import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowUp, Download, FileText, Loader2, Lock, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';

type CeremonyType = 'religious' | 'civil';
interface Participant { name: string; role: string; arm: string; placement: string }
interface MusicCue { moment: string; title: string; artist: string; timecode: string; launcher: string }
interface Speech { speaker: string; moment: string; text: string; file_url?: string; file_name?: string }
interface Witness { name: string; phone: string; email: string; role: string }
interface CeremonyData {
  procession_in?: Participant[];
  procession_out?: Participant[];
  music?: MusicCue[];
  speeches?: Speech[];
  witnesses?: Witness[];
  checklist?: Record<string, boolean>;
  timing?: Record<string, string>;
  music_allowed?: boolean;
}

const db = supabase as any;
const L = (fr: string, en: string) => ({ fr, en });

const MUSIC_MOMENTS = [
  L('Entrée du cortège / du marié', 'Procession / groom entrance'),
  L('Entrée de la mariée', 'Bride entrance'),
  L('Recueillement ou rituel (sable, bougies, rubans)', 'Reflection or ritual (sand, candles, ribbons)'),
  L('Échange des consentements & alliances', 'Vows & rings'),
  L('Signature des registres / bénédiction', 'Register signing / blessing'),
  L('Sortie des mariés & lancer de pétales', 'Recessional & petal toss'),
];

const CIVIL_CHECKLIST = [
  { key: 'id_couple', ...L('Pièces d’identité des mariés', 'Couple’s ID documents') },
  { key: 'id_witnesses', ...L('Pièces d’identité des témoins (2 à 4)', 'Witnesses’ ID (2 to 4)') },
  { key: 'family_book', ...L('Livret de famille (si enfants)', 'Family record book (if children)') },
  { key: 'rings', ...L('Alliances (si échange en mairie)', 'Rings (if exchanged at the town hall)') },
  { key: 'convocation', ...L('Convocation / confirmation de la mairie', 'Town hall confirmation') },
];

const CIVIL_TIMING = [
  { key: 'convocation', ...L('Convocation des invités (15 min avant)', 'Guests arrive (15 min before)') },
  { key: 'entry', ...L('Entrée dans la salle', 'Entering the room') },
  { key: 'couple_entry', ...L('Entrée des mariés', 'Couple’s entrance') },
  { key: 'exit', ...L('Sortie & félicitations sur le parvis', 'Exit & congratulations outside') },
];

interface Props { type: CeremonyType }

/** Outil d'organisation de la cérémonie (religieuse/laïque ou mairie), partagé entre le wedding planner et les mariés. */
const CeremonyPlanner: React.FC<Props> = ({ type }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const lab = (entry: { fr: string; en: string }) => (isEnglish ? entry.en : entry.fr);
  const { user } = useAuth();
  const { currentWeddingId, isWeddingCollaborator } = useWedding();
  const weddingId = currentWeddingId || user?.id || null;
  const canEdit = !isWeddingCollaborator;
  const [data, setData] = useState<CeremonyData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!weddingId) return;
    (async () => {
      try {
        const { data: row, error } = await db.from('wedding_ceremony_plans').select('data').eq('wedding_id', weddingId).eq('ceremony_type', type).maybeSingle();
        if (error) throw error;
        setData(row?.data || {
          music: type === 'religious' ? MUSIC_MOMENTS.map((moment) => ({ moment: lab(moment), title: '', artist: '', timecode: '', launcher: '' })) : [],
        });
      } catch (error) {
        console.error('❌ load ceremony plan failed:', error);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId, type]);

  const persist = (next: CeremonyData) => {
    setData(next);
    if (!canEdit || !weddingId) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      setIsSaving(true);
      const { error } = await db.from('wedding_ceremony_plans').upsert(
        { wedding_id: weddingId, ceremony_type: type, data: next, updated_by: user?.id },
        { onConflict: 'wedding_id,ceremony_type' },
      );
      setIsSaving(false);
      if (error) {
        console.error('❌ save ceremony plan failed:', error);
        toast.error(tr('Enregistrement impossible', 'Could not save'));
      }
    }, 800);
  };

  const updateList = <K extends keyof CeremonyData>(key: K, list: any[]) => persist({ ...data, [key]: list });
  const moveItem = (key: keyof CeremonyData, index: number, delta: number) => {
    const list = [...((data[key] as any[]) || [])];
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    updateList(key, list);
  };

  const uploadSpeechFile = async (index: number, file: File) => {
    if (!user || file.size > 10 * 1024 * 1024) { toast.error(tr('Fichier trop lourd (10 Mo max)', 'File too large (10 MB max)')); return; }
    setUploadingIndex(index);
    try {
      const path = `${user.id}/ceremony-${weddingId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
      const { error } = await supabase.storage.from('coordination-files').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('coordination-files').getPublicUrl(path);
      const speeches = [...(data.speeches || [])];
      speeches[index] = { ...speeches[index], file_url: publicUrl, file_name: file.name };
      updateList('speeches', speeches);
    } catch (error) {
      console.error('❌ uploadSpeechFile failed:', error);
      toast.error(tr('Envoi impossible', 'Upload failed'));
    } finally {
      setUploadingIndex(null);
    }
  };

  const exportSummary = async () => {
    const { default: jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    pdf.setFillColor(99, 116, 90); pdf.rect(0, 0, 210, 30, 'F');
    pdf.setTextColor(255, 255, 255); pdf.setFont('times', 'bold'); pdf.setFontSize(20); pdf.text('MARIABLE', 15, 15);
    pdf.setFont('times', 'normal'); pdf.setFontSize(12);
    pdf.text(type === 'civil' ? tr('Fiche mairie', 'Town hall sheet') : tr('Fiche officiant & wedding planner', 'Officiant & planner sheet'), 15, 24);
    pdf.setTextColor(30, 30, 30);
    let y = 42;
    const write = (text: string, bold = false) => {
      pdf.setFont('helvetica', bold ? 'bold' : 'normal'); pdf.setFontSize(bold ? 12 : 10);
      pdf.splitTextToSize(text, 180).forEach((part: string) => { if (y > 280) { pdf.addPage(); y = 20; } pdf.text(part, 15, y); y += bold ? 7 : 5.5; });
    };
    if (type === 'civil') {
      write(tr('Timing', 'Timing'), true);
      CIVIL_TIMING.forEach((step) => write(`${lab(step)} : ${data.timing?.[step.key] || '—'}`));
      write(`${tr('Musique autorisée', 'Music allowed')} : ${data.music_allowed ? tr('Oui', 'Yes') : tr('Non / à confirmer', 'No / to confirm')}`);
      write(tr('Témoins', 'Witnesses'), true);
      (data.witnesses || []).forEach((w) => write(`${w.name} · ${w.role} · ${w.phone} ${w.email}`));
      write(tr('Dossier', 'Paperwork'), true);
      CIVIL_CHECKLIST.forEach((item) => write(`${data.checklist?.[item.key] ? '[x]' : '[ ]'} ${lab(item)}`));
    } else {
      write(tr('Cortège – entrée', 'Procession – in'), true);
      (data.procession_in || []).forEach((p, i) => write(`${i + 1}. ${p.name} — ${p.role}${p.arm ? ` · ${tr('bras', 'arm')} : ${p.arm}` : ''}${p.placement ? ` · ${p.placement}` : ''}`));
      write(tr('Cortège – sortie', 'Procession – out'), true);
      (data.procession_out || []).forEach((p, i) => write(`${i + 1}. ${p.name} — ${p.role}`));
      write(tr('Musiques', 'Music'), true);
      (data.music || []).forEach((m) => write(`${m.moment} : ${m.title || '—'}${m.artist ? ` (${m.artist})` : ''}${m.timecode ? ` · ${m.timecode}` : ''}${m.launcher ? ` · ${m.launcher}` : ''}`));
      write(tr('Interventions', 'Speeches'), true);
      (data.speeches || []).forEach((s, i) => { write(`${i + 1}. ${s.speaker}${s.moment ? ` — ${s.moment}` : ''}`); if (s.text) write(s.text); });
    }
    pdf.save(type === 'civil' ? 'fiche-mairie.pdf' : 'fiche-ceremonie.pdf');
  };

  if (isLoading) return <div className="py-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-wedding-olive" /></div>;

  const inputClass = 'h-11 text-base rounded-none';
  const sectionClass = 'border border-border bg-background p-4 sm:p-5 space-y-3';

  const renderProcession = (key: 'procession_in' | 'procession_out', title: string) => {
    const list = data[key] || [];
    return (
      <section className={sectionClass} aria-label={title}>
        <h3 className="font-serif text-lg">{title}</h3>
        {list.length === 0 && <p className="text-sm text-muted-foreground">{tr('Aucun participant pour le moment.', 'No participants yet.')}</p>}
        <ol className="space-y-2">
          {list.map((p, index) => (
            <li key={index} className="grid grid-cols-1 sm:grid-cols-[2rem_1fr_1fr_1fr_1fr_auto] gap-2 items-center border-b border-border pb-2">
              <span className="font-serif text-wedding-olive">{index + 1}.</span>
              <Input className={inputClass} placeholder={tr('Nom', 'Name')} value={p.name} disabled={!canEdit} aria-label={tr('Nom', 'Name')}
                onChange={(e) => updateList(key, list.map((x, i) => (i === index ? { ...x, name: e.target.value } : x)))} />
              <Input className={inputClass} placeholder={tr('Rôle (témoin, père…)', 'Role (witness, father…)')} value={p.role} disabled={!canEdit} aria-label={tr('Rôle', 'Role')}
                onChange={(e) => updateList(key, list.map((x, i) => (i === index ? { ...x, role: e.target.value } : x)))} />
              <Input className={inputClass} placeholder={tr('Au bras de', 'Arm in arm with')} value={p.arm} disabled={!canEdit} aria-label={tr('Au bras de', 'Arm in arm with')}
                onChange={(e) => updateList(key, list.map((x, i) => (i === index ? { ...x, arm: e.target.value } : x)))} />
              <Input className={inputClass} placeholder={tr('Placement (1er rang, autel…)', 'Seat (front row, altar…)')} value={p.placement} disabled={!canEdit} aria-label={tr('Placement', 'Seat')}
                onChange={(e) => updateList(key, list.map((x, i) => (i === index ? { ...x, placement: e.target.value } : x)))} />
              {canEdit && (
                <div className="flex">
                  <Button variant="ghost" size="icon" aria-label={tr('Monter', 'Move up')} onClick={() => moveItem(key, index, -1)}><ArrowUp className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" aria-label={tr('Descendre', 'Move down')} onClick={() => moveItem(key, index, 1)}><ArrowDown className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" aria-label={tr('Supprimer', 'Delete')} onClick={() => updateList(key, list.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              )}
            </li>
          ))}
        </ol>
        {canEdit && (
          <Button variant="outline" className="rounded-none min-h-[44px]" onClick={() => updateList(key, [...list, { name: '', role: '', arm: '', placement: '' }])}>
            <Plus className="h-4 w-4 mr-2" />{tr('Ajouter une personne', 'Add a person')}
          </Button>
        )}
      </section>
    );
  };

  return (
    <div className="space-y-4">
      <header className="bg-editorial-beige border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">{type === 'civil' ? tr('Organisation de la mairie', 'Town hall planning') : tr('Organisation de la cérémonie', 'Ceremony planning')}</h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            {type === 'civil'
              ? tr('Dossier, témoins officiels et timing minuté : une cérémonie courte (15 à 20 min) qui ne laisse pas de place à l’improvisation.', 'Paperwork, official witnesses and a precise timing for a short (15–20 min) ceremony.')
              : tr('Cortège, musiques des temps forts et interventions, réunis dans une fiche pour l’officiant et le wedding planner.', 'Procession, key music cues and speeches, gathered in one sheet for the officiant and planner.')}
          </p>
          {isWeddingCollaborator && (
            <p className="mt-2 inline-flex items-center gap-2 border border-wedding-olive/40 bg-background px-3 py-1 text-xs text-wedding-olive">
              <Lock className="h-3 w-3" />
              {tr('Consultation partagée · Piloté en coordination avec votre wedding planner', 'Shared view · Managed with your wedding planner')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isSaving && <span className="text-xs text-muted-foreground">{tr('Enregistrement…', 'Saving…')}</span>}
          <Button onClick={exportSummary} className="rounded-none min-h-[44px] bg-wedding-olive hover:bg-wedding-olive/90 text-white">
            <Download className="h-4 w-4 mr-2" />{tr('Fiche synthétique PDF', 'Summary sheet PDF')}
          </Button>
        </div>
      </header>

      {type === 'civil' ? (
        <>
          <section className={sectionClass}>
            <h3 className="font-serif text-lg">{tr('Dossier & check administratif', 'Paperwork checklist')}</h3>
            {CIVIL_CHECKLIST.map((item) => (
              <label key={item.key} className="flex items-center gap-3 min-h-[40px] text-sm">
                <Checkbox checked={!!data.checklist?.[item.key]} disabled={!canEdit}
                  onCheckedChange={(v) => persist({ ...data, checklist: { ...(data.checklist || {}), [item.key]: !!v } })} />
                {lab(item)}
              </label>
            ))}
          </section>
          <section className={sectionClass}>
            <h3 className="font-serif text-lg">{tr('Témoins officiels', 'Official witnesses')}</h3>
            {(data.witnesses || []).map((w, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 border-b border-border pb-2">
                {(['name', 'role', 'phone', 'email'] as const).map((field) => (
                  <Input key={field} className={inputClass} disabled={!canEdit} value={w[field]} aria-label={field}
                    placeholder={{ name: tr('Nom', 'Name'), role: tr('Rôle', 'Role'), phone: tr('Téléphone', 'Phone'), email: 'Email' }[field]}
                    onChange={(e) => updateList('witnesses', (data.witnesses || []).map((x, i) => (i === index ? { ...x, [field]: e.target.value } : x)))} />
                ))}
                {canEdit && <Button variant="ghost" size="icon" aria-label={tr('Supprimer', 'Delete')} onClick={() => updateList('witnesses', (data.witnesses || []).filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button>}
              </div>
            ))}
            {canEdit && (data.witnesses || []).length < 4 && (
              <Button variant="outline" className="rounded-none min-h-[44px]" onClick={() => updateList('witnesses', [...(data.witnesses || []), { name: '', role: tr('Témoin', 'Witness'), phone: '', email: '' }])}>
                <Plus className="h-4 w-4 mr-2" />{tr('Ajouter un témoin', 'Add a witness')}
              </Button>
            )}
          </section>
          <section className={sectionClass}>
            <h3 className="font-serif text-lg">{tr('Timing & cortège', 'Timing & procession')}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {CIVIL_TIMING.map((step) => (
                <label key={step.key} className="text-sm space-y-1">
                  <span>{lab(step)}</span>
                  <Input type="time" className={inputClass} disabled={!canEdit} value={data.timing?.[step.key] || ''}
                    onChange={(e) => persist({ ...data, timing: { ...(data.timing || {}), [step.key]: e.target.value } })} />
                </label>
              ))}
            </div>
            <label className="flex items-center gap-3 min-h-[40px] text-sm">
              <Checkbox checked={!!data.music_allowed} disabled={!canEdit} onCheckedChange={(v) => persist({ ...data, music_allowed: !!v })} />
              {tr('Musique autorisée par la mairie', 'Music allowed by the town hall')}
            </label>
          </section>
          {renderProcession('procession_in', tr('Ordre d’entrée', 'Entrance order'))}
        </>
      ) : (
        <>
          {renderProcession('procession_in', tr('Cortège – entrée', 'Procession – entrance'))}
          {renderProcession('procession_out', tr('Cortège – sortie', 'Procession – exit'))}
          <section className={sectionClass}>
            <h3 className="font-serif text-lg">{tr('Musiques des temps forts', 'Key music cues')}</h3>
            {(data.music || []).map((cue, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_6rem_1fr_auto] gap-2 border-b border-border pb-2">
                {(['moment', 'title', 'artist', 'timecode', 'launcher'] as const).map((field) => (
                  <Input key={field} className={inputClass} disabled={!canEdit} value={cue[field]} aria-label={field}
                    placeholder={{ moment: tr('Temps fort', 'Moment'), title: tr('Titre', 'Title'), artist: tr('Artiste', 'Artist'), timecode: '00:00', launcher: tr('Lancé par (DJ…)', 'Cued by (DJ…)') }[field]}
                    onChange={(e) => updateList('music', (data.music || []).map((x, i) => (i === index ? { ...x, [field]: e.target.value } : x)))} />
                ))}
                {canEdit && <Button variant="ghost" size="icon" aria-label={tr('Supprimer', 'Delete')} onClick={() => updateList('music', (data.music || []).filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button>}
              </div>
            ))}
            {canEdit && (
              <Button variant="outline" className="rounded-none min-h-[44px]" onClick={() => updateList('music', [...(data.music || []), { moment: '', title: '', artist: '', timecode: '', launcher: '' }])}>
                <Plus className="h-4 w-4 mr-2" />{tr('Ajouter une musique', 'Add a music cue')}
              </Button>
            )}
          </section>
          <section className={sectionClass}>
            <h3 className="font-serif text-lg">{tr('Interventions & discours', 'Speeches & readings')}</h3>
            {(data.speeches || []).map((speech, index) => (
              <div key={index} className="space-y-2 border-b border-border pb-3">
                <div className="grid grid-cols-1 sm:grid-cols-[2rem_1fr_1fr_auto] gap-2 items-center">
                  <span className="font-serif text-wedding-olive">{index + 1}.</span>
                  <Input className={inputClass} disabled={!canEdit} value={speech.speaker} placeholder={tr('Qui prend la parole', 'Speaker')} aria-label={tr('Intervenant', 'Speaker')}
                    onChange={(e) => updateList('speeches', (data.speeches || []).map((x, i) => (i === index ? { ...x, speaker: e.target.value } : x)))} />
                  <Input className={inputClass} disabled={!canEdit} value={speech.moment} placeholder={tr('À quel moment', 'When')} aria-label={tr('Moment', 'When')}
                    onChange={(e) => updateList('speeches', (data.speeches || []).map((x, i) => (i === index ? { ...x, moment: e.target.value } : x)))} />
                  {canEdit && (
                    <div className="flex">
                      <Button variant="ghost" size="icon" aria-label={tr('Monter', 'Move up')} onClick={() => moveItem('speeches', index, -1)}><ArrowUp className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label={tr('Supprimer', 'Delete')} onClick={() => updateList('speeches', (data.speeches || []).filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  )}
                </div>
                <Textarea rows={3} className="text-base rounded-none" disabled={!canEdit} value={speech.text} placeholder={tr('Texte du discours (facultatif)', 'Speech text (optional)')}
                  onChange={(e) => updateList('speeches', (data.speeches || []).map((x, i) => (i === index ? { ...x, text: e.target.value } : x)))} />
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {speech.file_url && (
                    <a href={speech.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-wedding-olive hover:underline">
                      <FileText className="h-4 w-4" />{speech.file_name || tr('Document', 'Document')}
                    </a>
                  )}
                  {canEdit && (
                    <label className="inline-flex items-center gap-2 cursor-pointer border border-border px-3 min-h-[40px]">
                      {uploadingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {tr('Livret / document (PDF, Word)', 'Booklet / document (PDF, Word)')}
                      <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => e.target.files?.[0] && uploadSpeechFile(index, e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>
            ))}
            {canEdit && (
              <Button variant="outline" className="rounded-none min-h-[44px]" onClick={() => updateList('speeches', [...(data.speeches || []), { speaker: '', moment: '', text: '' }])}>
                <Plus className="h-4 w-4 mr-2" />{tr('Ajouter une intervention', 'Add a speech')}
              </Button>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default CeremonyPlanner;

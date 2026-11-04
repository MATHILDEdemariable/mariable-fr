import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Ban, Send, Loader2, FileDown, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWeddingModulePlan } from '@/hooks/useWeddingModulePlan';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

const db = supabase as any;

type MusicMoment = { key: string; label: string; title: string; artist: string; link: string; notes: string };
type MusicPlan = {
  moments: MusicMoment[];
  playlists: { spotify: string; apple: string; deezer: string };
  blacklist: string[];
  tech: { microphones: string; outdoorSound: string; sparklers: string; decibels: string; other: string };
};

const MOMENT_LABELS = ['Entrée cérémonie', 'Sortie de cérémonie', 'Entrée cocktail', 'Entrée salle', 'Arrivée du gâteau', 'Ouverture de bal', 'Lancement soirée'];
const DEFAULT_PLAN: MusicPlan = {
  moments: MOMENT_LABELS.map((label, index) => ({ key: `m${index}`, label, title: '', artist: '', link: '', notes: '' })),
  playlists: { spotify: '', apple: '', deezer: '' },
  blacklist: [],
  tech: { microphones: '', outdoorSound: '', sparklers: '', decibels: '', other: '' },
};
const TECH_FIELDS: { key: keyof MusicPlan['tech']; label: string; placeholder: string }[] = [
  { key: 'microphones', label: 'Micros sans fil', placeholder: 'Ex. 2 micros : discours témoins + officiant' },
  { key: 'outdoorSound', label: 'Sonorisation extérieure', placeholder: 'Ex. enceinte batterie pour la cérémonie laïque' },
  { key: 'sparklers', label: 'Feux de Bengale / étincelles froides', placeholder: 'Ex. étincelles froides sur l’ouverture de bal, 22h30' },
  { key: 'decibels', label: 'Contraintes décibels', placeholder: 'Ex. limiteur 95 dB, coupure musique 2h' },
  { key: 'other', label: 'Autres notes', placeholder: 'Accès régie, horaires d’installation…' },
];

/** Construit la fiche DJ A4 (charte Mariable). */
const buildMusicPdf = async (plan: MusicPlan) => {
  const { default: jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  pdf.setFillColor(99, 116, 90); pdf.rect(0, 0, 210, 30, 'F');
  pdf.setTextColor(255, 255, 255); pdf.setFont('times', 'bold'); pdf.setFontSize(20); pdf.text('MARIABLE', 15, 15);
  pdf.setFont('times', 'normal'); pdf.setFontSize(12); pdf.text('Fiche DJ & Musique', 15, 24);
  pdf.setTextColor(30, 30, 30);
  let y = 42;
  const write = (text: string, bold = false, color?: [number, number, number]) => {
    pdf.setFont('helvetica', bold ? 'bold' : 'normal'); pdf.setFontSize(bold ? 12 : 10);
    if (color) pdf.setTextColor(...color); else pdf.setTextColor(30, 30, 30);
    pdf.splitTextToSize(text, 180).forEach((part: string) => { if (y > 280) { pdf.addPage(); y = 20; } pdf.text(part, 15, y); y += bold ? 7 : 5.5; });
    if (bold) y += 1;
  };
  write('Moments clés', true);
  plan.moments.forEach((moment) => {
    write(`${moment.label} : ${[moment.title, moment.artist].filter(Boolean).join(' — ') || '—'}`);
    if (moment.link) write(`   Lien / timer : ${moment.link}`);
    if (moment.notes) write(`   Remarques : ${moment.notes}`);
  });
  const playlists = [['Spotify', plan.playlists.spotify], ['Apple Music', plan.playlists.apple], ['Deezer', plan.playlists.deezer]].filter(([, url]) => url);
  if (playlists.length) { y += 2; write('Playlists', true); playlists.forEach(([name, url]) => write(`${name} : ${url}`)); }
  if (plan.blacklist.length) { y += 2; write('BLACKLIST — À NE JAMAIS PASSER', true, [190, 30, 30]); plan.blacklist.forEach((item) => write(`✕ ${item}`, false, [190, 30, 30])); }
  y += 2; write('Notes techniques', true);
  TECH_FIELDS.forEach((field) => { if (plan.tech[field.key]) write(`${field.label} : ${plan.tech[field.key]}`); });
  return pdf;
};

const MusiquePage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const { user } = useAuth();
  const { coordination } = useMonJourMCoordination();
  const { weddingId, data: plan, updateData, isLoading, isSaving } = useWeddingModulePlan<MusicPlan>('music', DEFAULT_PLAN);
  const [blacklistInput, setBlacklistInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const updateMoment = (key: string, field: keyof MusicMoment, value: string) =>
    updateData((previous) => ({ ...previous, moments: previous.moments.map((moment) => (moment.key === key ? { ...moment, [field]: value } : moment)) }));

  const addBlacklistItem = () => {
    const value = blacklistInput.trim();
    if (!value) return;
    updateData((previous) => ({ ...previous, blacklist: [...previous.blacklist, value] }));
    setBlacklistInput('');
  };

  const handleDownloadPdf = async () => {
    try {
      const pdf = await buildMusicPdf(plan);
      pdf.save('fiche-dj-musique.pdf');
    } catch (error) {
      console.error('❌ handleDownloadPdf failed:', error);
      toast.error(tr('Export impossible', 'Export failed'));
    }
  };

  /** Range la fiche DJ dans les documents du Déroulé Jour J et marque le module transmis. */
  const handleSendToJourJ = async () => {
    if (!user || !weddingId) return;
    if (!coordination?.id) {
      toast.error(tr('Ouvrez d’abord le Déroulé Jour J une fois pour l’initialiser.', 'Open the wedding day run once first.'));
      return;
    }
    setIsSending(true);
    try {
      const pdf = await buildMusicPdf(plan);
      const blob = pdf.output('blob');
      const filePath = `${user.id}/coordination-${coordination.id}/fiche-music-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage.from('coordination-files').upload(filePath, blob, { contentType: 'application/pdf' });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('coordination-files').getPublicUrl(filePath);
      await db.from('coordination_documents').delete().eq('coordination_id', coordination.id).eq('category', 'organisation-music');
      const { error: insertError } = await db.from('coordination_documents').insert({
        coordination_id: coordination.id, title: 'Fiche DJ & Musique', category: 'organisation-music',
        description: 'Générée depuis le module Musique', file_url: publicUrl, file_path: filePath,
        file_type: 'pdf', mime_type: 'application/pdf', file_size: blob.size,
      });
      if (insertError) throw insertError;
      await db.from('wedding_jour_j_handoffs').upsert(
        { wedding_id: weddingId, module: 'music', validated_by: user.id, validated_at: new Date().toISOString() },
        { onConflict: 'wedding_id,module' },
      );
      window.dispatchEvent(new Event('jour-m-documents-updated'));
      toast.success(tr('Fiche DJ ajoutée au Déroulé Jour J', 'DJ sheet added to the wedding day run'));
    } catch (error) {
      console.error('❌ handleSendToJourJ failed:', error);
      toast.error(tr('Transmission impossible', 'Could not send'));
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <>
      <Helmet>
        <title>{tr('DJ & Musique du mariage | Mariable', 'Wedding DJ & music | Mariable')}</title>
        <meta name="description" content={tr('Moments clés, playlists, blacklist et notes techniques pour le DJ du mariage.', 'Key moments, playlists, blacklist and tech notes for the wedding DJ.')} />
      </Helmet>
      <section className="space-y-5">
        <header className="bg-editorial-beige border border-border p-4 sm:p-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl flex items-center gap-2"><Music className="h-6 w-6 text-wedding-olive" />{tr('DJ & Musique', 'DJ & Music')}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">{tr('Partagé entre les mariés et le wedding planner. Enregistrement automatique.', 'Shared between the couple and the planner. Saved automatically.')} {isSaving && tr('Enregistrement…', 'Saving…')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleDownloadPdf} className="min-h-[44px] rounded-none"><FileDown className="h-4 w-4 mr-2" />{tr('Fiche DJ (PDF)', 'DJ sheet (PDF)')}</Button>
            <Button onClick={handleSendToJourJ} disabled={isSending} className="min-h-[44px] rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
              {isSending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}{tr('Charger dans le Déroulé Jour J', 'Load into wedding day run')}
            </Button>
          </div>
        </header>

        {plan.blacklist.length > 0 && (
          <div role="alert" className="border-2 border-destructive bg-destructive/10 p-3 text-destructive text-sm font-medium flex items-center gap-2">
            <Ban className="h-4 w-4 shrink-0" />{tr('Blacklist :', 'Blacklist:')} {plan.blacklist.join(' · ')}
          </div>
        )}

        <section className="space-y-3" aria-labelledby="moments-title">
          <h2 id="moments-title" className="font-serif text-xl">{tr('Moments clés', 'Key moments')}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {plan.moments.map((moment) => (
              <article key={moment.key} className="border border-wedding-olive/25 bg-background p-3 space-y-2">
                <h3 className="font-serif text-base">{moment.label}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={moment.title} onChange={(event) => updateMoment(moment.key, 'title', event.target.value)} placeholder={tr('Titre', 'Title')} className="rounded-none" />
                  <Input value={moment.artist} onChange={(event) => updateMoment(moment.key, 'artist', event.target.value)} placeholder={tr('Artiste', 'Artist')} className="rounded-none" />
                </div>
                <Input value={moment.link} onChange={(event) => updateMoment(moment.key, 'link', event.target.value)} placeholder={tr('Lien / timer (ex. démarrer à 0:45)', 'Link / timer')} className="rounded-none" />
                <Input value={moment.notes} onChange={(event) => updateMoment(moment.key, 'notes', event.target.value)} placeholder={tr('Remarques', 'Notes')} className="rounded-none" />
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="border border-border p-4 space-y-2">
            <h2 className="font-serif text-xl">{tr('Playlists & liens', 'Playlists & links')}</h2>
            {([['spotify', 'Spotify'], ['apple', 'Apple Music'], ['deezer', 'Deezer']] as const).map(([key, label]) => (
              <label key={key} className="block text-sm">{label}
                <Input value={plan.playlists[key]} onChange={(event) => updateData((previous) => ({ ...previous, playlists: { ...previous.playlists, [key]: event.target.value } }))} placeholder="https://…" className="rounded-none mt-1" />
              </label>
            ))}
          </div>
          <div className="border-2 border-destructive/60 p-4 space-y-2">
            <h2 className="font-serif text-xl text-destructive flex items-center gap-2"><Ban className="h-5 w-5" />{tr('Blacklist musicale', 'Music blacklist')}</h2>
            <p className="text-xs text-muted-foreground">{tr('Titres ou styles formellement proscrits par les mariés.', 'Songs or styles the couple strictly forbids.')}</p>
            <div className="flex gap-2">
              <Input value={blacklistInput} onChange={(event) => setBlacklistInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addBlacklistItem()} placeholder={tr('Ex. La Chenille, techno…', 'E.g. Macarena, techno…')} className="rounded-none" />
              <Button type="button" onClick={addBlacklistItem} variant="destructive" className="rounded-none min-h-[44px]" aria-label={tr('Ajouter', 'Add')}><Plus className="h-4 w-4" /></Button>
            </div>
            <ul className="space-y-1">
              {plan.blacklist.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-center justify-between bg-destructive/10 text-destructive px-2 py-1 text-sm">
                  {item}
                  <button type="button" onClick={() => updateData((previous) => ({ ...previous, blacklist: previous.blacklist.filter((_, position) => position !== index) }))} className="p-2" aria-label={tr('Retirer', 'Remove')}><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border border-border p-4 space-y-3">
          <h2 className="font-serif text-xl">{tr('Notes techniques DJ', 'DJ tech notes')}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {TECH_FIELDS.map((field) => (
              <label key={field.key} className="block text-sm">{field.label}
                <Textarea value={plan.tech[field.key]} onChange={(event) => updateData((previous) => ({ ...previous, tech: { ...previous.tech, [field.key]: event.target.value } }))} placeholder={field.placeholder} className="rounded-none mt-1 min-h-[70px]" />
              </label>
            ))}
          </div>
        </section>
      </section>
    </>
  );
};

export default MusiquePage;

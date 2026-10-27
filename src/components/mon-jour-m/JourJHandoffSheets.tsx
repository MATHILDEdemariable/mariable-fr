import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, Wine, Sparkles, Users, Heart, Building2, CheckCircle2, Clock, Loader2, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';
import { DECOR_ZONES, DECOR_RESPONSIBLES, DECOR_STATUSES, decorLabel } from '@/data/decorCatalog';
import { translateDrinkLabel } from '@/components/drinks/DrinksPlanTable';
import { toast } from 'sonner';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';
import type { JourJModule } from '@/hooks/useJourJHandoff';
import { buildCeremonyPdf } from '@/components/ceremony/CeremonyPlanner';

const db = supabase as any;

type SheetData =
  | { module: 'seating'; tables: { name: string; guests: string[] }[]; alphabetical: { guest: string; table: string }[] }
  | { module: 'drinks'; rows: any[] }
  | { module: 'decor'; zones: { zone: string; items: any[] }[] }
  | { module: 'trombinoscope'; people: any[] };

const MODULES: { key: JourJModule; icon: typeof Table; fr: string; en: string; sourceFr: string; sourceEn: string; path: string }[] = [
  { key: 'seating', icon: Table, fr: 'Plan de table', en: 'Seating plan', sourceFr: 'Liste par table et alphabétique', sourceEn: 'By table and alphabetical', path: '/dashboard/seating-plan' },
  { key: 'drinks', icon: Wine, fr: 'Boissons', en: 'Drinks', sourceFr: 'Fiche bar / traiteur', sourceEn: 'Bar / caterer sheet', path: '/dashboard/drinks' },
  { key: 'decor', icon: Sparkles, fr: 'Décoration', en: 'Decor', sourceFr: 'Mise en place par zone', sourceEn: 'Set-up by area', path: '/dashboard/decoration' },
  { key: 'trombinoscope', icon: Users, fr: 'Trombinoscope', en: 'Who’s who', sourceFr: 'Ajouté à l’équipe', sourceEn: 'Added to the team', path: '/mon-jour-m/equipe' },
  { key: 'ceremony_religious', icon: Heart, fr: 'Cérémonie', en: 'Ceremony', sourceFr: 'Cortège, musiques, interventions', sourceEn: 'Procession, music, speeches', path: '/dashboard/ceremonie' },
  { key: 'ceremony_civil', icon: Building2, fr: 'Mairie', en: 'City hall', sourceFr: 'Témoins, dossier, timing', sourceEn: 'Witnesses, paperwork, timing', path: '/dashboard/mairie-civil' },
];
const isCeremonyModule = (module: JourJModule) => module === 'ceremony_religious' || module === 'ceremony_civil';

/** Fiches transmises par l'espace Organisation (validées par les mariés ou le pro), lues en direct. */
const JourJHandoffSheets: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const { user } = useAuth();
  const { currentWeddingId } = useWedding();
  const weddingId = currentWeddingId || user?.id || null;
  const [handoffs, setHandoffs] = useState<Record<string, string>>({});
  const [openSheet, setOpenSheet] = useState<SheetData | null>(null);
  const [loadingModule, setLoadingModule] = useState<JourJModule | null>(null);
  const [publishingModule, setPublishingModule] = useState<JourJModule | null>(null);
  const { coordination } = useMonJourMCoordination();

  useEffect(() => {
    if (!weddingId) return;
    (async () => {
      const { data, error } = await db.from('wedding_jour_j_handoffs').select('module, validated_at').eq('wedding_id', weddingId);
      if (error) {
        console.error('❌ loadHandoffs failed:', error);
        return;
      }
      setHandoffs(Object.fromEntries((data || []).map((row: any) => [row.module, row.validated_at])));
    })();
  }, [weddingId]);

  const loadSheetData = async (module: JourJModule): Promise<SheetData | null> => {
    if (!weddingId) return null;
    if (module === 'trombinoscope') {
      const { data } = await db.from('wedding_key_people').select('full_name, key_role, phone, notes').eq('wedding_id', weddingId).order('position');
      return { module: 'trombinoscope', people: data || [] };
    }
    let result = null as SheetData | null;
    const setOpenSheet = (value: SheetData) => { result = value; };
    {
      if (module === 'seating') {
        const { data: plans } = await db.from('seating_plans').select('id').eq('wedding_id', weddingId).order('created_at', { ascending: false }).limit(1);
        const planId = plans?.[0]?.id;
        const [{ data: tables }, { data: guests }] = planId
          ? await Promise.all([
              db.from('seating_tables').select('id, table_name, table_number').eq('seating_plan_id', planId).order('table_number'),
              db.from('seating_assignments').select('guest_name, table_id').eq('seating_plan_id', planId),
            ])
          : [{ data: [] }, { data: [] }];
        const tableName = (table: any) => table.table_name || `${tr('Table', 'Table')} ${table.table_number}`;
        const byTable = (tables || []).map((table: any) => ({
          name: tableName(table),
          guests: (guests || []).filter((guest: any) => guest.table_id === table.id).map((guest: any) => guest.guest_name).sort((a: string, b: string) => a.localeCompare(b)),
        }));
        const alphabetical = (guests || [])
          .map((guest: any) => {
            const table = (tables || []).find((entry: any) => entry.id === guest.table_id);
            return { guest: guest.guest_name, table: table ? tableName(table) : tr('Non placé', 'Not seated') };
          })
          .sort((a: any, b: any) => a.guest.localeCompare(b.guest));
        setOpenSheet({ module: 'seating', tables: byTable, alphabetical });
      } else if (module === 'drinks') {
        const { data } = await db.from('wedding_drinks_plan').select('rows').eq('wedding_id', weddingId).maybeSingle();
        setOpenSheet({ module: 'drinks', rows: Array.isArray(data?.rows) ? data.rows : [] });
      } else if (module === 'decor') {
        const { data } = await db.from('wedding_decor_items').select('name, zone, responsible, status, quantity, notes').eq('wedding_id', weddingId).order('position');
        const zones = Object.keys(DECOR_ZONES)
          .map((zone) => ({ zone, items: (data || []).filter((item: any) => item.zone === zone) }))
          .filter((group) => group.items.length > 0);
        setOpenSheet({ module: 'decor', zones });
      }
    }
    return result;
  };

  const openModuleSheet = async (module: JourJModule) => {
    if (module === 'trombinoscope') return;
    setLoadingModule(module);
    try {
      const data = await loadSheetData(module);
      if (data) setOpenSheet(data);
    } catch (error) {
      console.error('❌ openModuleSheet failed:', error);
    } finally {
      setLoadingModule(null);
    }
  };

  /** Génère la fiche en PDF (charte Mariable) et la range dans les documents du Jour J, visibles en consultation. */
  const publishModulePdf = async (module: JourJModule) => {
    if (!coordination?.id || !user) return;
    setPublishingModule(module);
    try {
      const meta = MODULES.find((entry) => entry.key === module)!;
      const title = isEnglish ? meta.en : meta.fr;
      let pdf: any;
      if (isCeremonyModule(module)) {
        const ceremonyType = module === 'ceremony_civil' ? 'civil' : 'religious';
        const { data: plan, error: planError } = await db.from('wedding_ceremony_plans').select('data').eq('wedding_id', weddingId).eq('ceremony_type', ceremonyType).maybeSingle();
        if (planError) throw planError;
        pdf = await buildCeremonyPdf(ceremonyType, plan?.data || {}, !!isEnglish);
      } else {
      const data = await loadSheetData(module);
      if (!data) throw new Error('Fiche introuvable');
      const lines: { text: string; bold?: boolean }[] = [];
      if (data.module === 'seating') {
        data.tables.forEach((table) => { lines.push({ text: `${table.name} (${table.guests.length})`, bold: true }); lines.push({ text: table.guests.join(', ') || '—' }); });
        lines.push({ text: tr('Ordre alphabétique', 'Alphabetical'), bold: true });
        data.alphabetical.forEach((entry) => lines.push({ text: `${entry.guest} — ${entry.table}` }));
      } else if (data.module === 'drinks') {
        data.rows.forEach((row: any) => lines.push({ text: [translateDrinkLabel(row.moment, !!isEnglish), translateDrinkLabel(row.drinkType, !!isEnglish), row.drinkName, row.quantity && `${tr('Qté', 'Qty')} ${row.quantity}`, row.supplier].filter(Boolean).join(' · ') }));
      } else if (data.module === 'decor') {
        data.zones.forEach((group) => {
          lines.push({ text: decorLabel(DECOR_ZONES, group.zone, !!isEnglish), bold: true });
          group.items.forEach((item: any) => lines.push({ text: `${item.name}${item.quantity ? ` × ${item.quantity}` : ''} — ${decorLabel(DECOR_RESPONSIBLES, item.responsible, !!isEnglish)}${item.notes ? ` (${item.notes})` : ''}` }));
        });
      } else {
        data.people.forEach((person: any) => lines.push({ text: [person.full_name, person.key_role, person.phone].filter(Boolean).join(' · ') }));
      }
      const { default: jsPDF } = await import('jspdf');
      pdf = new jsPDF();
      pdf.setFillColor(99, 116, 90); pdf.rect(0, 0, 210, 30, 'F');
      pdf.setTextColor(255, 255, 255); pdf.setFont('times', 'bold'); pdf.setFontSize(20); pdf.text('MARIABLE', 15, 15);
      pdf.setFont('times', 'normal'); pdf.setFontSize(12); pdf.text(title, 15, 24);
      pdf.setTextColor(30, 30, 30);
      let y = 42;
      lines.forEach((line) => {
        pdf.setFont('helvetica', line.bold ? 'bold' : 'normal'); pdf.setFontSize(line.bold ? 12 : 10);
        pdf.splitTextToSize(line.text, 180).forEach((part: string) => {
          if (y > 280) { pdf.addPage(); y = 20; }
          pdf.text(part, 15, y); y += line.bold ? 7 : 5.5;
        });
        if (line.bold) y += 1;
      });
      }
      const blob = pdf.output('blob');
      const filePath = `${user.id}/coordination-${coordination.id}/fiche-${module}-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage.from('coordination-files').upload(filePath, blob, { contentType: 'application/pdf' });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('coordination-files').getPublicUrl(filePath);
      const documentTitle = `${tr('Fiche', 'Sheet')} ${title}`;
      await db.from('coordination_documents').delete().eq('coordination_id', coordination.id).eq('category', `organisation-${module}`);
      const { error: insertError } = await db.from('coordination_documents').insert({
        coordination_id: coordination.id, title: documentTitle, category: `organisation-${module}`,
        description: tr('Générée depuis l’organisation', 'Generated from the planning space'),
        file_url: publicUrl, file_path: filePath, file_type: 'pdf', mime_type: 'application/pdf', file_size: blob.size,
      });
      if (insertError) throw insertError;
      window.dispatchEvent(new Event('jour-m-documents-updated'));
      toast.success(tr('PDF ajouté aux documents, visible en consultation', 'PDF added to documents, visible in the shared view'));
    } catch (error) {
      console.error('❌ publishModulePdf failed:', error);
      toast.error(tr('Impossible de publier le PDF', 'Could not publish the PDF'));
    } finally {
      setPublishingModule(null);
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <section className="mb-6 border-l-2 border-wedding-olive bg-editorial-beige px-4 py-3 space-y-3" aria-labelledby="handoff-sheets-title">
      <p id="handoff-sheets-title" className="text-sm text-muted-foreground">
        {tr('Complétez votre ', 'Complete your ')}
        {MODULES.filter((module) => module.key !== 'ceremony_civil').map((module, index, list) => (
          <React.Fragment key={module.key}>
            <Link to={module.path} className="underline text-wedding-olive hover:text-foreground">{(isEnglish ? module.en : module.fr).toLowerCase()}</Link>
            {index < list.length - 2 ? ', ' : index === list.length - 2 ? tr(' ou ', ' or ') : ''}
          </React.Fragment>
        ))}
        {tr(' pour retrouver les fiches ici en un clic.', ' to find the sheets here in one click.')}
      </p>
      {MODULES.some((module) => handoffs[module.key]) && (
        <div className="flex flex-wrap gap-2">
          {MODULES.filter((module) => handoffs[module.key]).map((module) => (
            <button
              key={module.key}
              type="button"
              onClick={() => publishModulePdf(module.key)}
              disabled={publishingModule === module.key}
              className="inline-flex items-center gap-1 min-h-[36px] px-3 text-xs border border-wedding-olive/30 bg-background hover:bg-wedding-olive/10"
              title={tr('Publier en PDF dans Documents', 'Publish as PDF to Documents')}
            >
              {publishingModule === module.key ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileDown className="h-3 w-3 text-wedding-olive" />}
              {isEnglish ? module.en : module.fr}
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!openSheet} onOpenChange={(open) => !open && setOpenSheet(null)}>
        <DialogContent className="max-w-2xl rounded-none max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {openSheet?.module === 'seating' ? tr('Plan de table validé', 'Approved seating plan')
                : openSheet?.module === 'drinks' ? tr('Fiche boissons', 'Drinks sheet')
                : tr('Mise en place déco par zone', 'Decor set-up by area')}
            </DialogTitle>
          </DialogHeader>

          {openSheet?.module === 'seating' && (
            <div className="grid sm:grid-cols-2 gap-5 text-sm">
              <div className="space-y-3">
                <h4 className="font-serif text-base">{tr('Par table', 'By table')}</h4>
                {openSheet.tables.length === 0 ? <p className="text-muted-foreground">{tr('Aucune table', 'No tables')}</p> : openSheet.tables.map((table) => (
                  <div key={table.name}>
                    <p className="font-medium">{table.name} <span className="text-muted-foreground">({table.guests.length})</span></p>
                    <p className="text-muted-foreground">{table.guests.join(', ') || '—'}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base mb-2">{tr('Ordre alphabétique', 'Alphabetical')}</h4>
                {openSheet.alphabetical.map((entry, index) => (
                  <p key={`${entry.guest}-${index}`} className="flex justify-between gap-2 border-b border-border py-1"><span>{entry.guest}</span><span className="text-muted-foreground">{entry.table}</span></p>
                ))}
              </div>
            </div>
          )}

          {openSheet?.module === 'drinks' && (
            openSheet.rows.length === 0 ? <p className="text-sm text-muted-foreground">{tr('Aucune boisson', 'No drinks')}</p> : (
              <div className="space-y-2 text-sm">
                {openSheet.rows.map((row: any) => (
                  <div key={row.id} className="border-b border-border pb-2">
                    <p className="font-medium">{translateDrinkLabel(row.moment, !!isEnglish)} — {translateDrinkLabel(row.drinkType, !!isEnglish)}{row.drinkName ? ` · ${row.drinkName}` : ''}</p>
                    <p className="text-muted-foreground">
                      {[row.quantity && `${tr('Qté', 'Qty')} ${row.quantity}`, row.supplier, row.pairing, translateDrinkLabel(row.status, !!isEnglish)].filter(Boolean).join(' · ')}
                    </p>
                    {row.notes && <p className="text-muted-foreground italic">{row.notes}</p>}
                  </div>
                ))}
              </div>
            )
          )}

          {openSheet?.module === 'decor' && (
            openSheet.zones.length === 0 ? <p className="text-sm text-muted-foreground">{tr('Aucun élément', 'No items')}</p> : (
              <div className="space-y-4 text-sm">
                {openSheet.zones.map((group) => (
                  <div key={group.zone}>
                    <h4 className="font-serif text-base border-b border-wedding-olive/30 pb-1 mb-1">{decorLabel(DECOR_ZONES, group.zone, !!isEnglish)}</h4>
                    {group.items.map((item: any, index: number) => {
                      const status = DECOR_STATUSES.find((entry) => entry.key === item.status);
                      return (
                        <p key={`${item.name}-${index}`} className="flex flex-wrap justify-between gap-2 py-1 border-b border-border">
                          <span>{item.name}{item.quantity ? ` × ${item.quantity}` : ''}{item.notes ? <span className="text-muted-foreground"> — {item.notes}</span> : null}</span>
                          <span className="text-muted-foreground">{decorLabel(DECOR_RESPONSIBLES, item.responsible, !!isEnglish)} · {status ? (isEnglish ? status.en : status.fr) : item.status}</span>
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default JourJHandoffSheets;

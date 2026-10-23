import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, Wine, Sparkles, Users, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';
import { DECOR_ZONES, DECOR_RESPONSIBLES, DECOR_STATUSES, decorLabel } from '@/data/decorCatalog';
import { translateDrinkLabel } from '@/components/drinks/DrinksPlanTable';
import type { JourJModule } from '@/hooks/useJourJHandoff';

const db = supabase as any;

type SheetData =
  | { module: 'seating'; tables: { name: string; guests: string[] }[]; alphabetical: { guest: string; table: string }[] }
  | { module: 'drinks'; rows: any[] }
  | { module: 'decor'; zones: { zone: string; items: any[] }[] };

const MODULES: { key: JourJModule; icon: typeof Table; fr: string; en: string; sourceFr: string; sourceEn: string; path: string }[] = [
  { key: 'seating', icon: Table, fr: 'Plan de table', en: 'Seating plan', sourceFr: 'Liste par table et alphabétique', sourceEn: 'By table and alphabetical', path: '/dashboard/seating-plan' },
  { key: 'drinks', icon: Wine, fr: 'Boissons', en: 'Drinks', sourceFr: 'Fiche bar / traiteur', sourceEn: 'Bar / caterer sheet', path: '/dashboard/drinks' },
  { key: 'decor', icon: Sparkles, fr: 'Décoration', en: 'Decor', sourceFr: 'Mise en place par zone', sourceEn: 'Set-up by area', path: '/dashboard/decoration' },
  { key: 'trombinoscope', icon: Users, fr: 'Trombinoscope', en: 'Who’s who', sourceFr: 'Ajouté à l’équipe', sourceEn: 'Added to the team', path: '/mon-jour-m/equipe' },
];

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

  const openModuleSheet = async (module: JourJModule) => {
    if (!weddingId || module === 'trombinoscope') return;
    setLoadingModule(module);
    try {
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
    } catch (error) {
      console.error('❌ openModuleSheet failed:', error);
    } finally {
      setLoadingModule(null);
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <section className="mb-6 border border-border bg-editorial-beige p-4 sm:p-5 space-y-3" aria-labelledby="handoff-sheets-title">
      <div>
        <h2 id="handoff-sheets-title" className="font-serif text-xl">{tr('Transmis par l’organisation', 'Sent from the planning space')}</h2>
        <p className="text-sm text-muted-foreground">{tr('Dès qu’un module est validé côté organisation, sa fiche est disponible ici, toujours à jour.', 'As soon as a module is approved in the planning space, its sheet is available here, always up to date.')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MODULES.map((module) => {
          const validatedAt = handoffs[module.key];
          const Icon = module.icon;
          return (
            <article key={module.key} className="border border-wedding-olive/25 bg-background p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-wedding-olive" />
                <h3 className="font-serif text-base">{isEnglish ? module.en : module.fr}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{isEnglish ? module.sourceEn : module.sourceFr}</p>
              <p className={`text-xs inline-flex items-center gap-1 ${validatedAt ? 'text-wedding-olive' : 'text-muted-foreground'}`}>
                {validatedAt ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                {validatedAt ? `${tr('Validé le', 'Approved')} ${formatDate(validatedAt)}` : tr('Pas encore validé', 'Not approved yet')}
              </p>
              <div className="mt-auto">
                {validatedAt && module.key !== 'trombinoscope' ? (
                  <Button size="sm" variant="outline" className="min-h-[40px] w-full rounded-none" onClick={() => openModuleSheet(module.key)} disabled={loadingModule === module.key}>
                    {loadingModule === module.key && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {tr('Voir la fiche', 'View sheet')}
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" className="min-h-[40px] w-full rounded-none" asChild>
                    <Link to={module.path}>{module.key === 'trombinoscope' && validatedAt ? tr('Voir l’équipe', 'View team') : tr('Ouvrir le module', 'Open module')}</Link>
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

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

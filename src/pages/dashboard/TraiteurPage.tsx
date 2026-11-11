import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Upload, FileText, Loader2, CheckCircle2, UtensilsCrossed, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWeddingModulePlan } from '@/hooks/useWeddingModulePlan';
import JourJHandoffButton from '@/components/jour-j/JourJHandoffButton';
import {
  DEFAULT_CATERING_PLAN, DAY_PRESETS, MENU_FIELDS, SOURCES, VENDOR_ROLES,
  createCateringDay, getCateringDays,
  type CateringDay, type CateringPlan, type EquipmentRow,
} from '@/data/cateringPlan';

const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const TraiteurPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const { user } = useAuth();
  const { weddingId, data: plan, updateData, isLoading, isSaving } = useWeddingModulePlan<CateringPlan>('catering', DEFAULT_CATERING_PLAN);
  const [isUploading, setIsUploading] = useState(false);
  const [newRowLabel, setNewRowLabel] = useState('');
  const [newDayName, setNewDayName] = useState('');
  const [activeDayId, setActiveDayId] = useState<string | null>(null);

  const days = getCateringDays(plan);
  const activeDay = days.find((day) => day.id === activeDayId) ?? days[0];

  // Toute modification d'un jour enregistre la liste complète des jours (reprise automatique des anciennes données)
  const updateDay = (dayId: string, updater: (day: CateringDay) => CateringDay) =>
    updateData((previous) => ({ ...previous, days: getCateringDays(previous).map((day) => (day.id === dayId ? updater(day) : day)) }));
  const patchActiveDay = (patch: Partial<CateringDay>) => updateDay(activeDay.id, (day) => ({ ...day, ...patch }));

  const addDay = (name: string) => {
    const dayName = name.trim();
    if (!dayName) return;
    const day = createCateringDay(dayName);
    updateData((previous) => ({ ...previous, days: [...getCateringDays(previous), day] }));
    setActiveDayId(day.id);
    setNewDayName('');
  };

  const removeDay = (dayId: string) => {
    if (days.length <= 1) return;
    if (!window.confirm(tr('Supprimer ce jour et son contenu ?', 'Delete this day and its content?'))) return;
    updateData((previous) => ({ ...previous, days: getCateringDays(previous).filter((day) => day.id !== dayId) }));
    setActiveDayId(null);
  };

  const handleUploadProposal = async (file: File | undefined) => {
    if (!file || !user || !weddingId) return;
    if (file.size > 15 * 1024 * 1024) { toast.error(tr('Fichier trop lourd (15 Mo max)', 'File too large (15 MB max)')); return; }
    setIsUploading(true);
    try {
      const filePath = `${user.id}/traiteur-${weddingId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
      const { error } = await supabase.storage.from('coordination-files').upload(filePath, file, { contentType: file.type || 'application/pdf' });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('coordination-files').getPublicUrl(filePath);
      updateData((previous) => ({ ...previous, proposals: [...previous.proposals, { name: file.name, url: publicUrl, path: filePath }] }));
      toast.success(tr('Proposition ajoutée', 'Proposal added'));
    } catch (error) {
      console.error('❌ handleUploadProposal failed:', error);
      toast.error(tr('Envoi impossible', 'Upload failed'));
    } finally {
      setIsUploading(false);
    }
  };

  const setValidation = (patch: Partial<CateringPlan['validation']>) =>
    updateData((previous) => {
      const validation = { ...previous.validation, ...patch };
      validation.status = validation.coupleOk && validation.plannerOk ? 'validated' : 'in_progress';
      return { ...previous, validation };
    });

  const updateRow = (id: string, patch: Partial<EquipmentRow>) =>
    updateDay(activeDay.id, (day) => ({ ...day, equipment: day.equipment.map((row) => (row.id === id ? { ...row, ...patch } : row)) }));

  const addRow = () => {
    const label = newRowLabel.trim();
    if (!label) return;
    updateDay(activeDay.id, (day) => ({ ...day, equipment: [...day.equipment, { id: newId('custom'), group: 'Autres', label, source: '', notes: '' }] }));
    setNewRowLabel('');
  };

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const groups = Array.from(new Set(activeDay.equipment.map((row) => row.group)));
  const isValidated = plan.validation.status === 'validated';
  const tabClass = 'rounded-none min-h-[40px]';

  return (
    <>
      <Helmet>
        <title>{tr('Traiteur & matériel du mariage | Mariable', 'Wedding catering & equipment | Mariable')}</title>
        <meta name="description" content={tr('Menus, prestataires, vaisselle et logistique traiteur par jour d’événement, transmis au Jour J.', 'Menus, vendors, tableware and catering logistics per event day, shared with the wedding day.')} />
      </Helmet>
      <section className="space-y-5">
        <header className="bg-editorial-beige border border-border p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl flex items-center gap-2"><UtensilsCrossed className="h-6 w-6 text-wedding-olive" />{tr('Traiteur & Matériel', 'Catering & Equipment')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{tr('Un onglet par temps fort. Partagé entre les mariés et le wedding planner, enregistrement automatique.', 'One tab per event. Shared between the couple and the planner, saved automatically.')} {isSaving && tr('Enregistrement…', 'Saving…')}</p>
          </div>
          <JourJHandoffButton module="catering" />
        </header>

        {/* Jours de l'événement */}
        <nav aria-label={tr('Jours de l’événement', 'Event days')} className="flex flex-wrap items-center gap-2">
          {days.map((day) => (
            <div key={day.id} className={`inline-flex items-center border ${day.id === activeDay.id ? 'border-wedding-olive bg-wedding-olive text-white' : 'border-border'}`}>
              <button type="button" aria-pressed={day.id === activeDay.id} onClick={() => setActiveDayId(day.id)} className="min-h-[44px] px-4 text-sm font-medium">{day.name}</button>
              {days.length > 1 && day.id === activeDay.id && (
                <button type="button" onClick={() => removeDay(day.id)} aria-label={tr(`Supprimer ${day.name}`, `Delete ${day.name}`)} className="min-h-[44px] px-2"><X className="h-4 w-4" /></button>
              )}
            </div>
          ))}
          {DAY_PRESETS.filter((preset) => !days.some((day) => day.name === (isEnglish ? preset.en : preset.fr))).map((preset) => (
            <button key={preset.fr} type="button" onClick={() => addDay(isEnglish ? preset.en : preset.fr)} className="min-h-[44px] px-3 text-xs border border-dashed border-wedding-olive/50 text-wedding-olive hover:bg-wedding-olive/5">+ {isEnglish ? preset.en : preset.fr}</button>
          ))}
          <div className="flex gap-1">
            <Input value={newDayName} onChange={(event) => setNewDayName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addDay(newDayName)} placeholder={tr('Autre moment…', 'Other event…')} className="rounded-none h-11 w-40" />
            <Button type="button" variant="outline" onClick={() => addDay(newDayName)} className="rounded-none min-h-[44px]" aria-label={tr('Ajouter un jour', 'Add a day')}><Plus className="h-4 w-4" /></Button>
          </div>
        </nav>

        <div className="grid gap-3 sm:grid-cols-3 border border-border p-4">
          <label className="block text-sm">{tr('Nom du moment', 'Event name')}
            <Input value={activeDay.name} onChange={(event) => patchActiveDay({ name: event.target.value })} className="rounded-none mt-1" />
          </label>
          <label className="block text-sm">{tr('Date', 'Date')}
            <Input type="date" value={activeDay.date} onChange={(event) => patchActiveDay({ date: event.target.value })} className="rounded-none mt-1" />
          </label>
          <label className="block text-sm">{tr('Nombre de couverts', 'Guest count')}
            <Input inputMode="numeric" value={activeDay.guestCount} onChange={(event) => patchActiveDay({ guestCount: event.target.value })} className="rounded-none mt-1" />
          </label>
        </div>

        <Tabs defaultValue="vendors" key={activeDay.id}>
          <TabsList className="rounded-none w-full sm:w-auto flex-wrap h-auto">
            <TabsTrigger value="vendors" className={tabClass}>{tr('Prestataires', 'Vendors')}</TabsTrigger>
            <TabsTrigger value="menus" className={tabClass}>{tr('Menus & régimes', 'Menus & diets')}</TabsTrigger>
            <TabsTrigger value="equipment" className={tabClass}>{tr('Matériel & vaisselle', 'Equipment & tableware')}</TabsTrigger>
            <TabsTrigger value="logistics" className={tabClass}>{tr('Logistique', 'Logistics')}</TabsTrigger>
            <TabsTrigger value="custom" className={tabClass}>{tr('Items personnalisés', 'Custom items')}</TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground">{tr('Plusieurs prestataires possibles par moment (traiteur, food truck, pâtissier, loueur…).', 'Several vendors per event (caterer, food truck, pastry, rental…).')}</p>
            {activeDay.vendors.map((vendor) => (
              <div key={vendor.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto] border border-border p-3">
                <select value={vendor.role} onChange={(event) => patchActiveDay({ vendors: activeDay.vendors.map((entry) => (entry.id === vendor.id ? { ...entry, role: event.target.value } : entry)) })} className="h-11 border border-input bg-background px-2 text-sm" aria-label={tr('Rôle', 'Role')}>
                  {VENDOR_ROLES.map((role) => <option key={role.key} value={role.key}>{isEnglish ? role.en : role.fr}</option>)}
                </select>
                <Input value={vendor.name} onChange={(event) => patchActiveDay({ vendors: activeDay.vendors.map((entry) => (entry.id === vendor.id ? { ...entry, name: event.target.value } : entry)) })} placeholder={tr('Nom du prestataire', 'Vendor name')} className="rounded-none" />
                <Input value={vendor.contact} onChange={(event) => patchActiveDay({ vendors: activeDay.vendors.map((entry) => (entry.id === vendor.id ? { ...entry, contact: event.target.value } : entry)) })} placeholder={tr('Contact Jour J (tél.)', 'Day-of contact (phone)')} className="rounded-none" />
                <button type="button" className="p-2 text-destructive" aria-label={tr('Retirer', 'Remove')} onClick={() => patchActiveDay({ vendors: activeDay.vendors.filter((entry) => entry.id !== vendor.id) })}><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <Button type="button" onClick={() => patchActiveDay({ vendors: [...activeDay.vendors, { id: newId('vendor'), name: '', role: activeDay.vendors.length ? 'other' : 'main_caterer', contact: '' }] })} className="rounded-none min-h-[44px] bg-wedding-olive hover:bg-wedding-olive/90 text-white"><Plus className="h-4 w-4 mr-1" />{tr('Ajouter un prestataire', 'Add a vendor')}</Button>
          </TabsContent>

          <TabsContent value="menus" className="space-y-4 mt-4">
            <div className={`border p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between ${isValidated ? 'border-wedding-olive bg-wedding-olive/10' : 'border-border'}`}>
              <p className="font-medium flex items-center gap-2">
                {isValidated ? <CheckCircle2 className="h-5 w-5 text-wedding-olive" /> : <Loader2 className="h-4 w-4" />}
                {isValidated ? tr('Menus validés par les mariés et le wedding planner', 'Menus approved by couple and planner') : tr('Validation en cours', 'Approval in progress')}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2 min-h-[44px]"><input type="checkbox" checked={plan.validation.coupleOk} onChange={(event) => setValidation({ coupleOk: event.target.checked })} className="h-4 w-4" />{tr('Validé par les mariés', 'Approved by couple')}</label>
                <label className="flex items-center gap-2 min-h-[44px]"><input type="checkbox" checked={plan.validation.plannerOk} onChange={(event) => setValidation({ plannerOk: event.target.checked })} className="h-4 w-4" />{tr('Validé par le wedding planner', 'Approved by planner')}</label>
              </div>
            </div>

            <div className="border border-border p-4 space-y-2">
              <h2 className="font-serif text-xl">{tr('Propositions des traiteurs (PDF)', 'Caterer proposals (PDF)')}</h2>
              <label className="inline-flex items-center gap-2 border border-wedding-olive px-4 min-h-[44px] cursor-pointer hover:bg-wedding-olive/10 text-sm">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{tr('Déposer un PDF', 'Upload a PDF')}
                <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(event) => { handleUploadProposal(event.target.files?.[0]); event.target.value = ''; }} />
              </label>
              <ul className="space-y-1">
                {plan.proposals.map((proposal, index) => (
                  <li key={proposal.path} className="flex items-center justify-between text-sm border-b border-border py-1">
                    <a href={proposal.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline"><FileText className="h-4 w-4" />{proposal.name}</a>
                    <button type="button" className="p-2 text-destructive" aria-label={tr('Retirer', 'Remove')} onClick={() => updateData((previous) => ({ ...previous, proposals: previous.proposals.filter((_, position) => position !== index) }))}><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-border p-4 space-y-3">
              <h2 className="font-serif text-xl">{tr('Menu', 'Menu')} — {activeDay.name}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {MENU_FIELDS.map((field) => (
                  <label key={field.key} className="block text-sm">{isEnglish ? field.en : field.fr}
                    <Textarea value={activeDay.menu[field.key] || ''} onChange={(event) => patchActiveDay({ menu: { ...activeDay.menu, [field.key]: event.target.value } })} className="rounded-none mt-1 min-h-[70px]" />
                  </label>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4 mt-4">
            <div className="flex flex-wrap gap-2 text-xs">
              {SOURCES.map((source) => <span key={source.key} className={`border px-2 py-1 ${source.className}`}>{source.emoji} {isEnglish ? source.en : source.fr}</span>)}
            </div>
            {groups.map((group) => (
              <div key={group} className="border border-border">
                <h2 className="font-serif text-lg px-3 py-2 bg-editorial-beige">{group}</h2>
                <ul className="divide-y divide-border">
                  {activeDay.equipment.filter((row) => row.group === group).map((row) => (
                    <li key={row.id} className="p-3 flex flex-col lg:flex-row lg:items-center gap-2">
                      <span className="lg:w-48 font-medium text-sm">{row.label}</span>
                      <div className="grid grid-cols-3 gap-1 flex-1" role="radiogroup" aria-label={row.label}>
                        {SOURCES.map((source) => (
                          <button key={source.key} type="button" role="radio" aria-checked={row.source === source.key}
                            onClick={() => updateRow(row.id, { source: row.source === source.key ? '' : source.key })}
                            className={`min-h-[44px] border text-xs px-1 ${row.source === source.key ? source.className + ' font-semibold' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                            {source.emoji} {isEnglish ? source.en : source.fr}
                          </button>
                        ))}
                      </div>
                      <Input value={row.notes} onChange={(event) => updateRow(row.id, { notes: event.target.value })} placeholder={tr('Quantité / remarque', 'Qty / note')} className="rounded-none lg:w-48" />
                      {row.id.startsWith('custom-') && (
                        <button type="button" className="p-2 text-destructive self-end lg:self-auto" aria-label={tr('Supprimer', 'Delete')} onClick={() => updateDay(activeDay.id, (day) => ({ ...day, equipment: day.equipment.filter((entry) => entry.id !== row.id) }))}><Trash2 className="h-4 w-4" /></button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex gap-2">
              <Input value={newRowLabel} onChange={(event) => setNewRowLabel(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addRow()} placeholder={tr('Ajouter une ligne (ex. Mange-debout)', 'Add a line')} className="rounded-none" />
              <Button type="button" onClick={addRow} className="rounded-none min-h-[44px] bg-wedding-olive hover:bg-wedding-olive/90 text-white"><Plus className="h-4 w-4 mr-1" />{tr('Ajouter', 'Add')}</Button>
            </div>
          </TabsContent>

          <TabsContent value="logistics" className="space-y-3 mt-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 border border-border p-4">
              {([
                ['arrival', tr('Arrivée des équipes', 'Team arrival')],
                ['setup', tr('Installation / dressage', 'Set-up')],
                ['service', tr('Début du service', 'Service starts')],
                ['teardown', tr('Débarras / fin', 'Clear-up / end')],
              ] as const).map(([key, label]) => (
                <label key={key} className="block text-sm">{label}
                  <Input type="time" value={activeDay.logistics[key]} onChange={(event) => patchActiveDay({ logistics: { ...activeDay.logistics, [key]: event.target.value } })} className="rounded-none mt-1" />
                </label>
              ))}
            </div>
            <label className="block text-sm">{tr('Consignes (accès office, électricité, eau, poubelles, retour vaisselle…)', 'Instructions (kitchen access, power, water, waste, tableware return…)')}
              <Textarea value={activeDay.logistics.notes} onChange={(event) => patchActiveDay({ logistics: { ...activeDay.logistics, notes: event.target.value } })} className="rounded-none mt-1 min-h-[100px]" />
            </label>
          </TabsContent>

          <TabsContent value="custom" className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground">{tr('Tout ce qui ne rentre pas ailleurs : candy bar, plateau fromages tardif, repas des prestataires…', 'Anything else: candy bar, late-night snack, vendor meals…')}</p>
            {activeDay.customItems.map((item) => (
              <div key={item.id} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto] border border-border p-3">
                <Input value={item.label} onChange={(event) => patchActiveDay({ customItems: activeDay.customItems.map((entry) => (entry.id === item.id ? { ...entry, label: event.target.value } : entry)) })} placeholder={tr('Intitulé', 'Item')} className="rounded-none" />
                <Input value={item.detail} onChange={(event) => patchActiveDay({ customItems: activeDay.customItems.map((entry) => (entry.id === item.id ? { ...entry, detail: event.target.value } : entry)) })} placeholder={tr('Détail / quantité / qui s’en charge', 'Detail / qty / who')} className="rounded-none" />
                <button type="button" className="p-2 text-destructive" aria-label={tr('Retirer', 'Remove')} onClick={() => patchActiveDay({ customItems: activeDay.customItems.filter((entry) => entry.id !== item.id) })}><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <Button type="button" onClick={() => patchActiveDay({ customItems: [...activeDay.customItems, { id: newId('item'), label: '', detail: '' }] })} className="rounded-none min-h-[44px] bg-wedding-olive hover:bg-wedding-olive/90 text-white"><Plus className="h-4 w-4 mr-1" />{tr('Ajouter un item', 'Add an item')}</Button>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default TraiteurPage;

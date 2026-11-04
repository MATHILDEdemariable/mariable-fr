import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Upload, FileText, Loader2, CheckCircle2, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWeddingModulePlan } from '@/hooks/useWeddingModulePlan';

type EquipmentSource = 'caterer' | 'rental' | 'couple' | '';
type EquipmentRow = { id: string; group: string; label: string; source: EquipmentSource; notes: string };
type CateringPlan = {
  proposals: { name: string; url: string; path: string }[];
  menu: Record<string, string>;
  validation: { status: 'in_progress' | 'validated'; coupleOk: boolean; plannerOk: boolean };
  equipment: EquipmentRow[];
};

const MENU_FIELDS: { key: string; label: string }[] = [
  { key: 'cocktail', label: 'Pièces vin d’honneur validées' },
  { key: 'starter', label: 'Entrée' },
  { key: 'main', label: 'Plat' },
  { key: 'cheese', label: 'Fromages' },
  { key: 'dessert', label: 'Dessert / Pièce montée' },
  { key: 'kids', label: 'Menu enfants' },
  { key: 'diets', label: 'Régimes spécifiques & allergies' },
];
const EQUIPMENT_DEFAULTS: [string, string[]][] = [
  ['Assiettes', ['Assiettes cocktail', 'Assiettes entrée', 'Assiettes plat', 'Assiettes dessert']],
  ['Verres', ['Verres à eau', 'Verres vin rouge', 'Verres vin blanc', 'Flûtes']],
  ['Couverts', ['Couverts']],
  ['Nappes & serviettes', ['Nappes', 'Serviettes']],
  ['Mobilier', ['Tables', 'Chaises', 'Buffets']],
];
const SOURCES: { key: Exclude<EquipmentSource, ''>; emoji: string; label: string; className: string }[] = [
  { key: 'caterer', emoji: '🟢', label: 'Fourni par traiteur', className: 'border-green-600 bg-green-50 text-green-800' },
  { key: 'rental', emoji: '🟡', label: 'Loué séparément', className: 'border-amber-500 bg-amber-50 text-amber-800' },
  { key: 'couple', emoji: '🔵', label: 'Acheté / DIY mariés', className: 'border-blue-600 bg-blue-50 text-blue-800' },
];
const DEFAULT_PLAN: CateringPlan = {
  proposals: [],
  menu: {},
  validation: { status: 'in_progress', coupleOk: false, plannerOk: false },
  equipment: EQUIPMENT_DEFAULTS.flatMap(([group, labels]) => labels.map((label, index) => ({ id: `${group}-${index}`, group, label, source: '' as EquipmentSource, notes: '' }))),
};

const TraiteurPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const { user } = useAuth();
  const { weddingId, data: plan, updateData, isLoading, isSaving } = useWeddingModulePlan<CateringPlan>('catering', DEFAULT_PLAN);
  const [isUploading, setIsUploading] = useState(false);
  const [newRowLabel, setNewRowLabel] = useState('');

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
    updateData((previous) => ({ ...previous, equipment: previous.equipment.map((row) => (row.id === id ? { ...row, ...patch } : row)) }));

  const addRow = () => {
    const label = newRowLabel.trim();
    if (!label) return;
    updateData((previous) => ({ ...previous, equipment: [...previous.equipment, { id: `custom-${Date.now()}`, group: 'Autres', label, source: '', notes: '' }] }));
    setNewRowLabel('');
  };

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const groups = Array.from(new Set(plan.equipment.map((row) => row.group)));
  const isValidated = plan.validation.status === 'validated';

  return (
    <>
      <Helmet>
        <title>{tr('Traiteur & matériel du mariage | Mariable', 'Wedding catering & equipment | Mariable')}</title>
        <meta name="description" content={tr('Menus, dégustation et arbitrage vaisselle et mobilier entre traiteur, location et mariés.', 'Menus, tasting and tableware decisions between caterer, rental and couple.')} />
      </Helmet>
      <section className="space-y-5">
        <header className="bg-editorial-beige border border-border p-4 sm:p-6">
          <h1 className="font-serif text-3xl flex items-center gap-2"><UtensilsCrossed className="h-6 w-6 text-wedding-olive" />{tr('Traiteur & Matériel', 'Catering & Equipment')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{tr('Partagé entre les mariés et le wedding planner. Enregistrement automatique.', 'Shared between the couple and the planner. Saved automatically.')} {isSaving && tr('Enregistrement…', 'Saving…')}</p>
        </header>

        <Tabs defaultValue="menus">
          <TabsList className="rounded-none w-full sm:w-auto">
            <TabsTrigger value="menus" className="rounded-none min-h-[40px]">{tr('Menus & dégustation', 'Menus & tasting')}</TabsTrigger>
            <TabsTrigger value="equipment" className="rounded-none min-h-[40px]">{tr('Matériel & vaisselle', 'Equipment & tableware')}</TabsTrigger>
          </TabsList>

          <TabsContent value="menus" className="space-y-4 mt-4">
            <div className={`border p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between ${isValidated ? 'border-wedding-olive bg-wedding-olive/10' : 'border-border'}`}>
              <p className="font-medium flex items-center gap-2">
                {isValidated ? <CheckCircle2 className="h-5 w-5 text-wedding-olive" /> : <Loader2 className="h-4 w-4" />}
                {isValidated ? tr('Menu validé par les mariés et le wedding planner', 'Menu approved by couple and planner') : tr('Validation en cours', 'Approval in progress')}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2 min-h-[44px]"><input type="checkbox" checked={plan.validation.coupleOk} onChange={(event) => setValidation({ coupleOk: event.target.checked })} className="h-4 w-4" />{tr('Validé par les mariés', 'Approved by couple')}</label>
                <label className="flex items-center gap-2 min-h-[44px]"><input type="checkbox" checked={plan.validation.plannerOk} onChange={(event) => setValidation({ plannerOk: event.target.checked })} className="h-4 w-4" />{tr('Validé par le wedding planner', 'Approved by planner')}</label>
              </div>
            </div>

            <div className="border border-border p-4 space-y-2">
              <h2 className="font-serif text-xl">{tr('Propositions du traiteur (PDF)', 'Caterer proposals (PDF)')}</h2>
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
              <h2 className="font-serif text-xl">{tr('Fiche récapitulative du menu', 'Menu summary')}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {MENU_FIELDS.map((field) => (
                  <label key={field.key} className="block text-sm">{field.label}
                    <Textarea value={plan.menu[field.key] || ''} onChange={(event) => updateData((previous) => ({ ...previous, menu: { ...previous.menu, [field.key]: event.target.value } }))} className="rounded-none mt-1 min-h-[70px]" />
                  </label>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4 mt-4">
            <div className="flex flex-wrap gap-2 text-xs">
              {SOURCES.map((source) => <span key={source.key} className={`border px-2 py-1 ${source.className}`}>{source.emoji} {source.label}</span>)}
            </div>
            {groups.map((group) => (
              <div key={group} className="border border-border">
                <h2 className="font-serif text-lg px-3 py-2 bg-editorial-beige">{group}</h2>
                <ul className="divide-y divide-border">
                  {plan.equipment.filter((row) => row.group === group).map((row) => (
                    <li key={row.id} className="p-3 flex flex-col lg:flex-row lg:items-center gap-2">
                      <span className="lg:w-48 font-medium text-sm">{row.label}</span>
                      <div className="grid grid-cols-3 gap-1 flex-1" role="radiogroup" aria-label={row.label}>
                        {SOURCES.map((source) => (
                          <button key={source.key} type="button" role="radio" aria-checked={row.source === source.key}
                            onClick={() => updateRow(row.id, { source: row.source === source.key ? '' : source.key })}
                            className={`min-h-[44px] border text-xs px-1 ${row.source === source.key ? source.className + ' font-semibold' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                            {source.emoji} {source.label}
                          </button>
                        ))}
                      </div>
                      <Input value={row.notes} onChange={(event) => updateRow(row.id, { notes: event.target.value })} placeholder={tr('Quantité / remarque', 'Qty / note')} className="rounded-none lg:w-48" />
                      {row.id.startsWith('custom-') && (
                        <button type="button" className="p-2 text-destructive self-end lg:self-auto" aria-label={tr('Supprimer', 'Delete')} onClick={() => updateData((previous) => ({ ...previous, equipment: previous.equipment.filter((entry) => entry.id !== row.id) }))}><Trash2 className="h-4 w-4" /></button>
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
        </Tabs>
      </section>
    </>
  );
};

export default TraiteurPage;

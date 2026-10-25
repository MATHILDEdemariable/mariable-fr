import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Plus, Sparkles, Trash2, Pencil, ChevronLeft, ChevronRight, LayoutGrid, UserRound, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';
import JourJHandoffButton from '@/components/jour-j/JourJHandoffButton';
import {
  DECOR_CATEGORIES, DECOR_ZONES, DECOR_RESPONSIBLES, DECOR_STATUSES, DECOR_STARTER_KIT, decorLabel, type DecorStatus,
} from '@/data/decorCatalog';

export interface DecorItem {
  id: string;
  name: string;
  category: string;
  zone: string;
  responsible: string;
  status: DecorStatus;
  quantity: number | null;
  notes: string | null;
  position: number;
}

const db = supabase as any;
const selectClass = 'h-11 w-full border border-input bg-background px-2 text-sm';
const emptyForm = { name: '', category: 'ambiance', zone: 'diner', responsible: 'couple', status: 'to_find' as DecorStatus, quantity: '', notes: '' };

const DecorationPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const { user } = useAuth();
  const { currentWeddingId } = useWedding();
  const weddingId = currentWeddingId || user?.id || null;

  const [items, setItems] = useState<DecorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'zones' | 'owners'>('kanban');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isImportingKit, setIsImportingKit] = useState(false);

  const loadDecorItems = async () => {
    if (!weddingId) return;
    setIsLoading(true);
    try {
      const { data, error } = await db
        .from('wedding_decor_items')
        .select('id, name, category, zone, responsible, status, quantity, notes, position')
        .eq('wedding_id', weddingId)
        .order('position')
        .order('created_at');
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('❌ loadDecorItems failed:', error);
      toast.error(tr('Impossible de charger la décoration', 'Could not load decor'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDecorItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  const openCreateDialog = (status: DecorStatus = 'to_find') => {
    setEditingId(null);
    setForm({ ...emptyForm, status });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: DecorItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name, category: item.category, zone: item.zone, responsible: item.responsible,
      status: item.status, quantity: item.quantity?.toString() ?? '', notes: item.notes ?? '',
    });
    setIsDialogOpen(true);
  };

  const handleSaveItem = async () => {
    if (!form.name.trim() || !weddingId || !user) return;
    const quantityValue = parseInt(form.quantity, 10);
    const payload = {
      name: form.name.trim(), category: form.category, zone: form.zone, responsible: form.responsible,
      status: form.status, quantity: Number.isFinite(quantityValue) ? quantityValue : null, notes: form.notes.trim() || null,
    };
    try {
      if (editingId) {
        const { error } = await db.from('wedding_decor_items').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await db.from('wedding_decor_items').insert({ ...payload, wedding_id: weddingId, user_id: user.id, position: items.length });
        if (error) throw error;
      }
      setIsDialogOpen(false);
      loadDecorItems();
    } catch (error) {
      console.error('❌ handleSaveItem failed:', error);
      toast.error(tr('Enregistrement impossible', 'Could not save'));
    }
  };

  const updateItemStatus = async (item: DecorItem, status: DecorStatus) => {
    setItems((previous) => previous.map((entry) => (entry.id === item.id ? { ...entry, status } : entry)));
    const { error } = await db.from('wedding_decor_items').update({ status }).eq('id', item.id);
    if (error) {
      console.error('❌ updateItemStatus failed:', error);
      toast.error(tr('Mise à jour impossible', 'Could not update'));
      loadDecorItems();
    }
  };

  const handleDeleteItem = async (item: DecorItem) => {
    if (!window.confirm(tr(`Supprimer « ${item.name} » ?`, `Delete "${item.name}"?`))) return;
    const { error } = await db.from('wedding_decor_items').delete().eq('id', item.id);
    if (error) {
      console.error('❌ handleDeleteItem failed:', error);
      toast.error(tr('Suppression impossible', 'Could not delete'));
      return;
    }
    setItems((previous) => previous.filter((entry) => entry.id !== item.id));
  };

  const handleImportKit = async () => {
    if (!weddingId || !user) return;
    setIsImportingKit(true);
    try {
      const existingNames = new Set(items.map((item) => item.name.toLowerCase()));
      const rows = DECOR_STARTER_KIT
        .map((kitItem, index) => ({
          wedding_id: weddingId, user_id: user.id, name: isEnglish ? kitItem.name.en : kitItem.name.fr,
          category: kitItem.category, zone: kitItem.zone, responsible: 'couple', status: 'to_find', position: items.length + index,
        }))
        .filter((row) => !existingNames.has(row.name.toLowerCase()));
      if (rows.length === 0) {
        toast.info(tr('Le kit est déjà dans votre liste', 'The kit is already in your list'));
        return;
      }
      const { error } = await db.from('wedding_decor_items').insert(rows);
      if (error) throw error;
      toast.success(tr(`${rows.length} éléments ajoutés`, `${rows.length} items added`));
      loadDecorItems();
    } catch (error) {
      console.error('❌ handleImportKit failed:', error);
      toast.error(tr("Import du kit impossible", 'Could not import the kit'));
    } finally {
      setIsImportingKit(false);
    }
  };

  const itemsByZone = useMemo(() => {
    return Object.keys(DECOR_ZONES)
      .map((zoneKey) => ({ zoneKey, zoneItems: items.filter((item) => item.zone === zoneKey) }))
      .filter((group) => group.zoneItems.length > 0);
  }, [items]);

  const itemsByOwner = useMemo(() => {
    return Object.keys(DECOR_RESPONSIBLES)
      .map((zoneKey) => ({ zoneKey, zoneItems: items.filter((item) => item.responsible === zoneKey) }))
      .filter((group) => group.zoneItems.length > 0);
  }, [items]);

  const renderItemCard = (item: DecorItem) => {
    const statusIndex = DECOR_STATUSES.findIndex((status) => status.key === item.status);
    return (
      <article key={item.id} className="border border-wedding-olive/25 bg-background p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-base leading-snug">{item.name}{item.quantity ? <span className="text-muted-foreground text-sm"> × {item.quantity}</span> : null}</h3>
          <div className="flex shrink-0">
            <button type="button" onClick={() => openEditDialog(item)} className="p-2 hover:bg-muted" aria-label={tr('Modifier', 'Edit')}><Pencil className="h-4 w-4" /></button>
            <button type="button" onClick={() => handleDeleteItem(item)} className="p-2 hover:bg-muted text-destructive" aria-label={tr('Supprimer', 'Delete')}><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 text-[11px] uppercase tracking-wide">
          <span className="border border-wedding-olive/30 px-2 py-0.5 text-wedding-olive">{decorLabel(DECOR_CATEGORIES, item.category, isEnglish)}</span>
          <span className="border border-border px-2 py-0.5 text-muted-foreground">{decorLabel(DECOR_ZONES, item.zone, isEnglish)}</span>
        </div>
        <p className="text-xs text-muted-foreground">{tr('Responsable', 'Owner')} : {decorLabel(DECOR_RESPONSIBLES, item.responsible, isEnglish)}</p>
        {item.notes && <p className="text-sm whitespace-pre-line">{item.notes}</p>}
        <div className="flex items-center justify-between pt-1">
          <button type="button" disabled={statusIndex <= 0} onClick={() => updateItemStatus(item, DECOR_STATUSES[statusIndex - 1].key)}
            className="min-h-[36px] px-2 text-xs inline-flex items-center gap-1 disabled:opacity-30 hover:bg-muted" aria-label={tr('Étape précédente', 'Previous step')}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          {view !== 'kanban' && <span className="text-xs text-wedding-olive">{isEnglish ? DECOR_STATUSES[statusIndex]?.en : DECOR_STATUSES[statusIndex]?.fr}</span>}
          <button type="button" disabled={statusIndex >= DECOR_STATUSES.length - 1} onClick={() => updateItemStatus(item, DECOR_STATUSES[statusIndex + 1].key)}
            className="min-h-[36px] px-2 text-xs inline-flex items-center gap-1 disabled:opacity-30 hover:bg-muted" aria-label={tr('Étape suivante', 'Next step')}>
            {statusIndex < DECOR_STATUSES.length - 1 && (isEnglish ? DECOR_STATUSES[statusIndex + 1].en : DECOR_STATUSES[statusIndex + 1].fr)}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </article>
    );
  };

  return (
    <>
      <Helmet>
        <title>{tr('Décoration du mariage | Mariable', 'Wedding decor | Mariable')}</title>
        <meta name="description" content={tr('Suivez la papeterie, la petite déco, les fleurs et le confort des invités avec votre wedding planner.', 'Track stationery, small decor, flowers and guest comfort with your wedding planner.')} />
      </Helmet>

      <section className="space-y-5">
        <header className="bg-editorial-beige border border-border p-4 sm:p-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">{tr('Décoration', 'Decor')}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              {tr('Papeterie, petite déco, fleurs, confort des invités : qui s’en occupe, où ça va, où ça en est. Partagé entre les mariés et le wedding planner.',
                'Stationery, small decor, flowers, guest comfort: who handles it, where it goes, where it stands. Shared between the couple and the wedding planner.')}
            </p>
          </div>
          <JourJHandoffButton module="decor" />
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="grid grid-cols-3 border border-wedding-olive/30 w-full sm:w-auto" role="group" aria-label={tr('Affichage', 'View')}>
            <button type="button" aria-pressed={view === 'kanban'} onClick={() => setView('kanban')}
              className={`min-h-[44px] px-4 text-sm inline-flex items-center justify-center gap-2 ${view === 'kanban' ? 'bg-wedding-olive text-white' : 'hover:bg-wedding-olive/10'}`}>
              <LayoutGrid className="h-4 w-4" /> {tr('Avancement', 'Progress')}
            </button>
            <button type="button" aria-pressed={view === 'zones'} onClick={() => setView('zones')}
              className={`min-h-[44px] px-4 text-sm inline-flex items-center justify-center gap-2 ${view === 'zones' ? 'bg-wedding-olive text-white' : 'hover:bg-wedding-olive/10'}`}>
              <MapPin className="h-4 w-4" /> {tr('Par zone', 'By area')}
            </button>
            <button type="button" aria-pressed={view === 'owners'} onClick={() => setView('owners')}
              className={`min-h-[44px] px-4 text-sm inline-flex items-center justify-center gap-2 ${view === 'owners' ? 'bg-wedding-olive text-white' : 'hover:bg-wedding-olive/10'}`}>
              <UserRound className="h-4 w-4" /> {tr('Par responsable', 'By owner')}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Button variant="outline" onClick={handleImportKit} disabled={isImportingKit} className="min-h-[44px] rounded-none">
              {isImportingKit ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              {tr('Kit indispensable', 'Starter kit')}
            </Button>
            <Button onClick={() => openCreateDialog()} className="min-h-[44px] rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
              <Plus className="h-4 w-4 mr-2" /> {tr('Ajouter', 'Add')}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-wedding-olive" /></div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-wedding-olive/40 p-8 text-center space-y-3">
            <p className="font-serif text-xl">{tr('Aucun élément pour le moment', 'No items yet')}</p>
            <p className="text-sm text-muted-foreground">{tr('Commencez avec le kit indispensable (12 éléments classiques) ou ajoutez les vôtres.', 'Start with the starter kit (12 classic items) or add your own.')}</p>
          </div>
        ) : view === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DECOR_STATUSES.map((status) => {
              const columnItems = items.filter((item) => item.status === status.key);
              return (
                <div key={status.key} className="bg-muted/40 border border-border p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg">{isEnglish ? status.en : status.fr} <span className="text-sm text-muted-foreground">({columnItems.length})</span></h2>
                    <button type="button" onClick={() => openCreateDialog(status.key)} className="p-2 hover:bg-background" aria-label={tr('Ajouter dans cette colonne', 'Add to this column')}><Plus className="h-4 w-4" /></button>
                  </div>
                  {columnItems.map(renderItemCard)}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-5">
            {(view === 'owners' ? itemsByOwner : itemsByZone).map(({ zoneKey, zoneItems }) => (
              <div key={zoneKey} className="space-y-2">
                <h2 className="font-serif text-xl border-b border-wedding-olive/30 pb-1">{decorLabel(view === 'owners' ? DECOR_RESPONSIBLES : DECOR_ZONES, zoneKey, isEnglish)} <span className="text-sm text-muted-foreground">({zoneItems.length})</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{zoneItems.map(renderItemCard)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingId ? tr("Modifier l'élément", 'Edit item') : tr('Nouvel élément de déco', 'New decor item')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="decor-name">{tr('Élément', 'Item')}</Label>
              <Input id="decor-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={tr('Ex. Panneau de bienvenue en plexi', 'E.g. Acrylic welcome sign')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="decor-category">{tr('Catégorie', 'Category')}</Label>
                <select id="decor-category" className={selectClass} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                  {Object.keys(DECOR_CATEGORIES).map((key) => <option key={key} value={key}>{decorLabel(DECOR_CATEGORIES, key, isEnglish)}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="decor-zone">{tr('Où ça va ?', 'Where?')}</Label>
                <select id="decor-zone" className={selectClass} value={form.zone} onChange={(event) => setForm({ ...form, zone: event.target.value })}>
                  {Object.keys(DECOR_ZONES).map((key) => <option key={key} value={key}>{decorLabel(DECOR_ZONES, key, isEnglish)}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="decor-responsible">{tr('Qui s’en charge ?', 'Who handles it?')}</Label>
                <select id="decor-responsible" className={selectClass} value={form.responsible} onChange={(event) => setForm({ ...form, responsible: event.target.value })}>
                  {Object.keys(DECOR_RESPONSIBLES).map((key) => <option key={key} value={key}>{decorLabel(DECOR_RESPONSIBLES, key, isEnglish)}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="decor-status">{tr('Statut', 'Status')}</Label>
                <select id="decor-status" className={selectClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as DecorStatus })}>
                  {DECOR_STATUSES.map((status) => <option key={status.key} value={status.key}>{isEnglish ? status.en : status.fr}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="decor-quantity">{tr('Quantité', 'Quantity')}</Label>
              <Input id="decor-quantity" type="number" min={0} inputMode="numeric" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} />
            </div>
            <div>
              <Label htmlFor="decor-notes">{tr('Note', 'Note')}</Label>
              <Textarea id="decor-notes" rows={2} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder={tr('Ex. 2 paniers, apporter 4 rallonges', 'E.g. 2 baskets, bring 4 extension cords')} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={handleSaveItem} disabled={!form.name.trim()} className="min-h-[44px] rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">{tr('Enregistrer', 'Save')}</Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="min-h-[44px] rounded-none">{tr('Annuler', 'Cancel')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DecorationPage;

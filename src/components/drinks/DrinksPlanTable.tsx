import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Share2, Copy, Link2Off, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';
import { toast } from 'sonner';

export interface DrinkPlanRow {
  id: string;
  day: string;
  moment: string;
  drinkType: string;
  drinkName: string;
  pairing: string;
  quantity: string;
  supplier: string;
  notes: string;
  status: string;
}

export const DRINK_MOMENTS = ['Apéritif', 'Entrée', 'Plat', 'Fromage', 'Dessert', 'Soirée', 'Brunch'];
export const DRINK_TYPES = ['Champagne', 'Vin blanc', 'Vin rouge', 'Rosé', 'Bière', 'Cocktail', 'Spiritueux', 'Sans alcool'];
export const DRINK_STATUSES = ['À choisir', 'Validé', 'Commandé', 'Livré'];
export const DRINK_DAYS = ['Jour 1', 'Jour 2', 'Jour 3'];

const EN_LABELS: Record<string, string> = {
  'Apéritif': 'Aperitif', 'Entrée': 'Starter', 'Plat': 'Main course', 'Fromage': 'Cheese', 'Dessert': 'Dessert',
  'Soirée': 'Party', 'Brunch': 'Brunch', 'Champagne': 'Champagne', 'Vin blanc': 'White wine', 'Vin rouge': 'Red wine',
  'Rosé': 'Rosé', 'Bière': 'Beer', 'Cocktail': 'Cocktail', 'Spiritueux': 'Spirits', 'Sans alcool': 'Non-alcoholic',
  'À choisir': 'To choose', 'Validé': 'Approved', 'Commandé': 'Ordered', 'Livré': 'Delivered',
  'Jour 1': 'Day 1', 'Jour 2': 'Day 2', 'Jour 3': 'Day 3',
};
export const translateDrinkLabel = (value: string, isEnglish: boolean) => (isEnglish ? EN_LABELS[value] ?? value : value);

export const DRINK_TYPE_COLORS: Record<string, string> = {
  'Champagne': 'bg-amber-100 text-amber-900', 'Vin blanc': 'bg-yellow-50 text-yellow-900',
  'Vin rouge': 'bg-red-100 text-red-900', 'Rosé': 'bg-pink-100 text-pink-900', 'Bière': 'bg-orange-100 text-orange-900',
  'Cocktail': 'bg-teal-100 text-teal-900', 'Spiritueux': 'bg-stone-200 text-stone-900', 'Sans alcool': 'bg-sky-100 text-sky-900',
};

const createEmptyRow = (moment = 'Apéritif'): DrinkPlanRow => ({
  id: crypto.randomUUID(), day: 'Jour 1', moment, drinkType: 'Champagne', drinkName: '', pairing: '',
  quantity: '', supplier: '', notes: '', status: 'À choisir',
});

const db = supabase as any;
const selectClass = 'h-10 w-full border border-input bg-background px-2 text-sm';

const DrinksPlanTable: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const { user } = useAuth();
  const { currentWeddingId } = useWedding();
  const weddingId = currentWeddingId || user?.id || null;

  const [rows, setRows] = useState<DrinkPlanRow[]>([]);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareActive, setShareActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const loadedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!weddingId || !user) return;
    loadedRef.current = false;
    (async () => {
      setIsLoading(true);
      try {
        const { data, error } = await db
          .from('wedding_drinks_plan')
          .select('rows, share_token, share_active')
          .eq('wedding_id', weddingId)
          .maybeSingle();
        if (error) throw error;
        setRows(Array.isArray(data?.rows) ? data.rows : []);
        setShareToken(data?.share_token ?? null);
        setShareActive(!!data?.share_active);
      } catch (error) {
        console.error('❌ loadDrinksPlan failed:', error);
        toast.error(tr('Impossible de charger le plan des boissons', 'Could not load the drinks plan'));
      } finally {
        setIsLoading(false);
        loadedRef.current = true;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId, user]);

  const savePlan = async (patch: Record<string, unknown>) => {
    if (!weddingId || !user) return;
    setIsSaving(true);
    try {
      const { error } = await db
        .from('wedding_drinks_plan')
        .upsert({ wedding_id: weddingId, created_by: user.id, ...patch }, { onConflict: 'wedding_id' });
      if (error) throw error;
    } catch (error) {
      console.error('❌ saveDrinksPlan failed:', error);
      toast.error(tr("Enregistrement impossible", 'Could not save'));
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarde automatique (debounce)
  useEffect(() => {
    if (!loadedRef.current) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => savePlan({ rows }), 800);
    return () => clearTimeout(saveTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const updateRow = (rowId: string, field: keyof DrinkPlanRow, value: string) =>
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));

  const addRow = (moment?: string) => setRows((prev) => [...prev, createEmptyRow(moment)]);
  const deleteRow = (rowId: string) => setRows((prev) => prev.filter((row) => row.id !== rowId));

  const shareUrl = shareToken ? `${window.location.origin}/boissons-partagees/${shareToken}` : '';

  const handleCreateShareLink = async () => {
    const token = shareToken || crypto.randomUUID().replace(/-/g, '');
    setShareToken(token);
    setShareActive(true);
    await savePlan({ rows, share_token: token, share_active: true });
    const url = `${window.location.origin}/boissons-partagees/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(tr('Lien de consultation copié', 'View link copied'));
    } catch {
      toast.success(tr('Lien de consultation créé', 'View link created'));
    }
  };

  const handleDisableShare = async () => {
    setShareActive(false);
    await savePlan({ rows, share_active: false });
    toast.success(tr('Lien désactivé', 'Link disabled'));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(tr('Lien copié', 'Link copied'));
    } catch {
      toast.error(tr('Copie impossible', 'Copy failed'));
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">{tr('Chargement…', 'Loading…')}</div>;
  }

  // Regroupement visuel par jour puis moment
  const sortedRows = [...rows].sort((a, b) =>
    a.day === b.day
      ? DRINK_MOMENTS.indexOf(a.moment) - DRINK_MOMENTS.indexOf(b.moment)
      : a.day.localeCompare(b.day)
  );

  return (
    <section className="bg-editorial-beige border border-border p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">{tr('Plan des boissons & accords', 'Drinks & pairings plan')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {tr(
              'Quelle boisson, à quel moment, avec quel plat. Partagez-le en un lien avec votre traiteur ou wedding planner.',
              'Which drink, when, with which dish. Share it in one link with your caterer or wedding planner.'
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1" aria-live="polite">
            {isSaving ? tr('Enregistrement…', 'Saving…') : tr('Enregistré automatiquement', 'Saved automatically')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreateShareLink} className="bg-editorial-olive hover:bg-editorial-olive/90 text-white min-h-[44px]">
            <Share2 className="h-4 w-4 mr-2" />
            {tr('Partager en consultation', 'Share view-only')}
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="min-h-[44px]">
            <Printer className="h-4 w-4 mr-2" />
            {tr('Imprimer', 'Print')}
          </Button>
        </div>
      </div>

      {shareActive && shareToken && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-background border border-border p-3 text-sm">
          <span className="truncate flex-1" title={shareUrl}>{shareUrl}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-1" /> {tr('Copier', 'Copy')}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDisableShare}>
              <Link2Off className="h-4 w-4 mr-1" /> {tr('Désactiver', 'Disable')}
            </Button>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="text-center py-10 bg-background border border-dashed border-border">
          <p className="text-sm text-muted-foreground mb-4">
            {tr('Aucune boisson pour le moment. Commencez par un moment :', 'No drinks yet. Start with a moment:')}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {DRINK_MOMENTS.map((moment) => (
              <Button key={moment} size="sm" variant="outline" onClick={() => addRow(moment)}>
                + {translateDrinkLabel(moment, !!isEnglish)}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedRows.map((row) => (
            <article key={row.id} className="bg-background border border-border p-3 grid grid-cols-2 lg:grid-cols-12 gap-2 items-end">
              <label className="col-span-1 lg:col-span-1 text-xs">
                {tr('Jour', 'Day')}
                <select className={selectClass} value={row.day} onChange={(e) => updateRow(row.id, 'day', e.target.value)}>
                  {DRINK_DAYS.map((d) => <option key={d} value={d}>{translateDrinkLabel(d, !!isEnglish)}</option>)}
                </select>
              </label>
              <label className="col-span-1 lg:col-span-1 text-xs">
                {tr('Moment', 'Moment')}
                <select className={selectClass} value={row.moment} onChange={(e) => updateRow(row.id, 'moment', e.target.value)}>
                  {DRINK_MOMENTS.map((m) => <option key={m} value={m}>{translateDrinkLabel(m, !!isEnglish)}</option>)}
                </select>
              </label>
              <label className="col-span-1 lg:col-span-2 text-xs">
                {tr('Typologie', 'Type')}
                <select
                  className={`${selectClass} ${DRINK_TYPE_COLORS[row.drinkType] ?? ''}`}
                  value={row.drinkType}
                  onChange={(e) => updateRow(row.id, 'drinkType', e.target.value)}
                >
                  {DRINK_TYPES.map((t) => <option key={t} value={t}>{translateDrinkLabel(t, !!isEnglish)}</option>)}
                </select>
              </label>
              <label className="col-span-1 lg:col-span-2 text-xs">
                {tr('Nom / cuvée', 'Name / vintage')}
                <Input value={row.drinkName} placeholder="Ruinart Blanc de Blancs" onChange={(e) => updateRow(row.id, 'drinkName', e.target.value)} />
              </label>
              <label className="col-span-2 lg:col-span-2 text-xs">
                {tr('Accord / plat', 'Pairing / dish')}
                <Input value={row.pairing} placeholder={tr('Option viande', 'Meat option')} onChange={(e) => updateRow(row.id, 'pairing', e.target.value)} />
              </label>
              <label className="col-span-1 lg:col-span-1 text-xs">
                {tr('Quantité', 'Quantity')}
                <Input value={row.quantity} placeholder="24 btl" onChange={(e) => updateRow(row.id, 'quantity', e.target.value)} />
              </label>
              <label className="col-span-1 lg:col-span-1 text-xs">
                {tr('Statut', 'Status')}
                <select className={selectClass} value={row.status} onChange={(e) => updateRow(row.id, 'status', e.target.value)}>
                  {DRINK_STATUSES.map((s) => <option key={s} value={s}>{translateDrinkLabel(s, !!isEnglish)}</option>)}
                </select>
              </label>
              <label className="col-span-1 lg:col-span-1 text-xs">
                {tr('Fournisseur', 'Supplier')}
                <Input value={row.supplier} placeholder={tr('Traiteur', 'Caterer')} onChange={(e) => updateRow(row.id, 'supplier', e.target.value)} />
              </label>
              <div className="col-span-1 lg:col-span-1 flex justify-end">
                <Button variant="ghost" size="icon" aria-label={tr('Supprimer la ligne', 'Delete row')} onClick={() => deleteRow(row.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <label className="col-span-2 lg:col-span-12 text-xs">
                {tr('Notes (température, service…)', 'Notes (temperature, service…)')}
                <Input value={row.notes} placeholder={tr('Servir à 16°C', 'Serve at 16°C')} onChange={(e) => updateRow(row.id, 'notes', e.target.value)} />
              </label>
            </article>
          ))}
          <Button variant="outline" onClick={() => addRow()} className="w-full min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" /> {tr('Ajouter une boisson', 'Add a drink')}
          </Button>
        </div>
      )}
    </section>
  );
};

export default DrinksPlanTable;

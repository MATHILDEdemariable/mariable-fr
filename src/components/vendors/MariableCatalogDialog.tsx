import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Check, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface CatalogVendor {
  id: string;
  nom: string;
  categorie: string | null;
  ville: string | null;
  email: string | null;
  telephone: string | null;
  site_web: string | null;
}

interface MariableCatalogListProps {
  actionLabel: string;
  onPick: (vendor: CatalogVendor) => Promise<boolean>;
}

/** Liste du catalogue Mariable (prestataires visibles) avec recherche et filtre catégorie. */
export const MariableCatalogList: React.FC<MariableCatalogListProps> = ({ actionLabel, onPick }) => {
  const [vendors, setVendors] = useState<CatalogVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [pickedIds, setPickedIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const { data, error } = await supabase
          .from('prestataires_rows')
          .select('id, nom, categorie, ville, email, telephone, site_web')
          .eq('visible', true)
          .order('nom')
          .limit(1000);
        if (error) throw error;
        setVendors((data ?? []) as CatalogVendor[]);
      } catch (error) {
        console.error('❌ MariableCatalog: chargement impossible', error);
      } finally {
        setLoading(false);
      }
    };
    loadCatalog();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(vendors.map((v) => v.categorie).filter(Boolean))) as string[],
    [vendors]
  );

  const filteredVendors = useMemo(() => {
    const query = search.trim().toLowerCase();
    return vendors.filter((v) => {
      if (category !== 'all' && v.categorie !== category) return false;
      if (!query) return true;
      return `${v.nom} ${v.ville ?? ''}`.toLowerCase().includes(query);
    });
  }, [vendors, search, category]);

  const handlePick = async (vendor: CatalogVendor) => {
    setPendingId(vendor.id);
    const ok = await onPick(vendor);
    setPendingId(null);
    if (ok) setPickedIds((prev) => new Set(prev).add(vendor.id));
  };

  return (
    <div className="space-y-3 min-w-0 w-full">
      <Input placeholder="Nom, ville…" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-none" />
      <div className="flex gap-1.5 overflow-x-auto pb-1 min-w-0 [&>button]:shrink-0 [&>button]:whitespace-nowrap">
        {['all', ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-2.5 py-1 text-xs border transition-colors ${category === c ? 'bg-wedding-olive text-white border-wedding-olive' : 'bg-background border-border text-muted-foreground hover:border-wedding-olive'}`}
          >
            {c === 'all' ? 'Tous' : c}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : (
        <ul className="divide-y divide-border border border-border max-h-[50vh] overflow-y-auto">
          {filteredVendors.slice(0, 200).map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{v.nom}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {v.categorie}{v.ville && <><MapPin className="h-3 w-3 ml-1" />{v.ville}</>}
                </p>
              </div>
              <Button
                size="sm"
                variant={pickedIds.has(v.id) ? 'outline' : 'default'}
                className="rounded-none shrink-0 min-h-[36px]"
                disabled={pickedIds.has(v.id) || pendingId === v.id}
                onClick={() => handlePick(v)}
              >
                {pendingId === v.id ? <Loader2 className="h-3 w-3 animate-spin" /> : pickedIds.has(v.id) ? <Check className="h-3 w-3" /> : <><Plus className="h-3 w-3 mr-1" />{actionLabel}</>}
              </Button>
            </li>
          ))}
          {filteredVendors.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Aucun résultat</li>}
        </ul>
      )}
    </div>
  );
};

interface MariableCatalogDialogProps extends MariableCatalogListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
}

const MariableCatalogDialog: React.FC<MariableCatalogDialogProps> = ({ open, onOpenChange, title, ...listProps }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-2xl w-[calc(100vw-2rem)] rounded-none grid-cols-1 overflow-hidden">
      <DialogHeader>
        <DialogTitle className="font-serif text-xl text-wedding-olive">{title}</DialogTitle>
      </DialogHeader>
      <div className="min-w-0">{open && <MariableCatalogList {...listProps} />}</div>
    </DialogContent>
  </Dialog>
);

export default MariableCatalogDialog;

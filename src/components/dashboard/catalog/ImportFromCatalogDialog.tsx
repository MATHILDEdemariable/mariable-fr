import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getPriceUnit, getVendorCategory } from '@/data/constants';
import { usePriceCatalog, type PriceCatalogItem } from '@/hooks/usePriceCatalog';

export interface CatalogImportSelection {
  item: PriceCatalogItem;
  quantity: number;
  amount: number;
}

interface ImportFromCatalogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestsCount: number;
  onImport: (selections: CatalogImportSelection[]) => void;
}

const ImportFromCatalogDialog: React.FC<ImportFromCatalogDialogProps> = ({ open, onOpenChange, guestsCount, onImport }) => {
  const { t, i18n } = useTranslation('budget');
  const isEnglish = i18n.language?.startsWith('en');
  const { items, isLoading } = usePriceCatalog();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Record<string, number>>({});

  const defaultQuantity = (item: PriceCatalogItem) => (item.price_unit === 'per_person' ? Math.max(guestsCount || 1, 1) : 1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(query) || (item.description || '').toLowerCase().includes(query)
    );
  }, [items, search]);

  const toggle = (item: PriceCatalogItem, checked: boolean) => {
    setSelected(prev => {
      const next = { ...prev };
      if (checked) next[item.id] = defaultQuantity(item);
      else delete next[item.id];
      return next;
    });
  };

  const handleImport = () => {
    const selections: CatalogImportSelection[] = items
      .filter(item => selected[item.id] !== undefined)
      .map(item => {
        const quantity = selected[item.id] || 1;
        return { item, quantity, amount: Math.round(item.base_price * quantity) };
      });

    if (selections.length === 0) return;
    onImport(selections);
    setSelected({});
    onOpenChange(false);
  };

  const selectedCount = Object.keys(selected).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif">{t('catalog.import.title')}</DialogTitle>
        </DialogHeader>

        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('catalog.searchPlaceholder')}
        />

        <ScrollArea className="h-[50vh] pr-3">
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">{t('catalog.loading')}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{t('catalog.import.empty')}</p>
          ) : (
            <div className="space-y-2">
              {filtered.map(item => {
                const category = getVendorCategory(item.category);
                const unit = getPriceUnit(item.price_unit);
                const isSelected = selected[item.id] !== undefined;
                const quantity = selected[item.id] ?? defaultQuantity(item);

                return (
                  <div key={item.id} className="flex items-start gap-3 border rounded-md p-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={checked => toggle(item, Boolean(checked))}
                      className="mt-1"
                      aria-label={item.name}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        <span aria-hidden className="mr-1">{category.icon}</span>
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isEnglish ? category.en : category.fr} · {new Intl.NumberFormat('fr-FR').format(item.base_price)} € · {isEnglish ? unit.en : unit.fr}
                      </p>
                    </div>
                    {isSelected && item.price_unit !== 'forfait' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={e => setSelected(prev => ({ ...prev, [item.id]: Math.max(parseInt(e.target.value, 10) || 1, 1) }))}
                          className="w-20 h-8"
                          aria-label={t('catalog.import.quantity')}
                        />
                        <span className="text-sm font-semibold text-wedding-olive w-24 text-right">
                          {new Intl.NumberFormat('fr-FR').format(Math.round(item.base_price * quantity))} €
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('catalog.actions.cancel')}</Button>
          <Button
            onClick={handleImport}
            disabled={selectedCount === 0}
            className="bg-wedding-olive hover:bg-wedding-olive/90"
          >
            {t('catalog.import.confirm', { count: selectedCount })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFromCatalogDialog;

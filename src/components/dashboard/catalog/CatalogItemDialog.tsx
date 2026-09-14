import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRICE_UNITS, VENDOR_CATEGORIES } from '@/data/constants';
import type { PriceCatalogInput, PriceCatalogItem } from '@/hooks/usePriceCatalog';

interface CatalogItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: PriceCatalogItem | null;
  onSubmit: (values: PriceCatalogInput) => Promise<void> | void;
  isSubmitting?: boolean;
}

const CatalogItemDialog: React.FC<CatalogItemDialogProps> = ({ open, onOpenChange, item, onSubmit, isSubmitting }) => {
  const { t, i18n } = useTranslation('budget');
  const isEnglish = i18n.language?.startsWith('en');

  const [category, setCategory] = useState('venue');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('0');
  const [priceUnit, setPriceUnit] = useState('forfait');

  useEffect(() => {
    if (!open) return;
    setCategory(item?.category ?? 'venue');
    setName(item?.name ?? '');
    setDescription(item?.description ?? '');
    setBasePrice(String(item?.base_price ?? 0));
    setPriceUnit(item?.price_unit ?? 'forfait');
  }, [open, item]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onSubmit({
      category,
      name: name.trim(),
      description: description.trim() || null,
      base_price: parseFloat(basePrice) || 0,
      price_unit: priceUnit,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {item ? t('catalog.dialog.editTitle') : t('catalog.dialog.addTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t('catalog.fields.category')}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-background z-50">
                {VENDOR_CATEGORIES.map(cat => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {cat.icon} {isEnglish ? cat.en : cat.fr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>{t('catalog.fields.name')}</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder={t('catalog.fields.namePlaceholder')} />
          </div>

          <div className="space-y-1.5">
            <Label>{t('catalog.fields.description')}</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('catalog.fields.price')}</Label>
              <Input type="number" min={0} value={basePrice} onChange={e => setBasePrice(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('catalog.fields.unit')}</Label>
              <Select value={priceUnit} onValueChange={setPriceUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {PRICE_UNITS.map(unit => (
                    <SelectItem key={unit.key} value={unit.key}>{isEnglish ? unit.en : unit.fr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('catalog.actions.cancel')}</Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className="bg-wedding-olive hover:bg-wedding-olive/90"
          >
            {t('catalog.actions.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogItemDialog;

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useWedding, type Wedding } from '@/contexts/WeddingContext';

interface ModifierMariageDialogProps {
  wedding: Wedding | null;
  onOpenChange: (open: boolean) => void;
}

/** Fenêtre d'édition d'un espace mariage (prénoms des mariés, date, lieu, invités). */
const ModifierMariageDialog: React.FC<ModifierMariageDialogProps> = ({ wedding, onOpenChange }) => {
  const { updateWedding } = useWedding();
  const { toast } = useToast();
  const { t } = useTranslation('pro');

  const [title, setTitle] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!wedding) return;
    setTitle(wedding.title ?? '');
    setWeddingDate(wedding.wedding_date ? wedding.wedding_date.slice(0, 10) : '');
    setLocation(wedding.wedding_location ?? '');
    setGuestCount(wedding.guest_count ? String(wedding.guest_count) : '');
  }, [wedding]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!wedding) return;
    if (!title.trim()) {
      toast({ title: t('editWedding.namesRequired'), description: t('editWedding.namesRequiredDesc'), variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      await updateWedding(wedding.id, {
        title: title.trim(),
        wedding_date: weddingDate || null,
        wedding_location: location.trim() || null,
        guest_count: guestCount ? Number(guestCount) : null,
      });
      toast({ title: t('editWedding.updated') });
      onOpenChange(false);
    } catch (error) {
      console.error('❌ ModifierMariageDialog: enregistrement impossible', error);
      toast({
        title: t('editWedding.errorTitle'),
        description: t('editWedding.errorDesc'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!wedding} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#F8F5EF] rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{t('editWedding.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-wedding-title">{t('editWedding.names')}</Label>
            <Input
              id="edit-wedding-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('editWedding.namesPlaceholder')}
              className="rounded-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-wedding-date">{t('editWedding.date')}</Label>
            <Input
              id="edit-wedding-date"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="rounded-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-wedding-location">{t('editWedding.location')}</Label>
            <Input
              id="edit-wedding-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('editWedding.locationPlaceholder')}
              className="rounded-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-wedding-guests">{t('editWedding.guests')}</Label>
            <Input
              id="edit-wedding-guests"
              type="number"
              min={0}
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="120"
              className="rounded-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-none" onClick={() => onOpenChange(false)}>
              {t('editWedding.cancel')}
            </Button>
            <Button type="submit" className="rounded-none" disabled={saving}>
              {saving ? t('editWedding.saving') : t('editWedding.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModifierMariageDialog;

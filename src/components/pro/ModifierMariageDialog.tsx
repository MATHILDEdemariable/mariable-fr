import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWedding, type Wedding } from '@/contexts/WeddingContext';

interface ModifierMariageDialogProps {
  wedding: Wedding | null;
  onOpenChange: (open: boolean) => void;
}

/** Fenêtre d'édition d'un espace mariage (prénoms des mariés, date, lieu, invités). */
const ModifierMariageDialog: React.FC<ModifierMariageDialogProps> = ({ wedding, onOpenChange }) => {
  const { updateWedding } = useWedding();
  const { toast } = useToast();

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
      toast({ title: 'Prénoms requis', description: 'Indiquez les prénoms des mariés.', variant: 'destructive' });
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
      toast({ title: 'Mariage mis à jour' });
      onOpenChange(false);
    } catch (error) {
      console.error('❌ ModifierMariageDialog: enregistrement impossible', error);
      toast({
        title: 'Enregistrement impossible',
        description: "Les informations n'ont pas pu être enregistrées. Réessayez dans un instant.",
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
          <DialogTitle className="font-serif text-xl">Modifier le mariage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-wedding-title">Prénoms des mariés</Label>
            <Input
              id="edit-wedding-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Camille & Antoine"
              className="rounded-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-wedding-date">Date du mariage</Label>
            <Input
              id="edit-wedding-date"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="rounded-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-wedding-location">Lieu</Label>
            <Input
              id="edit-wedding-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Château de ..."
              className="rounded-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-wedding-guests">Nombre d'invités</Label>
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
              Annuler
            </Button>
            <Button type="submit" className="rounded-none" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModifierMariageDialog;

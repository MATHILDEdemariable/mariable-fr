import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWedding } from '@/contexts/WeddingContext';

interface NouveauMariageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NouveauMariageDialog: React.FC<NouveauMariageDialogProps> = ({ open, onOpenChange }) => {
  const { createWedding } = useWedding();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      toast({ title: 'Titre requis', description: 'Indiquez le nom du couple ou du mariage.', variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      await createWedding({
        title: title.trim(),
        wedding_date: weddingDate || null,
        wedding_location: location.trim() || null,
        guest_count: guestCount ? Number(guestCount) : null,
      });
      onOpenChange(false);
      setTitle('');
      setWeddingDate('');
      setLocation('');
      setGuestCount('');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ NouveauMariageDialog: création impossible', error);
      toast({
        title: 'Création impossible',
        description: "Le mariage n'a pas pu être créé. Réessayez dans un instant.",
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#F8F5EF]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Nouveau mariage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="wedding-title">Couple / titre</Label>
            <Input
              id="wedding-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Camille & Antoine"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wedding-date">Date</Label>
            <Input id="wedding-date" type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wedding-location">Lieu</Label>
            <Input
              id="wedding-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Château de ..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wedding-guests">Nombre d'invités</Label>
            <Input
              id="wedding-guests"
              type="number"
              min={0}
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="120"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-none" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="rounded-none" disabled={saving}>
              {saving ? 'Création...' : 'Créer et ouvrir'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NouveauMariageDialog;

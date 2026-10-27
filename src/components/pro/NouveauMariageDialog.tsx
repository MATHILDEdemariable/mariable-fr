import { useTranslation } from 'react-i18next';
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
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.language?.startsWith('en') ? en : fr);

  const [title, setTitle] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [prestationType, setPrestationType] = useState<'organisation' | 'jourJ'>('jourJ');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      toast({ title: tr('Titre requis', 'Title required'), description: tr('Indiquez le nom du couple ou du mariage.', 'Enter the couple or wedding name.'), variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      await createWedding({
        title: title.trim(),
        wedding_date: weddingDate || null,
        wedding_location: location.trim() || null,
        guest_count: guestCount ? Number(guestCount) : null,
        prestation_type: prestationType,
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
        title: tr('Création impossible', 'Could not create'),
        description: tr("Le mariage n'a pas pu être créé. Réessayez dans un instant.", 'The wedding could not be created. Please try again.'),
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
          <DialogTitle className="font-serif text-xl">{tr('Nouveau mariage', 'New wedding')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="space-y-1.5">
            <legend className="text-sm font-medium mb-1.5">{tr('Formule', 'Service')}</legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {([
                { value: 'jourJ' as const, label: tr('Coordination Jour J', 'Wedding-day coordination'), hint: tr('Planning, équipe, plan de table', 'Schedule, team, seating plan') },
                { value: 'organisation' as const, label: tr('Organisation complète', 'Full planning'), hint: tr('Budget, rétroplanning, RSVP + Jour J', 'Budget, timeline, RSVP + wedding day') },
              ]).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={prestationType === option.value}
                  onClick={() => setPrestationType(option.value)}
                  className={`min-h-[64px] border p-3 text-left text-sm transition-colors ${prestationType === option.value ? 'border-wedding-olive bg-wedding-olive text-background' : 'border-border bg-background hover:border-wedding-olive'}`}
                >
                  <span className="block font-semibold">{option.label}</span>
                  <span className="block text-xs opacity-80">{option.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-1.5">
            <Label htmlFor="wedding-title">{tr('Couple / titre', 'Couple / title')}</Label>
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
            <Label htmlFor="wedding-location">{tr('Lieu', 'Venue')}</Label>
            <Input
              id="wedding-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={tr('Château de ...', 'Château ...')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wedding-guests">{tr("Nombre d'invités", 'Guest count')}</Label>
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
              {tr('Annuler', 'Cancel')}
            </Button>
            <Button type="submit" className="rounded-none" disabled={saving}>
              {saving ? tr('Création...', 'Creating...') : tr('Créer et ouvrir', 'Create & open')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NouveauMariageDialog;

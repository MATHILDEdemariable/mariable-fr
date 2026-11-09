import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWedding } from '@/contexts/WeddingContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { Camera } from 'lucide-react';

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
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const coverPreview = React.useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : ''), [coverFile]);

  const uploadCoverPhoto = async (): Promise<string | null> => {
    if (!coverFile) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const extension = coverFile.name.split('.').pop() || 'jpg';
      const filePath = `${user.id}/wedding-covers/${Date.now()}.${extension}`;
      const { error } = await supabase.storage.from('wedding-documents').upload(filePath, coverFile);
      if (error) throw error;
      return supabase.storage.from('wedding-documents').getPublicUrl(filePath).data.publicUrl;
    } catch (error) {
      console.error('❌ uploadCoverPhoto failed:', error);
      toast({ title: tr('Photo non enregistrée', 'Photo not saved'), description: tr('Le mariage est créé sans photo.', 'The wedding is created without a photo.') });
      return null;
    }
  };
  // Formule Coordination Jour J : seuls les mariages Jour J peuvent être créés
  const { isProJourJ } = useUserProfile();
  const effectivePrestationType = isProJourJ ? 'jourJ' : prestationType;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      toast({ title: tr('Titre requis', 'Title required'), description: tr('Indiquez le nom du couple ou du mariage.', 'Enter the couple or wedding name.'), variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      const coverUrl = await uploadCoverPhoto();
      await createWedding({
        cover_url: coverUrl,
        title: title.trim(),
        wedding_date: weddingDate || null,
        wedding_location: location.trim() || null,
        guest_count: guestCount ? Number(guestCount) : null,
        prestation_type: effectivePrestationType,
      });
      onOpenChange(false);
      setTitle('');
      setWeddingDate('');
      setLocation('');
      setGuestCount('');
      setCoverFile(null);
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
              ]).map((option) => {
                const isLocked = isProJourJ && option.value === 'organisation';
                return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={effectivePrestationType === option.value}
                  aria-disabled={isLocked}
                  disabled={isLocked}
                  onClick={() => setPrestationType(option.value)}
                  className={`min-h-[64px] border p-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${effectivePrestationType === option.value ? 'border-wedding-olive bg-wedding-olive text-background' : 'border-border bg-background hover:border-wedding-olive'}`}
                >
                  <span className="block font-semibold">{option.label}</span>
                  <span className="block text-xs opacity-80">{isLocked ? tr('Inclus dans la formule Organisation complète', 'Included in the Full planning plan') : option.hint}</span>
                </button>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-1.5">
            <Label htmlFor="wedding-cover">{tr('Photo (facultatif)', 'Photo (optional)')}</Label>
            <label htmlFor="wedding-cover" className="flex items-center gap-3 min-h-[64px] border border-dashed border-border bg-background p-2 cursor-pointer hover:border-wedding-olive">
              <span className="h-14 w-14 shrink-0 bg-muted flex items-center justify-center overflow-hidden">
                {coverPreview ? <img src={coverPreview} alt="" className="h-full w-full object-cover" /> : <Camera className="h-5 w-5 text-wedding-olive" />}
              </span>
              <span className="text-sm text-muted-foreground">{coverFile ? tr('Changer la photo', 'Change photo') : tr('Ajouter une photo du couple ou du lieu', 'Add a photo of the couple or venue')}</span>
            </label>
            <input id="wedding-cover" type="file" accept="image/*" className="sr-only"
              onChange={(e) => { const file = e.target.files?.[0]; if (file && file.size > 5_000_000) { toast({ title: tr('Photo trop lourde (5 Mo max)', 'Photo too large (5 MB max)'), variant: 'destructive' }); return; } setCoverFile(file ?? null); }} />
          </div>

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

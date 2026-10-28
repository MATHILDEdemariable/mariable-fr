import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { GUEST_COLOR_PALETTE } from '@/lib/guestTags';
import { useWeddingScope } from '@/hooks/useWeddingScope';

interface GuestManualAddProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const guestSchema = z.object({
  firstName: z.string().trim().min(2, 'Minimum 2 caractères').max(50),
  lastName: z.string().trim().min(2, 'Minimum 2 caractères').max(50),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().max(300).optional(),
  type: z.enum(['adult', 'child']),
  notes: z.string().max(500).optional(),
});

const GuestManualAdd: React.FC<GuestManualAddProps> = ({ isOpen, onClose, onAdded }) => {
  const { weddingId } = useWeddingScope();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [guestType, setGuestType] = useState<'adult' | 'child'>('adult');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const [guestColor, setGuestColor] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.language?.startsWith('en') ? en : fr);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setGuestType('adult');
    setNotes('');
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      guestSchema.parse({
        firstName,
        lastName,
        email,
        phone,
        address,
        type: guestType,
        notes,
      });

      setSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      const { error } = await supabase
        .from('wedding_guest_list')
        .insert({
          user_id: user.id,
          ...(weddingId ? { wedding_id: weddingId } : {}),
          guest_first_name: firstName.trim(),
          guest_last_name: lastName.trim(),
          guest_email: email.trim() || null,
          guest_phone: phone.trim() || null,
          guest_address: address.trim() || null,
          guest_type: guestType,
          notes: notes.trim() || null,
          guest_color: guestColor,
          source: 'manual',
        });

      if (error) throw error;

      toast({
        title: tr('Invité ajouté', 'Guest added'),
        description: `${firstName} ${lastName}`,
      });

      resetForm();
      onAdded();
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error('Erreur lors de l\'ajout:', error);
        toast({
          title: tr('Erreur', 'Error'),
          description: tr("Impossible d'ajouter l'invité", 'Unable to add guest'),
          variant: 'destructive',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tr('Ajouter un invité', 'Add a guest')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{tr('Prénom', 'First name')} *</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Marie"
              required
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">{tr('Nom', 'Last name')} *</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Dupont"
              required
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marie@exemple.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{tr('Téléphone', 'Phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{tr('Adresse postale', 'Postal address')}</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rue, Code postal, Ville, Pays"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>{tr("Type d'invité", 'Guest type')} *</Label>
            <RadioGroup value={guestType} onValueChange={(value) => setGuestType(value as 'adult' | 'child')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adult" id="adult" />
                <Label htmlFor="adult" className="font-normal cursor-pointer">
                  {tr('Adulte', 'Adult')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="child" id="child" />
                <Label htmlFor="child" className="font-normal cursor-pointer">
                  {tr('Enfant', 'Child')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{tr('Menu & commentaires', 'Menu & comments')}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={tr('Végétarien, allergie, PMR…', 'Vegetarian, allergy, wheelchair…')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>{tr('Couleur', 'Colour')}</Label>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setGuestColor(null)} className={`h-8 px-2 text-xs border ${!guestColor ? 'ring-2 ring-foreground' : ''}`}>{tr('Aucune', 'None')}</button>
              {GUEST_COLOR_PALETTE.map((c) => (
                <button key={c} type="button" onClick={() => setGuestColor(c)} aria-label={c} className={`h-8 w-8 rounded-full border ${guestColor === c ? 'ring-2 ring-offset-2 ring-foreground' : ''}`} style={{ backgroundColor: c }} />
              ))}
              <input type="color" value={guestColor || '#63745A'} onChange={(e) => setGuestColor(e.target.value)} className="h-8 w-10 border" aria-label={tr('Couleur personnalisée', 'Custom colour')} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {tr('Annuler', 'Cancel')}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {tr('Ajout...', 'Adding...')}
                </>
              ) : (
                tr('Ajouter', 'Add')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestManualAdd;

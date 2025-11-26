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

interface Guest {
  id: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  guest_address: string | null;
  guest_type: 'adult' | 'child';
  notes: string | null;
  rsvp_status: 'pending' | 'confirmed' | 'declined';
}

interface GuestEditDialogProps {
  guest: Guest;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const guestSchema = z.object({
  firstName: z.string().trim().min(2, 'Minimum 2 caractères').max(50),
  lastName: z.string().trim().min(2, 'Minimum 2 caractères').max(50),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().max(300).optional(),
  type: z.enum(['adult', 'child']),
  notes: z.string().max(500).optional(),
  rsvpStatus: z.enum(['pending', 'confirmed', 'declined']),
});

const GuestEditDialog: React.FC<GuestEditDialogProps> = ({ guest, isOpen, onClose, onUpdated }) => {
  const [firstName, setFirstName] = useState(guest.guest_first_name);
  const [lastName, setLastName] = useState(guest.guest_last_name);
  const [email, setEmail] = useState(guest.guest_email || '');
  const [phone, setPhone] = useState(guest.guest_phone || '');
  const [address, setAddress] = useState(guest.guest_address || '');
  const [guestType, setGuestType] = useState<'adult' | 'child'>(guest.guest_type);
  const [notes, setNotes] = useState(guest.notes || '');
  const [rsvpStatus, setRsvpStatus] = useState<'pending' | 'confirmed' | 'declined'>(guest.rsvp_status);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

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
        rsvpStatus,
      });

      setSubmitting(true);

      const { error } = await supabase
        .from('wedding_guest_list')
        .update({
          guest_first_name: firstName.trim(),
          guest_last_name: lastName.trim(),
          guest_email: email.trim() || null,
          guest_phone: phone.trim() || null,
          guest_address: address.trim() || null,
          guest_type: guestType,
          notes: notes.trim() || null,
          rsvp_status: rsvpStatus,
        })
        .eq('id', guest.id);

      if (error) throw error;

      toast({
        title: 'Invité modifié',
        description: `${firstName} ${lastName} a été mis à jour`,
      });

      onUpdated();
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
        console.error('Erreur lors de la modification:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de modifier l\'invité',
          variant: 'destructive',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'invité</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom *</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse postale</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Type d'invité *</Label>
            <RadioGroup value={guestType} onValueChange={(value) => setGuestType(value as 'adult' | 'child')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adult" id="adult" />
                <Label htmlFor="adult" className="font-normal cursor-pointer">
                  Adulte
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="child" id="child" />
                <Label htmlFor="child" className="font-normal cursor-pointer">
                  Enfant
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rsvpStatus">Statut de confirmation *</Label>
            <select
              id="rsvpStatus"
              value={rsvpStatus}
              onChange={(e) => setRsvpStatus(e.target.value as 'pending' | 'confirmed' | 'declined')}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="declined">Absent</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Commentaires</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes, régimes alimentaires, allergies..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestEditDialog;

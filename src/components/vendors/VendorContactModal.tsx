import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface VendorContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
}

const VendorContactModal: React.FC<VendorContactModalProps> = ({
  isOpen,
  onClose,
  vendorId,
  vendorName,
}) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [message, setMessage] = useState(
    `Bonjour, nous aimerions avoir plus d'informations / prévoir un rdv / quelles sont vos disponibilités restantes pour un mariage en ${weddingDate || 'septembre 2026'} ?`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !weddingDate || !message) {
      toast({
        description: 'Veuillez remplir tous les champs requis.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('vendor_contact_requests')
        .insert({
          email,
          phone: phone || null,
          wedding_date_text: weddingDate,
          message,
          vendor_id: vendorId,
          vendor_name: vendorName,
        });

      if (error) throw error;

      // Tracking automatique : créer ou mettre à jour dans vendors_tracking_preprod
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: existingTracking } = await supabase
          .from('vendors_tracking_preprod')
          .select('id, status')
          .eq('user_id', user.id)
          .eq('prestataire_id', vendorId)
          .maybeSingle();

        if (existingTracking) {
          if (existingTracking.status === 'à contacter') {
            await supabase
              .from('vendors_tracking_preprod')
              .update({ 
                status: 'contactés', 
                contact_date: new Date().toISOString() 
              })
              .eq('id', existingTracking.id);
          }
        } else {
          await supabase
            .from('vendors_tracking_preprod')
            .insert({
              user_id: user.id,
              prestataire_id: vendorId,
              vendor_name: vendorName,
              category: 'Prestataire',
              status: 'contactés',
              contact_date: new Date().toISOString(),
              notes: `Premier contact via formulaire le ${new Date().toLocaleDateString('fr-FR')}`,
              source: 'mariable'
            });
        }
      }

      toast({
        description: 'Votre demande a été envoyée avec succès !',
      });

      // Reset form
      setEmail('');
      setPhone('');
      setWeddingDate('');
      setMessage(`Bonjour, nous aimerions avoir plus d'informations / prévoir un rdv / quelles sont vos disponibilités restantes pour un mariage en septembre 2026 ?`);
      onClose();
    } catch (error) {
      console.error('Error submitting contact request:', error);
      toast({
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update message when wedding date changes
  React.useEffect(() => {
    if (weddingDate) {
      setMessage(`Bonjour, nous aimerions avoir plus d'informations / prévoir un rdv / quelles sont vos disponibilités restantes pour un mariage en ${weddingDate} ?`);
    }
  }, [weddingDate]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contacter {vendorName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@exemple.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
              pattern="^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$"
              title="Format français : 06 12 34 56 78"
            />
          </div>

          <div>
            <Label htmlFor="weddingDate">Date de mariage souhaitée *</Label>
            <Input
              id="weddingDate"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              placeholder="Ex: septembre 2026, été 2025, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Envoyer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VendorContactModal;
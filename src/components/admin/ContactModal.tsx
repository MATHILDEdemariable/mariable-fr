
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
import { Badge } from '@/components/ui/badge';
import { Mail, Send } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type FormulaireProfessionnel = Database['public']['Tables']['prestataires']['Row'];

interface ContactModalProps {
  formulaires: FormulaireProfessionnel[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({
  formulaires,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    from: 'admin@mariable.fr',
  });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!emailData.subject || !emailData.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formulaires.length === 0) {
      toast.error('Aucun destinataire sélectionné');
      return;
    }

    setSending(true);
    try {
      // Simuler l'envoi d'email - ici vous intégreriez votre service d'email
      // Par exemple avec Resend, SendGrid, etc.
      
      const emailPromises = formulaires.map(async (formulaire) => {
        // Simuler l'envoi
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Ici vous feriez l'appel réel à votre service d'email
        console.log(`Email envoyé à ${formulaire.email}:`, {
          to: formulaire.email,
          subject: emailData.subject,
          message: emailData.message,
          from: emailData.from,
        });
      });

      await Promise.all(emailPromises);

      toast.success(`Email${formulaires.length > 1 ? 's' : ''} envoyé${formulaires.length > 1 ? 's' : ''} avec succès à ${formulaires.length} destinataire${formulaires.length > 1 ? 's' : ''}`);
      
      setEmailData({ subject: '', message: '', from: 'admin@mariable.fr' });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails:', error);
      toast.error('Erreur lors de l\'envoi des emails');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>
              Envoyer un email {formulaires.length > 1 ? 'en masse' : 'individuel'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Liste des destinataires */}
          <div>
            <Label>Destinataires ({formulaires.length})</Label>
            <div className="mt-2 p-3 border rounded-lg bg-gray-50 max-h-32 overflow-y-auto">
              {formulaires.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun destinataire sélectionné</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formulaires.map((formulaire) => (
                    <Badge key={formulaire.id} variant="outline" className="text-xs">
                      {formulaire.nom} ({formulaire.email})
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Champs du formulaire */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="from">Expéditeur</Label>
              <Input
                id="from"
                value={emailData.from}
                onChange={(e) => setEmailData({...emailData, from: e.target.value})}
                placeholder="admin@mariable.fr"
              />
            </div>

            <div>
              <Label htmlFor="subject">Objet *</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                placeholder="Objet de l'email..."
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={emailData.message}
                onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                placeholder="Contenu de votre message..."
                rows={8}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSend} disabled={sending}>
              <Send className="h-4 w-4 mr-1" />
              {sending ? 'Envoi...' : `Envoyer (${formulaires.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;

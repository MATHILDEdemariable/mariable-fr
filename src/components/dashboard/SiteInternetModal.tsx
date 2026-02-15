import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Globe, ExternalLink, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SiteInternetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SiteInternetModal: React.FC<SiteInternetModalProps> = ({ open, onOpenChange }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    console.log('🚀 SiteInternetModal submit started');
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contact_requests').insert({
        email: email.trim(),
        message: `[DEMANDE SITE INTERNET - 50€] Nom: ${name.trim()}. ${message.trim()}`,
        type: 'site_internet',
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Votre demande a été envoyée avec succès !');
      console.log('✅ SiteInternetModal submit completed');
    } catch (error) {
      console.error('❌ SiteInternetModal submit failed:', error);
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitted(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg rounded-none border-editorial-noir/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-editorial-noir">
            Votre site de mariage personnalisé
          </DialogTitle>
          <DialogDescription className="text-editorial-noir/60">
            Un site internet élégant et sur-mesure pour partager les détails de votre mariage avec vos invités. Après votre demande, nous vous recontacterons par email puis par WhatsApp pour valider ensemble les images et textes de votre site.
          </DialogDescription>
        </DialogHeader>

        {/* Tarif */}
        <div className="bg-editorial-beige p-4 border border-editorial-noir/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-editorial-noir">50 € — Site clé en main</p>
              <p className="text-sm text-editorial-noir/60 mt-1">Design éditorial, responsive, personnalisé à votre image</p>
            </div>
            <Globe className="h-8 w-8 text-editorial-noir/30" />
          </div>
        </div>

        {/* Fonctionnalités */}
        <div className="space-y-2 text-sm text-editorial-noir/70">
          <p className="font-medium text-editorial-noir">Inclus dans votre site :</p>
          <ul className="grid grid-cols-2 gap-1.5">
            {['Compte à rebours', 'Programme du jour', 'Formulaire RSVP', 'Infos hébergements', 'Plan d\'accès', 'Design sur-mesure'].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-wedding-olive" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Exemple */}
        <Button
          variant="outline"
          className="w-full rounded-none border-editorial-noir/20 text-editorial-noir"
          onClick={() => window.open('/exemplesite', '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Voir un exemple de site
        </Button>

        {/* Formulaire ou confirmation */}
        {isSubmitted ? (
          <div className="text-center py-4">
            <Check className="h-10 w-10 text-wedding-olive mx-auto mb-2" />
            <p className="font-medium text-editorial-noir">Demande envoyée !</p>
            <p className="text-sm text-editorial-noir/60 mt-1">Nous vous recontacterons par email puis WhatsApp sous 24h pour créer votre site ensemble.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Votre nom *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-none border-editorial-noir/20"
              required
            />
            <Input
              type="email"
              placeholder="Votre email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-none border-editorial-noir/20"
              required
            />
            <Textarea
              placeholder="Détails de votre mariage (date, lieu, style souhaité...)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-none border-editorial-noir/20 min-h-[80px]"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-editorial-noir hover:bg-editorial-noir/80 text-white rounded-none"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Demander mon site — 50 €'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SiteInternetModal;

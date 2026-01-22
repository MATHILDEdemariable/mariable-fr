import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, Instagram, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROBLEM_CATEGORIES = [
  { value: 'bug', label: 'Bug technique' },
  { value: 'feature', label: 'Question sur une fonctionnalité' },
  { value: 'account', label: 'Problème de compte' },
  { value: 'suggestion', label: 'Suggestion d\'amélioration' },
  { value: 'other', label: 'Autre' },
];

export const ProblemModal: React.FC<ProblemModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Charger l'email de l'utilisateur connecté
  React.useEffect(() => {
    const loadUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }
    };
    if (isOpen) {
      loadUserEmail();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !subject || !message.trim()) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Enregistrer dans la base de données
      const { error: dbError } = await supabase
        .from('contact_requests')
        .insert({
          email,
          type: subject,
          message,
          status: 'pending',
        });

      if (dbError) throw dbError;

      // Envoyer l'email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-problem-report', {
        body: {
          email,
          subject: PROBLEM_CATEGORIES.find(c => c.value === subject)?.label || subject,
          message,
        },
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Ne pas bloquer si l'email échoue, le message est quand même enregistré
      }

      toast({
        title: 'Message envoyé !',
        description: 'Nous avons bien reçu votre message et reviendrons vers vous rapidement.',
      });

      // Reset form
      setSubject('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error submitting problem:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer votre message. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-wedding-olive">
            Un problème ?
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Votre email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Sujet</Label>
            <Select value={subject} onValueChange={setSubject} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un sujet" />
              </SelectTrigger>
              <SelectContent>
                {PROBLEM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Votre message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez votre problème ou votre question..."
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer le message
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou contactez-nous directement
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.href = 'mailto:mathilde@mariable.fr'}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open('https://www.instagram.com/mariable.fr/', '_blank')}
              className="flex-1"
            >
              <Instagram className="h-4 w-4 mr-2" />
              Instagram
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

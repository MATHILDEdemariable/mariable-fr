
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlanningResult } from './types';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface EmailCaptureFormProps {
  onSubmit: (email: string, fullName: string) => void;
  onSkip: () => void;
  quizScore: number;
  quizStatus: string;
  level: string;
}

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ 
  onSubmit, 
  onSkip, 
  quizScore, 
  quizStatus, 
  level 
}) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez entrer votre adresse e-mail.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Save email and quiz results
      onSubmit(email.trim(), fullName.trim());
      
      toast({
        title: "Merci !",
        description: "Vos informations ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate('/register', { 
      state: { 
        fromQuiz: true,
        quizScore,
        quizStatus
      } 
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-2">Voir votre planning personnalisé</h2>
        <p className="text-muted-foreground">
          Recevez votre planning personnalisé basé sur votre niveau d'avancement dans les préparatifs.
        </p>
      </div>
      
      <div className="border rounded-lg p-6 bg-wedding-light/30">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Votre nom</Label>
            <Input 
              id="fullName"
              type="text"
              placeholder="Votre nom"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Votre e-mail <span className="text-red-500">*</span></Label>
            <Input 
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
              disabled={isSubmitting}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Recevoir mon plan personnalisé
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <Button 
              type="button" 
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-muted-foreground"
            >
              Créer un compte complet
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground pt-2">
            En soumettant ce formulaire, vous acceptez de recevoir des informations sur nos services.
          </p>
        </form>
      </div>
    </div>
  );
};

export default EmailCaptureForm;

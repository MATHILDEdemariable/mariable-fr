
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
  quizResult: PlanningResult;
  onComplete: (data: { email: string; full_name?: string }) => void;
}

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ quizResult, onComplete }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fonction pour déterminer le niveau en fonction du score
  const getLevelFromScore = (score: number): string => {
    if (score <= 3) return 'Début';
    if (score <= 7) return 'Milieu';
    return 'Fin';
  };

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
      // Déterminer le niveau en fonction du score
      const level = getLevelFromScore(quizResult.score);
      
      // Sauvegarder les données dans Supabase
      const { error } = await supabase.from('quiz_email_captures').insert({
        email: email.trim(),
        full_name: fullName.trim() || null,
        quiz_score: quizResult.score,
        quiz_status: quizResult.status,
        level: level,
      });

      if (error) {
        console.error("Erreur lors de l'enregistrement:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos coordonnées. Veuillez réessayer.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Appeler onComplete avec les données
      onComplete({ email, full_name: fullName });
      
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
        quizScore: quizResult.score,
        quizStatus: quizResult.status
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
              onClick={handleSkip}
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

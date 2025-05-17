
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlanningResult } from './types';

interface EmailCaptureFormProps {
  quizResult: PlanningResult;
  onComplete: () => void;
}

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ quizResult, onComplete }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !fullName) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('quiz_email_captures')
        .insert([
          { 
            email, 
            full_name: fullName,
            quiz_score: quizResult.score,
            quiz_status: quizResult.status
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Merci !",
        description: "Votre plan personnalisé est maintenant disponible"
      });
      
      onComplete();
    } catch (error: any) {
      console.error('Error saving email:', error);
      toast({
        title: "Une erreur est survenue",
        description: error.message === "duplicate key value violates unique constraint \"quiz_email_captures_email_key\"" 
          ? "Cette adresse email est déjà enregistrée" 
          : "Impossible d'enregistrer vos informations",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold">Obtenez votre plan personnalisé</h3>
        <p className="text-muted-foreground">
          Recevez votre plan et restez informé des meilleures ressources pour votre mariage
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Votre nom</Label>
          <Input 
            id="fullName" 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jean Dupont"
            required
          />
        </div>
        
        <div>
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
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Traitement en cours...' : 'Voir mon plan personnalisé'}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        En soumettant ce formulaire, vous acceptez de recevoir des conseils pour votre mariage. Vous pouvez vous désabonner à tout moment.
      </p>
    </form>
  );
};

export default EmailCaptureForm;

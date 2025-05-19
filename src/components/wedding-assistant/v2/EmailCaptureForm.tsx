
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';
import { PlanningResult } from './types';
import { useToast } from '@/components/ui/use-toast';

interface EmailCaptureFormProps {
  quizResult: PlanningResult;
  onComplete: (email: string, fullName?: string) => void;
}

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ quizResult, onComplete }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !validateEmail(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    onComplete(email, fullName);
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl md:text-2xl font-serif">Recevez votre planning personnalisé</CardTitle>
        <CardDescription>
          Obtenez votre planning sur-mesure adapté à votre avancement actuel
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input 
              type="text"
              placeholder="Votre prénom et nom (facultatif)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Input 
              type="email"
              placeholder="Votre adresse email *"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Traitement...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Recevoir mon plan personnalisé
                  <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground pt-2">
            En soumettant ce formulaire, vous acceptez de recevoir des emails de notre part.
            Vous pourrez vous désabonner à tout moment.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailCaptureForm;

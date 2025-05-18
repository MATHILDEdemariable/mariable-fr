
import React, { useState } from 'react';
import { PlanningResult } from './types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { generateTasksFromQuizResult } from './taskGenerator';

interface EmailCaptureFormProps {
  quizResult: PlanningResult;
  onComplete: () => void;
}

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ quizResult, onComplete }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!email) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre email",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if the user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. Save the quiz results to the email_captures table
      const { error: captureError } = await supabase
        .from('quiz_email_captures')
        .insert([
          { 
            email, 
            full_name: fullName,
            quiz_score: quizResult.score,
            quiz_status: quizResult.status
          }
        ]);
        
      if (captureError) throw captureError;

      // 2. If the user is authenticated, save the tasks to the todos_planification table
      if (user) {
        const tasks = generateTasksFromQuizResult(quizResult);
        
        if (tasks.length > 0) {
          // Add user_id to each task
          const tasksWithUserId = tasks.map(task => ({
            ...task,
            user_id: user.id
          }));
          
          // Insert tasks into the todos_planification table
          const { error: tasksError } = await supabase
            .from('todos_planification')
            .insert(tasksWithUserId);
            
          if (tasksError) {
            console.error('Error saving tasks:', tasksError);
            toast({
              title: "Attention",
              description: "Vos résultats ont été enregistrés, mais nous n'avons pas pu créer votre plan personnalisé.",
              variant: "default"
            });
          } else {
            toast({
              title: "Plan créé avec succès",
              description: "Votre plan personnalisé a été créé et est disponible dans votre tableau de bord.",
              variant: "default"
            });
          }
        }
      }
      
      setIsSuccess(true);
      
      // Delay to show success state before proceeding
      setTimeout(() => {
        if (user) {
          // If user is logged in, redirect to dashboard after completing quiz
          navigate('/dashboard');
        } else {
          onComplete();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error saving quiz results:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos résultats. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-serif text-center mb-4">Recevez votre plan personnalisé</h2>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Entrez votre email pour recevoir votre plan de mariage personnalisé basé sur vos réponses.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Votre nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
          disabled={isSubmitting || isSuccess}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
            </>
          ) : isSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Enregistré avec succès!
            </>
          ) : (
            'Recevoir mon plan personnalisé'
          )}
        </Button>
      </form>
    </div>
  );
};

export default EmailCaptureForm;

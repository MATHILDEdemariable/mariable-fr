
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PlanningQuiz from '../PlanningQuiz';
import PlanningStepIndicator from './PlanningStepIndicator';
import { PlanningFormValues, PlanningEvent, savePlanningResponses } from '../types/planningTypes';
import { usePlanning } from '../context/PlanningContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const PlanningForm: React.FC = () => {
  const { setFormData, setEvents, setActiveTab, loading, setLoading, user } = usePlanning();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  
  // Define step labels based on planning categories
  const stepLabels = [
    'Cérémonie',
    'Logistique', 
    'Préparatifs',
    'Photos',
    'Cocktail',
    'Repas',
    'Soirée'
  ];

  useEffect(() => {
    // Initialize completed steps array
    setCompletedSteps(new Array(stepLabels.length).fill(false));
  }, []);

  const handleStepChange = (stepIndex: number) => {
    // Only allow navigation to completed steps or current step
    if (stepIndex <= currentStep || completedSteps[stepIndex]) {
      setCurrentStep(stepIndex);
    }
  };

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newCompleted = [...prev];
      newCompleted[stepIndex] = true;
      return newCompleted;
    });
  };

  const handleFormSubmit = async (data: PlanningFormValues, generatedEvents: PlanningEvent[]) => {
    setFormData(data);
    setEvents(generatedEvents);
    setActiveTab("results");
    
    // Save responses to Supabase if a user is logged in
    if (user) {
      try {
        setLoading(true);
        await savePlanningResponses(
          supabase, 
          user.id, 
          user.email || undefined, 
          data, 
          generatedEvents
        );
        
        toast({
          title: "Planning sauvegardé",
          description: "Votre planning a été généré et sauvegardé avec succès."
        });
      } catch (error: any) {
        console.error("Error saving planning:", error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Une erreur est survenue lors de la sauvegarde du planning, mais vous pouvez toujours le visualiser et l'exporter.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Configurez votre jour J</CardTitle>
        <CardDescription>
          Répondez aux questions suivantes pour générer automatiquement le planning optimisé de votre journée de mariage.
        </CardDescription>
        
        <PlanningStepIndicator
          currentStep={currentStep}
          totalSteps={stepLabels.length}
          stepLabels={stepLabels}
          completedSteps={completedSteps}
          onStepClick={handleStepChange}
          allowNavigation={true}
        />
      </CardHeader>
      <CardContent>
        <PlanningQuiz 
          onSubmit={handleFormSubmit}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onStepComplete={handleStepComplete}
          stepLabels={stepLabels}
        />
      </CardContent>
    </Card>
  );
};

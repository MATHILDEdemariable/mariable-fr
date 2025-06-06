
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PlanningQuiz from '../PlanningQuiz';
import PlanningStepIndicator from './PlanningStepIndicator';
import { 
  PlanningFormValues, 
  PlanningEvent, 
  savePlanningResponses, 
  saveGeneratedPlanning 
} from '../types/planningTypes';
import { usePlanning } from '../context/PlanningContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Use the same reordered categories config as in PlanningQuiz for consistency
const CATEGORIES_CONFIG = [
  { key: 'cérémonie', label: 'Cérémonie' },
  { key: 'logistique', label: 'Logistique' }, 
  { key: 'préparatifs_final', label: 'Préparatifs' },
  { key: 'photos', label: 'Photos' },
  { key: 'cocktail', label: 'Cocktail' },
  { key: 'repas', label: 'Repas' },
  { key: 'soiree', label: 'Soirée' }
];

export const PlanningForm: React.FC = () => {
  const { setFormData, setEvents, setActiveTab, loading, setLoading, user } = usePlanning();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  // Initialize step labels from categories config
  const stepLabels = CATEGORIES_CONFIG.map(cat => cat.label);

  useEffect(() => {
    // Initialize available categories
    const baseCategories = CATEGORIES_CONFIG.map(cat => cat.key);
    setAvailableCategories(baseCategories);
    
    // Initialize completed steps array
    setCompletedSteps(new Array(baseCategories.length).fill(false));
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
    console.log('Form submission with data:', data);
    console.log('Generated events:', generatedEvents);
    
    setFormData(data);
    setEvents(generatedEvents);
    setActiveTab("results");
    
    // Save to both tables if user is logged in - silent save without blocking UI
    if (user) {
      try {
        // Save to new generated_planning table
        await saveGeneratedPlanning(supabase, user.id, data, generatedEvents);
        
        // Also save to legacy planning_reponses_utilisateur table for backward compatibility
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
      } catch (error) {
        console.error("Error saving planning:", error);
        // Silent error handling - don't show error messages to user
        // The planning is still generated and usable
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-3 sm:px-6 py-4 sm:py-6">
        <CardTitle className="font-serif text-base sm:text-lg md:text-xl">
          Configurez votre jour J
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm md:text-base leading-relaxed">
          Répondez aux questions suivantes pour générer automatiquement le planning optimisé de votre journée de mariage.
        </CardDescription>
        
        {/* Step indicator - mobile responsive */}
        <div className="mt-3 sm:mt-4">
          <PlanningStepIndicator
            currentStep={currentStep}
            totalSteps={availableCategories.length}
            stepLabels={stepLabels}
            completedSteps={completedSteps}
            onStepClick={handleStepChange}
            allowNavigation={true}
          />
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 py-4 sm:py-6">
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


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlanning } from '../context/PlanningContext';
import PlanningQuiz from '../PlanningQuiz';
import { convertFormValuesToFormData, type PlanningFormValues } from './FormDataConverter';
import { PlanningEvent } from '../types/planningTypes';

const PlanningForm: React.FC = () => {
  const { formData, setFormData, setActiveTab } = usePlanning();
  const [localLoading, setLocalLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const stepLabels = [
    'Cérémonie',
    'Logistique',
    'Préparatifs final',
    'Photos',
    'Cocktail',
    'Repas',
    'Soirée'
  ];

  const handleQuizSubmit = async (values: PlanningFormValues, events: PlanningEvent[]) => {
    console.log('Quiz completed with values:', values);
    console.log('Generated events:', events);
    setLocalLoading(true);
    
    try {
      // Convert PlanningFormValues to FormData format
      const convertedData = convertFormValuesToFormData(values);
      setFormData(convertedData);
      
      // Switch to results tab after generating planning
      setTimeout(() => {
        setActiveTab('results');
        setLocalLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing quiz results:', error);
      setLocalLoading(false);
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleStepComplete = (step: number) => {
    setCompletedSteps(prev => [...prev.filter(s => s !== step), step]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questionnaire de Planning</CardTitle>
      </CardHeader>
      <CardContent>
        {localLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive mx-auto mb-4"></div>
              <p>Génération de votre planning...</p>
            </div>
          </div>
        ) : (
          <PlanningQuiz 
            onSubmit={handleQuizSubmit}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onStepComplete={handleStepComplete}
            stepLabels={stepLabels}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PlanningForm;

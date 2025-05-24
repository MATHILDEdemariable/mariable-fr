
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import {
  PlanningFormValues,
  PlanningQuestion,
  PlanningEvent,
  fetchPlanningQuestions,
  isQuestionVisible,
  generatePlanning
} from './types/planningTypes';

interface PlanningQuizProps {
  onSubmit: (data: PlanningFormValues, generatedEvents: PlanningEvent[]) => void;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onStepComplete?: (stepIndex: number) => void;
  stepLabels?: string[];
}

const PlanningQuiz: React.FC<PlanningQuizProps> = ({ 
  onSubmit, 
  currentStep = 0, 
  onStepChange, 
  onStepComplete,
  stepLabels = []
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PlanningQuestion[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  
  const form = useForm<PlanningFormValues>({
    defaultValues: {},
  });
  
  const watchAllFields = form.watch();
  
  // Get current section based on step
  const currentSection = sections[currentStep] || '';
  
  // Fetch planning questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await fetchPlanningQuestions(supabase);
        
        setQuestions(data.allQuestions);
        
        // Extract and set unique section names
        const uniqueSections = [...new Set(data.allQuestions.map(q => q.categorie))];
        setSections(uniqueSections);
        
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors du chargement des questions');
        console.error('Error loading planning questions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, []);
  
  // Handle navigation between sections
  const handleNextStep = () => {
    if (currentStep < sections.length - 1) {
      const nextStep = currentStep + 1;
      if (onStepChange) {
        onStepChange(nextStep);
      }
      if (onStepComplete) {
        onStepComplete(currentStep);
      }
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      if (onStepChange) {
        onStepChange(currentStep - 1);
      }
    }
  };
  
  // Handle form submission
  const handleFormSubmit = (data: PlanningFormValues) => {
    try {
      // Generate the planning based on the form responses
      const generatedPlanning = generatePlanning(questions, data);
      onSubmit(data, generatedPlanning);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération du planning');
      console.error('Error generating planning:', err);
    }
  };
  
  // Helper to render appropriate input based on question type
  const renderQuestionInput = (question: PlanningQuestion) => {
    const { type, option_name } = question;
    
    switch (type) {
      case 'choix':
        return (
          <FormField
            key={option_name}
            control={form.control}
            name={option_name}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {question.options && Array.isArray(question.options) && question.options.map((option, index) => {
                      const optionValue = typeof option === 'object' ? option.valeur : option;
                      const optionLabel = typeof option === 'object' 
                        ? `${option.valeur} (${option.duree_minutes} minutes)`
                        : option;
                        
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionValue} id={`${option_name}-${index}`} />
                          <label htmlFor={`${option_name}-${index}`} className="text-sm">{optionLabel}</label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'multi-choix':
        return (
          <FormField
            key={option_name}
            control={form.control}
            name={option_name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <div className="flex flex-col space-y-2">
                  {question.options && Array.isArray(question.options) && question.options.map((option, index) => {
                    const optionValue = typeof option === 'object' ? option.valeur : option;
                    const optionLabel = typeof option === 'object' 
                      ? `${option.valeur} (${option.duree_minutes} minutes)`
                      : option;
                      
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${option_name}-${index}`}
                          checked={(field.value || []).includes(optionValue)}
                          onCheckedChange={(checked) => {
                            const updatedValue = field.value || [];
                            if (checked) {
                              field.onChange([...updatedValue, optionValue]);
                            } else {
                              field.onChange(updatedValue.filter((v: string) => v !== optionValue));
                            }
                          }}
                        />
                        <label htmlFor={`${option_name}-${index}`} className="text-sm">{optionLabel}</label>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'time':
        return (
          <FormField
            key={option_name}
            control={form.control}
            name={option_name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field} 
                    className="w-full max-w-[200px]"
                  />
                </FormControl>
                <FormDescription>
                  Heure au format 24h (ex: 14:30)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'number':
        return (
          <FormField
            key={option_name}
            control={form.control}
            name={option_name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full max-w-[200px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'texte':
        return (
          <FormField
            key={option_name}
            control={form.control}
            name={option_name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'fixe':
        return (
          <div key={option_name} className="space-y-2">
            <h3 className="font-medium">{question.label}</h3>
            <p className="text-sm text-gray-500">
              {question.duree_minutes > 0 ? `Durée prévue: ${question.duree_minutes} minutes` : ''}
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Component to render current section questions
  const CurrentSectionQuestions = () => {
    // Filter questions by current section and visibility conditions
    const currentQuestions = questions
      .filter(q => q.categorie === currentSection)
      .filter(q => isQuestionVisible(q, watchAllFields));

    if (currentQuestions.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Aucune question disponible pour cette section.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {currentQuestions.map(question => (
          <div key={question.id} className="py-2">
            {renderQuestionInput(question)}
          </div>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-wedding-olive"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">
            <p>Erreur: {error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Section title */}
            <div className="border-b pb-4 mb-6">
              <h2 className="text-xl font-serif capitalize">{currentSection}</h2>
              <p className="text-sm text-gray-500">
                {currentSection === 'cérémonie' && "Informations sur votre cérémonie de mariage"}
                {currentSection === 'logistique' && "Détails logistiques de votre journée"}
                {currentSection === 'préparatifs' && "Organisation de vos préparatifs"}
                {currentSection === 'photos' && "Planification des séances photos"}
                {currentSection === 'cocktail' && "Organisation du cocktail"}
                {currentSection === 'repas' && "Déroulement du repas"}
                {currentSection === 'soiree' && "Organisation de votre soirée"}
              </p>
            </div>
            
            {/* Current section questions */}
            <CurrentSectionQuestions />
            
            {/* Navigation buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
              >
                Précédent
              </Button>
              
              {currentStep === sections.length - 1 ? (
                <Button 
                  type="submit"
                  className="bg-wedding-olive hover:bg-wedding-olive/80"
                >
                  Générer le planning
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-wedding-olive hover:bg-wedding-olive/80"
                >
                  Suivant
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PlanningQuiz;

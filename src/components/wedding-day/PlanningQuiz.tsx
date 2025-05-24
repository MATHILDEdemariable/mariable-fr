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

// Centralized categories configuration as single source of truth
const CATEGORIES_CONFIG = [
  { key: 'cérémonie', label: 'Cérémonie(s)', description: 'Informations sur votre/vos cérémonie(s) de mariage' },
  { key: 'logistique', label: 'Logistique', description: 'Temps de trajets et logistique' },
  { key: 'photos', label: 'Photos', description: 'Planification des séances photos' },
  { key: 'cocktail', label: 'Cocktail', description: 'Organisation du cocktail' },
  { key: 'repas', label: 'Repas', description: 'Déroulement du repas' },
  { key: 'soiree', label: 'Soirée', description: 'Organisation de votre soirée' },
  { key: 'préparatifs_final', label: 'Préparatifs', description: 'Préparatifs du matin de votre mariage' }
];

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
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const form = useForm<PlanningFormValues>({
    defaultValues: {},
  });
  
  const watchAllFields = form.watch();
  
  // Get current category based on step
  const currentCategory = availableCategories[currentCategoryIndex] || '';
  
  // Fetch planning questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await fetchPlanningQuestions(supabase);
        setQuestions(data.allQuestions);
        
        // Initialize available categories based on base config
        const baseCategories = CATEGORIES_CONFIG.map(cat => cat.key);
        setAvailableCategories(baseCategories);
        
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors du chargement des questions');
        console.error('Error loading planning questions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, []);
  
  // Update available categories when form values change (for conditional logic)
  useEffect(() => {
    const baseCategories = CATEGORIES_CONFIG.map(cat => cat.key);
    let dynamicCategories = [...baseCategories];
    
    // Add préparatifs_2 if double ceremony is selected
    if (watchAllFields.double_ceremonie === 'oui') {
      // Insert préparatifs_2 before préparatifs_final
      const finalPrepIndex = dynamicCategories.indexOf('préparatifs_final');
      if (finalPrepIndex > -1) {
        dynamicCategories.splice(finalPrepIndex, 0, 'préparatifs_2');
      }
    }
    
    setAvailableCategories(dynamicCategories);
  }, [watchAllFields.double_ceremonie]);
  
  // Sync with parent step changes
  useEffect(() => {
    if (currentStep !== currentCategoryIndex) {
      setCurrentCategoryIndex(currentStep);
    }
  }, [currentStep]);
  
  // Handle navigation between categories
  const handleNextStep = () => {
    const nextIndex = currentCategoryIndex + 1;
    
    if (nextIndex < availableCategories.length) {
      setCurrentCategoryIndex(nextIndex);
      if (onStepChange) {
        onStepChange(nextIndex);
      }
      if (onStepComplete) {
        onStepComplete(currentCategoryIndex);
      }
    }
  };
  
  const handlePrevStep = () => {
    const prevIndex = currentCategoryIndex - 1;
    
    if (prevIndex >= 0) {
      setCurrentCategoryIndex(prevIndex);
      if (onStepChange) {
        onStepChange(prevIndex);
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
  
  // Special renderer for ceremony section with conditional fieldsets
  const renderCeremonySection = () => {
    const isDualCeremony = watchAllFields.double_ceremonie === 'oui';
    const ceremonyQuestions = questions.filter(q => q.categorie === 'cérémonie');
    
    // Find the double ceremony question
    const doubleCeremonyQuestion = ceremonyQuestions.find(q => q.option_name === 'double_ceremonie');
    
    return (
      <div className="space-y-6">
        {/* Double ceremony question */}
        {doubleCeremonyQuestion && renderQuestionInput(doubleCeremonyQuestion)}
        
        {/* Single ceremony fieldset */}
        {!isDualCeremony && (
          <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
            <legend className="text-lg font-medium px-2">Votre cérémonie</legend>
            {ceremonyQuestions
              .filter(q => q.option_name === 'heure_ceremonie_principale' || q.option_name === 'type_ceremonie_principale')
              .filter(q => isQuestionVisible(q, watchAllFields))
              .map(question => (
                <div key={question.id}>
                  {renderQuestionInput(question)}
                </div>
              ))}
          </fieldset>
        )}
        
        {/* Dual ceremony fieldsets */}
        {isDualCeremony && (
          <>
            <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
              <legend className="text-lg font-medium px-2">Première cérémonie</legend>
              {ceremonyQuestions
                .filter(q => q.option_name === 'heure_ceremonie_1' || q.option_name === 'type_ceremonie_1')
                .filter(q => isQuestionVisible(q, watchAllFields))
                .map(question => (
                  <div key={question.id}>
                    {renderQuestionInput(question)}
                  </div>
                ))}
            </fieldset>
            
            <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
              <legend className="text-lg font-medium px-2">Deuxième cérémonie</legend>
              {ceremonyQuestions
                .filter(q => q.option_name === 'heure_ceremonie_2' || q.option_name === 'type_ceremonie_2')
                .filter(q => isQuestionVisible(q, watchAllFields))
                .map(question => (
                  <div key={question.id}>
                    {renderQuestionInput(question)}
                  </div>
                ))}
            </fieldset>
          </>
        )}
      </div>
    );
  };
  
  // Component to render current section questions
  const CurrentSectionQuestions = () => {
    // Special handling for ceremony section
    if (currentCategory === 'cérémonie') {
      return renderCeremonySection();
    }
    
    // Filter questions by current section and visibility conditions
    const currentQuestions = questions
      .filter(q => q.categorie === currentCategory)
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
  
  // Get section config helper
  const getCurrentCategoryConfig = () => {
    return CATEGORIES_CONFIG.find(cat => cat.key === currentCategory) || 
           { key: currentCategory, label: currentCategory, description: '' };
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
  
  const currentCategoryConfig = getCurrentCategoryConfig();
  
  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Section title */}
            <div className="border-b pb-4 mb-6">
              <h2 className="text-xl font-serif">{currentCategoryConfig.label}</h2>
              <p className="text-sm text-gray-500">
                {currentCategoryConfig.description}
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
                disabled={currentCategoryIndex === 0}
              >
                Précédent
              </Button>
              
              {currentCategoryIndex === availableCategories.length - 1 ? (
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

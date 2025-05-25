
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { PlanningFormValues, PlanningEvent } from './types/planningTypes';
import { generatePlanningEvents } from './planning/generateSchedule';

interface PlanningQuestion {
  id: string;
  categorie: string;
  label: string;
  type: string;
  option_name: string;
  options: any;
  visible_si?: any;
  duree_minutes?: number;
  ordre_affichage: number;
}

interface PlanningQuizProps {
  onSubmit: (data: PlanningFormValues, events: PlanningEvent[]) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  onStepComplete: (stepIndex: number) => void;
  stepLabels: string[];
  availableCategories: string[];
  completedSteps: boolean[];
}

const PlanningQuiz: React.FC<PlanningQuizProps> = ({
  onSubmit,
  currentStep,
  onStepChange,
  onStepComplete,
  stepLabels,
  availableCategories,
  completedSteps
}) => {
  const [questions, setQuestions] = useState<PlanningQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('planning_questions')
        .select('*')
        .order('ordre_affichage', { ascending: true });

      if (error) {
        console.error('Error loading questions:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les questions.",
          variant: "destructive"
        });
        return;
      }

      setQuestions(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current category based on currentStep and availableCategories
  const getCurrentCategory = () => {
    if (currentStep >= 0 && currentStep < availableCategories.length) {
      return availableCategories[currentStep];
    }
    return null;
  };

  // Get questions for current category
  const getCurrentQuestions = () => {
    const currentCategory = getCurrentCategory();
    if (!currentCategory) return [];
    
    let categoryQuestions = questions.filter(q => q.categorie === currentCategory);
    
    // For préparatifs, handle both preparatifs_1 and preparatifs_2 logic
    if (currentCategory === 'préparatifs_final') {
      // Get all questions from both preparatifs_1 and preparatifs_2
      const preparatifs1Questions = questions.filter(q => q.categorie === 'preparatifs_1');
      const preparatifs2Questions = questions.filter(q => q.categorie === 'preparatifs_2');
      
      // Always show preparatifs_1 questions
      categoryQuestions = [...preparatifs1Questions];
      
      // Only show preparatifs_2 questions if double_ceremonie = "oui"
      if (answers.double_ceremonie === "oui") {
        categoryQuestions = [...categoryQuestions, ...preparatifs2Questions];
      }
    }
    
    return categoryQuestions.filter(q => isQuestionVisible(q));
  };

  // Check if question should be visible based on conditions
  const isQuestionVisible = (question: PlanningQuestion): boolean => {
    if (!question.visible_si) return true;
    
    const conditions = Object.entries(question.visible_si);
    return conditions.every(([key, value]) => answers[key] === value);
  };

  // Handle answer change
  const handleAnswerChange = (questionOptionName: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionOptionName]: value
    }));
  };

  // Check if current step can be completed (made more lenient - not all questions required)
  const canCompleteCurrentStep = () => {
    const currentQuestions = getCurrentQuestions();
    
    // For now, allow progression even if not all questions are answered
    // This makes the quiz more user-friendly
    return true;
  };

  // Handle next step
  const handleNext = () => {
    // Mark current step as completed (even if not all questions answered)
    onStepComplete(currentStep);

    // Move to next step or submit if this is the last step
    if (currentStep < availableCategories.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      // This is the final step (Soirée), now we can submit
      handleSubmit();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  // Handle form submission (only after all steps completed)
  const handleSubmit = () => {
    // Generate events from answers
    const events = generatePlanningEvents(answers);
    
    // Submit the form
    onSubmit(answers as PlanningFormValues, events);
  };

  // Render question input based on type
  const renderQuestionInput = (question: PlanningQuestion) => {
    const value = answers[question.option_name];

    switch (question.type) {
      case 'choix':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={(val) => handleAnswerChange(question.option_name, val)}
          >
            {Array.isArray(question.options) && question.options.map((option: any, index: number) => {
              const optionValue = typeof option === 'string' ? option : option.valeur || option;
              const optionLabel = typeof option === 'string' ? option : 
                (option.label || `${option.valeur}${option.duree_minutes ? ` (${option.duree_minutes} min)` : ''}`);
              
              return (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={optionValue} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`}>{optionLabel}</Label>
                </div>
              );
            })}
          </RadioGroup>
        );

      case 'multi-choix':
        return (
          <div className="space-y-2">
            {Array.isArray(question.options) && question.options.map((option: any, index: number) => {
              const optionValue = typeof option === 'string' ? option : option.valeur || option;
              const optionLabel = typeof option === 'string' ? option : 
                (option.label || `${option.valeur}${option.duree_minutes ? ` (${option.duree_minutes} min)` : ''}`);
              const checked = Array.isArray(value) && value.includes(optionValue);

              return (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${index}`}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = isChecked
                        ? [...currentValues, optionValue]
                        : currentValues.filter(v => v !== optionValue);
                      handleAnswerChange(question.option_name, newValues);
                    }}
                  />
                  <Label htmlFor={`${question.id}-${index}`}>{optionLabel}</Label>
                </div>
              );
            })}
          </div>
        );

      case 'time':
        return (
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.option_name, e.target.value)}
            className="w-full max-w-[200px]"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.option_name, e.target.value)}
            className="w-full max-w-[200px]"
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.option_name, e.target.value)}
            className="w-full"
          />
        );
    }
  };

  // Render preparatifs section with custom structure
  const renderPreparatifsSection = () => {
    const preparatifs1Questions = questions.filter(q => q.categorie === 'preparatifs_1');
    const preparatifs2Questions = questions.filter(q => q.categorie === 'preparatifs_2');
    
    return (
      <div className="space-y-8">
        {/* Préparatifs avant la 1ère cérémonie */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Préparatifs avant la 1ère cérémonie</h3>
          <div className="space-y-6">
            {preparatifs1Questions.filter(q => isQuestionVisible(q)).map((question) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-medium">{question.label}</Label>
                {question.duree_minutes && (
                  <p className="text-sm text-muted-foreground">Durée prévue: {question.duree_minutes} minutes</p>
                )}
                {renderQuestionInput(question)}
              </div>
            ))}
          </div>
        </div>

        {/* Préparatifs avant la 2ème cérémonie - only if double ceremony */}
        {answers.double_ceremonie === "oui" && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Préparatifs avant la 2ème cérémonie</h3>
            <p className="text-sm text-blue-600 mb-4">
              Choisissez les étapes de préparation à répéter avant votre deuxième cérémonie.
            </p>
            <div className="space-y-6">
              {preparatifs2Questions.filter(q => isQuestionVisible(q)).map((question) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-medium">{question.label}</Label>
                  {question.duree_minutes && (
                    <p className="text-sm text-muted-foreground">{question.label.replace('Retouche', 'Retouche et remise en forme')} ({question.duree_minutes} minutes)</p>
                  )}
                  {renderQuestionInput(question)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center">Chargement des questions...</div>;
  }

  const currentQuestions = getCurrentQuestions();
  const currentCategory = getCurrentCategory();
  const isLastStep = currentStep === availableCategories.length - 1;

  return (
    <div className="space-y-6">
      {currentCategory && (
        <div className="mb-6">
          <h3 className="text-xl font-serif mb-4">{stepLabels[currentStep]}</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Étape {currentStep + 1} sur {availableCategories.length}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {currentCategory === 'préparatifs_final' ? (
          renderPreparatifsSection()
        ) : (
          currentQuestions.map((question) => (
            <div key={question.id} className="space-y-3">
              <Label className="text-base font-medium">{question.label}</Label>
              {question.duree_minutes && (
                <p className="text-sm text-muted-foreground">Durée prévue: {question.duree_minutes} minutes</p>
              )}
              {renderQuestionInput(question)}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Précédent
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          className="bg-wedding-olive hover:bg-wedding-olive/80"
        >
          {isLastStep ? 'Générer le planning' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
};

export default PlanningQuiz;

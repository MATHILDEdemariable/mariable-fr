
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

      console.log('All loaded questions:', data);
      setQuestions(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced label cleaning function that removes trailing characters and special chars
  const cleanLabel = (label: string): string => {
    if (!label) return '';
    
    return label
      .replace(/o+$/, '') // Remove trailing 'o' characters
      .replace(/[^\w\s\-\(\)\/\?\.\,\:àáâäèéêëìíîïòóôöùúûüÿñç]/gi, '') // Remove special characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Trim whitespace
  };

  // Get current category based on currentStep and availableCategories
  const getCurrentCategory = () => {
    if (currentStep >= 0 && currentStep < availableCategories.length) {
      return availableCategories[currentStep];
    }
    return null;
  };

  // Get questions for current category with enhanced preparatifs logic
  const getCurrentQuestions = () => {
    const currentCategory = getCurrentCategory();
    if (!currentCategory) return [];
    
    let categoryQuestions = questions.filter(q => q.categorie === currentCategory);
    
    // Special handling for préparatifs step
    if (currentCategory === 'préparatifs') {
      // Get all preparatifs_final questions (always shown)
      const preparatifsBaseQuestions = questions.filter(q => 
        q.categorie === 'preparatifs_final'
      );
      
      // Get preparatifs_2 questions (only shown if double ceremony)
      const preparatifs2Questions = questions.filter(q => 
        q.categorie === 'preparatifs_2'
      );
      
      console.log('Preparatifs base questions:', preparatifsBaseQuestions);
      console.log('Preparatifs 2 questions:', preparatifs2Questions);
      console.log('Double ceremony answer:', answers.double_ceremonie);
      
      // Always include base preparatifs questions
      categoryQuestions = [...preparatifsBaseQuestions];
      
      // Add preparatifs_2 questions if double ceremony selected
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
    console.log('Answer changed:', questionOptionName, value);
    setAnswers(prev => ({
      ...prev,
      [questionOptionName]: value
    }));
  };

  // Handle next step
  const handleNext = () => {
    onStepComplete(currentStep);

    if (currentStep < availableCategories.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    const events = generatePlanningEvents(answers);
    onSubmit(answers as PlanningFormValues, events);
  };

  // Render question input based on type with proper preparatifs handling
  const renderQuestionInput = (question: PlanningQuestion) => {
    const value = answers[question.option_name];
    const cleanedLabel = cleanLabel(question.label);

    console.log('Rendering question:', question.id, question.type, cleanedLabel);

    // Handle 'fixe' type questions (show as info with duration)
    if (question.type === 'fixe') {
      return (
        <div className="bg-gray-50 p-4 rounded-md border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Activité incluse automatiquement</span>
            {question.duree_minutes && question.duree_minutes > 0 && (
              <span className="text-sm font-semibold text-blue-600">
                {question.duree_minutes} minutes
              </span>
            )}
          </div>
        </div>
      );
    }

    switch (question.type) {
      case 'choix':
        // For preparatifs, render as checkbox instead of radio
        if (question.categorie === 'preparatifs_final' || question.categorie === 'preparatifs_2') {
          const checked = value === 'oui' || value === true;
          
          return (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={question.id}
                  checked={checked}
                  onCheckedChange={(isChecked) => {
                    handleAnswerChange(question.option_name, isChecked ? 'oui' : 'non');
                  }}
                />
                <Label htmlFor={question.id} className="text-base">
                  {cleanedLabel}
                </Label>
              </div>
              {question.duree_minutes && question.duree_minutes > 0 && (
                <p className="text-sm text-blue-600 font-medium ml-6">
                  Durée prévue: {question.duree_minutes} minutes
                </p>
              )}
            </div>
          );
        }

        // Regular radio group for other categories
        return (
          <div className="space-y-2">
            <RadioGroup
              value={value || ''}
              onValueChange={(val) => handleAnswerChange(question.option_name, val)}
            >
              {Array.isArray(question.options) && question.options.map((option: any, index: number) => {
                const optionValue = typeof option === 'string' ? option : option.valeur || option;
                const optionLabel = typeof option === 'string' ? cleanLabel(option) : 
                  cleanLabel(option.label || `${option.valeur}${option.duree_minutes ? ` (${option.duree_minutes} min)` : ''}`);
                
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={optionValue} id={`${question.id}-${index}`} />
                    <Label htmlFor={`${question.id}-${index}`}>{optionLabel}</Label>
                  </div>
                );
              })}
            </RadioGroup>
            {question.duree_minutes && question.duree_minutes > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                Durée prévue: {question.duree_minutes} minutes
              </p>
            )}
          </div>
        );

      case 'multi-choix':
        return (
          <div className="space-y-2">
            <div className="space-y-2">
              {Array.isArray(question.options) && question.options.map((option: any, index: number) => {
                const optionValue = typeof option === 'string' ? option : option.valeur || option;
                const optionLabel = typeof option === 'string' ? cleanLabel(option) : 
                  cleanLabel(option.label || `${option.valeur}${option.duree_minutes ? ` (${option.duree_minutes} min)` : ''}`);
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
            {question.duree_minutes && question.duree_minutes > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                Durée prévue: {question.duree_minutes} minutes
              </p>
            )}
          </div>
        );

      case 'time':
        return (
          <div className="space-y-2">
            <Input
              type="time"
              value={value || ''}
              onChange={(e) => handleAnswerChange(question.option_name, e.target.value)}
              className="w-full max-w-[200px]"
            />
            {question.duree_minutes && question.duree_minutes > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                Durée prévue: {question.duree_minutes} minutes
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => handleAnswerChange(question.option_name, e.target.value)}
              className="w-full max-w-[200px]"
            />
            {question.duree_minutes && question.duree_minutes > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                Durée prévue: {question.duree_minutes} minutes
              </p>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => handleAnswerChange(question.option_name, e.target.value)}
              className="w-full"
            />
            {question.duree_minutes && question.duree_minutes > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                Durée prévue: {question.duree_minutes} minutes
              </p>
            )}
          </div>
        );
    }
  };

  // Render preparatifs section with enhanced structure
  const renderPreparatifsSection = () => {
    const preparatifsBaseQuestions = questions.filter(q => 
      q.categorie === 'preparatifs_final'
    ).filter(q => isQuestionVisible(q));
    
    const preparatifs2Questions = questions.filter(q => q.categorie === 'preparatifs_2')
      .filter(q => isQuestionVisible(q));
    
    console.log('Base preparatifs questions:', preparatifsBaseQuestions);
    console.log('Preparatifs 2 questions:', preparatifs2Questions);
    console.log('Should show preparatifs 2?', answers.double_ceremonie === "oui");
    
    return (
      <div className="space-y-8">
        {/* Préparatifs before first ceremony */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Préparatifs avant la cérémonie</h3>
          <div className="space-y-4">
            {preparatifsBaseQuestions.map((question) => (
              <div key={question.id} className="space-y-2">
                {renderQuestionInput(question)}
              </div>
            ))}
            {preparatifsBaseQuestions.length === 0 && (
              <p className="text-gray-500 italic">Aucune question de préparatifs trouvée.</p>
            )}
          </div>
        </div>

        {/* Préparatifs before second ceremony - only if double ceremony */}
        {answers.double_ceremonie === "oui" && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Préparatifs avant la 2ème cérémonie</h3>
            <p className="text-sm text-blue-600 mb-4">
              Choisissez les étapes de préparation à répéter avant votre deuxième cérémonie.
            </p>
            <div className="space-y-4">
              {preparatifs2Questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  {renderQuestionInput(question)}
                </div>
              ))}
              {preparatifs2Questions.length === 0 && (
                <p className="text-gray-500 italic">Aucune question de préparatifs pour la 2ème cérémonie trouvée.</p>
              )}
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

  console.log('Current category:', currentCategory);
  console.log('Current questions:', currentQuestions);

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
        {currentCategory === 'préparatifs' ? (
          renderPreparatifsSection()
        ) : (
          <>
            {currentQuestions.map((question) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-medium">{cleanLabel(question.label)}</Label>
                {renderQuestionInput(question)}
              </div>
            ))}
            {currentQuestions.length === 0 && currentCategory && (
              <p className="text-gray-500 italic">
                Aucune question trouvée pour la catégorie "{currentCategory}".
              </p>
            )}
          </>
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

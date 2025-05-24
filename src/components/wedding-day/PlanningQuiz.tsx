import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  PlanningFormValues, 
  PlanningEvent, 
  QuizQuestion, 
  FormSection,
  calculateEventTimes,
  generatePlanningEvents
} from './types/planningTypes';

// Reordered categories config to include Soirée after Repas
const CATEGORIES_CONFIG = [
  { key: 'cérémonie', label: 'Cérémonie' },
  { key: 'logistique', label: 'Logistique' }, 
  { key: 'préparatifs_final', label: 'Préparatifs' },
  { key: 'photos', label: 'Photos' },
  { key: 'cocktail', label: 'Cocktail' },
  { key: 'repas', label: 'Repas' },
  { key: 'soiree', label: 'Soirée' }
];

interface PlanningQuizProps {
  onSubmit: (data: PlanningFormValues, events: PlanningEvent[]) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  onStepComplete: (stepIndex: number) => void;
  stepLabels: string[];
}

const PlanningQuiz: React.FC<PlanningQuizProps> = ({
  onSubmit,
  currentStep,
  onStepChange,
  onStepComplete,
  stepLabels
}) => {
  const [formData, setFormData] = useState<PlanningFormValues>({});
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCategory = CATEGORIES_CONFIG[currentStep]?.key;
  const currentCategoryQuestions = questions.filter(q => {
    if (currentCategory === 'préparatifs_final') {
      // Handle unified Préparatifs step logic
      if (formData.double_ceremonie === 'non') {
        return q.category === 'préparatifs_final';
      } else {
        return q.category === 'préparatifs_final' || q.category === 'préparatif_2';
      }
    }
    return q.category === currentCategory;
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // Use the correct table name from the database schema
      const { data, error } = await supabase
        .from('planning_questions')
        .select('*')
        .order('ordre_affichage', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match QuizQuestion format
      const transformedQuestions: QuizQuestion[] = (data || []).map(q => ({
        id: q.id,
        question: q.label,
        type: q.type as any,
        category: q.categorie,
        options: Array.isArray(q.options) ? q.options as string[] : [],
        required: true,
        placeholder: ''
      }));
      
      setQuestions(transformedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentCategoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Mark current step as complete
      onStepComplete(currentStep);
      
      // Move to next step
      if (currentStep < CATEGORIES_CONFIG.length - 1) {
        onStepChange(currentStep + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Final submission
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentStep > 0) {
      onStepChange(currentStep - 1);
      const prevCategoryQuestions = questions.filter(q => {
        const prevCategory = CATEGORIES_CONFIG[currentStep - 1]?.key;
        if (prevCategory === 'préparatifs_final') {
          if (formData.double_ceremonie === 'non') {
            return q.category === 'préparatifs_final';
          } else {
            return q.category === 'préparatifs_final' || q.category === 'préparatif_2';
          }
        }
        return q.category === prevCategory;
      });
      setCurrentQuestionIndex(prevCategoryQuestions.length - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate events from form data
      const events = generatePlanningEvents(formData);
      
      // Calculate times for all events
      const eventsWithTimes = calculateEventTimes(events, formData);
      
      onSubmit(formData, eventsWithTimes);
    } catch (error) {
      console.error('Error generating planning:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des questions...</div>;
  }

  if (currentCategoryQuestions.length === 0) {
    return <div className="text-center py-8">Aucune question disponible pour cette section.</div>;
  }

  const currentQuestion = currentCategoryQuestions[currentQuestionIndex];
  const progress = ((currentStep * 100) + ((currentQuestionIndex + 1) / currentCategoryQuestions.length * 100)) / CATEGORIES_CONFIG.length;

  const renderQuestionInput = (question: QuizQuestion) => {
    const value = formData[question.id];

    switch (question.type) {
      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={(newValue) => handleInputChange(question.id, newValue)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onCheckedChange={(checked) => {
                    const currentArray = Array.isArray(value) ? value : [];
                    if (checked) {
                      handleInputChange(question.id, [...currentArray, option]);
                    } else {
                      handleInputChange(question.id, currentArray.filter(v => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'time':
        return (
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
          />
        );

      case 'text':
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
          />
        );

      default:
        return null;
    }
  };

  const isAnswered = () => {
    const value = formData[currentQuestion.id];
    if (currentQuestion.required === false) return true;
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== '';
  };

  const isLastStep = currentStep === CATEGORIES_CONFIG.length - 1;
  const isLastQuestion = currentQuestionIndex === currentCategoryQuestions.length - 1;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Étape {currentStep + 1} sur {CATEGORIES_CONFIG.length}</span>
          <span>Question {currentQuestionIndex + 1} sur {currentCategoryQuestions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{CATEGORIES_CONFIG[currentStep]?.label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">{currentQuestion.question}</h3>
            {renderQuestionInput(currentQuestion)}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 && currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered() || isSubmitting}
              className="bg-wedding-olive hover:bg-wedding-olive/80"
            >
              {isSubmitting ? (
                "Génération..."
              ) : isLastStep && isLastQuestion ? (
                "Générer le planning"
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningQuiz;

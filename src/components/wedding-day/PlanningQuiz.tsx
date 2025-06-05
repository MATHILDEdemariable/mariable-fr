
import React, { useState, useEffect, useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { 
  PlanningFormValues, 
  PlanningEvent, 
  fetchPlanningQuestions, 
  generatePlanning,
  PlanningQuestion,
  isQuestionVisible
} from './types/planningTypes';
import { supabase } from '@/integrations/supabase/client';

interface PlanningQuizProps {
  onSubmit: (data: PlanningFormValues, events: PlanningEvent[]) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  onStepComplete: (step: number) => void;
  stepLabels: string[];
}

// Mapping des catégories aux étapes
const STEP_CATEGORIES = [
  'cérémonie',
  'logistique', 
  'préparatifs_final',
  'photos',
  'cocktail',
  'repas',
  'soiree'
];

const PlanningQuiz: React.FC<PlanningQuizProps> = ({
  onSubmit,
  currentStep,
  onStepChange,
  onStepComplete,
  stepLabels
}) => {
  const [formData, setFormData] = useState<PlanningFormValues>({});
  const [questions, setQuestions] = useState<PlanningQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add useReducer to force re-renders when needed
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const planningData = await fetchPlanningQuestions(supabase);
        setQuestions(planningData.allQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Enhanced logging for formData changes
  useEffect(() => {
    console.log('FormData updated:', formData);
    console.log('Double ceremony status:', formData.double_ceremonie);
  }, [formData]);

  const getCurrentStepQuestions = () => {
    const currentCategory = STEP_CATEGORIES[currentStep];
    let categoryQuestions = questions.filter(q => q.categorie === currentCategory);
    
    console.log(`Getting questions for category: ${currentCategory}`);
    console.log('All category questions:', categoryQuestions.map(q => ({ name: q.option_name, visible_si: q.visible_si })));
    console.log('Current formData:', formData);
    
    // Logique spéciale pour les cérémonies - éviter la duplication
    if (currentCategory === 'cérémonie') {
      const isDualCeremony = formData.double_ceremonie === 'oui';
      console.log('isDualCeremony:', isDualCeremony, 'double_ceremonie value:', formData.double_ceremonie);
      
      categoryQuestions = categoryQuestions.filter(q => {
        // Toujours montrer la question principale double_ceremonie
        if (q.option_name === 'double_ceremonie') return true;
        
        // Pour une seule cérémonie
        if (!isDualCeremony) {
          return q.option_name === 'heure_ceremonie_principale' || 
                 q.option_name === 'type_ceremonie_principale';
        }
        
        // Pour deux cérémonies
        if (isDualCeremony) {
          return q.option_name === 'heure_ceremonie_1' || 
                 q.option_name === 'type_ceremonie_1' ||
                 q.option_name === 'heure_ceremonie_2' || 
                 q.option_name === 'type_ceremonie_2';
        }
        
        return false;
      });
    }
    
    // Logique spéciale pour la logistique - trajets conditionnels
    if (currentCategory === 'logistique') {
      const isDualCeremony = formData.double_ceremonie === 'oui';
      console.log('Logistique - isDualCeremony:', isDualCeremony);
      
      categoryQuestions = categoryQuestions.filter(q => {
        // Questions non-trajet (comme pause_maries)
        if (!q.option_name.includes('trajet')) {
          // Appliquer les conditions de visibilité normales
          return isQuestionVisible(q, formData);
        }
        
        // Pour une seule cérémonie
        if (!isDualCeremony) {
          return q.option_name === 'trajet_depart_ceremonie' || 
                 q.option_name === 'trajet_ceremonie_reception';
        }
        
        // Pour deux cérémonies
        if (isDualCeremony) {
          return q.option_name === 'trajet_1_depart_ceremonie_1' || 
                 q.option_name === 'trajet_2_ceremonie_1_arrivee_1' ||
                 q.option_name === 'trajet_3_depart_ceremonie_2' || 
                 q.option_name === 'trajet_4_ceremonie_2_reception';
        }
        
        return false;
      });
    }
    
    // Appliquer les autres conditions de visibilité avec debug amélioré
    const visibleQuestions = categoryQuestions.filter(q => {
      // Pour les catégories spéciales (cérémonie, logistique), on a déjà filtré
      if (currentCategory === 'cérémonie' || 
          (currentCategory === 'logistique' && q.option_name.includes('trajet'))) {
        console.log(`Question ${q.option_name}: using special category logic - visible`);
        return true;
      }
      
      const isVisible = isQuestionVisible(q, formData);
      console.log(`Question ${q.option_name}: visible=${isVisible}, visible_si:`, q.visible_si, 'FormData check:', formData);
      return isVisible;
    }).sort((a, b) => a.ordre_affichage - b.ordre_affichage);
    
    console.log('Final visible questions:', visibleQuestions.map(q => ({ name: q.option_name, order: q.ordre_affichage })));
    return visibleQuestions;
  };

  const updateFormData = (fieldName: string, value: any) => {
    console.log(`Updating ${fieldName} to:`, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [fieldName]: value
      };
      console.log('New formData after update:', newData);
      
      // Force re-render after critical updates (like double_ceremonie)
      if (fieldName === 'double_ceremonie') {
        console.log('Critical field updated, forcing re-render');
        setTimeout(() => forceUpdate(), 10);
      }
      
      return newData;
    });
  };

  const handleMultiSelectChange = (fieldName: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[fieldName] as string[] || [];
      if (checked) {
        return {
          ...prev,
          [fieldName]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [fieldName]: currentValues.filter(v => v !== value)
        };
      }
    });
  };

  const renderQuestion = (question: PlanningQuestion) => {
    const value = formData[question.option_name];
    
    // Enhanced debug log pour chaque question rendue
    console.log('Rendering question:', {
      name: question.option_name,
      visible: isQuestionVisible(question, formData),
      value: value,
      visible_si: question.visible_si
    });

    switch (question.type) {
      case 'choix':
        return (
          <div className="space-y-3">
            <RadioGroup
              value={value as string || ''}
              onValueChange={(newValue) => updateFormData(question.option_name, newValue)}
            >
              {question.options?.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.valeur;
                return (
                  <div key={optionValue} className="flex items-center space-x-2">
                    <RadioGroupItem value={optionValue} id={`${question.id}-${optionValue}`} />
                    <Label htmlFor={`${question.id}-${optionValue}`}>{optionValue}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );

      case 'multi-choix':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.valeur;
              const isChecked = (value as string[] || []).includes(optionValue);
              return (
                <div key={optionValue} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${optionValue}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => 
                      handleMultiSelectChange(question.option_name, optionValue, checked === true)
                    }
                  />
                  <Label htmlFor={`${question.id}-${optionValue}`}>{optionValue}</Label>
                </div>
              );
            })}
          </div>
        );

      case 'time':
        return (
          <Input
            type="time"
            value={value as string || ''}
            onChange={(e) => updateFormData(question.option_name, e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value as number || ''}
            onChange={(e) => updateFormData(question.option_name, parseInt(e.target.value) || 0)}
            min="0"
            placeholder={question.option_name.includes('trajet') ? 'Durée en minutes' : ''}
          />
        );

      case 'texte':
        return (
          <Input
            type="text"
            value={value as string || ''}
            onChange={(e) => updateFormData(question.option_name, e.target.value)}
          />
        );

      case 'fixe':
        return (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">{question.label}</p>
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    onStepComplete(currentStep);
    if (currentStep < STEP_CATEGORIES.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      // Dernière étape - générer le planning
      const generatedEvents = generatePlanning(questions, formData);
      onSubmit(formData, generatedEvents);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const canProceed = () => {
    const currentQuestions = getCurrentStepQuestions();
    // Vérifier si au moins une question obligatoire est remplie
    return currentQuestions.length === 0 || currentQuestions.some(q => {
      const value = formData[q.option_name];
      return value !== undefined && value !== '' && value !== null;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  const currentQuestions = getCurrentStepQuestions();
  const isLastStep = currentStep === STEP_CATEGORIES.length - 1;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">
            {stepLabels[currentStep]} ({currentStep + 1}/{STEP_CATEGORIES.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune question pour cette étape.</p>
            </div>
          ) : (
            currentQuestions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label className="text-base font-medium">
                  {question.label_affichage_front || question.label}
                </Label>
                {renderQuestion(question)}
              </div>
            ))
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-wedding-olive hover:bg-wedding-olive/80"
            >
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Générer le planning
                </>
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

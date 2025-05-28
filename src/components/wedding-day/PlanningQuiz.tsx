
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PlanningQuestion {
  id: string;
  option_name: string;
  label: string;
  type: string;
  options: any;
  categorie: string;
  ordre_affichage: number;
}

interface PlanningQuizProps {
  onSubmit: (data: any, events: any[]) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  onStepComplete: (step: number) => void;
  stepLabels: string[];
}

const CATEGORIES_CONFIG = [
  { key: 'cérémonie', label: 'Cérémonie' },
  { key: 'logistique', label: 'Logistique' }, 
  { key: 'préparatifs_final', label: 'Préparatifs' },
  { key: 'photos', label: 'Photos' },
  { key: 'cocktail', label: 'Cocktail' },
  { key: 'repas', label: 'Repas' },
  { key: 'soiree', label: 'Soirée' }
];

const PlanningQuiz: React.FC<PlanningQuizProps> = ({
  onSubmit,
  currentStep,
  onStepChange,
  onStepComplete,
  stepLabels
}) => {
  const [questions, setQuestions] = useState<PlanningQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('planning_questions')
        .select('*')
        .in('categorie', CATEGORIES_CONFIG.map(cat => cat.key))
        .order('ordre_affichage', { ascending: true });

      if (error) throw error;

      if (data) {
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      // Use fallback questions for critical categories
      setQuestions([
        {
          id: 'logistique_1',
          option_name: 'heure_ceremonie',
          label: 'À quelle heure commence votre cérémonie ?',
          type: 'select',
          options: ['10h00', '11h00', '14h00', '15h00', '16h00', '17h00'],
          categorie: 'logistique',
          ordre_affichage: 1
        },
        {
          id: 'soiree_1',
          option_name: 'fin_soiree',
          label: 'À quelle heure se termine votre soirée ?',
          type: 'select',
          options: ['23h00', '00h00', '01h00', '02h00', '03h00', '04h00'],
          categorie: 'soiree',
          ordre_affichage: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCategoryQuestions = () => {
    const currentCategory = CATEGORIES_CONFIG[currentStep];
    if (!currentCategory) return [];
    
    return questions.filter(q => q.categorie === currentCategory.key);
  };

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    onStepComplete(currentStep);
    if (currentStep < CATEGORIES_CONFIG.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      // Generate mock events and submit
      const mockEvents = [
        {
          id: '1',
          title: 'Préparation mariée',
          start_time: '10:00',
          end_time: '12:00',
          category: 'préparatifs',
          description: 'Préparation de la mariée avec maquillage et coiffure'
        },
        {
          id: '2',
          title: 'Cérémonie',
          start_time: responses.heure_ceremonie || '15:00',
          end_time: '16:00',
          category: 'cérémonie',
          description: 'Cérémonie de mariage'
        }
      ];
      onSubmit(responses, mockEvents);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-olive mx-auto mb-4"></div>
        <p>Chargement des questions...</p>
      </div>
    );
  }

  const currentQuestions = getCurrentCategoryQuestions();
  const progress = ((currentStep + 1) / CATEGORIES_CONFIG.length) * 100;

  if (currentQuestions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune question disponible pour cette étape.</p>
        <div className="flex justify-between pt-4">
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
            className="bg-wedding-olive hover:bg-wedding-olive/80"
          >
            {currentStep === CATEGORIES_CONFIG.length - 1 ? 'Terminer' : 'Suivant'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Étape {currentStep + 1} sur {CATEGORIES_CONFIG.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">
            {CATEGORIES_CONFIG[currentStep]?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestions.map((question) => (
            <div key={question.id} className="space-y-3">
              <label className="text-sm font-medium">{question.label}</label>
              
              {question.type === 'select' && question.options && (
                <div className="space-y-2">
                  {(Array.isArray(question.options) ? question.options : []).map((option: string) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={question.option_name}
                        value={option}
                        checked={responses[question.option_name] === option}
                        onChange={(e) => handleResponse(question.option_name, e.target.value)}
                        className="text-wedding-olive"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'text' && (
                <input
                  type="text"
                  value={responses[question.option_name] || ''}
                  onChange={(e) => handleResponse(question.option_name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-olive"
                />
              )}

              {question.type === 'number' && (
                <input
                  type="number"
                  value={responses[question.option_name] || ''}
                  onChange={(e) => handleResponse(question.option_name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-olive"
                />
              )}
            </div>
          ))}

          <div className="flex justify-between pt-4">
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
              className="bg-wedding-olive hover:bg-wedding-olive/80"
            >
              {currentStep === CATEGORIES_CONFIG.length - 1 ? 'Terminer' : 'Suivant'}
              {currentStep === CATEGORIES_CONFIG.length - 1 ? (
                <ArrowRight className="h-4 w-4 ml-2" />
              ) : (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningQuiz;

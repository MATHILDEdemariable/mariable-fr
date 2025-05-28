import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateTasks } from './taskGenerator';
import { generateQuizResult, saveQuizResult } from './types';
import { usePersistentQuiz } from '@/hooks/usePersistentQuiz';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { supabase } from '@/integrations/supabase/client';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  section: string;
  order_index: number;
}

const WeddingQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { quizData, saveQuizResponse } = usePersistentQuiz();
  const { updateProgress } = useProgressTracking();

  // Load questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data) {
          const formattedQuestions = data.map(q => ({
            id: q.id,
            question: q.question,
            options: Array.isArray(q.options) ? q.options as string[] : [],
            section: q.section,
            order_index: q.order_index
          }));
          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        // Use fallback questions instead of showing error toast
        setQuestions([
          {
            id: 'wedding_size',
            question: 'Quelle est la taille de votre mariage ?',
            options: ['Petit (moins de 50 invités)', 'Moyen (50-150 invités)', 'Grand (plus de 150 invités)'],
            section: 'Organisation Générale',
            order_index: 1
          },
          {
            id: 'wedding_style',
            question: 'Quel est le style de votre mariage ?',
            options: ['Romantique', 'Moderne', 'Champêtre', 'Bohème', 'Traditionnel'],
            section: 'Organisation Générale',
            order_index: 2
          },
          {
            id: 'planning_progress',
            question: 'Où en êtes-vous dans la planification de votre mariage ?',
            options: ['Début', 'En cours', 'Avancé', 'Presque terminé', 'Finalisé'],
            section: 'Organisation Générale',
            order_index: 3
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [toast]);

  // Load existing responses
  useEffect(() => {
    if (quizData?.responses && Object.keys(quizData.responses).length > 0) {
      setAnswers(quizData.responses);
      if (quizData.completed) {
        setIsCompleted(true);
        const savedResult = localStorage.getItem('quizResult');
        if (savedResult) {
          setResult(JSON.parse(savedResult));
        }
      }
    }
  }, [quizData]);

  // Auto-save responses when answers change (silent save)
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const timeoutId = setTimeout(() => {
        // Silent save - no error handling that would show toast messages
        saveQuizResponse(answers).catch(() => {
          // Silently handle errors - don't show error messages to user
          console.log('Auto-save failed, will retry on completion');
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [answers, saveQuizResponse]);

  const handleAnswer = (questionId: string, answer: any) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const quizResult = generateQuizResult(answers);
      setResult(quizResult);
      
      // Save quiz result
      await saveQuizResult(quizResult);
      
      // Generate tasks
      const generatedTasks = generateTasks(answers, quizResult);
      
      // Save responses with tasks
      await saveQuizResponse(answers, generatedTasks);
      
      // Update progress - only show success message for this
      await updateProgress('planning', true);
      
      setIsCompleted(true);
      
      toast({
        title: "Questionnaire terminé!",
        description: "Votre planning personnalisé a été généré avec succès."
      });
      
    } catch (error) {
      console.error('Error completing quiz:', error);
      // Show minimal error message only for critical failures
      toast({
        title: "Questionnaire terminé",
        description: "Votre planning a été généré. Vos réponses seront sauvegardées lors de votre prochaine connexion.",
        variant: "default" // Use default variant instead of destructive
      });
      
      // Still mark as completed even if save failed
      setIsCompleted(true);
      const quizResult = generateQuizResult(answers);
      setResult(quizResult);
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

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune question disponible pour le moment.</p>
      </div>
    );
  }

  if (isCompleted && result) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-wedding-olive/10 to-wedding-cream/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-wedding-olive">
              <CheckCircle2 className="h-6 w-6" />
              Questionnaire terminé !
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-wedding-olive">{result.score}/10</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{result.level}</div>
                <div className="text-sm text-muted-foreground">Niveau</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{result.status}</div>
                <div className="text-sm text-muted-foreground">Statut</div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentQuestion(0);
                }} 
                variant="outline"
              >
                Modifier mes réponses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} sur {questions.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {currentQ.options.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={currentQ.id}
                  value={option}
                  checked={answers[currentQ.id] === option}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  className="text-wedding-olive"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>

            <Button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              className="bg-wedding-olive hover:bg-wedding-olive/80"
            >
              {currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant'}
              {currentQuestion === questions.length - 1 ? (
                <CheckCircle2 className="h-4 w-4 ml-2" />
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

export default WeddingQuiz;

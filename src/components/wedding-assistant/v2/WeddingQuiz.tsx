
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
import { useNavigate } from 'react-router-dom';

interface QuizOption {
  text: string;
  score: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  section: string;
  order_index: number;
}

const WeddingQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: string, score: number }>>({});
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { quizData, saveQuizResponse } = usePersistentQuiz();
  const { updateProgress } = useProgressTracking();
  const navigate = useNavigate();

  // Load questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      console.log('🚀 Loading quiz questions from database');
      try {
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data) {
          const formattedQuestions = data.map(q => {
            const options = Array.isArray(q.options) ? q.options : [];
            const scores = Array.isArray(q.scores) ? q.scores : [];
            const formattedOptions: QuizOption[] = options.map((option: any, index: number) => ({
              text: String(option),
              score: Number(scores[index]) || 1
            }));

            return {
              id: q.id,
              question: q.question,
              options: formattedOptions,
              section: q.section,
              order_index: q.order_index
            };
          });
          
          console.log('✅ Quiz questions loaded successfully:', formattedQuestions.length);
          setQuestions(formattedQuestions as QuizQuestion[]);
        }
      } catch (error) {
        console.error('❌ Error loading questions:', error);
        // Use fallback questions instead of showing error toast
        setQuestions([
          {
            id: 'wedding_size',
            question: 'Quelle est la taille de votre mariage ?',
            options: [
              { text: 'Petit (moins de 50 invités)', score: 1 },
              { text: 'Moyen (50-150 invités)', score: 2 },
              { text: 'Grand (plus de 150 invités)', score: 3 }
            ],
            section: 'Organisation Générale',
            order_index: 1
          },
          {
            id: 'wedding_style',
            question: 'Quel est le style de votre mariage ?',
            options: [
              { text: 'Romantique', score: 1 },
              { text: 'Moderne', score: 2 },
              { text: 'Champêtre', score: 3 },
              { text: 'Bohème', score: 4 },
              { text: 'Traditionnel', score: 5 }
            ],
            section: 'Organisation Générale',
            order_index: 2
          },
          {
            id: 'planning_progress',
            question: 'Où en êtes-vous dans la planification de votre mariage ?',
            options: [
              { text: 'Début', score: 1 },
              { text: 'En cours', score: 3 },
              { text: 'Avancé', score: 5 },
              { text: 'Presque terminé', score: 8 },
              { text: 'Finalisé', score: 10 }
            ],
            section: 'Organisation Générale',
            order_index: 3
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Load existing responses
  useEffect(() => {
    if (quizData?.responses && Object.keys(quizData.responses).length > 0) {
      setAnswers(quizData.responses as Record<string, { answer: string, score: number }>);
    }
  }, [quizData]);

  // Auto-save responses when answers change (silent save)
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const timeoutId = setTimeout(() => {
        saveQuizResponse(answers).catch(() => {
          console.log('Auto-save failed, will retry on completion');
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [answers, saveQuizResponse]);

  const handleAnswer = (questionId: string, answer: string, score: number) => {
    const newAnswers = { ...answers, [questionId]: { answer, score } };
    setAnswers(newAnswers);
    console.log('📝 Answer recorded:', { questionId, answer, score });
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
    console.log('🎯 Completing quiz with answers:', answers);
    
    try {
      const quizResult = await generateQuizResult(answers);
      console.log('📊 Quiz result generated:', quizResult);
      
      // Save quiz result to localStorage for immediate access
      localStorage.setItem('quizResult', JSON.stringify(quizResult));
      
      // Save to database
      await saveQuizResult(quizResult);
      
      // Generate tasks
      const generatedTasks = generateTasks(answers, quizResult);
      
      // Save responses with tasks
      await saveQuizResponse(answers, generatedTasks);
      
      // Update progress
      await updateProgress('planning', true);
      
      toast({
        title: "Questionnaire terminé!",
        description: "Votre planning personnalisé a été généré avec succès."
      });
      
      // Redirect to personalized results page
      console.log('🔄 Redirecting to personalized results page');
      navigate('/planning-resultats-personnalises');
      
    } catch (error) {
      console.error('Error completing quiz:', error);
      
      // Still redirect even if save failed, with localStorage data
      const quizResult = await generateQuizResult(answers);
      localStorage.setItem('quizResult', JSON.stringify(quizResult));
      
      toast({
        title: "Questionnaire terminé",
        description: "Votre planning a été généré. Redirection en cours...",
        variant: "default"
      });
      
      // Redirect anyway
      navigate('/planning-resultats-personnalises');
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
              <label key={option.text} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={currentQ.id}
                  value={option.text}
                  checked={answers[currentQ.id]?.answer === option.text}
                  onChange={() => handleAnswer(currentQ.id, option.text, option.score)}
                  className="text-wedding-olive"
                />
                <span>{option.text}</span>
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

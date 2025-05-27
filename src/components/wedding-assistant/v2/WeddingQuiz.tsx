import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateTasks } from './taskGenerator';
import { generateQuizResult, saveQuizResult } from './types';
import { usePersistentQuiz } from '@/hooks/usePersistentQuiz';
import { useProgressTracking } from '@/hooks/useProgressTracking';

const questions = [
  {
    id: 'wedding_size',
    question: 'Quelle est la taille de votre mariage ?',
    type: 'single',
    options: ['Petit (moins de 50 invités)', 'Moyen (50-150 invités)', 'Grand (plus de 150 invités)'],
  },
  {
    id: 'wedding_style',
    question: 'Quel est le style de votre mariage ?',
    type: 'multiple',
    options: ['Romantique', 'Moderne', 'Champêtre', 'Bohème', 'Traditionnel'],
  },
  {
    id: 'planning_progress',
    question: 'Où en êtes-vous dans la planification de votre mariage ?',
    type: 'scale',
  },
  {
    id: 'budget_importance',
    question: 'Quelle importance accordez-vous au budget ?',
    type: 'scale',
  },
  {
    id: 'stress_level',
    question: 'Quel est votre niveau de stress actuel concernant le mariage ?',
    type: 'scale',
  },
];

const WeddingQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const { quizData, saveQuizResponse } = usePersistentQuiz();
  const { updateProgress } = useProgressTracking();

  // Load existing responses
  useEffect(() => {
    if (quizData?.responses && Object.keys(quizData.responses).length > 0) {
      setAnswers(quizData.responses);
      if (quizData.completed) {
        setIsCompleted(true);
        // Load quiz result from localStorage or generate from responses
        const savedResult = localStorage.getItem('quizResult');
        if (savedResult) {
          setResult(JSON.parse(savedResult));
        }
      }
    }
  }, [quizData]);

  // Auto-save responses when answers change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const timeoutId = setTimeout(() => {
        saveQuizResponse(answers);
      }, 1000); // Debounce by 1 second

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
      // Generate quiz result
      const quizResult = generateQuizResult(answers);
      setResult(quizResult);
      
      // Save quiz result
      await saveQuizResult(quizResult);
      
      // Generate tasks
      const generatedTasks = generateTasks(answers, quizResult);
      
      // Save everything to persistent storage
      await saveQuizResponse(answers, generatedTasks);
      
      // Update progress
      await updateProgress('planning', true);
      
      setIsCompleted(true);
      
      toast({
        title: "Questionnaire terminé!",
        description: "Votre planning personnalisé a été généré avec succès."
      });
      
    } catch (error) {
      console.error('Error completing quiz:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de votre planning.",
        variant: "destructive"
      });
    }
  };

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
            
            <p className="text-center text-muted-foreground mb-4">
              Votre planning personnalisé est disponible dans l'onglet "Mon Planning"
            </p>
            
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
          {currentQ.type === 'single' && (
            <div className="space-y-2">
              {currentQ.options?.map((option) => (
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
          )}

          {currentQ.type === 'multiple' && (
            <div className="space-y-2">
              {currentQ.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={answers[currentQ.id]?.includes(option) || false}
                    onChange={(e) => {
                      const current = answers[currentQ.id] || [];
                      const newValue = e.target.checked
                        ? [...current, option]
                        : current.filter((item: string) => item !== option);
                      handleAnswer(currentQ.id, newValue);
                    }}
                    className="text-wedding-olive"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQ.type === 'scale' && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Pas du tout</span>
                <span>Complètement</span>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleAnswer(currentQ.id, num)}
                    className={`w-12 h-12 rounded-full border-2 transition-colors ${
                      answers[currentQ.id] === num
                        ? 'bg-wedding-olive border-wedding-olive text-white'
                        : 'border-gray-300 hover:border-wedding-olive'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

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

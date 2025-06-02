
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { useWeddingQuiz, QuizAnswer } from '@/hooks/useWeddingQuiz';
import { QuizProgress } from './QuizProgress';
import { QuestionCard } from './QuestionCard';
import { QuizResults } from './QuizResults';

type QuizStep = 'intro' | 'quiz' | 'results';

export const WeddingQuizApp: React.FC = () => {
  const { questions, loading, error, calculateResults, saveResults } = useWeddingQuiz();
  const [currentStep, setCurrentStep] = useState<QuizStep>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [results, setResults] = useState<any>(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif mb-2">Initiation Mariage</h1>
          <p className="text-muted-foreground">
            Chargement du questionnaire...
          </p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-olive"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif mb-2">Initiation Mariage</h1>
          <p className="text-muted-foreground text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const handleStartQuiz = () => {
    setCurrentStep('quiz');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleOptionSelect = (optionId: string, score: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        optionId,
        score
      }
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Finish quiz
      const quizResults = calculateResults(answers);
      setResults(quizResults);
      setCurrentStep('results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
  };

  const handleSaveResults = async () => {
    if (results) {
      await saveResults(results);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnsweredCurrent = currentQuestion && answers[currentQuestion.id];
  const canGoNext = hasAnsweredCurrent;

  if (currentStep === 'intro') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif mb-2">Initiation Mariage</h1>
          <p className="text-muted-foreground">
            Découvrez votre niveau de préparation et recevez des conseils personnalisés
          </p>
        </div>

        <Card className="border-wedding-olive/20">
          <CardHeader>
            <CardTitle className="font-serif text-center">
              Questionnaire de planification personnalisé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Ce questionnaire vous aidera à évaluer votre avancement dans la planification de votre mariage 
                et vous proposera des objectifs personnalisés selon votre niveau.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 bg-wedding-cream/30 rounded-lg">
                  <div className="text-2xl font-bold text-wedding-olive">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 bg-wedding-cream/30 rounded-lg">
                  <div className="text-2xl font-bold text-wedding-olive">5</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="p-4 bg-wedding-cream/30 rounded-lg">
                  <div className="text-2xl font-bold text-wedding-olive">100%</div>
                  <div className="text-sm text-muted-foreground">Personnalisé</div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartQuiz}
              className="bg-wedding-olive hover:bg-wedding-olive/90 px-8 py-3"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Commencer le questionnaire
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'quiz') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif mb-2">Initiation Mariage</h1>
          <p className="text-muted-foreground">
            Questionnaire personnalisé
          </p>
        </div>

        <QuizProgress 
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            selectedOptionId={answers[currentQuestion.id]?.optionId}
            onOptionSelect={handleOptionSelect}
          />
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canGoNext}
            className="bg-wedding-olive hover:bg-wedding-olive/90 w-full sm:w-auto order-1 sm:order-2"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Voir les résultats' : 'Suivant'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif mb-2">Vos Résultats</h1>
          <p className="text-muted-foreground">
            Découvrez votre niveau et vos objectifs personnalisés
          </p>
        </div>

        <QuizResults
          results={results}
          onRetakeQuiz={handleRetakeQuiz}
          onSaveResults={handleSaveResults}
        />
      </div>
    );
  }

  return null;
};

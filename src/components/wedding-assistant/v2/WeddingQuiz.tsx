
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { QuizQuestion, QuizScoring, UserAnswers, PlanningResult } from './types';

const WeddingQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [scoringRules, setScoringRules] = useState<QuizScoring[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [currentSection, setCurrentSection] = useState<string>("");
  const [sections, setSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlanningResult | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const uniqueSections = Array.from(new Set(questions.map(q => q.section)));
      setSections(uniqueSections);
      setCurrentSection(uniqueSections[0]);
    }
  }, [questions]);

  useEffect(() => {
    // Calculate progress
    if (questions.length > 0) {
      const answeredQuestions = Object.keys(userAnswers).length;
      const progressValue = (answeredQuestions / questions.length) * 100;
      setProgress(progressValue);
    }
  }, [userAnswers, questions]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('order_index', { ascending: true });

      if (questionsError) throw questionsError;

      // Fetch scoring rules
      const { data: scoringData, error: scoringError } = await supabase
        .from('quiz_scoring')
        .select('*')
        .order('score_min', { ascending: true });

      if (scoringError) throw scoringError;

      // Transform data structure to match our types
      const formattedQuestions = questionsData.map(q => ({
        ...q,
        options: q.options as string[],
        scores: q.scores as number[]
      }));

      const formattedScoring = scoringData.map(s => ({
        ...s,
        objectives: s.objectives as string[],
        categories: s.categories as string[]
      }));

      setQuestions(formattedQuestions);
      setScoringRules(formattedScoring);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      setError('Une erreur est survenue lors du chargement du quiz. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const getSectionQuestions = () => {
    return questions.filter(q => q.section === currentSection);
  };

  const handleAnswerChange = (questionId: string, score: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  const calculateTotalScore = () => {
    return Object.values(userAnswers).reduce((total, score) => total + score, 0);
  };

  const getResultForScore = (score: number) => {
    const matchingRule = scoringRules.find(
      rule => score >= rule.score_min && score <= rule.score_max
    );
    
    if (!matchingRule) return null;
    
    return {
      score,
      status: matchingRule.status,
      objectives: matchingRule.objectives,
      categories: matchingRule.categories
    };
  };

  const handleSubmit = () => {
    setSubmitting(true);
    
    try {
      const totalScore = calculateTotalScore();
      const resultData = getResultForScore(totalScore);
      
      if (resultData) {
        setResult(resultData);
        setCurrentStep(1); // Move to results view
      } else {
        setError('Une erreur est survenue lors du calcul des résultats.');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Une erreur est survenue lors de la soumission du quiz.');
    }
    
    setSubmitting(false);
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setResult(null);
    setCurrentStep(0);
    setProgress(0);
  };

  // Check if all questions are answered
  const allQuestionsAnswered = questions.length > 0 && 
    questions.every(q => userAnswers[q.id] !== undefined);

  if (loading) {
    return <div className="flex justify-center items-center py-12">Chargement du quiz...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button variant="outline" onClick={fetchQuizData} className="mt-4">
          Réessayer
        </Button>
      </Alert>
    );
  }

  // Results view
  if (currentStep === 1 && result) {
    return (
      <div className="space-y-6">
        <Alert className="bg-wedding-olive/10 border-wedding-olive">
          <AlertTitle className="text-lg font-semibold">
            Votre progression : {result.status}
          </AlertTitle>
          <AlertDescription>
            Score total : {result.score} points
          </AlertDescription>
        </Alert>

        <Card className="border-wedding-olive/30">
          <CardHeader>
            <CardTitle>Votre plan personnalisé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-medium text-lg">Objectifs prioritaires :</h3>
            <ul className="space-y-2">
              {result.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check size={18} className="text-wedding-olive mt-1 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
            
            <Separator className="my-4" />
            
            <h3 className="font-medium text-lg">Catégories à prioriser :</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.categories.map((category, index) => (
                <Badge key={index} variant="outline" className="bg-wedding-cream">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={resetQuiz} 
              variant="outline" 
              className="w-full"
              startIcon={<RefreshCcw size={16} />}
            >
              Recommencer le quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Quiz view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif mb-4">Évaluez l'avancement de votre mariage</h2>
        <p className="text-muted-foreground mb-6">
          Répondez aux questions suivantes pour obtenir un plan personnalisé.
        </p>
        
        <Progress value={progress} className="h-2 mb-4" />
        
        <div className="flex gap-2 overflow-x-auto py-2 mb-6">
          {sections.map((section, index) => (
            <Button
              key={section}
              variant={currentSection === section ? "default" : "outline"}
              size="sm"
              onClick={() => handleSectionChange(section)}
              className="whitespace-nowrap"
            >
              {index + 1}. {section}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {getSectionQuestions().map((question) => (
          <div key={question.id} className="space-y-3">
            <h3 className="font-medium">{question.question}</h3>
            <RadioGroup
              onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
              value={userAnswers[question.id]?.toString() || ""}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value={question.scores[index].toString()} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Separator />
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          disabled={sections.indexOf(currentSection) === 0}
          onClick={() => {
            const currentIndex = sections.indexOf(currentSection);
            if (currentIndex > 0) {
              setCurrentSection(sections[currentIndex - 1]);
            }
          }}
        >
          Section précédente
        </Button>
        
        {sections.indexOf(currentSection) < sections.length - 1 ? (
          <Button
            onClick={() => {
              const currentIndex = sections.indexOf(currentSection);
              if (currentIndex < sections.length - 1) {
                setCurrentSection(sections[currentIndex + 1]);
              }
            }}
          >
            Section suivante
            <ArrowRight size={16} className="ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={!allQuestionsAnswered || submitting}
          >
            Obtenir mon plan
            <ArrowRight size={16} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default WeddingQuiz;

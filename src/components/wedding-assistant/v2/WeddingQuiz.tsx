import React, { useState, useEffect } from 'react';
import { QuizQuestion, UserAnswers, PlanningResult, QuizScoring, SECTION_ORDER, UserQuizResult } from './types';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarIcon, ArrowLeft, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import StepIndicator from './StepIndicator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Json } from '@/integrations/supabase/types';
import EmailCaptureForm from './EmailCaptureForm';
import { generateTasksFromQuizResult } from './taskGenerator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

const WeddingQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [scoringRules, setScoringRules] = useState<QuizScoring[]>([]);
  const [currentSection, setCurrentSection] = useState<string>("");
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<PlanningResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Determine distinct sections for step indicator
  const [sections, setSections] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [sectionsCompleted, setSectionsCompleted] = useState<{[key: string]: boolean}>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    fetchQuizData();
  }, []);
  
  // Effect to update currentStep based on the current section
  useEffect(() => {
    if (currentSection && sections.length > 0) {
      const sectionIndex = sections.indexOf(currentSection);
      if (sectionIndex >= 0) {
        setCurrentStep(sectionIndex + 1);
      }
    }
  }, [currentSection, sections]);

  const fetchQuizData = async () => {
    setIsLoading(true);
    try {
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (questionsError) throw questionsError;
      
      const { data: scoringData, error: scoringError } = await supabase
        .from('quiz_scoring')
        .select('*');
      
      if (scoringError) throw scoringError;
      
      if (questionsData && questionsData.length > 0) {
        // Convert JSON data to appropriate types
        const formattedQuestions: QuizQuestion[] = questionsData.map(q => ({
          ...q,
          options: parseJsonArray<string>(q.options),
          scores: parseJsonArray<number>(q.scores)
        }));
        
        const formattedScoring: QuizScoring[] = scoringData?.map(s => ({
          ...s,
          objectives: parseJsonArray<string>(s.objectives),
          categories: parseJsonArray<string>(s.categories)
        })) || [];

        // Sort questions by predefined section order
        const sortedQuestions = sortQuestionsBySectionOrder(formattedQuestions);
        
        setQuestions(sortedQuestions);
        setScoringRules(formattedScoring);
        setCurrentSection(sortedQuestions[0].section);
        
        // Use predefined section order instead of extracting from questions
        const availableSections = SECTION_ORDER.filter(section => 
          sortedQuestions.some(q => q.section === section)
        );
        setSections(availableSections);
        
        // Initialize completed sections
        const initialSectionsCompleted: {[key: string]: boolean} = {};
        availableSections.forEach(section => {
          initialSectionsCompleted[section] = false;
        });
        setSectionsCompleted(initialSectionsCompleted);
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les questions du quiz.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sort questions by predefined section order
  const sortQuestionsBySectionOrder = (questions: QuizQuestion[]): QuizQuestion[] => {
    return [...questions].sort((a, b) => {
      // First compare by section order
      const sectionIndexA = SECTION_ORDER.indexOf(a.section);
      const sectionIndexB = SECTION_ORDER.indexOf(b.section);
      
      if (sectionIndexA !== sectionIndexB) {
        return sectionIndexA - sectionIndexB;
      }
      
      // Then for questions in same section, use order_index
      return a.order_index - b.order_index;
    });
  };

  // Utility function to safely parse JSON
  const parseJsonArray = <T,>(jsonValue: Json): T[] => {
    if (Array.isArray(jsonValue)) {
      return jsonValue as T[];
    }
    return [];
  };

  const handleAnswer = (questionId: string, scoreIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: scoreIndex
    }));
  };

  const handleNext = () => {
    // Check if this is last question in current section
    const currentSectionQuestions = questions.filter(q => q.section === currentSection);
    const isLastQuestionInSection = 
      currentSectionQuestions.findIndex(q => q.id === questions[currentQuestionIndex].id) === 
      currentSectionQuestions.length - 1;
    
    if (isLastQuestionInSection) {
      // Mark this section as completed
      setSectionsCompleted(prev => ({
        ...prev,
        [currentSection]: true
      }));
      
      // Find next uncompleted section
      const nextSectionIndex = sections.indexOf(currentSection) + 1;
      
      // If reached last section
      if (nextSectionIndex >= sections.length) {
        calculateResult();
        
        // If user is authenticated, show results directly
        if (isAuthenticated) {
          setShowResult(true);
          saveResultToSupabase(null); // User is already authenticated
        } else {
          // Show email capture form for non-authenticated users
          setShowEmailForm(true);
        }
      } else {
        // Move to first question of next section
        const nextSection = sections[nextSectionIndex];
        setCurrentSection(nextSection);
        const nextSectionFirstQuestionIndex = questions.findIndex(q => q.section === nextSection);
        setCurrentQuestionIndex(nextSectionFirstQuestionIndex);
      }
    } else {
      // Just move to next question in same section
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestion = questions[currentQuestionIndex - 1];
      // If previous question is in different section
      if (prevQuestion.section !== currentSection) {
        setCurrentSection(prevQuestion.section);
      }
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const calculateResult = () => {
    // Calculate total score
    let totalScore = 0;
    let answeredCount = 0;
    
    Object.entries(userAnswers).forEach(([questionId, answerIndex]) => {
      const question = questions.find(q => q.id === questionId);
      if (question && question.scores[answerIndex] !== undefined) {
        totalScore += question.scores[answerIndex];
        answeredCount++;
      }
    });
    
    // Normalize score if needed
    const normalizedScore = answeredCount > 0 ? Math.round(totalScore / answeredCount * 10) : 0;
    
    // Find applicable scoring rule
    const applicableRule = scoringRules.find(rule => 
      normalizedScore >= rule.score_min && normalizedScore <= rule.score_max
    );
    
    if (applicableRule) {
      setResult({
        score: normalizedScore,
        status: applicableRule.status,
        objectives: applicableRule.objectives,
        categories: applicableRule.categories
      });
    } else {
      setResult({
        score: normalizedScore,
        status: "Non défini",
        objectives: ["Planifier votre mariage étape par étape"],
        categories: ["Organisation générale"]
      });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Only allow navigating to already completed sections
    const targetSection = sections[stepIndex - 1];
    if (sectionsCompleted[targetSection] || targetSection === currentSection) {
      setCurrentSection(targetSection);
      // Find index of first question in this section
      const firstQuestionIndex = questions.findIndex(q => q.section === targetSection);
      if (firstQuestionIndex >= 0) {
        setCurrentQuestionIndex(firstQuestionIndex);
      }
    }
  };

  // Determine level based on score
  const getLevel = (score: number): string => {
    if (score <= 3) return 'Début';
    if (score <= 7) return 'Milieu';
    return 'Fin';
  };

  // Save results to Supabase
  const saveResultToSupabase = async (email: string | null) => {
    if (!result) return;
    
    try {
      // Get user session if available
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const level = getLevel(result.score);
      
      // Call the edge function to insert the quiz result
      const { data, error } = await supabase.functions.invoke('insert_user_quiz_result', {
        body: {
          p_user_id: userId || null,
          p_email: email || (userId ? session?.user?.email : null),
          p_score: result.score,
          p_status: result.status,
          p_level: level,
          p_objectives: result.objectives,
          p_categories: result.categories
        }
      });
      
      if (error) {
        console.error("Error using edge function:", error);
        
        // No fallback to direct insert since the table doesn't exist in the TypeScript types
        // Just log the error and continue
        console.log("Unable to save quiz results directly due to schema mismatch");
      }
      
      // If user is authenticated, tasks will be automatically created via trigger
      if (userId) {
        toast({
          title: "Vos résultats ont été enregistrés",
          description: "Votre planning a été généré dans votre tableau de bord.",
          duration: 5000
        });
      }
      
      // Show results after saving
      setShowResult(true);
      
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des résultats:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des résultats.",
        variant: "destructive"
      });
      // Show results anyway even if saving failed
      setShowResult(true);
    }
  };

  // Handle email form submission
  const handleEmailSubmit = (email: string, fullName: string) => {
    saveResultToSupabase(email);
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p>Chargement du questionnaire...</p>
      </div>
    );
  }

  // Show email capture form
  if (showEmailForm && !showResult && result) {
    return (
      <div className="max-w-2xl mx-auto py-4">
        <EmailCaptureForm 
          onSubmit={handleEmailSubmit} 
          onSkip={() => setShowResult(true)} 
          quizScore={result.score}
          quizStatus={result.status}
          level={getLevel(result.score)}
        />
      </div>
    );
  }

  if (showResult && result) {
    const level = getLevel(result.score);
    
    return (
      <div className="max-w-2xl mx-auto py-4">
        <ScrollArea className="h-[70vh]">
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif mb-2">Votre niveau de préparation</h2>
              <div className="inline-block bg-wedding-cream px-4 py-2 rounded-md">
                <p className="text-xl font-semibold">{result.status}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Score: {result.score}/10</p>
                <p className="text-sm font-medium mt-1">Niveau: {level}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-serif">Objectifs recommandés</h3>
              {result.objectives.length > 0 ? (
                <ul className="space-y-4">
                  {result.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-wedding-olive text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Aucun objectif spécifique n'a été trouvé pour votre niveau.</p>
              )}
            </div>

            <Separator />

            <div className="space-y-6">
              <h3 className="text-xl font-serif">Catégories à prioriser</h3>
              {result.categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.categories.map((category, index) => (
                    <div key={index} className="border rounded-md p-4 bg-wedding-light/50 flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-wedding-olive flex-shrink-0 mt-0.5" />
                      <p>{category}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune catégorie spécifique n'a été trouvée pour votre niveau.</p>
              )}
            </div>

            <Separator />
            
            <div className="space-y-6">
              <h3 className="text-xl font-serif mb-2">Prêt à organiser votre mariage ?</h3>
              <p className="text-muted-foreground">Accédez à des outils plus détaillés pour organiser votre grand jour :</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard/tasks" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light text-center">
                      <h4 className="font-medium mb-1">Voir votre checklist détaillée</h4>
                      <p className="text-sm text-muted-foreground">Accédez à votre planning personnalisé</p>
                    </Link>
                    
                    <Link to="/dashboard/budget" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light text-center">
                      <h4 className="font-medium mb-1">Calculer votre budget</h4>
                      <p className="text-sm text-muted-foreground">Estimez le budget de votre mariage</p>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light text-center">
                      <h4 className="font-medium mb-1">Calculer votre budget</h4>
                      <p className="text-sm text-muted-foreground">Créez un compte pour obtenir une estimation précise</p>
                    </Link>
                    
                    <Link to="/register" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light text-center">
                      <h4 className="font-medium mb-1">Voir votre checklist détaillée</h4>
                      <p className="text-sm text-muted-foreground">Accédez à votre planning personnalisé</p>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="pt-4">
                <Button 
                  asChild
                  className="w-full bg-wedding-olive hover:bg-wedding-olive/90 flex items-center justify-center gap-2"
                >
                  {isAuthenticated ? (
                    <Link to="/dashboard">
                      <CalendarIcon size={18} />
                      Accéder à mon tableau de bord
                      <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link to="/register">
                      <CalendarIcon size={18} />
                      Créer un compte gratuitement
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Filter questions for current section
  const currentSectionQuestions = questions.filter(q => q.section === currentSection);
  const currentSectionQuestionIndex = currentSectionQuestions.findIndex(q => q.id === questions[currentQuestionIndex].id);
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate overall progress (based on all questions)
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      {/* Step indicator */}
      <StepIndicator 
        currentStep={currentStep}
        totalSteps={sections.length}
        stepNames={!isMobile ? sections : undefined}
        onStepClick={handleStepClick}
        allowNavigation={true}
      />

      {/* Section title */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-serif">{currentSection}</h2>
        <p className="text-sm text-muted-foreground">
          Question {currentSectionQuestionIndex + 1} sur {currentSectionQuestions.length}
        </p>
      </div>

      {/* Global progress bar */}
      <Progress value={progressPercentage} className="h-2" />
      
      {/* Current question */}
      <div className="bg-wedding-light/50 p-6 rounded-lg shadow-sm">
        <p className="text-lg mb-4">{currentQuestion.question}</p>
        
        <RadioGroup 
          value={userAnswers[currentQuestion.id]?.toString() || ""} 
          onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={index.toString()} 
                id={`option-${currentQuestion.id}-${index}`} 
              />
              <Label 
                htmlFor={`option-${currentQuestion.id}-${index}`}
                className="text-base"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Précédent
        </Button>
        
        <Button
          type="button"
          onClick={handleNext}
          disabled={userAnswers[currentQuestion.id] === undefined}
          className="bg-wedding-olive hover:bg-wedding-olive/90 flex items-center gap-2"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default WeddingQuiz;

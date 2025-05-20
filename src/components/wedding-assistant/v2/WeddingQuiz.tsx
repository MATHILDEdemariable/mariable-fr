
import React, { useState, useEffect } from 'react';
import { QuizQuestion, UserAnswers, PlanningResult, QuizScoring, SECTION_ORDER } from './types';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarIcon, ArrowLeft } from 'lucide-react';
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

const WeddingQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [scoringRules, setScoringRules] = useState<QuizScoring[]>([]);
  const [currentSection, setCurrentSection] = useState<string>("");
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<PlanningResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Déterminer les sections distinctes pour l'indicateur d'étapes
  const [sections, setSections] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [sectionsCompleted, setSectionsCompleted] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    fetchQuizData();
  }, []);
  
  // Effet pour mettre à jour currentStep en fonction de la section actuelle
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
        // Convertir les données JSON en types appropriés
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

        // Trier les questions selon l'ordre prédéfini des sections
        const sortedQuestions = sortQuestionsBySectionOrder(formattedQuestions);
        
        setQuestions(sortedQuestions);
        setScoringRules(formattedScoring);
        setCurrentSection(sortedQuestions[0].section);
        
        // Utiliser l'ordre prédéfini des sections au lieu de l'extraire des questions
        const availableSections = SECTION_ORDER.filter(section => 
          sortedQuestions.some(q => q.section === section)
        );
        setSections(availableSections);
        
        // Initialiser sections complétées
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

  // Fonction pour trier les questions selon l'ordre prédéfini des sections
  const sortQuestionsBySectionOrder = (questions: QuizQuestion[]): QuizQuestion[] => {
    return [...questions].sort((a, b) => {
      // D'abord, comparer selon l'ordre des sections
      const sectionIndexA = SECTION_ORDER.indexOf(a.section);
      const sectionIndexB = SECTION_ORDER.indexOf(b.section);
      
      if (sectionIndexA !== sectionIndexB) {
        return sectionIndexA - sectionIndexB;
      }
      
      // Ensuite, pour les questions de la même section, utiliser order_index
      return a.order_index - b.order_index;
    });
  };

  // Fonction utilitaire pour analyser le JSON de manière sécurisée
  const parseJsonArray = <T,>(jsonValue: Json): T[] => {
    if (Array.isArray(jsonValue)) {
      return jsonValue as T[];
    }
    // Si la valeur n'est pas un tableau, renvoyer un tableau vide
    return [];
  };

  const handleAnswer = (questionId: string, scoreIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: scoreIndex
    }));
  };

  const handleNext = () => {
    // Si on est à la dernière question de la section actuelle
    const currentSectionQuestions = questions.filter(q => q.section === currentSection);
    const isLastQuestionInSection = 
      currentSectionQuestions.findIndex(q => q.id === questions[currentQuestionIndex].id) === 
      currentSectionQuestions.length - 1;
    
    if (isLastQuestionInSection) {
      // Marquer cette section comme complétée
      setSectionsCompleted(prev => ({
        ...prev,
        [currentSection]: true
      }));
      
      // Trouver la prochaine section non complétée
      const nextSectionIndex = sections.indexOf(currentSection) + 1;
      
      // Si nous avons atteint la dernière section
      if (nextSectionIndex >= sections.length) {
        calculateResult();
        // Afficher le formulaire de capture d'email au lieu de la modal d'authentification
        setShowEmailCapture(true);
      } else {
        // Passer à la première question de la section suivante
        const nextSection = sections[nextSectionIndex];
        setCurrentSection(nextSection);
        const nextSectionFirstQuestionIndex = questions.findIndex(q => q.section === nextSection);
        setCurrentQuestionIndex(nextSectionFirstQuestionIndex);
      }
    } else {
      // Simplement passer à la question suivante dans la même section
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestion = questions[currentQuestionIndex - 1];
      // Si la question précédente est d'une section différente
      if (prevQuestion.section !== currentSection) {
        setCurrentSection(prevQuestion.section);
      }
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const calculateResult = () => {
    // Calculer le score total
    let totalScore = 0;
    let answeredCount = 0;
    
    Object.entries(userAnswers).forEach(([questionId, answerIndex]) => {
      const question = questions.find(q => q.id === questionId);
      if (question && question.scores[answerIndex] !== undefined) {
        totalScore += question.scores[answerIndex];
        answeredCount++;
      }
    });
    
    // Normaliser le score si nécessaire
    const normalizedScore = answeredCount > 0 ? Math.round(totalScore / answeredCount * 10) : 0;
    
    // Trouver la règle de scoring applicable
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
    // Seulement permettre de naviguer vers des sections déjà complétées
    const targetSection = sections[stepIndex - 1];
    if (sectionsCompleted[targetSection] || targetSection === currentSection) {
      setCurrentSection(targetSection);
      // Trouver l'index de la première question de cette section
      const firstQuestionIndex = questions.findIndex(q => q.section === targetSection);
      if (firstQuestionIndex >= 0) {
        setCurrentQuestionIndex(firstQuestionIndex);
      }
    }
  };

  // Modifié pour rediriger vers la page de résultats après capture d'email
  const handleEmailCaptureComplete = (emailData: { email: string; full_name?: string }) => {
    if (result) {
      // Stocker le résultat dans le localStorage pour pouvoir l'utiliser sur la page de résultats
      localStorage.setItem('quizResult', JSON.stringify(result));
      
      // Rediriger vers la page de résultats
      navigate('/planning-personnalise/resultats');
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de générer votre plan personnalisé.",
        variant: "destructive"
      });
    }
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p>Chargement du questionnaire...</p>
      </div>
    );
  }

  if (showEmailCapture && result) {
    return (
      <div className="max-w-2xl mx-auto py-4">
        <EmailCaptureForm quizResult={result} onComplete={handleEmailCaptureComplete} />
      </div>
    );
  }

  // La partie résultat n'est plus affichée ici car on redirige vers une nouvelle page

  // Filtrer les questions pour la section actuelle
  const currentSectionQuestions = questions.filter(q => q.section === currentSection);
  const currentSectionQuestionIndex = currentSectionQuestions.findIndex(q => q.id === questions[currentQuestionIndex].id);
  const currentQuestion = questions[currentQuestionIndex];

  // Calculer le progrès global (basé sur toutes les questions)
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      {/* Indicateur d'étapes */}
      <StepIndicator 
        currentStep={currentStep}
        totalSteps={sections.length}
        stepNames={!isMobile ? sections : undefined}
        onStepClick={handleStepClick}
        allowNavigation={true}
      />

      {/* Titre de la section */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-serif">{currentSection}</h2>
        <p className="text-sm text-muted-foreground">
          Question {currentSectionQuestionIndex + 1} sur {currentSectionQuestions.length}
        </p>
      </div>

      {/* Barre de progression globale */}
      <Progress value={progressPercentage} className="h-2" />
      
      {/* Question actuelle */}
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
      
      {/* Boutons navigation */}
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

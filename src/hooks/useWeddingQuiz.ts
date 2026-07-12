
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QuizQuestion {
  id: string;
  question: string;
  order_index: number;
  section: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  text: string;
  score: number;
}

export interface QuizLevel {
  id: string;
  status: string;
  score_min: number;
  score_max: number;
  categories: string[];
  objectives: string[];
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
  score: number;
}

export interface QuizResults {
  totalScore: number;
  level: QuizLevel | null;
  answers: Record<string, QuizAnswer>;
}

export const useWeddingQuiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [levels, setLevels] = useState<QuizLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      
      // Fetch questions with options and scoring
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('order_index');

      if (questionsError) throw questionsError;

      // Fetch scoring levels
      const { data: scoringData, error: scoringError } = await supabase
        .from('quiz_scoring')
        .select('*')
        .order('score_min');

      if (scoringError) throw scoringError;

      // Transform questions data
      const transformedQuestions: QuizQuestion[] = (questionsData || []).map(q => {
        const options = Array.isArray(q.options) ? q.options : [];
        const scores = Array.isArray(q.scores) ? q.scores : [];
        
        const transformedOptions: QuizOption[] = options.map((option: any, index: number) => ({
          id: `${q.id}-${index}`,
          text: option,
          score: typeof scores[index] === 'number' ? scores[index] : 
                typeof scores[index] === 'string' ? parseInt(scores[index], 10) || 1 : 1
        }));

        return {
          id: q.id,
          question: q.question,
          order_index: q.order_index,
          section: q.section || '',
          options: transformedOptions
        };
      });

      // Transform scoring data to levels
      const transformedLevels: QuizLevel[] = (scoringData || []).map(level => ({
        id: level.id,
        status: level.status,
        score_min: level.score_min,
        score_max: level.score_max,
        categories: Array.isArray(level.categories) ? 
          level.categories.map(cat => typeof cat === 'string' ? cat : String(cat)) : [],
        objectives: Array.isArray(level.objectives) ? 
          level.objectives.map(obj => typeof obj === 'string' ? obj : String(obj)) : []
      }));

      setQuestions(transformedQuestions);
      setLevels(transformedLevels);
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      setError('Erreur lors du chargement du quiz');
      toast({
        title: "Erreur",
        description: "Impossible de charger le quiz. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateResults = (answers: Record<string, QuizAnswer>): QuizResults => {
    // Chaque réponse porte un score = code profil (1=Militaire, 2=Déléguée, 3=Détente, 4=Débutante)
    // On compte les occurrences et le profil majoritaire l'emporte.
    // Égalité → priorité Militaire > Déléguée > Détente > Débutante (ordre naturel 1→4).
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    Object.values(answers).forEach((a) => {
      if (counts[a.score] !== undefined) counts[a.score] += 1;
    });

    let winningProfile = 1;
    let maxCount = -1;
    for (const p of [1, 2, 3, 4]) {
      if (counts[p] > maxCount) {
        maxCount = counts[p];
        winningProfile = p;
      }
    }

    const level = levels.find(
      (l) => winningProfile >= l.score_min && winningProfile <= l.score_max
    ) || null;

    return {
      totalScore: maxCount, // nb de réponses du profil dominant (pour affichage)
      level,
      answers,
    };
  };

  const saveResults = async (results: QuizResults) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Connectez-vous pour sauvegarder vos résultats",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('user_quiz_results')
        .upsert({
          user_id: user.id,
          score: results.totalScore,
          level: results.level?.status || '',
          status: results.level?.status || '',
          categories: results.level?.categories || [],
          objectives: results.level?.objectives || []
        });

      if (error) throw error;

      toast({
        title: "Résultats sauvegardés",
        description: "Vos résultats ont été sauvegardés avec succès"
      });
      
      return true;
    } catch (err) {
      console.error('Error saving results:', err);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les résultats",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  return {
    questions,
    levels,
    loading,
    error,
    calculateResults,
    saveResults,
    refetch: fetchQuizData
  };
};

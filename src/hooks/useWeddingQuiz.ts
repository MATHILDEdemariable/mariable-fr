
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface QuizQuestion {
  id: string;
  question_text: string;
  question_order: number;
  category: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  option_text: string;
  option_order: number;
  score_value: number;
}

export interface QuizLevel {
  id: string;
  level_name: string;
  level_status: string;
  min_score: number;
  max_score: number;
  description: string;
  objectives: QuizObjective[];
}

export interface QuizObjective {
  id: string;
  objective_text: string;
  objective_order: number;
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
        .select(`
          id,
          question_text,
          question_order,
          category,
          quiz_options (
            id,
            option_text,
            option_order,
            quiz_scoring (
              score_value
            )
          )
        `)
        .order('question_order');

      if (questionsError) throw questionsError;

      // Fetch levels with objectives
      const { data: levelsData, error: levelsError } = await supabase
        .from('quiz_levels')
        .select(`
          id,
          level_name,
          level_status,
          min_score,
          max_score,
          description,
          quiz_objectives (
            id,
            objective_text,
            objective_order
          )
        `)
        .order('min_score');

      if (levelsError) throw levelsError;

      // Transform questions data
      const transformedQuestions: QuizQuestion[] = (questionsData || []).map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_order: q.question_order,
        category: q.category || '',
        options: (q.quiz_options || [])
          .map(opt => ({
            id: opt.id,
            option_text: opt.option_text,
            option_order: opt.option_order,
            score_value: opt.quiz_scoring?.[0]?.score_value || 0
          }))
          .sort((a, b) => a.option_order - b.option_order)
      }));

      // Transform levels data
      const transformedLevels: QuizLevel[] = (levelsData || []).map(level => ({
        id: level.id,
        level_name: level.level_name,
        level_status: level.level_status,
        min_score: level.min_score,
        max_score: level.max_score,
        description: level.description || '',
        objectives: (level.quiz_objectives || [])
          .sort((a, b) => a.objective_order - b.objective_order)
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
    const totalScore = Object.values(answers).reduce((sum, answer) => sum + answer.score, 0);
    const level = levels.find(l => totalScore >= l.min_score && totalScore <= l.max_score) || null;
    
    return {
      totalScore,
      level,
      answers
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
          answers: results.answers,
          total_score: results.totalScore,
          level_achieved: results.level?.level_name || null,
          completed_at: new Date().toISOString()
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

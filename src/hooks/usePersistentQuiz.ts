
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface QuizResponse {
  responses: Record<string, any>;
  generated_tasks: any[];
  completed: boolean;
}

export const usePersistentQuiz = () => {
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const saveQuizResponse = useCallback(async (responses: Record<string, any>, generatedTasks?: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_planning_responses')
        .upsert({
          user_id: user.id,
          responses,
          generated_tasks: generatedTasks || [],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setQuizData({
        responses,
        generated_tasks: generatedTasks || [],
        completed: !!generatedTasks
      });

    } catch (error) {
      console.error('Error saving quiz response:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder vos réponses",
        variant: "destructive"
      });
    }
  }, [toast]);

  const loadQuizData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_planning_responses')
        .select('responses, generated_tasks')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setQuizData({
          responses: data.responses || {},
          generated_tasks: data.generated_tasks || [],
          completed: !!(data.generated_tasks && data.generated_tasks.length > 0)
        });
      }
    } catch (error) {
      console.error('Error loading quiz data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuizData();
  }, [loadQuizData]);

  return {
    quizData,
    loading,
    saveQuizResponse,
    loadQuizData
  };
};


import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QuizResponse {
  responses: Record<string, any>;
  generated_tasks: any[];
  completed: boolean;
}

export const usePersistentQuiz = () => {
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const saveQuizResponse = useCallback(async (responses: Record<string, any>, generatedTasks?: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Silently fail if no user - will retry when logged in
        return;
      }

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

      if (error) {
        console.error('Quiz save error:', error);
        // Don't throw error - allow silent failure
        return;
      }

      setQuizData({
        responses,
        generated_tasks: generatedTasks || [],
        completed: !!generatedTasks
      });

    } catch (error) {
      console.error('Quiz save error:', error);
      // Don't throw error - allow silent failure
    }
  }, []);

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

      if (error && error.code !== 'PGRST116') {
        console.error('Quiz load error:', error);
        return;
      }

      if (data) {
        // Properly cast the JSON data to expected types
        const responses = data.responses as Record<string, any> || {};
        const generatedTasks = Array.isArray(data.generated_tasks) ? data.generated_tasks : [];
        
        setQuizData({
          responses,
          generated_tasks: generatedTasks,
          completed: generatedTasks.length > 0
        });
      }
    } catch (error) {
      console.error('Quiz load error:', error);
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


import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProgressItem {
  id: string;
  label: string;
  path: string;
  completed: boolean;
}

export const useProgressTracking = () => {
  const location = useLocation();
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([
    { id: 'planning', label: 'Planning personnalisé', path: '/dashboard/planning', completed: false },
    { id: 'budget', label: 'Budget défini', path: '/dashboard/budget', completed: false },
    { id: 'prestataires', label: 'Prestataires contactés', path: '/dashboard/prestataires', completed: false },
    { id: 'coordination', label: 'Coordination Jour J', path: '/dashboard/coordination', completed: false }
  ]);
  const [loading, setLoading] = useState(true);

  const updateProgress = useCallback(async (itemId: string, completed: boolean) => {
    try {
      // Update local state immediately for responsiveness
      setProgressItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, completed } : item
        )
      );

      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            step_name: itemId,
            is_complete: completed,
            completed_at: completed ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,step_name'
          });

        if (error) {
          console.error('Progress update error:', error);
          // Revert local state on error
          loadProgress();
        }
      }
    } catch (error) {
      console.error('Progress update error:', error);
      // Revert local state on error
      loadProgress();
    }
  }, []);

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_progress')
          .select('step_name, is_complete')
          .eq('user_id', user.id);

        if (error) {
          console.error('Progress load error:', error);
          return;
        }

        if (data) {
          setProgressItems(prev => 
            prev.map(item => {
              const progressData = data.find(d => d.step_name === item.id);
              return {
                ...item,
                completed: progressData ? progressData.is_complete : false
              };
            })
          );
        }
      }
    } catch (error) {
      console.error('Progress load error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProgressPercentage = useCallback(() => {
    const completed = progressItems.filter(item => item.completed).length;
    return Math.round((completed / progressItems.length) * 100);
  }, [progressItems]);

  const toggleProgress = useCallback(async (itemId: string) => {
    const currentItem = progressItems.find(item => item.id === itemId);
    if (currentItem) {
      await updateProgress(itemId, !currentItem.completed);
    }
  }, [progressItems, updateProgress]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Auto-mark current section as completed when user visits it (optional)
  useEffect(() => {
    const currentItem = progressItems.find(item => location.pathname.startsWith(item.path));
    if (currentItem && !currentItem.completed) {
      updateProgress(currentItem.id, true);
    }
  }, [location.pathname, progressItems, updateProgress]);

  return {
    progressItems,
    updateProgress,
    toggleProgress,
    getProgressPercentage,
    loadProgress,
    loading
  };
};

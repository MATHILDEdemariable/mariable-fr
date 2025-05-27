
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

  const updateProgress = useCallback(async (itemId: string, completed: boolean) => {
    setProgressItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, completed } : item
      )
    );

    // Save to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const completedSteps = progressItems
          .map(item => item.id === itemId ? { ...item, completed } : item)
          .filter(item => item.completed)
          .map(item => item.id);

        const progressPercentage = Math.round((completedSteps.length / progressItems.length) * 100);

        await supabase
          .from('user_planning_responses')
          .upsert({
            user_id: user.id,
            completed_steps: completedSteps,
            progress_percentage: progressPercentage,
            responses: {}
          }, {
            onConflict: 'user_id'
          });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [progressItems]);

  const loadProgress = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_planning_responses')
          .select('completed_steps')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data?.completed_steps) {
          setProgressItems(prev => 
            prev.map(item => ({
              ...item,
              completed: data.completed_steps.includes(item.id)
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }, []);

  const getProgressPercentage = useCallback(() => {
    const completed = progressItems.filter(item => item.completed).length;
    return Math.round((completed / progressItems.length) * 100);
  }, [progressItems]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Auto-mark current section as completed when user visits it
  useEffect(() => {
    const currentItem = progressItems.find(item => location.pathname.startsWith(item.path));
    if (currentItem && !currentItem.completed) {
      updateProgress(currentItem.id, true);
    }
  }, [location.pathname, progressItems, updateProgress]);

  return {
    progressItems,
    updateProgress,
    getProgressPercentage,
    loadProgress
  };
};

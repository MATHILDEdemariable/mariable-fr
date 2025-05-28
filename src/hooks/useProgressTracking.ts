
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProgressItem {
  id: string;
  label: string;
  path: string;
  completed: boolean;
}

export const useProgressTracking = () => {
  const location = useLocation();
  const { toast } = useToast();
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
        const updatedItems = progressItems.map(item => 
          item.id === itemId ? { ...item, completed } : item
        );
        
        const completedSteps = updatedItems
          .filter(item => item.completed)
          .map(item => item.id);

        const progressPercentage = Math.round((completedSteps.length / progressItems.length) * 100);

        const { error } = await supabase
          .from('user_planning_responses')
          .upsert({
            user_id: user.id,
            completed_steps: completedSteps,
            progress_percentage: progressPercentage,
            responses: {},
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error updating progress:', error);
          // Revert local state on error
          loadProgress();
          toast({
            title: "Erreur",
            description: "Impossible de sauvegarder votre progression",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert local state on error
      loadProgress();
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder votre progression",
        variant: "destructive"
      });
    }
  }, [progressItems, toast]);

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_planning_responses')
          .select('completed_steps, progress_percentage')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data?.completed_steps) {
          setProgressItems(prev => 
            prev.map(item => ({
              ...item,
              completed: Array.isArray(data.completed_steps) ? 
                data.completed_steps.includes(item.id) : false
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
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

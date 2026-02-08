
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface WeddingCoordination {
  id: string;
  title: string;
  description?: string;
  wedding_date?: string;
  wedding_location?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useWeddingCoordination = () => {
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();

  const initializeCoordination = useCallback(async () => {
    if (isInitializing || coordination) return coordination;

    try {
      setIsInitializing(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      console.log('🚀 useWeddingCoordination: Initializing coordination for user:', user.id);

      // Vérifier si une coordination existe déjà - prendre la plus récente
      const { data: existingCoordinations, error: fetchError } = await supabase
        .from('wedding_coordination')
        .select('id, title, description, wedding_date, wedding_location, user_id, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('❌ Error fetching coordination:', fetchError);
        throw fetchError;
      }

      let activeCoordination: WeddingCoordination;

      if (existingCoordinations && existingCoordinations.length > 0) {
        activeCoordination = existingCoordinations[0];
        console.log('✅ useWeddingCoordination: Found existing coordination:', activeCoordination.id);
      } else {
        // Créer une nouvelle coordination
        console.log('🆕 useWeddingCoordination: Creating new coordination...');
        const { data: newCoordination, error: createError } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage',
            description: 'Organisation de mon mariage'
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Error creating coordination:', createError);
          throw createError;
        }

        activeCoordination = newCoordination;
        console.log('✅ useWeddingCoordination: Created new coordination:', activeCoordination.id);
      }

      setCoordination(activeCoordination);
      return activeCoordination;
    } catch (error) {
      console.error('❌ useWeddingCoordination: Error initializing coordination:', error);
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser votre espace Mon Jour-M",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [coordination, isInitializing, toast]);

  const refreshCoordination = useCallback(async () => {
    if (!coordination) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('wedding_coordination')
        .select('id, title, description, wedding_date, wedding_location, user_id, created_at, updated_at')
        .eq('id', coordination.id)
        .single();

      if (error) throw error;
      
      setCoordination(data);
      console.log('🔄 useWeddingCoordination: Coordination refreshed');
    } catch (error) {
      console.error('❌ useWeddingCoordination: Error refreshing coordination:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rafraîchir les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [coordination, toast]);

  useEffect(() => {
    if (!coordination && !isInitializing) {
      const initialize = async () => {
        try {
          setIsLoading(true);
          await initializeCoordination();
        } catch (error) {
          console.error('useWeddingCoordination: Initialization failed:', error);
        } finally {
          setIsLoading(false);
        }
      };

      initialize();
    } else if (coordination) {
      setIsLoading(false);
    }
  }, [coordination, isInitializing, initializeCoordination]);

  return {
    coordination,
    isLoading: isLoading || isInitializing,
    isInitializing,
    refreshCoordination,
    initializeCoordination
  };
};

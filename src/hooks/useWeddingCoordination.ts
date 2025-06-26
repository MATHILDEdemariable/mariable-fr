
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
    try {
      setIsInitializing(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      console.log('🚀 Initializing coordination for user:', user.id);

      // Vérifier si une coordination existe déjà
      const { data: existingCoordination, error: fetchError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = pas de résultat
        throw fetchError;
      }

      if (existingCoordination) {
        console.log('✅ Found existing coordination:', existingCoordination.id);
        setCoordination(existingCoordination);
        return existingCoordination;
      }

      // Créer une nouvelle coordination
      console.log('🆕 Creating new coordination...');
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
        throw createError;
      }

      console.log('✅ Created new coordination:', newCoordination.id);
      setCoordination(newCoordination);
      
      toast({
        title: "Coordination initialisée",
        description: "Votre espace Mon Jour-M est prêt !",
      });

      return newCoordination;
    } catch (error) {
      console.error('❌ Error initializing coordination:', error);
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser votre espace Mon Jour-M",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [toast]);

  const refreshCoordination = useCallback(async () => {
    if (!coordination) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('id', coordination.id)
        .single();

      if (error) throw error;
      
      setCoordination(data);
      console.log('🔄 Coordination refreshed');
    } catch (error) {
      console.error('❌ Error refreshing coordination:', error);
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
    const loadData = async () => {
      try {
        setIsLoading(true);
        await initializeCoordination();
      } catch (error) {
        console.error('Error in useWeddingCoordination:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [initializeCoordination]);

  return {
    coordination,
    isLoading: isLoading || isInitializing,
    isInitializing,
    refreshCoordination,
    initializeCoordination
  };
};

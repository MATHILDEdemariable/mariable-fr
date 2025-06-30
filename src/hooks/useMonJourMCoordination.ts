
import { useState, useEffect, useCallback, useRef } from 'react';
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

interface UseMonJourMCoordinationReturn {
  coordination: WeddingCoordination | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  refreshCoordination: () => Promise<void>;
  initializeCoordination: () => Promise<WeddingCoordination | null>;
}

// Cache simple pour éviter les re-appels
const coordinationCache = new Map<string, WeddingCoordination>();

export const useMonJourMCoordination = (): UseMonJourMCoordinationReturn => {
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Ref pour éviter les setState sur composant démonté
  const mountedRef = useRef(true);

  // Cleanup function
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const initializeCoordination = useCallback(async (): Promise<WeddingCoordination | null> => {
    if (isInitializing || coordination) return coordination;

    try {
      setIsInitializing(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!mountedRef.current) return null;
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      console.log('🚀 useMonJourMCoordination: Initializing coordination for user:', user.id);

      // Vérifier le cache d'abord
      const cachedCoordination = coordinationCache.get(user.id);
      if (cachedCoordination) {
        console.log('📦 useMonJourMCoordination: Using cached coordination');
        if (mountedRef.current) {
          setCoordination(cachedCoordination);
          setIsLoading(false);
        }
        return cachedCoordination;
      }

      // Vérifier si une coordination existe déjà - prendre la plus récente
      const { data: existingCoordinations, error: fetchError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!mountedRef.current) return null;
      
      if (fetchError) {
        console.error('❌ Error fetching coordination:', fetchError);
        throw fetchError;
      }

      let activeCoordination: WeddingCoordination;

      if (existingCoordinations && existingCoordinations.length > 0) {
        activeCoordination = existingCoordinations[0];
        console.log('✅ useMonJourMCoordination: Found existing coordination:', activeCoordination.id);
      } else {
        // Créer une nouvelle coordination
        console.log('🆕 useMonJourMCoordination: Creating new coordination...');
        const { data: newCoordination, error: createError } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage',
            description: 'Organisation de mon mariage'
          })
          .select()
          .single();

        if (!mountedRef.current) return null;

        if (createError) {
          console.error('❌ Error creating coordination:', createError);
          throw createError;
        }

        activeCoordination = newCoordination;
        console.log('✅ useMonJourMCoordination: Created new coordination:', activeCoordination.id);
      }

      // Mettre en cache
      coordinationCache.set(user.id, activeCoordination);

      if (mountedRef.current) {
        setCoordination(activeCoordination);
        setIsLoading(false);
      }
      
      return activeCoordination;
    } catch (error: any) {
      if (!mountedRef.current) {
        return null;
      }
      
      console.error('❌ useMonJourMCoordination: Error initializing coordination:', error);
      
      if (mountedRef.current) {
        setError(error.message || 'Erreur d\'initialisation');
        setIsLoading(false);
        
        toast({
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser votre espace Mon Jour-M. Rechargement...",
          variant: "destructive",
        });
        
        // Retry automatique après 2 secondes
        setTimeout(() => {
          if (mountedRef.current) {
            initializeCoordination();
          }
        }, 2000);
      }
      
      throw error;
    } finally {
      if (mountedRef.current) {
        setIsInitializing(false);
      }
    }
  }, [coordination, isInitializing, toast]);

  const refreshCoordination = useCallback(async () => {
    if (!coordination || !mountedRef.current) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('id', coordination.id)
        .single();

      if (!mountedRef.current) return;

      if (error) throw error;
      
      // Mettre à jour le cache
      coordinationCache.set(data.user_id, data);
      
      setCoordination(data);
      console.log('🔄 useMonJourMCoordination: Coordination refreshed');
    } catch (error: any) {
      if (!mountedRef.current) return;
      
      console.error('❌ useMonJourMCoordination: Error refreshing coordination:', error);
      setError(error.message || 'Erreur de rafraîchissement');
      
      toast({
        title: "Erreur",
        description: "Impossible de rafraîchir les données",
        variant: "destructive",
      });
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [coordination, toast]);

  // Auto-initialisation avec cleanup
  useEffect(() => {
    if (!coordination && !isInitializing && mountedRef.current) {
      const initialize = async () => {
        try {
          await initializeCoordination();
        } catch (error) {
          console.error('useMonJourMCoordination: Auto-initialization failed:', error);
        }
      };

      // Délai pour éviter les appels trop rapides
      const timeoutId = setTimeout(initialize, 100);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [coordination, isInitializing, initializeCoordination]);

  return {
    coordination,
    isLoading,
    isInitializing,
    error,
    refreshCoordination,
    initializeCoordination
  };
};

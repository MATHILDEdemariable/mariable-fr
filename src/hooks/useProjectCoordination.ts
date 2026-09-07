import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useWeddingScope } from '@/hooks/useWeddingScope';

interface ProjectCoordination {
  id: string;
  title: string;
  description?: string;
  wedding_date?: string;
  wedding_location?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface UseProjectCoordinationReturn {
  coordination: ProjectCoordination | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  refreshCoordination: () => Promise<void>;
  initializeCoordination: () => Promise<ProjectCoordination | null>;
}

export const useProjectCoordination = (): UseProjectCoordinationReturn => {
  const [coordination, setCoordination] = useState<ProjectCoordination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { weddingId } = useWeddingScope();
  
  // Ref pour éviter les setState sur composant démonté
  const mountedRef = useRef(true);

  // Cleanup function
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const initializeCoordination = useCallback(async (): Promise<ProjectCoordination | null> => {
    if (isInitializing) return coordination;

    try {
      setIsInitializing(true);
      setIsLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!mountedRef.current) return null;
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      console.log('🚀 useProjectCoordination: Initializing project coordination for user:', user.id);

      // Vérifier si une coordination projet existe déjà - prendre la plus récente
      let fetchQuery: any = supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .like('title', 'Mission Mariage%')
        .order('created_at', { ascending: false })
        .limit(1);

      if (weddingId) fetchQuery = fetchQuery.eq('wedding_id', weddingId);

      const { data: existingCoordinations, error: fetchError } = await fetchQuery;

      if (!mountedRef.current) return null;
      
      if (fetchError) {
        console.error('❌ Error fetching project coordination:', fetchError);
        throw fetchError;
      }

      let activeCoordination: ProjectCoordination;

      if (existingCoordinations && existingCoordinations.length > 0) {
        activeCoordination = existingCoordinations[0];
        console.log('✅ useProjectCoordination: Found existing project coordination:', activeCoordination.id);
      } else {
        // Créer une nouvelle coordination projet
        console.log('🆕 useProjectCoordination: Creating new project coordination...');
        const insertPayload: any = {
          user_id: user.id,
          title: 'Mission Mariage - Préparation',
          description: 'Gestion et organisation de la préparation du mariage'
        };
        if (weddingId) insertPayload.wedding_id = weddingId;

        const { data: newCoordination, error: createError } = await supabase
          .from('wedding_coordination')
          .insert(insertPayload)
          .select()
          .single();

        if (!mountedRef.current) return null;

        if (createError) {
          console.error('❌ Error creating project coordination:', createError);
          throw createError;
        }

        activeCoordination = newCoordination;
        console.log('✅ useProjectCoordination: Created new project coordination:', activeCoordination.id);
      }

      if (mountedRef.current) {
        setCoordination(activeCoordination);
        setIsLoading(false);
      }
      
      return activeCoordination;
    } catch (error: any) {
      if (!mountedRef.current) {
        return null;
      }
      
      console.error('❌ useProjectCoordination: Error initializing project coordination:', error);
      
      if (mountedRef.current) {
        setError(error.message || 'Erreur d\'initialisation');
        setIsLoading(false);
        
        toast({
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser votre Mission Mariage. Rechargement...",
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
      
      setCoordination(data);
      console.log('🔄 useProjectCoordination: Project coordination refreshed');
    } catch (error: any) {
      if (!mountedRef.current) return;
      
      console.error('❌ useProjectCoordination: Error refreshing project coordination:', error);
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

  // Auto-initialisation avec protection contre les race conditions
  useEffect(() => {
    let isCancelled = false;
    
    if (!coordination && !isInitializing && mountedRef.current) {
      const initialize = async () => {
        if (isCancelled || !mountedRef.current) return;
        
        try {
          await initializeCoordination();
        } catch (error) {
          if (!isCancelled && mountedRef.current) {
            console.error('useProjectCoordination: Auto-initialization failed:', error);
            setError('Impossible d\'initialiser la coordination');
            setIsLoading(false);
          }
        }
      };

      // Délai plus court pour une meilleure réactivité
      const timeoutId = setTimeout(initialize, 50);
      
      return () => {
        isCancelled = true;
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
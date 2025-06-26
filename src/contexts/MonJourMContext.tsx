import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

interface PlanningTask {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  category: string;
  priority: string;
  status: string;
  assigned_to?: string[];
  position?: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  type: 'person' | 'vendor';
  prestataire_id?: string;
  notes?: string;
}

interface MonJourMContextType {
  coordination: WeddingCoordination | null;
  tasks: PlanningTask[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  isInitializing: boolean;
  initializeCoordination: () => Promise<WeddingCoordination | null>;
  refreshData: () => Promise<void>;
  addTask: (task: Omit<PlanningTask, 'id'>) => Promise<boolean>;
  updateTask: (task: PlanningTask) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<boolean>;
  updateTeamMember: (member: TeamMember) => Promise<boolean>;
  deleteTeamMember: (memberId: string) => Promise<boolean>;
}

const MonJourMContext = createContext<MonJourMContextType | undefined>(undefined);

export const MonJourMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction pour obtenir les clés de cache spécifiques à l'utilisateur
  const getCacheKeys = useCallback((userId: string) => ({
    coordination: `monjourm_coordination_${userId}`,
    tasks: `monjourm_tasks_${userId}`,
    teamMembers: `monjourm_team_members_${userId}`
  }), []);

  // Fonction pour nettoyer le cache d'un utilisateur spécifique
  const clearUserCache = useCallback((userId: string) => {
    const cacheKeys = getCacheKeys(userId);
    localStorage.removeItem(cacheKeys.coordination);
    localStorage.removeItem(cacheKeys.tasks);
    localStorage.removeItem(cacheKeys.teamMembers);
    console.log('🧹 Cache cleared for user:', userId);
  }, [getCacheKeys]);

  // Fonction pour nettoyer tout le cache Mon Jour-M
  const clearAllCache = useCallback(() => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('monjourm_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('🧹 All Mon Jour-M cache cleared');
  }, []);

  // Surveiller les changements d'utilisateur
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const newUserId = user?.id || null;
      
      if (currentUserId !== newUserId) {
        console.log('👤 User changed from', currentUserId, 'to', newUserId);
        
        // Reset state when user changes
        setCoordination(null);
        setTasks([]);
        setTeamMembers([]);
        setIsInitialized(false);
        
        setCurrentUserId(newUserId);
      }
    };

    checkUser();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUserId = session?.user?.id || null;
      if (currentUserId !== newUserId) {
        console.log('👤 Auth state changed, user:', newUserId);
        
        // Reset state when user changes
        setCoordination(null);
        setTasks([]);
        setTeamMembers([]);
        setIsInitialized(false);
        
        setCurrentUserId(newUserId);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [currentUserId]);

  // Load from cache on mount or user change
  useEffect(() => {
    if (!currentUserId) return;

    try {
      const cacheKeys = getCacheKeys(currentUserId);
      const cachedCoordination = localStorage.getItem(cacheKeys.coordination);
      const cachedTasks = localStorage.getItem(cacheKeys.tasks);
      const cachedTeamMembers = localStorage.getItem(cacheKeys.teamMembers);

      if (cachedCoordination) {
        const parsed = JSON.parse(cachedCoordination);
        // Vérifier que la coordination cached appartient bien à l'utilisateur actuel
        if (parsed.user_id === currentUserId) {
          setCoordination(parsed);
          console.log('📥 Loaded coordination from cache for user:', currentUserId);
        } else {
          localStorage.removeItem(cacheKeys.coordination);
        }
      }
      if (cachedTasks) {
        setTasks(JSON.parse(cachedTasks));
        console.log('📥 Loaded tasks from cache for user:', currentUserId);
      }
      if (cachedTeamMembers) {
        setTeamMembers(JSON.parse(cachedTeamMembers));
        console.log('📥 Loaded team members from cache for user:', currentUserId);
      }
    } catch (error) {
      console.error('❌ Error loading cache for user:', currentUserId, error);
      // En cas d'erreur, nettoyer le cache de cet utilisateur
      if (currentUserId) {
        clearUserCache(currentUserId);
      }
    }
  }, [currentUserId, getCacheKeys, clearUserCache]);

  // Cache coordination with user-specific key
  useEffect(() => {
    if (coordination && currentUserId) {
      const cacheKeys = getCacheKeys(currentUserId);
      localStorage.setItem(cacheKeys.coordination, JSON.stringify(coordination));
      console.log('💾 Coordination cached for user:', currentUserId);
    }
  }, [coordination, currentUserId, getCacheKeys]);

  // Cache tasks with user-specific key
  useEffect(() => {
    if (tasks.length > 0 && currentUserId) {
      const cacheKeys = getCacheKeys(currentUserId);
      localStorage.setItem(cacheKeys.tasks, JSON.stringify(tasks));
      console.log('💾 Tasks cached for user:', currentUserId, tasks.length, 'tasks');
    }
  }, [tasks, currentUserId, getCacheKeys]);

  // Cache team members with user-specific key
  useEffect(() => {
    if (teamMembers.length > 0 && currentUserId) {
      const cacheKeys = getCacheKeys(currentUserId);
      localStorage.setItem(cacheKeys.teamMembers, JSON.stringify(teamMembers));
      console.log('💾 Team members cached for user:', currentUserId, teamMembers.length, 'members');
    }
  }, [teamMembers, currentUserId, getCacheKeys]);

  const initializeCoordination = useCallback(async (): Promise<WeddingCoordination | null> => {
    if (isInitializing || isInitialized) return coordination;

    try {
      setIsInitializing(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ User not authenticated');
        return null;
      }

      console.log('🚀 Initializing coordination for user:', user.id);

      // Vérifier si une coordination existe déjà - STRICTEMENT pour cet utilisateur
      const { data: existingCoordinations, error: fetchError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Error fetching coordinations:', fetchError);
        throw fetchError;
      }

      let activeCoordination: WeddingCoordination;

      if (existingCoordinations && existingCoordinations.length > 0) {
        // Prendre la première coordination (la plus récente) pour CET utilisateur
        activeCoordination = existingCoordinations[0];
        console.log('✅ Found existing coordination for user:', user.id, 'coordination:', activeCoordination.id);

        // Supprimer les doublons s'il y en a pour CET utilisateur
        if (existingCoordinations.length > 1) {
          console.log('🧹 Cleaning up duplicate coordinations for user:', user.id);
          const duplicateIds = existingCoordinations.slice(1).map(c => c.id);
          
          // Supprimer les tâches des doublons
          await supabase
            .from('coordination_planning')
            .delete()
            .in('coordination_id', duplicateIds);
          
          // Supprimer les membres d'équipe des doublons
          await supabase
            .from('coordination_team')
            .delete()
            .in('coordination_id', duplicateIds);
          
          // Supprimer les coordinations dupliquées
          await supabase
            .from('wedding_coordination')
            .delete()
            .in('id', duplicateIds);
          
          console.log('✅ Cleaned up duplicates for user:', user.id);
        }
      } else {
        // Créer une nouvelle coordination pour CET utilisateur
        console.log('🆕 Creating new coordination for user:', user.id);
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
        console.log('✅ Created new coordination for user:', user.id, 'coordination:', activeCoordination.id);
      }

      setCoordination(activeCoordination);
      setIsInitialized(true);
      return activeCoordination;
    } catch (error) {
      console.error('❌ Error initializing coordination:', error);
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser votre espace Mon Jour-M",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [coordination, isInitializing, isInitialized, toast]);

  const loadTasks = useCallback(async (coordId: string) => {
    if (!coordId) return;
    
    try {
      console.log('📥 Loading tasks for coordination:', coordId);
      
      const { data, error } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', coordId)
        .order('position');

      if (error) {
        console.error('❌ Error loading tasks:', error);
        return;
      }

      console.log('✅ Loaded tasks:', data?.length || 0);
      
      const formattedTasks: PlanningTask[] = (data || []).map(task => ({
        ...task,
        assigned_to: Array.isArray(task.assigned_to) 
          ? task.assigned_to.map(id => String(id))
          : task.assigned_to 
            ? [String(task.assigned_to)]
            : []
      }));
      
      setTasks(formattedTasks);
    } catch (error) {
      console.error('❌ Error in loadTasks:', error);
    }
  }, []);

  const loadTeamMembers = useCallback(async (coordId: string) => {
    if (!coordId) return;
    
    try {
      console.log('📥 Loading team members for coordination:', coordId);
      
      const { data, error } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', coordId)
        .order('created_at');

      if (error) {
        console.error('❌ Error loading team members:', error);
        return;
      }

      console.log('✅ Loaded team members:', data?.length || 0);
      const mappedData = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        email: item.email,
        phone: item.phone,
        type: (item.type === 'vendor' ? 'vendor' : 'person') as 'person' | 'vendor',
        prestataire_id: item.prestataire_id,
        notes: item.notes
      }));

      setTeamMembers(mappedData);
    } catch (error) {
      console.error('❌ Error in loadTeamMembers:', error);
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (!coordination?.id) {
      console.log('⚠️ No coordination ID available for refresh');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('🔄 Refreshing data for coordination:', coordination.id);
      await Promise.all([
        loadTasks(coordination.id),
        loadTeamMembers(coordination.id)
      ]);
      console.log('✅ Data refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rafraîchir les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [coordination?.id, loadTasks, loadTeamMembers, toast]);

  const addTask = useCallback(async (taskData: Omit<PlanningTask, 'id'>): Promise<boolean> => {
    if (!coordination?.id) {
      console.error('❌ No coordination available for adding task');
      return false;
    }

    try {
      console.log('➕ Adding task:', taskData.title);

      const { data, error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: taskData.title,
          description: taskData.description || null,
          start_time: taskData.start_time || null,
          end_time: taskData.end_time || null,
          duration: taskData.duration || 30,
          category: taskData.category,
          priority: taskData.priority,
          status: taskData.status,
          assigned_to: taskData.assigned_to && taskData.assigned_to.length > 0 ? taskData.assigned_to : null,
          position: tasks.length
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding task:', error);
        throw error;
      }

      // Mise à jour immédiate de l'état local
      const newTask: PlanningTask = {
        ...data,
        assigned_to: Array.isArray(data.assigned_to) 
          ? data.assigned_to.map(id => String(id))
          : data.assigned_to 
            ? [String(data.assigned_to)]
            : []
      };
      
      setTasks(prev => {
        const updated = [...prev, newTask];
        console.log('✅ Task added locally, total tasks:', updated.length);
        return updated;
      });
      
      toast({
        title: "Tâche ajoutée",
        description: "La nouvelle tâche a été ajoutée au planning"
      });

      return true;
    } catch (error) {
      console.error('❌ Error adding task:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
        variant: "destructive"
      });
      return false;
    }
  }, [coordination?.id, tasks.length, toast]);

  const updateTask = useCallback(async (task: PlanningTask): Promise<boolean> => {
    try {
      console.log('✏️ Updating task:', task.id, task.title);

      const { error } = await supabase
        .from('coordination_planning')
        .update({
          title: task.title,
          description: task.description || null,
          start_time: task.start_time || null,
          end_time: task.end_time || null,
          duration: task.duration || 30,
          category: task.category,
          priority: task.priority,
          status: task.status,
          assigned_to: task.assigned_to && task.assigned_to.length > 0 ? task.assigned_to : null
        })
        .eq('id', task.id);

      if (error) {
        console.error('❌ Error updating task:', error);
        throw error;
      }

      // Mise à jour immédiate de l'état local
      setTasks(prev => {
        const updated = prev.map(t => t.id === task.id ? task : t);
        console.log('✅ Task updated locally');
        return updated;
      });
      
      toast({
        title: "Tâche modifiée",
        description: "Les informations ont été mises à jour"
      });

      return true;
    } catch (error) {
      console.error('❌ Error updating task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la tâche",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting task:', taskId);
      
      const { error } = await supabase
        .from('coordination_planning')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('❌ Error deleting task:', error);
        throw error;
      }
      
      // Mise à jour immédiate de l'état local
      setTasks(prev => {
        const updated = prev.filter(t => t.id !== taskId);
        console.log('✅ Task deleted locally, remaining tasks:', updated.length);
        return updated;
      });
      
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été retirée du planning"
      });

      return true;
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const addTeamMember = useCallback(async (memberData: Omit<TeamMember, 'id'>): Promise<boolean> => {
    if (!coordination?.id) {
      console.error('❌ No coordination available for adding member');
      return false;
    }

    try {
      console.log('➕ Adding member:', memberData.name);

      const { data, error } = await supabase
        .from('coordination_team')
        .insert({
          coordination_id: coordination.id,
          name: memberData.name,
          role: memberData.role || 'Membre',
          email: memberData.email || null,
          phone: memberData.phone || null,
          type: memberData.type,
          notes: memberData.notes || null
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding member:', error);
        throw error;
      }

      // Mise à jour immédiate de l'état local
      const newMember: TeamMember = {
        id: data.id,
        name: data.name,
        role: data.role,
        email: data.email,
        phone: data.phone,
        type: data.type as 'person' | 'vendor',
        prestataire_id: data.prestataire_id,
        notes: data.notes
      };
      
      setTeamMembers(prev => {
        const updated = [...prev, newMember];
        console.log('✅ Member added locally, total members:', updated.length);
        return updated;
      });
      
      toast({
        title: "Membre ajouté",
        description: "Le nouveau membre a été ajouté à l'équipe"
      });

      return true;
    } catch (error) {
      console.error('❌ Error adding member:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre",
        variant: "destructive"
      });
      return false;
    }
  }, [coordination?.id, toast]);

  const updateTeamMember = useCallback(async (member: TeamMember): Promise<boolean> => {
    try {
      console.log('✏️ Updating member:', member.id, member.name);

      const { error } = await supabase
        .from('coordination_team')
        .update({
          name: member.name,
          role: member.role,
          email: member.email || null,
          phone: member.phone || null,
          type: member.type,
          notes: member.notes || null
        })
        .eq('id', member.id);

      if (error) {
        console.error('❌ Error updating member:', error);
        throw error;
      }

      // Mise à jour immédiate de l'état local
      setTeamMembers(prev => {
        const updated = prev.map(m => m.id === member.id ? member : m);
        console.log('✅ Member updated locally');
        return updated;
      });
      
      toast({
        title: "Membre modifié",
        description: "Les informations ont été mises à jour"
      });

      return true;
    } catch (error) {
      console.error('❌ Error updating member:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le membre",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const deleteTeamMember = useCallback(async (memberId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting member:', memberId);
      
      const { error } = await supabase
        .from('coordination_team')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.error('❌ Error deleting member:', error);
        throw error;
      }
      
      // Mise à jour immédiate de l'état local
      setTeamMembers(prev => {
        const updated = prev.filter(m => m.id !== memberId);
        console.log('✅ Member deleted locally, remaining members:', updated.length);
        return updated;
      });
      
      toast({
        title: "Membre supprimé",
        description: "Le membre a été retiré de l'équipe"
      });

      return true;
    } catch (error) {
      console.error('❌ Error deleting member:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Initialisation automatique au montage quand l'utilisateur est disponible
  useEffect(() => {
    if (currentUserId && !isInitialized && !isInitializing) {
      console.log('🔄 Auto-initializing for user:', currentUserId);
      initializeCoordination();
    }
  }, [currentUserId, initializeCoordination, isInitialized, isInitializing]);

  // Chargement des données quand la coordination est disponible
  useEffect(() => {
    if (coordination?.id && isInitialized && currentUserId) {
      console.log('🔄 Loading data for initialized coordination:', coordination.id, 'user:', currentUserId);
      loadTasks(coordination.id);
      loadTeamMembers(coordination.id);
    }
  }, [coordination?.id, isInitialized, currentUserId, loadTasks, loadTeamMembers]);

  // Subscription temps réel persistante
  useEffect(() => {
    if (!coordination?.id || !isInitialized || !currentUserId) return;

    console.log('🔗 Setting up persistent realtime subscriptions for coordination:', coordination.id, 'user:', currentUserId);

    const planningChannel = supabase
      .channel(`coordination-planning-${coordination.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coordination_planning',
          filter: `coordination_id=eq.${coordination.id}`
        },
        (payload) => {
          console.log('📨 Planning change received:', payload.eventType);
          
          // Vérification de type pour payload.new
          if (payload.new && typeof payload.new === 'object' && payload.new !== null && 'id' in payload.new) {
            console.log('📨 Planning item ID:', payload.new.id);
          }
          
          // Recharger seulement si ce n'est pas notre propre modification
          setTimeout(() => {
            loadTasks(coordination.id);
          }, 100);
        }
      )
      .subscribe((status) => {
        console.log('📡 Planning subscription status:', status);
      });

    const teamChannel = supabase
      .channel(`coordination-team-${coordination.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coordination_team',
          filter: `coordination_id=eq.${coordination.id}`
        },
        (payload) => {
          console.log('📨 Team change received:', payload.eventType);
          
          // Vérification de type pour payload.new
          if (payload.new && typeof payload.new === 'object' && payload.new !== null && 'id' in payload.new) {
            console.log('📨 Team member ID:', payload.new.id);
          }
          
          // Recharger seulement si ce n'est pas notre propre modification
          setTimeout(() => {
            loadTeamMembers(coordination.id);
          }, 100);
        }
      )
      .subscribe((status) => {
        console.log('📡 Team subscription status:', status);
      });

    return () => {
      console.log('🔌 Cleaning up persistent realtime subscriptions');
      supabase.removeChannel(planningChannel);
      supabase.removeChannel(teamChannel);
    };
  }, [coordination?.id, isInitialized, currentUserId, loadTasks, loadTeamMembers]);

  const value: MonJourMContextType = {
    coordination,
    tasks,
    teamMembers,
    isLoading,
    isInitializing,
    initializeCoordination,
    refreshData,
    addTask,
    updateTask,
    deleteTask,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
  };

  return (
    <MonJourMContext.Provider value={value}>
      {children}
    </MonJourMContext.Provider>
  );
};

export const useMonJourM = (): MonJourMContextType => {
  const context = useContext(MonJourMContext);
  if (context === undefined) {
    throw new Error('useMonJourM must be used within a MonJourMProvider');
  }
  return context;
};

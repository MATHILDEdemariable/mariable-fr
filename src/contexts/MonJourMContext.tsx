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

export interface PlanningTask {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration: number; // Obligatoire - durée en minutes
  category: string;
  priority: "low" | "medium" | "high"; // Types stricts uniformisés
  status: "todo" | "completed" | "in_progress"; // Types stricts
  assigned_to: string[]; // Array de strings
  position: number; // Obligatoire - position dans la liste
  is_ai_generated?: boolean;
  is_manual_time?: boolean; // Nouvelle propriété pour les heures fixées manuellement
}

// Type pour les tâches partielles (venant de la base de données)
interface PartialPlanningTask {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  category?: string;
  priority?: string;
  status?: string;
  assigned_to?: any; // Json ou string[] ou null
  position?: number;
  is_ai_generated?: boolean;
}

// Type pour les données brutes de la base de données
interface DatabaseTask {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  category?: string;
  priority?: string;
  status?: string;
  assigned_to?: any; // Type Json de Supabase
  position?: number;
  is_ai_generated?: boolean;
  coordination_id?: string;
  created_at?: string;
  updated_at?: string;
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

// Fonction pour normaliser assigned_to
const normalizeAssignedTo = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(id => String(id));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(id => String(id));
      }
    } catch {
      return [String(value)];
    }
  }
  return [];
};

// Fonction pour normaliser le status
const normalizeStatus = (value?: string): "todo" | "completed" | "in_progress" => {
  if (!value) return "todo";
  switch (value.toLowerCase()) {
    case "completed":
    case "complete":
    case "done":
      return "completed";
    case "in_progress":
    case "in-progress":
    case "progress":
    case "doing":
      return "in_progress";
    case "todo":
    case "to-do":
    case "pending":
    default:
      return "todo";
  }
};

// Fonction pour normaliser la priorité
const normalizePriority = (value?: string): "low" | "medium" | "high" => {
  if (!value) return "medium";
  switch (value.toLowerCase()) {
    case "high":
    case "élevée":
    case "elevee":
      return "high";
    case "low":
    case "faible":
      return "low";
    case "medium":
    case "moyenne":
    default:
      return "medium";
  }
};

// Fonction de transformation complète des tâches de la base de données
const transformDatabaseTask = (dbTask: DatabaseTask, index: number): PlanningTask => {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    start_time: dbTask.start_time || "09:00",
    end_time: dbTask.end_time,
    duration: dbTask.duration || 15, // Valeur par défaut de 15 minutes
    category: dbTask.category || 'general',
    priority: normalizePriority(dbTask.priority),
    status: normalizeStatus(dbTask.status),
    assigned_to: normalizeAssignedTo(dbTask.assigned_to),
    position: typeof dbTask.position === 'number' ? dbTask.position : index, // Position obligatoire
    is_ai_generated: dbTask.is_ai_generated || false,
    is_manual_time: false // Valeur par défaut
  };
};

// Fonction utilitaire pour normaliser les tâches avec valeurs par défaut
export const normalizeTask = (task: PartialPlanningTask, index: number): PlanningTask => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    start_time: task.start_time || "09:00",
    end_time: task.end_time,
    duration: task.duration || 15, // Valeur par défaut de 15 minutes
    category: task.category || 'general',
    priority: normalizePriority(task.priority),
    status: normalizeStatus(task.status),
    assigned_to: normalizeAssignedTo(task.assigned_to),
    position: typeof task.position === 'number' ? task.position : index, // Position obligatoire
    is_ai_generated: task.is_ai_generated || false,
    is_manual_time: false // Valeur par défaut
  };
};

// Fonction pour recalculer les positions après drag & drop
export const updateTaskPositions = (tasks: PlanningTask[]): PlanningTask[] => {
  return tasks.map((task, index) => ({
    ...task,
    position: index
  }));
};

// Fonction utilitaire pour normaliser les tâches (ancienne fonction pour compatibilité)
export const normalizePlanningTask = (task: any): PlanningTask => {
  return normalizeTask(task, task.position || 0);
};

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

  // Surveiller les changements d'utilisateur avec initialisation immédiate
  useEffect(() => {
    let mounted = true;

    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const newUserId = user?.id || null;
        
        if (!mounted) return;

        if (currentUserId !== newUserId) {
          console.log('👤 User changed from', currentUserId, 'to', newUserId);
          
          // Reset state when user changes
          setCoordination(null);
          setTasks([]);
          setTeamMembers([]);
          setIsInitialized(false);
          
          setCurrentUserId(newUserId);
          
          // Initialiser immédiatement pour le nouvel utilisateur
          if (newUserId) {
            setTimeout(() => {
              if (mounted) {
                initializeForUser(newUserId);
              }
            }, 100);
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };

    initializeUser();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      const newUserId = session?.user?.id || null;
      if (currentUserId !== newUserId) {
        console.log('👤 Auth state changed, user:', newUserId);
        
        // Reset state when user changes
        setCoordination(null);
        setTasks([]);
        setTeamMembers([]);
        setIsInitialized(false);
        
        setCurrentUserId(newUserId);
        
        // Initialiser immédiatement pour le nouvel utilisateur
        if (newUserId) {
          setTimeout(() => {
            if (mounted) {
              initializeForUser(newUserId);
            }
          }, 100);
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [currentUserId]);

  // Nouvelle fonction d'initialisation pour un utilisateur spécifique
  const initializeForUser = useCallback(async (userId: string) => {
    if (isInitializing) return;
    
    try {
      setIsInitializing(true);
      console.log('🚀 Initializing for user:', userId);

      // Charger depuis le cache d'abord
      const cacheKeys = getCacheKeys(userId);
      const cachedCoordination = localStorage.getItem(cacheKeys.coordination);
      const cachedTasks = localStorage.getItem(cacheKeys.tasks);
      const cachedTeamMembers = localStorage.getItem(cacheKeys.teamMembers);

      if (cachedCoordination) {
        const parsed = JSON.parse(cachedCoordination);
        if (parsed.user_id === userId) {
          setCoordination(parsed);
          console.log('📥 Loaded coordination from cache');
        }
      }
      if (cachedTasks) {
        const rawTasks = JSON.parse(cachedTasks);
        const normalizedTasks = rawTasks.map((task: any, index: number) => normalizeTask(task, index));
        setTasks(normalizedTasks);
        console.log('📥 Loaded tasks from cache');
      }
      if (cachedTeamMembers) {
        setTeamMembers(JSON.parse(cachedTeamMembers));
        console.log('📥 Loaded team members from cache');
      }

      // Initialiser ou récupérer la coordination
      const activeCoordination = await initializeCoordination();
      
      if (activeCoordination) {
        // Charger les données depuis la base
        await Promise.all([
          loadTasks(activeCoordination.id),
          loadTeamMembers(activeCoordination.id)
        ]);
        
        setIsInitialized(true);
        console.log('✅ User initialization complete');
      }
    } catch (error) {
      console.error('❌ Error initializing user:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing, getCacheKeys]);

  // Cache avec clés spécifiques à l'utilisateur
  useEffect(() => {
    if (coordination && currentUserId) {
      const cacheKeys = getCacheKeys(currentUserId);
      localStorage.setItem(cacheKeys.coordination, JSON.stringify(coordination));
      console.log('💾 Coordination cached for user:', currentUserId);
    }
  }, [coordination, currentUserId, getCacheKeys]);

  useEffect(() => {
    if (tasks.length >= 0 && currentUserId) {
      const cacheKeys = getCacheKeys(currentUserId);
      localStorage.setItem(cacheKeys.tasks, JSON.stringify(tasks));
      console.log('💾 Tasks cached for user:', currentUserId, tasks.length, 'tasks');
    }
  }, [tasks, currentUserId, getCacheKeys]);

  useEffect(() => {
    if (teamMembers.length >= 0 && currentUserId) {
      const cacheKeys = getCacheKeys(currentUserId);
      localStorage.setItem(cacheKeys.teamMembers, JSON.stringify(teamMembers));
      console.log('💾 Team members cached for user:', currentUserId, teamMembers.length, 'members');
    }
  }, [teamMembers, currentUserId, getCacheKeys]);

  const initializeCoordination = useCallback(async (): Promise<WeddingCoordination | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ User not authenticated');
        return null;
      }

      console.log('🚀 Initializing coordination for user:', user.id);

      // Vérifier si une coordination existe déjà
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
        activeCoordination = existingCoordinations[0];
        console.log('✅ Found existing coordination:', activeCoordination.id);

        // Supprimer les doublons s'il y en a
        if (existingCoordinations.length > 1) {
          console.log('🧹 Cleaning up duplicate coordinations');
          const duplicateIds = existingCoordinations.slice(1).map(c => c.id);
          
          await supabase.from('coordination_planning').delete().in('coordination_id', duplicateIds);
          await supabase.from('coordination_team').delete().in('coordination_id', duplicateIds);
          await supabase.from('wedding_coordination').delete().in('id', duplicateIds);
        }
      } else {
        // Créer une nouvelle coordination
        console.log('🆕 Creating new coordination');
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
        console.log('✅ Created new coordination:', activeCoordination.id);
      }

      setCoordination(activeCoordination);
      return activeCoordination;
    } catch (error) {
      console.error('❌ Error initializing coordination:', error);
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser votre espace Mon Jour-M",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

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
      
      // Utiliser transformDatabaseTask au lieu de normalizeTask
      const normalizedTasks: PlanningTask[] = (data || []).map((task, index) => transformDatabaseTask(task as DatabaseTask, index));
      
      setTasks(normalizedTasks);
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
      toast({
        title: "Erreur",
        description: "Aucune coordination active trouvée",
        variant: "destructive"
      });
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
          duration: taskData.duration || 15,
          category: taskData.category,
          priority: taskData.priority,
          status: taskData.status,
          assigned_to: taskData.assigned_to && taskData.assigned_to.length > 0 ? taskData.assigned_to : null,
          position: taskData.position,
          is_ai_generated: taskData.is_ai_generated || false,
          is_manual_time: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding task:', error);
        toast({
          title: "Erreur",
          description: `Impossible d'ajouter la tâche: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      // Utiliser transformDatabaseTask pour la nouvelle tâche
      const newTask: PlanningTask = transformDatabaseTask(data as DatabaseTask, taskData.position);
      
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
  }, [coordination?.id, toast]);

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
          duration: task.duration,
          category: task.category,
          priority: task.priority,
          status: task.status,
          assigned_to: task.assigned_to && task.assigned_to.length > 0 ? task.assigned_to : null,
          position: task.position,
          is_ai_generated: task.is_ai_generated || false,
          is_manual_time: false
        })
        .eq('id', task.id);

      if (error) {
        console.error('❌ Error updating task:', error);
        throw error;
      }

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
      toast({
        title: "Erreur",
        description: "Aucune coordination active trouvée",
        variant: "destructive"
      });
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
        toast({
          title: "Erreur",
          description: `Impossible d'ajouter le membre: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

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

  // Subscriptions temps réel optimisées
  useEffect(() => {
    if (!coordination?.id || !isInitialized || !currentUserId) return;

    console.log('🔗 Setting up realtime subscriptions for coordination:', coordination.id);

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
          loadTasks(coordination.id);
        }
      )
      .subscribe();

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
          loadTeamMembers(coordination.id);
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Cleaning up realtime subscriptions');
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


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
  const { toast } = useToast();

  const initializeCoordination = useCallback(async (): Promise<WeddingCoordination | null> => {
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
      return newCoordination;
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
  }, [toast]);

  const loadTasks = useCallback(async (coordId: string) => {
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

      console.log('✅ Loaded tasks:', data);
      
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

      console.log('✅ Loaded team members:', data);
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
    if (!coordination?.id) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        loadTasks(coordination.id),
        loadTeamMembers(coordination.id)
      ]);
      console.log('🔄 Data refreshed successfully');
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
    if (!coordination?.id) return false;

    try {
      console.log('➕ Adding task:', taskData);

      const { data, error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: taskData.title,
          description: taskData.description || null,
          start_time: taskData.start_time || null,
          end_time: taskData.end_time || null,
          duration: taskData.duration,
          category: taskData.category,
          priority: taskData.priority,
          status: taskData.status,
          assigned_to: taskData.assigned_to && taskData.assigned_to.length > 0 ? taskData.assigned_to : null,
          position: tasks.length
        })
        .select()
        .single();

      if (error) throw error;

      // Mise à jour immédiate de l'état local
      const newTask: PlanningTask = {
        ...data,
        assigned_to: Array.isArray(data.assigned_to) 
          ? data.assigned_to.map(id => String(id))
          : data.assigned_to 
            ? [String(data.assigned_to)]
            : []
      };
      
      setTasks(prev => [...prev, newTask]);
      
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
      console.log('✏️ Updating task:', task);

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
          assigned_to: task.assigned_to && task.assigned_to.length > 0 ? task.assigned_to : null
        })
        .eq('id', task.id);

      if (error) throw error;

      // Mise à jour immédiate de l'état local
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
      
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

      if (error) throw error;
      
      // Mise à jour immédiate de l'état local
      setTasks(prev => prev.filter(t => t.id !== taskId));
      
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
    if (!coordination?.id) return false;

    try {
      console.log('➕ Adding member:', memberData);

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

      if (error) throw error;

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
      
      setTeamMembers(prev => [...prev, newMember]);
      
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
      console.log('✏️ Updating member:', member);

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

      if (error) throw error;

      // Mise à jour immédiate de l'état local
      setTeamMembers(prev => prev.map(m => m.id === member.id ? member : m));
      
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

      if (error) throw error;
      
      // Mise à jour immédiate de l'état local
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
      
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

  // Initialisation au montage du contexte
  useEffect(() => {
    initializeCoordination();
  }, [initializeCoordination]);

  // Chargement des données quand la coordination est disponible
  useEffect(() => {
    if (coordination?.id) {
      loadTasks(coordination.id);
      loadTeamMembers(coordination.id);
    }
  }, [coordination?.id, loadTasks, loadTeamMembers]);

  // Subscription temps réel
  useEffect(() => {
    if (!coordination?.id) return;

    console.log('🔗 Setting up realtime subscriptions for coordination:', coordination.id);

    const planningChannel = supabase
      .channel('coordination-planning-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coordination_planning',
          filter: `coordination_id=eq.${coordination.id}`
        },
        (payload) => {
          console.log('📨 Planning change received:', payload);
          loadTasks(coordination.id);
        }
      )
      .subscribe();

    const teamChannel = supabase
      .channel('coordination-team-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coordination_team',
          filter: `coordination_id=eq.${coordination.id}`
        },
        (payload) => {
          console.log('📨 Team change received:', payload);
          loadTeamMembers(coordination.id);
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Cleaning up realtime subscriptions');
      supabase.removeChannel(planningChannel);
      supabase.removeChannel(teamChannel);
    };
  }, [coordination?.id, loadTasks, loadTeamMembers]);

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

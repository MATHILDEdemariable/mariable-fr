import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWeddingScope } from '@/hooks/useWeddingScope';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ChecklistTask {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  status: TaskStatus;
  priority: TaskPriority;
  completed: boolean;
  due_date?: string | null;
  responsible?: string | null;
  position: number;
}

export interface ChecklistTaskInput {
  title: string;
  description?: string | null;
  category: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  responsible?: string | null;
}

const TABLE = 'checklist_mariage_manuel';

/**
 * Tâches de la check-list mariage partagées entre la vue post-it et les vues
 * Kanban / Liste / Calendrier. Scopées au mariage courant.
 */
export const useChecklistTasks = () => {
  const queryClient = useQueryClient();
  const { weddingId, weddingLoading, scopeQuery, withWedding } = useWeddingScope();

  const queryKey = useMemo(() => ['checklist-tasks', weddingId], [weddingId]);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey,
    enabled: !weddingLoading,
    queryFn: async (): Promise<ChecklistTask[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query: any = supabase.from(TABLE).select('*').eq('user_id', user.id);
      query = scopeQuery(query);

      const { data, error } = await query;
      if (error) {
        console.error('❌ useChecklistTasks load failed:', error);
        throw error;
      }

      return ((data || []) as any[])
        .map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          category: row.category,
          status: (row.status || (row.completed ? 'completed' : 'pending')) as TaskStatus,
          priority: (row.priority || 'medium') as TaskPriority,
          completed: !!row.completed,
          due_date: row.due_date,
          responsible: row.responsible,
          position: row.position ?? 0,
        }))
        .sort((a, b) => {
          if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
          if (a.due_date) return -1;
          if (b.due_date) return 1;
          return a.position - b.position;
        });
    },
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const createTask = useMutation({
    mutationFn: async (input: ChecklistTaskInput) => {
      console.log('🚀 createTask started:', { title: input.title });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('NOT_AUTHENTICATED');

      const status: TaskStatus = input.status || 'pending';
      const payload = withWedding({
        user_id: user.id,
        title: input.title,
        description: input.description || null,
        category: input.category,
        status,
        priority: input.priority || 'medium',
        completed: status === 'completed',
        due_date: input.due_date || null,
        responsible: input.responsible || null,
        position: 0,
      }) as any;

      const { error } = await supabase.from(TABLE).insert(payload);
      if (error) throw error;
      console.log('✅ createTask completed');
    },
    onSuccess: invalidate,
    onError: (error) => console.error('❌ createTask failed:', error),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ChecklistTaskInput> & { id: string }) => {
      const payload: any = { ...updates, updated_at: new Date().toISOString() };
      if (updates.status) payload.completed = updates.status === 'completed';

      const { error } = await supabase.from(TABLE).update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error) => console.error('❌ updateTask failed:', error),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error) => console.error('❌ deleteTask failed:', error),
  });

  return { tasks, isLoading: isLoading || weddingLoading, createTask, updateTask, deleteTask };
};

export default useChecklistTasks;

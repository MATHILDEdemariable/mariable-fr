
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { WeddingCoordination, CoordinationTeamMember, CoordinationPlanning, CoordinationDocument } from '@/types/coordination';

export const useCoordination = () => {
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [teamMembers, setTeamMembers] = useState<CoordinationTeamMember[]>([]);
  const [planningItems, setPlanningItems] = useState<CoordinationPlanning[]>([]);
  const [documents, setDocuments] = useState<CoordinationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCoordination = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer ou créer la coordination
      let { data: existingCoordination, error } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!existingCoordination) {
        // Créer une nouvelle coordination
        const { data: newCoordination, error: createError } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage'
          })
          .select()
          .single();

        if (createError) throw createError;
        existingCoordination = newCoordination;
      }

      setCoordination(existingCoordination);

      // Récupérer les données associées
      await Promise.all([
        fetchTeamMembers(existingCoordination.id),
        fetchPlanningItems(existingCoordination.id),
        fetchDocuments(existingCoordination.id)
      ]);

    } catch (error) {
      console.error('Erreur lors du chargement de la coordination:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de coordination",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (coordinationId: string) => {
    const { data, error } = await supabase
      .from('coordination_team')
      .select('*')
      .eq('coordination_id', coordinationId)
      .order('created_at');

    if (error) throw error;
    setTeamMembers(data || []);
  };

  const fetchPlanningItems = async (coordinationId: string) => {
    const { data, error } = await supabase
      .from('coordination_planning')
      .select('*')
      .eq('coordination_id', coordinationId)
      .order('position');

    if (error) throw error;
    setPlanningItems(data || []);
  };

  const fetchDocuments = async (coordinationId: string) => {
    const { data, error } = await supabase
      .from('coordination_documents')
      .select('*')
      .eq('coordination_id', coordinationId)
      .order('created_at');

    if (error) throw error;
    setDocuments(data || []);
  };

  const updateCoordination = async (updates: Partial<WeddingCoordination>) => {
    if (!coordination) return;

    const { data, error } = await supabase
      .from('wedding_coordination')
      .update(updates)
      .eq('id', coordination.id)
      .select()
      .single();

    if (error) throw error;
    setCoordination(data);
    return data;
  };

  const addTeamMember = async (member: Omit<CoordinationTeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('coordination_team')
      .insert(member)
      .select()
      .single();

    if (error) throw error;
    setTeamMembers(prev => [...prev, data]);
    return data;
  };

  const addPlanningItem = async (item: Omit<CoordinationPlanning, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('coordination_planning')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    setPlanningItems(prev => [...prev, data]);
    return data;
  };

  const updatePlanningItem = async (id: string, updates: Partial<CoordinationPlanning>) => {
    const { data, error } = await supabase
      .from('coordination_planning')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setPlanningItems(prev => prev.map(item => item.id === id ? data : item));
    return data;
  };

  const deletePlanningItem = async (id: string) => {
    const { error } = await supabase
      .from('coordination_planning')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setPlanningItems(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    fetchCoordination();
  }, []);

  return {
    coordination,
    teamMembers,
    planningItems,
    documents,
    loading,
    updateCoordination,
    addTeamMember,
    addPlanningItem,
    updatePlanningItem,
    deletePlanningItem,
    refetch: fetchCoordination
  };
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JeuneMarie, JeuneMariesFilters } from '@/types/jeunes-maries';
import { toast } from '@/hooks/use-toast';

export const useJeunesMaries = () => {
  const [jeunesMaries, setJeunesMaries] = useState<JeuneMarie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<JeuneMariesFilters>({
    search: '',
    region: 'toutes',
    budget: 'tous',
    note: 0
  });

  const fetchJeunesMaries = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('jeunes_maries')
        .select('*')
        .eq('status_moderation', 'approuve')
        .eq('visible', true)
        .order('date_mariage', { ascending: false });

      if (filters.search) {
        query = query.or(`nom_complet.ilike.%${filters.search}%,lieu_mariage.ilike.%${filters.search}%`);
      }

      if (filters.region && filters.region !== 'toutes') {
        query = query.ilike('lieu_mariage', `%${filters.region}%`);
      }

      if (filters.budget && filters.budget !== 'tous') {
        query = query.eq('budget_approximatif', filters.budget);
      }

      if (filters.note > 0) {
        query = query.gte('note_experience', filters.note);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors du chargement des jeunes mariés:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les profils des jeunes mariés",
          variant: "destructive"
        });
        return;
      }

      setJeunesMaries((data as JeuneMarie[]) || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getJeuneMariesBySlug = async (slug: string): Promise<JeuneMarie | null> => {
    try {
      const { data, error } = await supabase
        .from('jeunes_maries')
        .select('*')
        .eq('slug', slug)
        .eq('status_moderation', 'approuve')
        .eq('visible', true)
        .single();

      if (error) {
        console.error('Erreur lors du chargement du profil:', error);
        return null;
      }

      return data as JeuneMarie;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  };

  const submitJeuneMarie = async (data: Omit<JeuneMarie, 'id' | 'created_at' | 'updated_at' | 'status_moderation' | 'date_soumission' | 'date_approbation' | 'slug'>) => {
    try {
      const { error } = await supabase
        .from('jeunes_maries')
        .insert(data);

      if (error) {
        console.error('Erreur lors de la soumission:', error);
        toast({
          title: "Erreur",
          description: "Impossible de soumettre votre profil",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Succès",
        description: "Votre profil a été soumis avec succès. Il sera examiné sous peu.",
      });
      return true;
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchJeunesMaries();
  }, [filters]);

  return {
    jeunesMaries,
    loading,
    filters,
    setFilters,
    fetchJeunesMaries,
    getJeuneMariesBySlug,
    submitJeuneMarie
  };
};
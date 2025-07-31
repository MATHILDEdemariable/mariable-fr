import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JeuneMarie, JeuneMariesFilters } from '@/types/jeunes-maries';
import { generateUniqueSlug } from '@/utils/generateUniqueSlug';
import { fakeTestimonials } from '@/data/fakeTestimonials';
import { toast } from '@/hooks/use-toast';

// Utility function to check if a testimonial is fake
export const isFakeTestimonial = (jeuneMarie: JeuneMarie): boolean => {
  return jeuneMarie.id.startsWith('fake-');
};

export const useJeunesMaries = () => {
  const [jeunesMaries, setJeunesMaries] = useState<JeuneMarie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFakeTestimonials, setShowFakeTestimonials] = useState(false);
  const [filters, setFilters] = useState<JeuneMariesFilters>({
    search: '',
    region: 'toutes',
    budget: 'tous',
    note: 0
  });

  const fetchSystemSettings = async () => {
    try {
      console.log('🔍 Fetching system settings...');
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'show_fake_testimonials')
        .single();

      if (error) {
        console.error('❌ Error fetching system settings:', error);
        setShowFakeTestimonials(false);
        return;
      }

      console.log('✅ System settings fetched:', data);
      setShowFakeTestimonials(data?.setting_value || false);
    } catch (error) {
      console.error('❌ Error in fetchSystemSettings:', error);
      setShowFakeTestimonials(false);
    }
  };

  const fetchJeunesMaries = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching jeunes mariés...', { showFakeTestimonials, filters });
      
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
        console.error('❌ Erreur lors du chargement des jeunes mariés:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les profils des jeunes mariés",
          variant: "destructive"
        });
        setJeunesMaries([]);
        return;
      }

      let finalData = (data as JeuneMarie[]) || [];
      console.log('✅ Real testimonials loaded:', finalData.length);

      // Add fake testimonials if enabled
      if (showFakeTestimonials) {
        console.log('🎭 Adding fake testimonials...');
        const fakeData = fakeTestimonials.map(fake => ({
          ...fake,
          id: `fake-${fake.slug}`,
          created_at: fake.date_soumission,
          updated_at: fake.date_soumission
        })) as JeuneMarie[];
        
        finalData = [...finalData, ...fakeData];
        console.log('✅ Total testimonials (real + fake):', finalData.length);
      }

      setJeunesMaries(finalData);
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
      setJeunesMaries([]);
    } finally {
      setLoading(false);
    }
  };

  const getJeuneMariesBySlug = async (slug: string): Promise<JeuneMarie | null> => {
    try {
      // First check fake testimonials if they should be shown
      if (showFakeTestimonials) {
        const fakeTestimonial = fakeTestimonials.find(fake => fake.slug === slug);
        if (fakeTestimonial) {
          return {
            ...fakeTestimonial,
            id: `fake-${fakeTestimonial.slug}`,
            created_at: fakeTestimonial.date_soumission,
            updated_at: fakeTestimonial.date_soumission
          } as JeuneMarie;
        }
      }

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
    fetchSystemSettings();
  }, []);

  useEffect(() => {
    fetchJeunesMaries();
  }, [filters, showFakeTestimonials]);

  return {
    jeunesMaries,
    loading,
    filters,
    setFilters,
    fetchJeunesMaries,
    getJeuneMariesBySlug,
    submitJeuneMarie,
    showFakeTestimonials,
    setShowFakeTestimonials
  };
};
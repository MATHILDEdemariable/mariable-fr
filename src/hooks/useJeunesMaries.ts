import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JeuneMarie, JeuneMariesFilters } from '@/types/jeunes-maries';
import { toast } from '@/hooks/use-toast';

// Fonction utilitaire pour détecter les témoignages fictifs
export const isFakeTestimonial = (jeuneMarie: JeuneMarie): boolean => {
  return jeuneMarie.id.startsWith('fake-');
};

export const useJeunesMaries = () => {
  const [jeunesMaries, setJeunesMaries] = useState<JeuneMarie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<JeuneMariesFilters>({
    search: '',
    region: 'toutes',
    budget: 'tous',
    note: 0
  });

  // Témoignages fictifs statiques - toujours disponibles
  const staticFakeTestimonials: JeuneMarie[] = [
    {
      id: 'fake-1',
      nom_complet: 'Sarah & Thomas Martin',
      email: 'sarah.thomas@example.com',
      lieu_mariage: 'Château de Versailles',
      region: 'Île-de-France',
      date_mariage: '2023-06-15',
      nombre_invites: 120,
      budget_approximatif: '25000-35000',
      photo_principale_url: '/lovable-uploads/fake-testimonial-1.jpg',
      photos_mariage: [],
      experience_partagee: 'Notre mariage au Château de Versailles a été un rêve devenu réalité. L\'organisation a été parfaite grâce à notre wedding planner. La beauté des jardins à la française a créé un cadre magique pour nos photos.',
      conseils_couples: 'Commencez l\'organisation au moins 18 mois avant. N\'hésitez pas à faire appel à des professionnels pour les lieux prestigieux.',
      prestataires_recommandes: [],
      note_experience: 5,
      slug: 'sarah-thomas-martin',
      visible: true,
      status_moderation: 'approuve' as const,
      date_soumission: '2023-07-01',
      accept_email_contact: true,
      created_at: '2023-07-01T00:00:00Z',
      updated_at: '2023-07-01T00:00:00Z'
    },
    {
      id: 'fake-2',
      nom_complet: 'Emma & Lucas Dupont',
      email: 'emma.lucas@example.com',
      lieu_mariage: 'Domaine de la Bergerie',
      region: 'Provence-Alpes-Côte d\'Azur',
      date_mariage: '2023-09-22',
      nombre_invites: 80,
      budget_approximatif: '15000-25000',
      photo_principale_url: '/lovable-uploads/fake-testimonial-2.jpg',
      photos_mariage: [],
      experience_partagee: 'Un mariage intimiste en Provence avec une ambiance champêtre chic. Nos invités ont adoré l\'atmosphère détendue et les paysages provençaux. La lavande était en fleur, un décor naturel parfait.',
      conseils_couples: 'Choisissez un lieu qui vous ressemble et n\'oubliez pas de profiter de votre journée ! Pensez aux activités pour vos invités.',
      prestataires_recommandes: [],
      note_experience: 5,
      slug: 'emma-lucas-dupont',
      visible: true,
      status_moderation: 'approuve' as const,
      date_soumission: '2023-10-01',
      accept_email_contact: true,
      created_at: '2023-10-01T00:00:00Z',
      updated_at: '2023-10-01T00:00:00Z'
    },
    {
      id: 'fake-3',
      nom_complet: 'Marie & Antoine Leroy',
      email: 'marie.antoine@example.com',
      lieu_mariage: 'Château de Chambord',
      region: 'Centre-Val de Loire',
      date_mariage: '2023-05-27',
      nombre_invites: 150,
      budget_approximatif: '35000-50000',
      photo_principale_url: '/lovable-uploads/fake-testimonial-3.jpg',
      photos_mariage: [],
      experience_partagee: 'Un mariage de conte de fées dans la vallée de la Loire. L\'architecture Renaissance du château a créé un cadre majestueux. Nos invités étaient émerveillés par la grandeur des lieux.',
      conseils_couples: 'Visitez plusieurs lieux avant de choisir et pensez à la logistique pour vos invités. Les châteaux nécessitent une organisation particulière.',
      prestataires_recommandes: [],
      note_experience: 4,
      slug: 'marie-antoine-leroy',
      visible: true,
      status_moderation: 'approuve' as const,
      date_soumission: '2023-06-15',
      accept_email_contact: true,
      created_at: '2023-06-15T00:00:00Z',
      updated_at: '2023-06-15T00:00:00Z'
    }
  ];

  const fetchJeunesMaries = async () => {
    try {
      setLoading(true);
      console.log('🚀 Récupération des jeunes mariés...');

      // Récupérer les témoignages réels depuis Supabase
      const { data: realTestimonials, error } = await supabase
        .from('jeunes_maries')
        .select('*')
        .eq('status_moderation', 'approuve')
        .eq('visible', true)
        .order('date_mariage', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors de la récupération des témoignages:', error);
        // En cas d'erreur, afficher une liste vide
        setJeunesMaries([]);
        setLoading(false);
        return;
      }

      console.log('✅ Témoignages réels récupérés:', realTestimonials?.length || 0);

      // Normaliser les témoignages réels pour éviter les erreurs de types
      const normalizedRealTestimonials: JeuneMarie[] = (realTestimonials || []).map(testimonial => ({
        ...testimonial,
        photos_mariage: Array.isArray(testimonial.photos_mariage) ? testimonial.photos_mariage : [],
        prestataires_recommandes: Array.isArray(testimonial.prestataires_recommandes) ? testimonial.prestataires_recommandes : [],
        status_moderation: (testimonial.status_moderation as 'approuve' | 'en_attente' | 'rejete') || 'approuve',
        visible: testimonial.visible ?? true,
        accept_email_contact: testimonial.accept_email_contact ?? false,
        admin_notes: testimonial.admin_notes ?? undefined,
        budget_approximatif: testimonial.budget_approximatif ?? undefined,
        conseils_couples: testimonial.conseils_couples ?? undefined,
        date_approbation: testimonial.date_approbation ?? undefined,
        experience_partagee: testimonial.experience_partagee ?? undefined,
        note_experience: testimonial.note_experience ?? undefined,
        photo_principale_url: testimonial.photo_principale_url ?? undefined,
        slug: testimonial.slug ?? '',
        telephone: testimonial.telephone ?? undefined
      }));

      // Utiliser uniquement les vrais témoignages pour le listing public
      console.log('✅ Total témoignages réels disponibles:', normalizedRealTestimonials.length);

      setJeunesMaries(normalizedRealTestimonials);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des témoignages:', error);
      // En cas d'erreur, afficher une liste vide
      setJeunesMaries([]);
    } finally {
      setLoading(false);
    }
  };

  // Application des filtres - simple et robuste
  const applyFilters = () => {
    return jeunesMaries.filter(jeuneMarie => {
      // Filtre de recherche (nom ou lieu)
      const searchMatch = !filters.search || 
        jeuneMarie.nom_complet?.toLowerCase().includes(filters.search.toLowerCase()) ||
        jeuneMarie.lieu_mariage?.toLowerCase().includes(filters.search.toLowerCase());

      // Filtre par région  
      const regionMatch = filters.region === 'toutes' || 
        jeuneMarie.region?.toLowerCase().includes(filters.region.toLowerCase()) ||
        jeuneMarie.lieu_mariage?.toLowerCase().includes(filters.region.toLowerCase());

      // Filtre par budget
      let budgetMatch = true;
      if (filters.budget !== 'tous' && jeuneMarie.budget_approximatif) {
        budgetMatch = jeuneMarie.budget_approximatif === filters.budget;
      }

      // Filtre par note
      const noteMatch = filters.note === 0 || 
        (jeuneMarie.note_experience && jeuneMarie.note_experience >= filters.note);

      return searchMatch && regionMatch && budgetMatch && noteMatch;
    });
  };

  const getJeuneMariesBySlug = async (slug: string): Promise<JeuneMarie | null> => {
    try {
      // D'abord vérifier les témoignages fictifs
      const fakeTestimonial = staticFakeTestimonials.find(fake => fake.slug === slug);
      if (fakeTestimonial) {
        return fakeTestimonial;
      }

      // Puis vérifier les témoignages réels
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

  const filteredJeunesMaries = applyFilters();

  useEffect(() => {
    fetchJeunesMaries();
  }, []);

  return {
    jeunesMaries: filteredJeunesMaries,
    loading,
    filters,
    setFilters,
    fetchJeunesMaries,
    getJeuneMariesBySlug,
    submitJeuneMarie
  };
};
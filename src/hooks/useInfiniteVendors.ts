import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Prestataire = Database["public"]["Tables"]["prestataires_rows"]["Row"];
type RegionFrance = Database["public"]["Enums"]["region_france"];

interface VendorFilter {
  search: string;
  category: string;
  region: string | null;
  minPrice?: number;
  maxPrice?: number;
  categorieLieu?: string | null;
  capaciteMin?: number | null;
  hebergement?: boolean | null;
  couchages?: number | null;
}

interface UseInfiniteVendorsOptions {
  filters: VendorFilter;
  debouncedSearch: string;
  pageSize?: number;
  enabled?: boolean;
}

export const useInfiniteVendors = ({
  filters,
  debouncedSearch,
  pageSize = 12,
  enabled = true
}: UseInfiniteVendorsOptions) => {
  return useInfiniteQuery({
    queryKey: [
      'vendors-infinite',
      filters.category,
      filters.region,
      filters.minPrice,
      filters.maxPrice,
      filters.categorieLieu,
      filters.capaciteMin,
      filters.hebergement,
      filters.couchages,
      debouncedSearch,
      pageSize
    ],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('🚀 useInfiniteVendors - Loading page:', pageParam);
      
      let query = supabase
        .from('prestataires_rows')
        .select(`
          id,
          nom,
          description,
          ville,
          region,
          categorie,
          prix_a_partir_de,
          prix_par_personne,
          capacite_invites,
          hebergement_inclus,
          nombre_couchages,
          visible,
          featured,
          partner,
          slug,
          categorie_lieu
        `)
        .eq('visible', true)
        .order('featured', { ascending: false })
        .order('nom')
        .range(pageParam * pageSize, (pageParam + 1) * pageSize - 1);

      // Exclure les coordinateurs
      query = query.neq('categorie', 'Coordination');

      // Filtres de recherche
      if (debouncedSearch) {
        query = query.or(
          `nom.ilike.%${debouncedSearch}%,` +
          `ville.ilike.%${debouncedSearch}%,` +
          `description.ilike.%${debouncedSearch}%`
        );
      }

      if (filters.category && filters.category !== 'Tous') {
        query = query.eq('categorie', filters.category as Database["public"]["Enums"]["prestataire_categorie"]);
      }

      if (filters.region) {
        query = query.eq('region', filters.region as RegionFrance);
      }

      if (filters.minPrice) {
        query = query.or(`prix_a_partir_de.gte.${filters.minPrice},prix_par_personne.gte.${filters.minPrice}`);
      }

      if (filters.maxPrice) {
        query = query.or(`prix_a_partir_de.lte.${filters.maxPrice},prix_par_personne.lte.${filters.maxPrice}`);
      }

      // Filtres spécifiques aux lieux
      if (filters.category === 'Lieu de réception') {
        if (filters.categorieLieu) {
          query = query.eq('categorie_lieu', filters.categorieLieu);
        }
        if (filters.capaciteMin) {
          query = query.gte('capacite_invites', filters.capaciteMin);
        }
        if (filters.hebergement !== undefined) {
          query = query.eq('hebergement_inclus', filters.hebergement);
        }
        if (filters.couchages) {
          query = query.gte('nombre_couchages', filters.couchages);
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Erreur lors du chargement des prestataires:', error);
        throw new Error(error.message);
      }

      console.log(`✅ Page ${pageParam}: ${data?.length || 0} prestataires chargés`);
      return {
        data: data as Prestataire[],
        nextPage: data && data.length === pageSize ? pageParam + 1 : undefined,
        hasMore: data && data.length === pageSize
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled,
    refetchOnWindowFocus: false,
  });
};
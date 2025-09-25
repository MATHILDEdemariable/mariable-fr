import { useQuery } from '@tanstack/react-query';
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

interface UseOptimizedVendorsOptions {
  filters: VendorFilter;
  debouncedSearch: string;
  initialLimit?: number;
  enabled?: boolean;
}

interface VendorResult {
  vendors: Prestataire[];
  hasMore: boolean;
}

export const useOptimizedVendors = ({
  filters,
  debouncedSearch,
  initialLimit = 12,
  enabled = true
}: UseOptimizedVendorsOptions) => {
  return useQuery({
    queryKey: [
      'vendors-optimized',
      filters.category,
      filters.region,
      filters.minPrice,
      filters.maxPrice,
      filters.categorieLieu,
      filters.capaciteMin,
      filters.hebergement,
      filters.couchages,
      debouncedSearch,
      initialLimit
    ],
    queryFn: async (): Promise<VendorResult> => {
      console.log('🚀 useOptimizedVendors - Chargement optimisé des prestataires');
      
      // Étape 1 : Charger d'abord les données essentielles des prestataires (sans les photos)
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
        .limit(initialLimit + 1); // +1 pour détecter s'il y a plus de résultats

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

      console.log(`✅ ${data?.length || 0} prestataires chargés`);
      
      // Retourner les données avec information hasMore
      const hasMore = data && data.length > initialLimit;
      const vendors = hasMore ? data.slice(0, initialLimit) : data || [];
      
      return {
        vendors: vendors as Prestataire[],
        hasMore: hasMore || false
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Hook séparé pour charger les photos de manière lazy
export const useVendorPhotos = (vendorId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['vendor-photos', vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prestataires_photos_preprod')
        .select('url, ordre, principale, is_cover')
        .eq('prestataire_id', vendorId)
        .order('ordre')
        .limit(1); // Charger seulement la photo principale
      
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes de cache
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled,
    refetchOnWindowFocus: false,
  });
};
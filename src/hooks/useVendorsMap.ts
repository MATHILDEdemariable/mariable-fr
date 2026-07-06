import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type PrestataireCategorie = Database['public']['Enums']['prestataire_categorie'];

export interface MapVendor {
  id: string;
  nom: string;
  ville: string | null;
  categorie: PrestataireCategorie | null;
  slug: string | null;
  latitude: number;
  longitude: number;
  featured: boolean | null;
  partner: boolean | null;
}

interface Options {
  category: string;
  region: string | null;
  search: string;
}

export const useVendorsMap = ({ category, region, search }: Options) => {
  return useQuery({
    queryKey: ['vendors-map', category, region, search],
    queryFn: async (): Promise<MapVendor[]> => {
      let query = supabase
        .from('prestataires_rows')
        .select('id, nom, ville, categorie, slug, latitude, longitude, featured, partner')
        .eq('visible', true)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .limit(1000);

      if (category !== 'Coordination') {
        query = query.neq('categorie', 'Coordination');
      }
      if (category && category !== 'Tous') {
        query = query.eq('categorie', category as PrestataireCategorie);
      }
      if (region) {
        if (region === 'France entière') {
          query = query.filter('regions', 'cs', '["France entière"]');
        } else {
          query = query.or(`regions.cs.["${region}"],regions.cs.["France entière"]`);
        }
      }
      if (search) {
        query = query.or(`nom.ilike.%${search}%,ville.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data || []).filter((v: any) => v.latitude && v.longitude) as MapVendor[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};


import { Database } from '@/integrations/supabase/types';

type PrestataireCategorie = Database['public']['Enums']['prestataire_categorie'];
type RegionFrance = Database['public']['Enums']['region_france'];

export interface VendorFilter {
  search: string;
  category: PrestataireCategorie | 'Tous';
  region: RegionFrance | null;
  minPrice?: number;
  maxPrice?: number;
  categorieLieu?: string | null;
  capaciteMin?: number | null;
  hebergement?: boolean | null;
  couchages?: number | null;
}

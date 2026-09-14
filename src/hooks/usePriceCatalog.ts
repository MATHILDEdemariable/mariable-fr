import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PRICE_CATALOG_TEMPLATES } from '@/data/priceCatalogTemplates';

export interface PriceCatalogItem {
  id: string;
  user_id: string;
  category: string;
  name: string;
  description: string | null;
  base_price: number;
  price_unit: string;
  created_at: string;
  updated_at: string;
  /** Tarif standard du marché (lecture seule, non stocké en base) */
  is_standard: boolean;
}

// Tarifs standards affichés d'office, sans insertion en base
const STANDARD_ITEMS: PriceCatalogItem[] = PRICE_CATALOG_TEMPLATES.map((template, index) => ({
  id: `std-${index}`,
  user_id: 'standard',
  category: template.category,
  name: template.name,
  description: template.description ?? null,
  base_price: Number(template.base_price) || 0,
  price_unit: template.price_unit,
  created_at: '',
  updated_at: '',
  is_standard: true,
}));

export interface PriceCatalogInput {
  category: string;
  name: string;
  description?: string | null;
  base_price: number;
  price_unit: string;
}

const QUERY_KEY = ['price-catalog'];

export const usePriceCatalog = () => {
  const queryClient = useQueryClient();

  const { data: userItems = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<PriceCatalogItem[]> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];

      const { data, error } = await supabase
        .from('price_catalog')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ usePriceCatalog fetch failed:', error);
        throw error;
      }

      return (data || []).map(row => ({
        ...row,
        base_price: Number(row.base_price) || 0,
        is_standard: false,
      })) as PriceCatalogItem[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Les tarifs standards sont toujours disponibles, complétés par les tarifs personnels
  const items: PriceCatalogItem[] = [...STANDARD_ITEMS, ...userItems].sort((a, b) =>
    a.category === b.category ? a.name.localeCompare(b.name) : a.category.localeCompare(b.category)
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const createItem = useMutation({
    mutationFn: async (input: PriceCatalogInput) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('price_catalog')
        .insert({ ...input, user_id: userData.user.id });

      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...input }: PriceCatalogInput & { id: string }) => {
      const { error } = await supabase
        .from('price_catalog')
        .update(input)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('price_catalog').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { items, isLoading, createItem, updateItem, deleteItem };
};

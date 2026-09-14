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
}

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

  const { data: items = [], isLoading } = useQuery({
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

      return (data || []).map(row => ({ ...row, base_price: Number(row.base_price) || 0 })) as PriceCatalogItem[];
    },
    staleTime: 5 * 60 * 1000,
  });

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

  const loadStandardTemplates = useMutation({
    mutationFn: async (): Promise<number> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const existingNames = new Set(items.map(item => `${item.category}|${item.name.toLowerCase()}`));
      const toInsert = PRICE_CATALOG_TEMPLATES
        .filter(template => !existingNames.has(`${template.category}|${template.name.toLowerCase()}`))
        .map(template => ({ ...template, user_id: userData.user!.id }));

      if (toInsert.length === 0) return 0;

      const { error } = await supabase.from('price_catalog').insert(toInsert);
      if (error) throw error;

      return toInsert.length;
    },
    onSuccess: invalidate,
  });

  return { items, isLoading, createItem, updateItem, deleteItem, loadStandardTemplates };
};

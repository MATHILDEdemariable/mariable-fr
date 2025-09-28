import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Categorie = Database['public']['Enums']['prestataire_categorie'];
type Region = Database['public']['Enums']['region_france'];

interface VendorFilter {
  search: string;
  category: string;
  region: string | null;
  minPrice?: number;
  maxPrice?: number;
}

interface UsePaginatedVendorsOptions {
  filters: VendorFilter;
  debouncedSearch: string;
  pageSize?: number;
  enabled?: boolean;
}

export const usePaginatedVendors = ({
  filters,
  debouncedSearch,
  pageSize = 12,
  enabled = true
}: UsePaginatedVendorsOptions) => {
  const [allVendors, setAllVendors] = useState<any[]>([]);

  const queryKey = ['paginatedVendors', filters, debouncedSearch];

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      console.log('🚀 Fetching vendors page:', pageParam);
      
      let query = supabase
        .from('prestataires')
        .select(`
          id,
          nom,
          description,
          ville,
          prix_min,
          prix_max,
          categorie,
          region,
          capacite_min,
          capacite_max,
          note_moyenne,
          nombre_avis,
          telephone,
          email,
          site_web,
          instagram,
          facebook,
          linkedin,
          photos_urls,
          hebergement,
          nombre_lits,
          created_at
        `)
        .range(pageParam * pageSize, (pageParam + 1) * pageSize - 1);

      // Appliquer les filtres
      if (debouncedSearch) {
        query = query.or(`nom.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%,ville.ilike.%${debouncedSearch}%`);
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('categorie', filters.category as Categorie);
      }

      if (filters.region) {
        query = query.eq('region', filters.region as Region);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('prix_min', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('prix_max', filters.maxPrice);
      }

      const { data: vendors, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const hasMore = vendors?.length === pageSize;

      return {
        vendors: vendors || [],
        hasMore,
        page: pageParam
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 0,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fusionner toutes les pages dans allVendors
  useEffect(() => {
    if (data?.pages) {
      const flattenedVendors = data.pages.flatMap(page => page.vendors);
      setAllVendors(flattenedVendors);
    }
  }, [data]);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const reset = () => {
    setAllVendors([]);
  };

  return {
    vendors: allVendors,
    isLoading: isLoading,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore,
    reset,
    hasMore: hasNextPage,
    currentPage: data?.pages?.length || 0
  };
};
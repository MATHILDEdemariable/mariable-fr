import { useState } from 'react';
import { useOptimizedVendors } from './useOptimizedVendors';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [allVendors, setAllVendors] = useState<any[]>([]);

  const {
    data: vendors,
    isLoading,
    error
  } = useOptimizedVendors({
    filters,
    debouncedSearch,
    initialLimit: currentPage * pageSize,
    enabled
  });

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const reset = () => {
    setCurrentPage(1);
    setAllVendors([]);
  };

  const hasMore = vendors && vendors.length >= currentPage * pageSize;
  const isLoadingMore = isLoading && currentPage > 1;

  return {
    vendors: vendors || [],
    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error,
    loadMore,
    reset,
    hasMore,
    currentPage
  };
};
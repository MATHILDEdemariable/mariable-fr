import { useState } from 'react';
import { useOptimizedVendors } from './useOptimizedVendors';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [allVendors, setAllVendors] = useState<any[]>([]);

  const {
    data: vendorsData,
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
  };

  const vendors = vendorsData?.vendors || [];
  const hasMore = vendorsData?.hasMore || false;
  const isLoadingMore = isLoading && currentPage > 1;

  return {
    vendors,
    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error,
    loadMore,
    reset,
    hasMore,
    currentPage
  };
};
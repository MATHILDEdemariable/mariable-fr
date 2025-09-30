import { useState, useEffect } from 'react';
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

  // Accumuler les vendors au fur et à mesure
  useEffect(() => {
    if (vendorsData?.vendors) {
      if (currentPage === 1) {
        // Première page : remplacer tous les vendors
        setAllVendors(vendorsData.vendors);
      } else {
        // Pages suivantes : ajouter uniquement les nouveaux
        setAllVendors(prev => {
          const existingIds = new Set(prev.map(v => v.id));
          const newVendors = vendorsData.vendors.filter(v => !existingIds.has(v.id));
          return [...prev, ...newVendors];
        });
      }
    }
  }, [vendorsData, currentPage]);

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const reset = () => {
    setCurrentPage(1);
    setAllVendors([]);
  };

  const hasMore = vendorsData?.hasMore || false;
  const isLoadingMore = isLoading && currentPage > 1;

  return {
    vendors: allVendors,
    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error,
    loadMore,
    reset,
    hasMore,
    currentPage
  };
};
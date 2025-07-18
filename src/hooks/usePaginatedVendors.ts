
import { useState, useEffect } from 'react';
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
    console.log('📄 Loading more vendors - page:', currentPage + 1);
    setCurrentPage(prev => prev + 1);
    
    // Scroll smooth vers les nouveaux éléments après un petit délai
    setTimeout(() => {
      const container = document.querySelector('[data-vendors-container]');
      if (container) {
        const newItems = container.children[container.children.length - pageSize];
        if (newItems) {
          newItems.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);
  };

  // Reset seulement lors des changements de filtres de recherche (pas lors du loadMore)
  const reset = () => {
    console.log('🔄 Resetting pagination to page 1');
    setCurrentPage(1);
  };

  // Réinitialiser automatiquement quand les filtres changent
  useEffect(() => {
    reset();
  }, [filters.category, filters.region, debouncedSearch]);

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

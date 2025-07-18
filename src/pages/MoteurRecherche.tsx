import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import VendorCard from '@/components/VendorCard';
import VendorFilters from '@/components/VendorFilters';
import { usePaginatedVendors } from '@/hooks/usePaginatedVendors';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/toaster';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VendorCardSkeleton from '@/components/VendorCardSkeleton';
import SEO from '@/components/SEO';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Loader2 } from 'lucide-react';

const LazyVendorCard = ({ vendor }: { vendor: any }) => (
  <LazyLoadComponent effect="blur">
    <VendorCard vendor={vendor} />
  </LazyLoadComponent>
);

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

const MoteurRecherche = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filters, setFilters] = useState<VendorFilter>({
    search: '',
    category: '',
    region: null,
    minPrice: undefined,
    maxPrice: undefined,
    categorieLieu: null,
    capaciteMin: null,
    hebergement: null,
    couchages: null,
  });

  const {
    vendors,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
  } = usePaginatedVendors({
    filters,
    debouncedSearch,
    pageSize: 12,
    enabled: !!selectedRegion
  });

  // Removed the useEffect that was causing unwanted reset
  
  useEffect(() => {
    if (error) {
      console.error('Erreur lors du chargement des prestataires:', error);
      toast.error('Erreur lors du chargement des prestataires');
    }
  }, [error]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleRegionChange = (region: string | null) => {
    setSelectedRegion(region);
    setFilters(prev => ({ ...prev, region: region }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      region: null,
      minPrice: undefined,
      maxPrice: undefined,
      categorieLieu: null,
      capaciteMin: null,
      hebergement: null,
      couchages: null,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SEO 
        title="Recherche de prestataires de mariage | Mariable"
        description="Trouvez les meilleurs prestataires de mariage près de chez vous. Photographes, traiteurs, lieux de réception et plus encore."
        canonical="/prestataires"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-wedding-black mb-4">
            Trouvez le prestataire idéal pour votre mariage
          </h1>
          <p className="text-gray-600">
            Sélectionnez une région et commencez votre recherche parmi nos prestataires de mariage.
          </p>
        </div>

        <div className="mb-6">
          <Label htmlFor="regionSearch" className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher par région :
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              id="regionSearch"
              placeholder="Entrez une région (ex: Île-de-France)"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {selectedRegion && (
          <div className="space-y-6">
            <VendorFilters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VendorCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600">
                    {vendors.length} prestataire{vendors.length > 1 ? 's' : ''} trouvé{vendors.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div 
                  data-vendors-container
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {vendors.map((vendor) => (
                    <LazyVendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="bg-wedding-olive hover:bg-wedding-olive/90"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        'Charger plus de prestataires'
                      )}
                    </Button>
                  </div>
                )}

                {vendors.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      Aucun prestataire trouvé pour ces critères.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MoteurRecherche;

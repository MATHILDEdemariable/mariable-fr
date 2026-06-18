import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import VendorCard from '@/components/vendors/VendorCard';
import CoordinatorFilters, { CoordinatorFilter } from '@/components/coordinators/CoordinatorFilters';
import { toast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

type Prestataire = Database['public']['Tables']['prestataires_rows']['Row'];

const CoordinatorsPage = () => {
  const { t } = useTranslation('weddingDay');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [filters, setFilters] = useState<CoordinatorFilter>({
    search: searchParams.get('q') || '',
    region: searchParams.get('region'),
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const navigateToVendorDetails = (vendor: Prestataire) => {
    navigate(`/prestataire/${vendor.slug}`);
  };

  const handleWishlistAdd = (_vendor: Prestataire) => {};

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (filters.search) newParams.set('q', filters.search);
    if (filters.region) newParams.set('region', filters.region);
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters: Partial<CoordinatorFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const { data: coordinators, isLoading, error } = useQuery({
    queryKey: ['coordinators', filters.region, debouncedSearch],
    queryFn: async () => {
      let query = supabase
        .from('prestataires_rows')
        .select('*, prestataires_photos_preprod (*)')
        .eq('visible', true)
        .eq('categorie', 'Coordination')
        .order('featured', { ascending: false });

      if (debouncedSearch) {
        query = query.or(
          `nom.ilike.%${debouncedSearch}%,` +
          `ville.ilike.%${debouncedSearch}%,` +
          `description.ilike.%${debouncedSearch}%`
        );
      }

      if (filters.region) {
        query = query.contains('regions', [filters.region]);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data as Prestataire[];
    }
  });

  useEffect(() => {
    if (error) {
      toast({
        title: t('coordinators.errorTitle'),
        description: t('coordinators.loadError'),
        variant: "destructive",
      });
      console.error('Error fetching coordinators:', error);
    }
  }, [error, t]);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{t('coordinators.pageTitle')}</title>
        <meta name="description" content={t('coordinators.pageDescription')} />
      </Helmet>

      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 text-muted-foreground hover:text-wedding-olive transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('coordinators.back')}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif mb-2">{t('coordinators.title')}</h1>
          <p className="text-muted-foreground">{t('coordinators.subtitle')}</p>
        </div>

        <Button
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
          onClick={() => navigate('/professionnels')}
        >
          {t('coordinators.register')}
        </Button>
      </div>

      <div>
        <CoordinatorFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
        </div>
      ) : coordinators && coordinators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coordinators.map(coordinator => (
            <VendorCard
              key={coordinator.id}
              vendor={coordinator}
              onClick={navigateToVendorDetails}
              onWishlistAdd={handleWishlistAdd}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">{t('coordinators.noResults')}</h3>
          <p className="text-muted-foreground">{t('coordinators.noResultsDesc')}</p>
        </div>
      )}
    </div>
  );
};

export default CoordinatorsPage;

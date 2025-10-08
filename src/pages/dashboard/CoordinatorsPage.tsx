import React, { useState, useEffect } from 'react';
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
type RegionFrance = Database['public']['Enums']['region_france'];

const CoordinatorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [filters, setFilters] = useState<CoordinatorFilter>({
    search: searchParams.get('q') || '',
    region: searchParams.get('region'),
  });

  // Debounce pour la recherche
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  
  // Effet pour gérer le debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters.search]);
  
  const navigateToVendorDetails = (vendor: Prestataire) => {
    navigate(`/prestataire/${vendor.slug}`);
  };

  const handleWishlistAdd = (vendor: Prestataire) => {
    // Cette fonction sera déclenchée après l'ajout à la wishlist
  };
  
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (filters.search) newParams.set('q', filters.search);
    if (filters.region) newParams.set('region', filters.region);
    
    setSearchParams(newParams);
  }, [filters, setSearchParams]);
  
  const handleFilterChange = (newFilters: Partial<CoordinatorFilter>) => {
    console.log('New coordinator filters:', newFilters);
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
        .order('featured', { ascending: false })
      
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
        title: "Erreur",
        description: "Impossible de charger les coordinateurs. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error('Error fetching coordinators:', error);
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Coordinateurs de Mariage | Dashboard Mariable</title>
        <meta name="description" content="Trouvez le coordinateur de mariage idéal pour votre jour J depuis votre dashboard." />
      </Helmet>
      
      {/* Bouton retour et Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 text-muted-foreground hover:text-wedding-olive transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au dashboard
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif mb-2">Coordinateurs de Mariage</h1>
          <p className="text-muted-foreground">
            Trouvez le coordinateur idéal pour organiser votre jour J en toute sérénité
          </p>
        </div>
        
        <Button 
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
          onClick={() => navigate('/professionnels')}
        >
          Être référencé
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
          <h3 className="text-lg font-medium mb-2">Aucun coordinateur trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche pour obtenir plus de résultats.
          </p>
        </div>
      )}
    </div>
  );
};

export default CoordinatorsPage;
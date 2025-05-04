
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import VendorCard from '@/components/vendors/VendorCard';
import VendorFilters from '@/components/vendors/VendorFilters';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type Prestataire = Database['public']['Tables']['prestataires']['Row'];
type RegionFrance = Database['public']['Enums']['region_france'];

export interface VendorFilter {
  search: string;
  category: Database['public']['Enums']['prestataire_categorie'] | 'Tous';
  region: string | null;
  minPrice?: number;
  maxPrice?: number;
  // Filtres pour les lieux de réception
  categorieLieu?: string | null;
  capaciteMin?: number | null;
  hebergement?: boolean | null;
  couchages?: number | null;
}

const MoteurRecherche = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [filters, setFilters] = useState<VendorFilter>({
    search: searchParams.get('q') || '',
    category: (searchParams.get('category') as Database['public']['Enums']['prestataire_categorie']) || 'Tous',
    region: searchParams.get('region'),
    minPrice: searchParams.get('min') ? Number(searchParams.get('min')) : undefined,
    maxPrice: searchParams.get('max') ? Number(searchParams.get('max')) : undefined,
    categorieLieu: searchParams.get('categorieLieu'),
    capaciteMin: searchParams.get('capaciteMin') ? Number(searchParams.get('capaciteMin')) : undefined,
    hebergement: searchParams.get('hebergement') === 'true' ? true : undefined,
    couchages: searchParams.get('couchages') ? Number(searchParams.get('couchages')) : undefined,
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
    navigate(`/demo?id=${vendor.id}`);
  };

  const handleWishlistAdd = (vendor: Prestataire) => {
    // Cette fonction sera déclenchée après l'ajout à la wishlist
    // On peut simplement afficher une notification supplémentaire si nécessaire
  };
  
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (filters.search) newParams.set('q', filters.search);
    if (filters.category && filters.category !== 'Tous') newParams.set('category', filters.category);
    if (filters.region) newParams.set('region', filters.region);
    if (filters.minPrice) newParams.set('min', filters.minPrice.toString());
    if (filters.maxPrice) newParams.set('max', filters.maxPrice.toString());
    
    // Paramètres pour les lieux
    if (filters.categorieLieu) newParams.set('categorieLieu', filters.categorieLieu);
    if (filters.capaciteMin) newParams.set('capaciteMin', filters.capaciteMin.toString());
    if (filters.hebergement !== undefined) newParams.set('hebergement', filters.hebergement.toString());
    if (filters.couchages) newParams.set('couchages', filters.couchages.toString());
    
    setSearchParams(newParams);
  }, [filters, setSearchParams]);
  
  const handleFilterChange = (newFilters: Partial<VendorFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const { data: vendors, isLoading, error } = useQuery({
    queryKey: ['vendors', filters.category, filters.region, filters.minPrice, filters.maxPrice, 
               filters.categorieLieu, filters.capaciteMin, filters.hebergement, filters.couchages, debouncedSearch],
    queryFn: async () => {
      let query = supabase
        .from('prestataires')
        .select('*')
        .eq('visible', true);
      
      if (debouncedSearch) {
        // Recherche étendue sur plusieurs champs
        query = query.or(
          `nom.ilike.%${debouncedSearch}%,` +
          `ville.ilike.%${debouncedSearch}%,` +
          `region.ilike.%${debouncedSearch}%,` +
          `description.ilike.%${debouncedSearch}%`
        );
      }
      
      if (filters.category && filters.category !== 'Tous') {
        query = query.eq('categorie', filters.category);
      }
      
      if (filters.region) {
        // Utiliser une assertion de type pour assurer la compatibilité
        query = query.eq('region', filters.region as RegionFrance);
      }
      
      if (filters.minPrice) {
        query = query.or(`prix_a_partir_de.gte.${filters.minPrice},prix_par_personne.gte.${filters.minPrice}`);
      }
      
      if (filters.maxPrice) {
        query = query.or(`prix_a_partir_de.lte.${filters.maxPrice},prix_par_personne.lte.${filters.maxPrice}`);
      }
      
      // Filtres supplémentaires pour les lieux de réception
      if (filters.category === 'Lieu de réception') {
        if (filters.categorieLieu) {
          query = query.eq('categorie_lieu', filters.categorieLieu);
        }
        
        // Filtre simplifié pour la capacité
        if (filters.capaciteMin) {
          query = query.gte('capacite_invites', filters.capaciteMin);
        }
        
        if (filters.hebergement !== undefined) {
          query = query.eq('hebergement_inclus', filters.hebergement);
        }
        
        if (filters.couchages) {
          query = query.gte('nombre_couchages', filters.couchages);
        }
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
        description: "Impossible de charger les prestataires. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error('Error fetching vendors:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container max-w-7xl px-4 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-serif mb-2">Trouvez le prestataire idéal</h1>
        <p className="text-muted-foreground mb-6">
          Découvrez notre sélection de prestataires de qualité pour votre mariage
        </p>
        
        <div className="mb-8">
          <VendorFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
          </div>
        ) : vendors && vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map(vendor => (
              <VendorCard 
                key={vendor.id} 
                vendor={vendor} 
                onClick={navigateToVendorDetails}
                onWishlistAdd={handleWishlistAdd}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Aucun prestataire trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche pour obtenir plus de résultats.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MoteurRecherche;

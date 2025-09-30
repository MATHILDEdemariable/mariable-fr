
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import PremiumHeader from '@/components/home/PremiumHeader';
import VendorCard from '@/components/vendors/VendorCard';
import VendorCardSkeleton from '@/components/vendors/VendorCardSkeleton';
import LazyVendorCard from '@/components/vendors/LazyVendorCard';
import VendorFilters from '@/components/vendors/VendorFilters';
import { useOptimizedVendors } from '@/hooks/useOptimizedVendors';
import { usePaginatedVendors } from '@/hooks/usePaginatedVendors';
import { toast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Search, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import RegionSelectorPage, { slugToRegion, regionToSlug } from '@/components/search/RegionSelectorPage';
import { Helmet } from 'react-helmet-async';
import CarnetAdressesModal from '@/components/home/CarnetAdressesModal';

type Prestataire = Database['public']['Tables']['prestataires_rows']['Row'];
type RegionFrance = Database['public']['Enums']['region_france'];

export interface VendorFilter {
  search: string;
  category: Database['public']['Enums']['prestataire_categorie'] | 'Tous';
  region: string | null;
  minPrice?: number;
  maxPrice?: number;
}

const MoteurRecherche = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();
  const isMobile = useIsMobile();
  
  // Déterminer si on affiche la sélection de région ou les résultats
  const regionSlug = params.region;
  const selectedRegion = regionSlug ? slugToRegion(regionSlug) : null;
  const showRegionSelector = !regionSlug;
  const [isCarnetModalOpen, setIsCarnetModalOpen] = useState(false);
  
  const [filters, setFilters] = useState<VendorFilter>({
    search: searchParams.get('q') || '',
    category: (searchParams.get('category') as Database['public']['Enums']['prestataire_categorie']) || 'Tous',
    region: selectedRegion || null,
    minPrice: searchParams.get('min') ? Number(searchParams.get('min')) : undefined,
    maxPrice: searchParams.get('max') ? Number(searchParams.get('max')) : undefined,
  });

  // Synchroniser la région depuis l'URL avec les filtres
  useEffect(() => {
    if (selectedRegion !== filters.region) {
      setFilters(prev => ({ ...prev, region: selectedRegion }));
    }
  }, [selectedRegion, filters.region]);

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
    // On peut simplement afficher une notification supplémentaire si nécessaire
  };
  
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (filters.search) newParams.set('q', filters.search);
    if (filters.category && filters.category !== 'Tous') newParams.set('category', filters.category);
    if (filters.region) newParams.set('region', filters.region);
    if (filters.minPrice) newParams.set('min', filters.minPrice.toString());
    if (filters.maxPrice) newParams.set('max', filters.maxPrice.toString());
    
    setSearchParams(newParams);
  }, [filters, setSearchParams]);
  
  const handleFilterChange = (newFilters: Partial<VendorFilter>) => {
    console.log('New filters:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Utiliser le hook paginé pour de meilleures performances
  const { 
    vendors, 
    isLoading, 
    isLoadingMore, 
    error, 
    loadMore, 
    hasMore, 
    reset 
  } = usePaginatedVendors({
    filters,
    debouncedSearch,
    pageSize: 12,
    enabled: !!selectedRegion
  });

  // Reset pagination seulement quand les filtres de recherche changent (pas lors du chargement de plus)
  useEffect(() => {
    console.log('🔄 Filter changed, resetting pagination');
    reset();
  }, [filters.category, filters.region, debouncedSearch, reset]);
  
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

  // Génération du titre SEO
  const getPageTitle = () => {
    if (regionSlug === 'france-entiere') {
      return 'Prestataires Mariage France | Mariable';
    }
    if (selectedRegion) {
      return `Prestataires Mariage ${selectedRegion} | Mariable`;
    }
    return 'Choisissez votre région | Mariable';
  };

  const getMetaDescription = () => {
    if (regionSlug === 'france-entiere') {
      return 'Trouvez les meilleurs prestataires de mariage en France. Photographes, traiteurs, lieux de réception et plus encore.';
    }
    if (selectedRegion) {
      return `Découvrez les meilleurs prestataires de mariage en ${selectedRegion}. Sélection de qualité pour votre jour J.`;
    }
    return 'Sélectionnez votre région pour découvrir les meilleurs prestataires de mariage près de chez vous.';
  };

  const handleChangeRegion = () => {
    navigate('/selection');
  };

  if (showRegionSelector) {
    return (
      <div className="min-h-screen bg-white">
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Prestataires Mariage ${selectedRegion || 'France'}",
            "description": "${getMetaDescription()}",
            "numberOfItems": "${vendors?.length || 0}",
            "itemListElement": ${vendors ? JSON.stringify(vendors.slice(0, 10).map((vendor, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "LocalBusiness",
                "name": vendor.nom,
                "description": vendor.description,
                "address": {
                  "@type": "PostalAddress",
                  "addressRegion": vendor.region
                },
                "url": `https://www.mariable.fr/prestataire/${vendor.slug}`
              }
            }))) : '[]'}
          }
        `}</script>
      </Helmet>
        <PremiumHeader />
        <main className="container max-w-7xl px-4 pb-6 md:py-8" style={{ paddingTop: 'var(--header-h)' }}>
          <RegionSelectorPage />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
      </Helmet>
      <PremiumHeader />
      
      <main className="container max-w-7xl px-4 pb-6 md:py-8" style={{ paddingTop: 'var(--header-h)' }}>
        {/* Breadcrumb et bouton retour */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button 
            onClick={handleChangeRegion}
            className="flex items-center gap-1 text-muted-foreground hover:text-wedding-olive transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Changer de région
          </button>
          <span className="text-muted-foreground">•</span>
          <span className="text-wedding-olive font-medium">
            {regionSlug === 'france-entiere' ? 'France entière' : selectedRegion}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif mb-2">
              {regionSlug === 'france-entiere' 
                ? 'Prestataires de mariage en France' 
                : `Prestataires de mariage en ${selectedRegion}`
              }
            </h1>
            <p className="text-muted-foreground">
              Découvrez notre sélection de prestataires de qualité pour votre mariage
            </p>
          </div>
          
          <Button 
            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
            onClick={() => navigate('/professionnels')}
          >
            Être référencé
          </Button>
        </div>
        
        <div className="mb-8">
          <VendorFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
            {/* Message informatif pendant le chargement */}
            <div className="bg-wedding-olive/10 border border-wedding-olive/20 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Search className="h-5 w-5 text-wedding-olive" />
                <span className="font-medium text-wedding-olive">Recherche en cours...</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Nous recherchons les meilleurs prestataires de mariage en {selectedRegion}
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Filtrage par région et critères de qualité
              </div>
            </div>
            
            {/* Skeleton cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <VendorCardSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : vendors && vendors.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map(vendor => (
                <LazyVendorCard 
                  key={vendor.id} 
                  vendor={vendor} 
                  onClick={navigateToVendorDetails}
                  onWishlistAdd={handleWishlistAdd}
                />
              ))}
            </div>
            
            {/* Bouton "Charger plus" */}
            {hasMore && (
              <div className="flex justify-center pt-6" id="load-more-section">
                <Button
                  onClick={() => {
                    loadMore();
                    // Scroll smooth vers les nouveaux éléments après un délai
                    setTimeout(() => {
                      const loadMoreSection = document.getElementById('load-more-section');
                      if (loadMoreSection) {
                        loadMoreSection.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'center' 
                        });
                      }
                    }, 500);
                  }}
                  disabled={isLoadingMore}
                  variant="outline"
                  size="lg"
                  className="min-w-[200px]"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    'Charger plus de prestataires'
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="max-w-lg mx-auto">
              <h3 className="text-2xl font-serif mb-3 text-wedding-black">Aucun prestataire trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Nous n'avons pas trouvé de prestataires correspondant à vos critères.
                Recevez une sélection personnalisée par nos experts !
              </p>
              <Button 
                onClick={() => setIsCarnetModalOpen(true)}
                size="lg"
                className="bg-wedding-olive hover:bg-wedding-olive/90"
              >
                Recevoir une sélection personnalisée
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Réponse sous 48h • Gratuit et sans engagement
              </p>
            </div>
          </div>
        )}
      </main>
      
      <CarnetAdressesModal 
        isOpen={isCarnetModalOpen} 
        onClose={() => setIsCarnetModalOpen(false)} 
      />
    </div>
  );
};

export default MoteurRecherche;

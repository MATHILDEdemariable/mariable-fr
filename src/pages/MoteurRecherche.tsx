
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { VendorCard } from '@/components/vendors/VendorCard';
import VendorFilters from '@/components/vendors/VendorFilters';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type Prestataire = Database['public']['Tables']['prestataires']['Row'];

export interface VendorFilter {
  search: string;
  category: Database['public']['Enums']['prestataire_categorie'] | 'Tous';
  region: string | null;
  minPrice?: number;
  maxPrice?: number;
}

const MoteurRecherche = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  const [filters, setFilters] = useState<VendorFilter>({
    search: searchParams.get('q') || '',
    category: (searchParams.get('category') as Database['public']['Enums']['prestataire_categorie']) || 'Tous',
    region: searchParams.get('region'),
    minPrice: searchParams.get('min') ? Number(searchParams.get('min')) : undefined,
    maxPrice: searchParams.get('max') ? Number(searchParams.get('max')) : undefined,
  });
  
  // Fonction pour rediriger vers la page de détails
  const navigateToVendorDetails = (vendor: Prestataire) => {
    window.location.href = `/demo?id=${vendor.id}`;
  };
  
  // Actualiser les paramètres d'URL lorsque les filtres changent
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (filters.search) newParams.set('q', filters.search);
    if (filters.category && filters.category !== 'Tous') newParams.set('category', filters.category);
    if (filters.region) newParams.set('region', filters.region);
    if (filters.minPrice) newParams.set('min', filters.minPrice.toString());
    if (filters.maxPrice) newParams.set('max', filters.maxPrice.toString());
    
    setSearchParams(newParams);
  }, [filters, setSearchParams]);
  
  // Mettre à jour les filtres
  const handleFilterChange = (newFilters: Partial<VendorFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Requête à Supabase pour récupérer les prestataires filtrés
  const { data: vendors, isLoading, error } = useQuery({
    queryKey: ['vendors', filters],
    queryFn: async () => {
      let query = supabase
        .from('prestataires')
        .select('*')
        .eq('visible', true);
      
      // Appliquer les filtres
      if (filters.search) {
        query = query.ilike('nom', `%${filters.search}%`);
      }
      
      if (filters.category && filters.category !== 'Tous') {
        query = query.eq('categorie', filters.category);
      }
      
      if (filters.region) {
        query = query.eq('region', filters.region);
      }
      
      if (filters.minPrice) {
        query = query.or(`prix_a_partir_de.gte.${filters.minPrice},prix_par_personne.gte.${filters.minPrice}`);
      }
      
      if (filters.maxPrice) {
        query = query.or(`prix_a_partir_de.lte.${filters.maxPrice},prix_par_personne.lte.${filters.maxPrice}`);
      }
      
      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      return data as Prestataire[];
    }
  });
  
  // Gérer les erreurs
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
        
        {/* Filtres */}
        <div className="mb-8">
          <VendorFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {/* Liste des prestataires */}
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

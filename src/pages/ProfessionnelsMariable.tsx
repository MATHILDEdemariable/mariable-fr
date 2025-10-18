import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VendorCard from '@/components/vendors/VendorCard';
import { useOptimizedVendors } from '@/hooks/useOptimizedVendors';
import { useDebounce } from 'use-debounce';
import { Loader2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Database } from '@/integrations/supabase/types';

type PrestataireCategorie = Database['public']['Enums']['prestataire_categorie'];

const CATEGORIES: (PrestataireCategorie | 'Tous')[] = [
  'Tous',
  'Lieu de réception',
  'Traiteur',
  'Photographe',
  'Vidéaste',
  'DJ',
  'Fleuriste',
  'Décoration',
  'Mise en beauté',
  'Robe de mariée',
  'Voiture',
  'Invités',
  'Coordination'
];

const ITEMS_PER_PAGE = 12;

const REGIONS = [
  'France entière',
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  "Provence-Alpes-Côte d'Azur"
];

const ProfessionnelsMariable = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PrestataireCategorie | 'Tous'>('Tous');
  const [region, setRegion] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: vendorsData, isLoading } = useOptimizedVendors({
    filters: {
      search,
      category,
      region,
    },
    debouncedSearch,
    initialLimit: 1000, // Charger beaucoup pour la pagination côté client
  });

  const vendors = vendorsData?.vendors || [];
  const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVendors = vendors.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, category, region]);

  const handleReset = () => {
    setSearch('');
    setCategory('Tous');
    setRegion(null);
  };

  const hasActiveFilters = search || category !== 'Tous' || region;

  return (
    <>
      <Helmet>
        <title>Tous les Professionnels de Mariage | Mariable</title>
        <meta 
          name="description" 
          content="Découvrez notre sélection complète de prestataires de mariage : lieux de réception, traiteurs, photographes, DJ, fleuristes et plus encore. Trouvez les meilleurs professionnels pour votre mariage." 
        />
        <meta name="keywords" content="prestataires mariage, professionnels mariage, lieu réception, traiteur mariage, photographe mariage" />
      </Helmet>

      <PremiumHeader />
      
      <main className="min-h-screen bg-background pb-16" style={{ paddingTop: 'var(--header-h-premium)' }}>
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">
              Tous nos Professionnels
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Découvrez notre sélection complète de prestataires triés sur le volet pour votre mariage
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/selection')}
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
            >
              Matching intelligent
            </Button>
          </div>

          {/* Filtres */}
          <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom ou ville..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Catégorie */}
              <Select value={category} onValueChange={(value) => setCategory(value as PrestataireCategorie | 'Tous')}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Région */}
              <Select value={region || 'all'} onValueChange={(value) => setRegion(value === 'all' ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les régions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  {REGIONS.map((reg) => (
                    <SelectItem key={reg} value={reg}>
                      {reg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bouton Reset */}
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>

          {/* Compteur de résultats */}
          {!isLoading && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {vendors.length} {vendors.length > 1 ? 'prestataires trouvés' : 'prestataire trouvé'}
                {vendors.length > ITEMS_PER_PAGE && ` - Page ${currentPage} sur ${totalPages}`}
              </p>
            </div>
          )}

          {/* Liste des prestataires */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground mb-4">
                Aucun prestataire trouvé avec ces critères
              </p>
              <Button variant="outline" onClick={handleReset}>
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onClick={() => navigate(`/prestataire/${vendor.slug || vendor.id}`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      // Afficher seulement quelques pages autour de la page actuelle
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            className={currentPage === page ? "bg-wedding-olive hover:bg-wedding-olive/90" : ""}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 py-2">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProfessionnelsMariable;

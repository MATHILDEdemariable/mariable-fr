import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VendorCard from '@/components/vendors/VendorCard';
import { usePaginatedVendors } from '@/hooks/usePaginatedVendors';
import { useDebounce } from 'use-debounce';
import { Loader2, Search, X } from 'lucide-react';
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

const REGIONS = [
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
  const [debouncedSearch] = useDebounce(search, 500);

  const { vendors, isLoading, hasMore, loadMore } = usePaginatedVendors({
    filters: {
      search,
      category,
      region,
    },
    debouncedSearch,
    pageSize: 12,
  });

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
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">
              Tous nos Professionnels
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection complète de prestataires triés sur le volet pour votre mariage
            </p>
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
                {vendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onClick={() => navigate(`/prestataire/${vendor.slug || vendor.id}`)}
                  />
                ))}
              </div>

              {/* Bouton Charger plus */}
              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    onClick={loadMore}
                    variant="outline"
                    size="lg"
                    className="min-w-[200px]"
                  >
                    Charger plus
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

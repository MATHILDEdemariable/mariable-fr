import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SimpleHeader from '@/components/SimpleHeader';
import { Button } from '@/components/ui/button';
import { useOptimizedVendors } from '@/hooks/useOptimizedVendors';
import VendorCardInChat from '@/components/vibe-wedding/VendorCardInChat';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

const CATEGORIES = [
  'Lieu de réception',
  'Traiteur',
  'Photographe',
  'Vidéaste',
  'Fleuriste',
  'DJ & Animation',
  'Wedding Planner',
  'Coiffure & Maquillage',
  'Décoration',
  'Voiture de mariage'
];

const REGIONS = [
  'France entière',
  'Île-de-France',
  'Provence-Alpes-Côte d\'Azur',
  'Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Hauts-de-France',
  'Normandie',
  'Grand Est',
  'Bretagne',
  'Pays de la Loire',
  'Centre-Val de Loire',
  'Bourgogne-Franche-Comté',
  'Corse'
];

const Selection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const result = useOptimizedVendors({
    debouncedSearch: '',
    filters: {
      search: '',
      category: selectedCategory || undefined,
      region: selectedRegion || undefined
    }
  });

  const vendors = result.data?.vendors || [];
  const hasMore = result.data?.hasMore || false;

  return (
    <>
      <Helmet>
        <title>Sélection de Prestataires | Mariable</title>
        <meta 
          name="description" 
          content="Découvrez notre sélection complète de prestataires de mariage pour votre grand jour." 
        />
      </Helmet>

      <SimpleHeader />

      <div className="min-h-screen bg-background pb-12" style={{ paddingTop: 'var(--header-h-simple)' }}>
        <div className="container max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif text-wedding-charcoal mb-3">
              Nos Prestataires de Mariage
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez les meilleurs professionnels pour votre mariage, sélectionnés avec soin
            </p>
          </div>

          {/* Filtres */}
          <div className="bg-card border border-border rounded-lg p-4 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-wedding-olive" />
              <h2 className="font-semibold">Filtres</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Filtre Catégorie */}
              <div>
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les catégories</SelectItem>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre Région */}
              <div>
                <label className="text-sm font-medium mb-2 block">Région</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les régions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les régions</SelectItem>
                    {REGIONS.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bouton reset */}
            {(selectedCategory || selectedRegion) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedRegion('');
                }}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>

          {/* Liste des prestataires */}
          {vendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map(vendor => (
                <VendorCardInChat key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-2">
                Aucun prestataire trouvé avec ces critères
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedRegion('');
                }}
              >
                Afficher tous les prestataires
              </Button>
            </div>
          )}

          {/* Indicateur "plus de résultats" */}
          {hasMore && vendors.length > 0 && (
            <p className="text-center text-sm text-muted-foreground mt-8">
              Affinez vos critères pour voir plus de résultats
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Selection;

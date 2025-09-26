import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Database } from '@/integrations/supabase/types';
import { Search, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { VendorFilter } from '@/pages/MoteurRecherche';


type PrestataireCategorie = Database['public']['Enums']['prestataire_categorie'];

interface VendorFiltersProps {
  filters: VendorFilter;
  onFilterChange: (newFilters: Partial<VendorFilter>) => void;
}


const CATEGORIES: (PrestataireCategorie | 'Tous')[] = [
  "Tous",
  "Lieu de réception",
  "Traiteur",
  "Photographe",
  "Vidéaste",
  "DJ",
  "Fleuriste",
  "Robe de mariée",
  "Décoration"
];

const VendorFilters: React.FC<VendorFiltersProps> = ({ filters, onFilterChange }) => {
  const isMobile = useIsMobile();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 10000
  ]);
  
  // Optimisation avec useMemo pour les calculs coûteux
  const hasActiveFilters = useMemo(() => 
    filters.category !== 'Tous' || 
    filters.minPrice !== undefined || 
    filters.maxPrice !== undefined,
    [filters]
  );
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  const applyPriceFilter = () => {
    onFilterChange({ 
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });
  };
  
  const resetFilters = () => {
    onFilterChange({
      search: '',
      category: 'Tous',
      minPrice: undefined,
      maxPrice: undefined,
    });
    setPriceRange([0, 10000]);
  };

  

  return (
    <div className="space-y-4 bg-white">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, ville, région ou description..."
          className="pl-10"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>
      
      {/* Filtres desktop */}
      {!isMobile && (
        <div className="flex flex-wrap gap-3 items-center">
          {/* Catégorie */}
          <div className="w-[200px]">
            <Select
              value={filters.category}
              onValueChange={(value) => onFilterChange({ category: value as PrestataireCategorie | 'Tous' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les prestataires</SelectItem>
                {CATEGORIES.filter(category => category !== 'Tous').map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          
          {/* Prix */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[120px]">
                Budget
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Prix</h4>
                <div className="py-4">
                  <Slider
                    defaultValue={[priceRange[0], priceRange[1]]}
                    max={10000}
                    step={100}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={handlePriceChange}
                  />
                </div>
                <div className="flex justify-between">
                  <p>Min: {priceRange[0]}€</p>
                  <p>Max: {priceRange[1]}€</p>
                </div>
                <Button className="w-full bg-wedding-olive hover:bg-wedding-olive/90" onClick={applyPriceFilter}>
                  Appliquer
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Réinitialiser les filtres */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="flex items-center gap-1">
              <X className="h-4 w-4" /> Réinitialiser
            </Button>
          )}

        </div>
      )}

      
      {/* Filtres mobile (bouton) */}
      {isMobile && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button className="bg-wedding-olive hover:bg-wedding-olive/90 shadow-md">
                Filtres
                {hasActiveFilters && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-white text-xs text-wedding-olive flex items-center justify-center font-medium">
                    !
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-screen max-w-[95vw] p-4" align="center">
              <div className="space-y-4">
                <h4 className="font-medium">Filtres</h4>
                
                {/* Catégorie */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Catégorie</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => onFilterChange({ category: value as PrestataireCategorie | 'Tous' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tous">Tous les prestataires</SelectItem>
                      {CATEGORIES.filter(category => category !== 'Tous').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                
                {/* Prix */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Budget</label>
                    <span className="text-sm text-muted-foreground">
                      {priceRange[0]}€ - {priceRange[1]}€
                    </span>
                  </div>
                  <Slider
                    defaultValue={[priceRange[0], priceRange[1]]}
                    max={10000}
                    step={100}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={handlePriceChange}
                  />
                </div>

                
                <div className="flex gap-2 pt-2">
                  {hasActiveFilters && (
                    <Button variant="outline" className="flex-1" onClick={resetFilters}>
                      Réinitialiser
                    </Button>
                  )}
                  <Button 
                    className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90" 
                    onClick={() => {
                      applyPriceFilter();
                      setIsFiltersOpen(false);
                    }}
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default VendorFilters;

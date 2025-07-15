import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';

export interface CoordinatorFilter {
  search: string;
  region: string | null;
}

interface CoordinatorFiltersProps {
  filters: CoordinatorFilter;
  onFilterChange: (newFilters: Partial<CoordinatorFilter>) => void;
}

const REGIONS = [
  "Auvergne-Rhône-Alpes",
  "Bourgogne-Franche-Comté",
  "Bretagne",
  "Centre-Val de Loire",
  "Corse",
  "Grand Est",
  "Hauts-de-France",
  "Île-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire", 
  "Provence-Alpes-Côte d'Azur"
];

const CoordinatorFilters: React.FC<CoordinatorFiltersProps> = ({ filters, onFilterChange }) => {
  const isMobile = useIsMobile();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const hasActiveFilters = filters.region !== null;
  
  const resetFilters = () => {
    onFilterChange({
      search: '',
      region: null,
    });
  };

  return (
    <div className="space-y-4 bg-white">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, ville ou région..."
          className="pl-10"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>
      
      {/* Filtres desktop */}
      {!isMobile && (
        <div className="flex flex-wrap gap-3 items-center">
          {/* Région */}
          <div className="w-[200px]">
            <Select
              value={filters.region || 'all-regions'}
              onValueChange={(value) => onFilterChange({ region: value === 'all-regions' ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-regions">Toutes les régions</SelectItem>
                {REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
                <Filter className="h-4 w-4 mr-2" />
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
                
                {/* Région */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Région</label>
                  <Select
                    value={filters.region || 'all-regions'}
                    onValueChange={(value) => onFilterChange({ region: value === 'all-regions' ? null : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Région" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-regions">Toutes les régions</SelectItem>
                      {REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-2">
                  {hasActiveFilters && (
                    <Button variant="outline" className="flex-1" onClick={resetFilters}>
                      Réinitialiser
                    </Button>
                  )}
                  <Button 
                    className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90" 
                    onClick={() => setIsFiltersOpen(false)}
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

export default CoordinatorFilters;
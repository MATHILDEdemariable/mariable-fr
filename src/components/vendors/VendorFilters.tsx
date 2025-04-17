
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { VendorCategory, VendorFilter } from '@/types/airtable';

interface VendorFiltersProps {
  filters: VendorFilter;
  onFilterChange: (newFilters: Partial<VendorFilter>) => void;
}

const CATEGORIES: VendorCategory[] = [
  "Tous",
  "Lieu de réception",
  "Traiteur",
  "Photographe",
  "Vidéaste",
  "Coordination",
  "DJ",
  "Fleuriste",
  "Robe de mariée",
  "Décoration"
];

const REGIONS = [
  "Centre-Val-de-Loire",
  "Île-de-France",
  "Normandie",
  "Bretagne",
  "Pays de la Loire"
];

const VendorFilters: React.FC<VendorFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par mot-clé"
          className="pl-10"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select
            value={filters.category || "Tous"}
            onValueChange={(value) => onFilterChange({ category: value as VendorCategory })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select
            value={filters.region || ""}
            onValueChange={(value) => onFilterChange({ region: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les régions</SelectItem>
              {REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default VendorFilters;

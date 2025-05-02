
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from '@/integrations/supabase/types';

type PrestataireCategorie = Database['public']['Enums']['prestataire_categorie'];

interface BasicFiltersProps {
  category: string;
  region: string | null;
  onCategoryChange: (category: PrestataireCategorie | 'Tous') => void;
  onRegionChange: (region: string | null) => void;
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

const CATEGORIES: (PrestataireCategorie | 'Tous')[] = [
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

const BasicFilters: React.FC<BasicFiltersProps> = ({ 
  category, 
  region, 
  onCategoryChange, 
  onRegionChange 
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Catégorie */}
      <div className="w-[200px]">
        <Select
          value={category}
          onValueChange={(value) => onCategoryChange(value as PrestataireCategorie | 'Tous')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Région */}
      <div className="w-[200px]">
        <Select
          value={region || 'all-regions'}
          onValueChange={(value) => onRegionChange(value === 'all-regions' ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-regions">Toutes les régions</SelectItem>
            {REGIONS.map((reg) => (
              <SelectItem key={reg} value={reg}>
                {reg}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BasicFilters;

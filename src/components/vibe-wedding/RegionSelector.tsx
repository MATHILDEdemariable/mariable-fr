import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface RegionSelectorProps {
  onSelectRegion: (region: string) => void;
}

const FRENCH_REGIONS = [
  { name: 'Île-de-France', value: 'Île-de-France' },
  { name: 'Provence-Alpes-Côte d\'Azur', value: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Auvergne-Rhône-Alpes', value: 'Auvergne-Rhône-Alpes' },
  { name: 'Nouvelle-Aquitaine', value: 'Nouvelle-Aquitaine' },
  { name: 'Occitanie', value: 'Occitanie' },
  { name: 'Hauts-de-France', value: 'Hauts-de-France' },
  { name: 'Normandie', value: 'Normandie' },
  { name: 'Grand Est', value: 'Grand Est' },
  { name: 'Bretagne', value: 'Bretagne' },
  { name: 'Pays de la Loire', value: 'Pays de la Loire' },
  { name: 'Centre-Val de Loire', value: 'Centre-Val de Loire' },
  { name: 'Bourgogne-Franche-Comté', value: 'Bourgogne-Franche-Comté' },
  { name: 'Corse', value: 'Corse' },
];

const RegionSelector: React.FC<RegionSelectorProps> = ({ onSelectRegion }) => {
  return (
    <div className="my-4 p-5 bg-gradient-to-br from-wedding-blush/20 to-wedding-olive/10 rounded-xl border-2 border-wedding-blush/30 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <MapPin className="w-5 h-5 text-wedding-olive" />
        </div>
        <div>
          <p className="text-base font-semibold text-wedding-charcoal">
            📍 Sélectionnez votre région
          </p>
          <p className="text-xs text-muted-foreground">
            Pour trouver les meilleurs prestataires près de chez vous
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {FRENCH_REGIONS.map((region) => (
          <Button
            key={region.value}
            onClick={() => onSelectRegion(region.value)}
            variant="outline"
            size="sm"
            className="justify-center text-center h-auto py-2.5 px-2 hover:bg-wedding-olive/20 hover:border-wedding-olive hover:scale-105 transition-all text-xs leading-tight"
          >
            <span className="line-clamp-2">{region.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RegionSelector;

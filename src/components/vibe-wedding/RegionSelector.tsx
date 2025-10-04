import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface RegionSelectorProps {
  onSelectRegion: (region: string) => void;
}

const FRENCH_REGIONS = [
  { name: 'Île-de-France', value: 'île-de-france' },
  { name: 'Provence-Alpes-Côte d\'Azur', value: 'provence-alpes-côte d\'azur' },
  { name: 'Auvergne-Rhône-Alpes', value: 'auvergne-rhône-alpes' },
  { name: 'Nouvelle-Aquitaine', value: 'nouvelle-aquitaine' },
  { name: 'Occitanie', value: 'occitanie' },
  { name: 'Hauts-de-France', value: 'hauts-de-france' },
  { name: 'Normandie', value: 'normandie' },
  { name: 'Grand Est', value: 'grand est' },
  { name: 'Bretagne', value: 'bretagne' },
  { name: 'Pays de la Loire', value: 'pays de la loire' },
  { name: 'Centre-Val de Loire', value: 'centre-val de loire' },
  { name: 'Bourgogne-Franche-Comté', value: 'bourgogne-franche-comté' },
  { name: 'Corse', value: 'corse' },
];

const RegionSelector: React.FC<RegionSelectorProps> = ({ onSelectRegion }) => {
  return (
    <div className="my-4 p-4 bg-wedding-blush/10 rounded-lg border border-wedding-blush/20">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-wedding-olive" />
        <p className="text-sm font-medium text-wedding-charcoal">
          Sélectionnez votre région :
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {FRENCH_REGIONS.map((region) => (
          <Button
            key={region.value}
            onClick={() => onSelectRegion(region.value)}
            variant="outline"
            size="sm"
            className="justify-start text-left hover:bg-wedding-olive/10 hover:border-wedding-olive"
          >
            {region.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RegionSelector;

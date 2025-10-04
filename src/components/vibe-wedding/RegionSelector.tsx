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
            className="justify-start text-left h-auto py-2 px-3 hover:bg-wedding-olive/20 hover:border-wedding-olive hover:scale-105 transition-all"
          >
            {region.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RegionSelector;

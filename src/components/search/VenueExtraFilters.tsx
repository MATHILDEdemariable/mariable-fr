
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VenueCapacitySelector from './VenueCapacitySelector';

interface VenueExtraFiltersProps {
  onFilterChange: (filters: {
    categorieLieu?: string | null;
    capaciteMin?: number | null;
    hebergement?: boolean | null;
    couchages?: number | null;
  }) => void;
}

const LIEU_CATEGORIES = [
  'Château', 'Domaine', 'Ferme', 'Mas', 'Villa', 'Hôtel', 'Restaurant', 'Salle de réception', 'Autre'
];

const VenueExtraFilters: React.FC<VenueExtraFiltersProps> = ({ onFilterChange }) => {
  const [categorieLieu, setCategorieLieu] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<string>('');
  const [hebergementInclus, setHebergementInclus] = useState<boolean>(false);
  const [nombreCouchages, setNombreCouchages] = useState<string>('');

  const handleCategorieLieuChange = (value: string) => {
    setCategorieLieu(value);
    onFilterChange({ categorieLieu: value });
  };

  const handleCapacityChange = (value: string) => {
    setCapacity(value);
    const capacityVal = value ? parseInt(value, 10) : null;
    onFilterChange({ capaciteMin: capacityVal });
  };

  const handleHebergementChange = (checked: boolean) => {
    setHebergementInclus(checked);
    onFilterChange({ hebergement: checked });
  };

  const handleCouchagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombreCouchages(value);
    onFilterChange({ couchages: value ? parseInt(value, 10) : null });
  };

  return (
    <div className="space-y-4 p-3 bg-wedding-cream/20 rounded-md border border-wedding-olive/10">
      <h3 className="text-sm font-medium">Filtres spécifiques aux lieux</h3>
      
      {/* Catégorie de lieu */}
      <div>
        <Label className="text-xs">Type de lieu</Label>
        <Select
          value={categorieLieu || 'all-types'}
          onValueChange={handleCategorieLieuChange}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Tous les types de lieu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">Tous les types</SelectItem>
            {LIEU_CATEGORIES.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Capacité d'invités - utilise maintenant un simple Input */}
      <VenueCapacitySelector 
        capacity={capacity}
        onCapacityChange={handleCapacityChange}
      />
      
      {/* Hébergement inclus */}
      <div className="flex items-center justify-between">
        <Label className="text-xs cursor-pointer" htmlFor="hebergement">
          Hébergement sur place
        </Label>
        <Switch
          id="hebergement"
          checked={hebergementInclus}
          onCheckedChange={handleHebergementChange}
        />
      </div>
      
      {/* Nombre de couchages (visible uniquement si hébergement est activé) */}
      {hebergementInclus && (
        <div>
          <Label className="text-xs">Nombre minimum de couchages</Label>
          <Input
            type="number"
            placeholder="Ex: 10"
            className="mt-1"
            value={nombreCouchages}
            onChange={handleCouchagesChange}
            min="0"
          />
        </div>
      )}
    </div>
  );
};

export default VenueExtraFilters;

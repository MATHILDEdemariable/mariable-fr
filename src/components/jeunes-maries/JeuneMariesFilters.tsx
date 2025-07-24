import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';
import { JeuneMariesFilters } from '@/types/jeunes-maries';

interface JeuneMariesFiltersProps {
  filters: JeuneMariesFilters;
  onFilterChange: (key: keyof JeuneMariesFilters, value: string | number) => void;
  onReset: () => void;
}

const budgetOptions = [
  { value: '', label: 'Tous budgets' },
  { value: 'Moins de 10 000€', label: 'Moins de 10 000€' },
  { value: '10 000€ - 20 000€', label: '10 000€ - 20 000€' },
  { value: '20 000€ - 30 000€', label: '20 000€ - 30 000€' },
  { value: '30 000€ - 50 000€', label: '30 000€ - 50 000€' },
  { value: 'Plus de 50 000€', label: 'Plus de 50 000€' }
];

const regionOptions = [
  { value: '', label: 'Toutes régions' },
  { value: 'Île-de-France', label: 'Île-de-France' },
  { value: 'Provence-Alpes-Côte d\'Azur', label: 'Provence-Alpes-Côte d\'Azur' },
  { value: 'Auvergne-Rhône-Alpes', label: 'Auvergne-Rhône-Alpes' },
  { value: 'Nouvelle-Aquitaine', label: 'Nouvelle-Aquitaine' },
  { value: 'Occitanie', label: 'Occitanie' },
  { value: 'Grand Est', label: 'Grand Est' },
  { value: 'Hauts-de-France', label: 'Hauts-de-France' },
  { value: 'Pays de la Loire', label: 'Pays de la Loire' },
  { value: 'Bretagne', label: 'Bretagne' },
  { value: 'Normandie', label: 'Normandie' }
];

const noteOptions = [
  { value: '0', label: 'Toutes notes' },
  { value: '4', label: '4 étoiles et plus' },
  { value: '5', label: '5 étoiles uniquement' }
];

export const JeuneMariesFiltersComponent: React.FC<JeuneMariesFiltersProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-wedding-olive">Filtres</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-wedding-olive border-wedding-olive/30"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Recherche</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nom ou lieu..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Région</label>
          <Select
            value={filters.region}
            onValueChange={(value) => onFilterChange('region', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une région" />
            </SelectTrigger>
            <SelectContent>
              {regionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Budget</label>
          <Select
            value={filters.budget}
            onValueChange={(value) => onFilterChange('budget', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un budget" />
            </SelectTrigger>
            <SelectContent>
              {budgetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Note d'expérience</label>
          <Select
            value={filters.note.toString()}
            onValueChange={(value) => onFilterChange('note', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une note" />
            </SelectTrigger>
            <SelectContent>
              {noteOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface PrestataireCRMFiltersProps {
  filters: {
    statusCrm: string;
    search: string;
    category: string;
    region: string;
    sourceInscription: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

const PrestataireCRMFilters: React.FC<PrestataireCRMFiltersProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  const crmStatuses = [
    { value: 'acquisition', label: 'À contacter' },
    { value: 'contacted', label: 'Contacté' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'relance_1', label: 'Relance 1' },
    { value: 'relance_2', label: 'Relance 2' },
    { value: 'called', label: 'Appelé' },
    { value: 'waiting', label: 'En attente' },
    { value: 'other', label: 'Autre' }
  ];

  const categories = [
    { value: 'lieu', label: 'Lieu' },
    { value: 'photographe', label: 'Photographe' },
    { value: 'traiteur', label: 'Traiteur' },
    { value: 'fleuriste', label: 'Fleuriste' },
    { value: 'musique', label: 'Musique' },
    { value: 'decoration', label: 'Décoration' },
    { value: 'transport', label: 'Transport' },
    { value: 'autre', label: 'Autre' }
  ];

  const regions = [
    { value: 'ile_de_france', label: 'Île-de-France' },
    { value: 'provence_alpes_cote_azur', label: 'Provence-Alpes-Côte d\'Azur' },
    { value: 'occitanie', label: 'Occitanie' },
    { value: 'nouvelle_aquitaine', label: 'Nouvelle-Aquitaine' },
    { value: 'auvergne_rhone_alpes', label: 'Auvergne-Rhône-Alpes' },
    { value: 'autre', label: 'Autre' }
  ];

  const sourcesInscription = [
    { value: 'formulaire', label: 'Formulaire web' },
    { value: 'manuel', label: 'Ajout manuel admin' },
    { value: 'import', label: 'Import externe' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-wedding-olive" />
        <h3 className="font-semibold text-lg">Filtres CRM</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div>
          <Label htmlFor="search">Recherche</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Nom, email, ville..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status-crm">Statut CRM</Label>
          <Select value={filters.statusCrm} onValueChange={(value) => onFilterChange('statusCrm', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {crmStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="region">Région</Label>
          <Select value={filters.region} onValueChange={(value) => onFilterChange('region', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les régions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="source-inscription">Source inscription</Label>
          <Select value={filters.sourceInscription} onValueChange={(value) => onFilterChange('sourceInscription', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sources</SelectItem>
              {sourcesInscription.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default PrestataireCRMFilters;

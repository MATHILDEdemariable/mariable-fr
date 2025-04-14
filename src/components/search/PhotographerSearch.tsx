
import React, { useState } from 'react';
import { Map, Euro } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';

// Liste des régions françaises
const regions = [
  "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", 
  "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", 
  "Île-de-France", "Normandie", "Nouvelle-Aquitaine", 
  "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"
];

const PhotographerSearch = () => {
  const [serviceType, setServiceType] = useState<string[]>([]);
  const [region, setRegion] = useState<string | null>(null);
  const [budget, setBudget] = useState<number[]>([33]);

  const budgetLabels = ["< 1 000 €", "1 000 € - 2 000 €", "> 2 000 €"];
  const getBudgetLabel = (value: number) => {
    if (value <= 33) return budgetLabels[0];
    if (value <= 66) return budgetLabels[1];
    return budgetLabels[2];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Type de prestataire</label>
        <ToggleGroup 
          type="multiple" 
          variant="outline"
          className="flex flex-wrap gap-2"
          value={serviceType}
          onValueChange={(value) => setServiceType(value as string[])}
        >
          <ToggleGroupItem value="photographe" className="rounded-full border-wedding-black/20">Photographe</ToggleGroupItem>
          <ToggleGroupItem value="videaste" className="rounded-full border-wedding-black/20">Vidéaste</ToggleGroupItem>
          <ToggleGroupItem value="drone" className="rounded-full border-wedding-black/20">Drone</ToggleGroupItem>
          <ToggleGroupItem value="creator" className="rounded-full border-wedding-black/20">Wedding content creator</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <Map className="inline-block w-4 h-4 mr-1" /> Région
        </label>
        <select 
          className="w-full p-2 rounded-md border border-wedding-black/20 bg-white"
          value={region || ''}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">Toutes les régions</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2">Budget</label>
        <div className="px-2">
          <Slider 
            defaultValue={[33]} 
            max={100} 
            step={33}
            onValueChange={(value) => setBudget(value)}
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {budgetLabels.map((label, i) => (
              <span key={i} className={`${budget[0] >= i * 33 && budget[0] <= (i + 1) * 33 ? 'font-bold text-wedding-black' : ''}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerSearch;

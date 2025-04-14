
import React, { useState } from 'react';
import { Calendar, Map, Users, Hotel, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Liste des régions françaises
const regions = [
  "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", 
  "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", 
  "Île-de-France", "Normandie", "Nouvelle-Aquitaine", 
  "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"
];

const VenueSearch = () => {
  const [venueTypes, setVenueTypes] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState<number>(50);
  const [accommodation, setAccommodation] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [budget, setBudget] = useState<number[]>([5000]);

  const budgetLabels = ["< 5 000 €", "5 000 € - 10 000 €", "> 10 000 €"];
  const getBudgetLabel = (value: number) => {
    if (value <= 33) return budgetLabels[0];
    if (value <= 66) return budgetLabels[1];
    return budgetLabels[2];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Style recherché</label>
        <ToggleGroup 
          type="multiple" 
          variant="outline"
          className="flex flex-wrap gap-2"
          value={venueTypes}
          onValueChange={(value) => setVenueTypes(value as string[])}
        >
          <ToggleGroupItem value="chateau" className="rounded-full border-wedding-black/20">Château</ToggleGroupItem>
          <ToggleGroupItem value="ferme" className="rounded-full border-wedding-black/20">Ferme</ToggleGroupItem>
          <ToggleGroupItem value="domaine" className="rounded-full border-wedding-black/20">Domaine</ToggleGroupItem>
          <ToggleGroupItem value="restaurant" className="rounded-full border-wedding-black/20">Restaurant/Hôtel</ToggleGroupItem>
          <ToggleGroupItem value="autre" className="rounded-full border-wedding-black/20">Autres</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
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

      <div>
        <label className="block text-sm font-medium mb-2">
          <Calendar className="inline-block w-4 h-4 mr-1" /> Date souhaitée
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal border-wedding-black/20">
              {date ? format(date, 'PP', { locale: fr }) : 'Sélectionner une date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <Hotel className="inline-block w-4 h-4 mr-1" /> Hébergement
        </label>
        <ToggleGroup 
          type="single" 
          variant="outline"
          className="flex gap-2"
          value={accommodation || ''}
          onValueChange={(value) => value && setAccommodation(value)}
        >
          <ToggleGroupItem value="oui" className="flex-1 rounded-full border-wedding-black/20">Oui</ToggleGroupItem>
          <ToggleGroupItem value="non" className="flex-1 rounded-full border-wedding-black/20">Non</ToggleGroupItem>
          <ToggleGroupItem value="peu-importe" className="flex-1 rounded-full border-wedding-black/20">Peu importe</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <Users className="inline-block w-4 h-4 mr-1" /> Nombre d'invités
        </label>
        <div className="px-2">
          <Slider 
            defaultValue={[50]} 
            min={10}
            max={300}
            step={10}
            onValueChange={(value) => setGuestCount(value[0])}
          />
          <div className="text-center mt-2 text-sm font-medium">
            {guestCount} personnes
          </div>
        </div>
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
    </div>
  );
};

export default VenueSearch;


import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

const regions = [
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

type RegionSelectorProps = {
  className?: string;
  onRegionsChange?: (regions: string[]) => void;
};

const RegionSelector: React.FC<RegionSelectorProps> = ({ className, onRegionsChange }) => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const toggleRegion = (region: string) => {
    const updatedRegions = selectedRegions.includes(region)
      ? selectedRegions.filter(r => r !== region)
      : [...selectedRegions, region];
    
    setSelectedRegions(updatedRegions);
    onRegionsChange?.(updatedRegions);
  };

  const handleSelectAllRegions = () => {
    if (selectedRegions.length === regions.length) {
      setSelectedRegions([]);
      onRegionsChange?.([]);
    } else {
      setSelectedRegions([...regions]);
      onRegionsChange?.([...regions]);
    }
  };

  const displayText = selectedRegions.length === 0
    ? "Régions"
    : selectedRegions.length === 1
      ? selectedRegions[0]
      : `${selectedRegions.length} régions`;

  const popularDestinations = [
    "Île-de-France",
    "Provence-Alpes-Côte d'Azur",
    "Bretagne",
    "Normandie",
    "Occitanie"
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex-1 justify-start border border-wedding-black/10 bg-white font-normal shadow-sm hover:bg-white/80",
            className
          )}
        >
          <MapPin className="mr-2 h-4 w-4" />
          <span className="truncate">{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b">
          <div className="p-4 border-r">
            <h3 className="font-medium mb-2">Destinations populaires</h3>
            <div className="space-y-2">
              {popularDestinations.map((region) => (
                <div key={region} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`popular-${region}`}
                    checked={selectedRegions.includes(region)}
                    onCheckedChange={() => toggleRegion(region)}
                  />
                  <Label 
                    htmlFor={`popular-${region}`} 
                    className="text-sm cursor-pointer"
                  >
                    {region}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-medium mb-2">Toutes les régions</h3>
            <ScrollArea className="h-48 w-full pr-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="all-regions"
                    checked={selectedRegions.length === regions.length}
                    onCheckedChange={handleSelectAllRegions}
                  />
                  <Label 
                    htmlFor="all-regions" 
                    className="text-sm font-medium cursor-pointer"
                  >
                    Toutes les régions
                  </Label>
                </div>
                
                {regions.map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`region-${region}`}
                      checked={selectedRegions.includes(region)}
                      onCheckedChange={() => toggleRegion(region)}
                    />
                    <Label 
                      htmlFor={`region-${region}`} 
                      className="text-sm cursor-pointer"
                    >
                      {region}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <div className="flex justify-between p-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedRegions([]);
              onRegionsChange?.([]);
            }}
          >
            Effacer
          </Button>
          <Button onClick={() => setOpen(false)}>
            Appliquer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RegionSelector;


import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredRegions = regions.filter(region => 
    region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegionClick = (region: string) => {
    const updatedRegions = selectedRegions.includes(region)
      ? selectedRegions.filter(r => r !== region)
      : [...selectedRegions, region];
    
    setSelectedRegions(updatedRegions);
    onRegionsChange?.(updatedRegions);
    setSearchTerm('');
  };

  const handleClearAll = () => {
    setSelectedRegions([]);
    onRegionsChange?.([]);
  };

  const handleApply = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const displayText = selectedRegions.length === 0
    ? "Région"
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
      <PopoverContent className="w-96 p-4" align="center" sideOffset={5}>
        <div className="space-y-4">
          <Input
            ref={inputRef}
            placeholder="Rechercher une région..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />

          <div className="grid grid-cols-1 gap-3">
            <div>
              <h3 className="font-medium mb-2">Destinations populaires</h3>
              <div className="grid grid-cols-1 gap-2">
                {popularDestinations.map((region) => (
                  <div 
                    key={region} 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100",
                      selectedRegions.includes(region) ? "bg-gray-100" : ""
                    )}
                    onClick={() => handleRegionClick(region)}
                  >
                    <div className={cn(
                      "w-5 h-5 border border-gray-300 rounded-sm mr-2 flex items-center justify-center",
                      selectedRegions.includes(region) ? "bg-wedding-olive border-wedding-olive" : ""
                    )}>
                      {selectedRegions.includes(region) && <X className="h-3 w-3 text-white" />}
                    </div>
                    <span>{region}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Toutes les régions</h3>
              <ScrollArea className="h-48 pr-4">
                <div className="space-y-2">
                  {filteredRegions.map((region) => (
                    <div 
                      key={region} 
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100",
                        selectedRegions.includes(region) ? "bg-gray-100" : ""
                      )}
                      onClick={() => handleRegionClick(region)}
                    >
                      <div className={cn(
                        "w-5 h-5 border border-gray-300 rounded-sm mr-2 flex items-center justify-center",
                        selectedRegions.includes(region) ? "bg-wedding-olive border-wedding-olive" : ""
                      )}>
                        {selectedRegions.includes(region) && <X className="h-3 w-3 text-white" />}
                      </div>
                      <span>{region}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              onClick={handleClearAll}
            >
              Effacer
            </Button>
            <Button onClick={handleApply}>
              Appliquer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RegionSelector;

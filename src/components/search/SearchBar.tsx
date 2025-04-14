
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState('lieu');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsExpanded(true);
  };

  const handleSearch = () => {
    window.open('https://leguidemariable.softr.app/', '_blank');
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prevRegions => 
      prevRegions.includes(region)
        ? prevRegions.filter(r => r !== region)
        : [...prevRegions, region]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="shadow-lg border border-wedding-black/10 rounded-2xl overflow-hidden">
        <Tabs 
          defaultValue="lieu" 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="p-2 md:p-3 bg-white">
            <TabsList className="w-full h-auto bg-wedding-cream/50 p-1 gap-1">
              <TabsTrigger 
                value="lieu" 
                className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Lieu
              </TabsTrigger>
              <TabsTrigger 
                value="prestataires" 
                className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Prestataires
              </TabsTrigger>
            </TabsList>
          </div>

          <div className={`bg-white transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[600px]' : 'max-h-0'}`}>
            <TabsContent value="lieu" className="m-0 p-4 border-t">
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Régions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {regions.slice(0, 6).map((region) => (
                      <div key={region} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`region-${region}`}
                          checked={selectedRegions.includes(region)}
                          onCheckedChange={() => toggleRegion(region)}
                        />
                        <Label htmlFor={`region-${region}`} className="text-sm cursor-pointer">
                          {region}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="prestataires" className="m-0 p-4 border-t">
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Régions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {regions.slice(0, 6).map((region) => (
                      <div key={region} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`prestataire-region-${region}`}
                          checked={selectedRegions.includes(region)}
                          onCheckedChange={() => toggleRegion(region)}
                        />
                        <Label htmlFor={`prestataire-region-${region}`} className="text-sm cursor-pointer">
                          {region}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="p-3 bg-white border-t flex justify-end">
            <Button 
              onClick={handleSearch}
              size={isMobile ? "default" : "lg"} 
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white rounded-full flex items-center gap-2"
            >
              <Search size={18} />
              <span>Rechercher</span>
            </Button>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default SearchBar;

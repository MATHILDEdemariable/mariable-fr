
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import VenueSearch from './VenueSearch';
import CatererSearch from './CatererSearch';
import PhotographerSearch from './PhotographerSearch';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState('lieu');
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsExpanded(true);
  };

  const handleSearch = () => {
    console.log('Recherche pour:', activeTab);
    // Rediriger vers la page de résultats avec les filtres appropriés
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
                value="traiteur" 
                className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Traiteur
              </TabsTrigger>
              <TabsTrigger 
                value="photographe" 
                className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Photographe
              </TabsTrigger>
            </TabsList>
          </div>

          <div className={`bg-white transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[600px]' : 'max-h-0'}`}>
            <TabsContent value="lieu" className="m-0 p-4 border-t">
              <VenueSearch />
            </TabsContent>
            <TabsContent value="traiteur" className="m-0 p-4 border-t">
              <CatererSearch />
            </TabsContent>
            <TabsContent value="photographe" className="m-0 p-4 border-t">
              <PhotographerSearch />
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

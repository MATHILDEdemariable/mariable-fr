
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import RegionSelector from './RegionSelector';
import DateSelector from './DateSelector';
import GuestSelector from './GuestSelector';

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState('lieu');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>();
  const [dateSelectionType, setDateSelectionType] = useState<'exact' | 'flexible'>('exact');
  const [guestCount, setGuestCount] = useState(0);
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearch = () => {
    window.open('https://leguidemariable.softr.app/', '_blank');
  };

  const handleRegionsChange = (regions: string[]) => {
    setSelectedRegions(regions);
  };

  const handleDateChange = (date: Date | null | undefined, type: 'exact' | 'flexible') => {
    setSelectedDate(date);
    setDateSelectionType(type);
  };

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
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
                className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
              >
                Lieu
              </TabsTrigger>
              <TabsTrigger 
                value="prestataires" 
                className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
              >
                Prestataires
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-3 bg-white">
            <div className="flex flex-col sm:flex-row gap-2">
              <RegionSelector 
                onRegionsChange={handleRegionsChange}
                className="rounded-xl h-12"
              />
              
              <DateSelector 
                onDateChange={handleDateChange}
                className="rounded-xl h-12"
              />
              
              <GuestSelector 
                onGuestCountChange={handleGuestCountChange}
                className="rounded-xl h-12"
              />
              
              <Button 
                onClick={handleSearch}
                size={isMobile ? "default" : "lg"} 
                className="bg-wedding-olive hover:bg-wedding-olive/90 text-white rounded-xl flex items-center gap-2 h-12 text-sm"
              >
                <Search size={18} />
                <span>Rechercher</span>
              </Button>
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default SearchBar;

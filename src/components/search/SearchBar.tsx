
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import RegionSelector from './RegionSelector';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'lieu' | 'prestataire'>('lieu');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/guide-mariable-frame');
  };

  const handleTypeSelect = (type: 'lieu' | 'prestataire') => {
    setSearchType(type);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[300px]" sideOffset={5}>
            <div className="space-y-2">
              <div 
                className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${searchType === 'lieu' ? 'bg-gray-100' : ''}`}
                onClick={() => handleTypeSelect('lieu')}
              >
                Lieu de réception
              </div>
              <div 
                className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${searchType === 'prestataire' ? 'bg-gray-100' : ''}`}
                onClick={() => handleTypeSelect('prestataire')}
              >
                Prestataire
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <RegionSelector 
          onRegionsChange={setSelectedRegions}
          className="w-[200px]"
        />
        
        <Button 
          onClick={handleSearch}
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
          size="sm"
        >
          <Search size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

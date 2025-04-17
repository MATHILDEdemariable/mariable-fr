
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchType, setSearchType] = useState('lieu');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/guide-mariable-frame');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-wedding-black/10">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full h-9"
          />
        </div>
        
        <Select
          value={searchType}
          onValueChange={setSearchType}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Type de recherche" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lieu">Lieu de réception</SelectItem>
            <SelectItem value="prestataire">Prestataire</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleSearch}
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white h-9 px-3"
          size="sm"
        >
          <Search size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

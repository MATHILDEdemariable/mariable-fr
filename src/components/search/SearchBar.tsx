
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/guide-mariable-frame');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Un traiteur exceptionnel à Bordeaux"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full text-xs sm:text-sm" // Added text size classes for better mobile visibility
          />
        </div>
        <Button 
          onClick={handleSearch}
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white shrink-0"
          size="sm"
        >
          <Search size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

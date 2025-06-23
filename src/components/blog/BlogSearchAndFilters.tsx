
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlogSearchAndFiltersProps {
  onSearchChange: (search: string) => void;
  onCategoryFilter: (category: string | null) => void;
  onTagFilter: (tag: string | null) => void;
  selectedCategory: string | null;
  selectedTag: string | null;
  availableCategories: string[];
  availableTags: string[];
  searchTerm: string;
}

const BlogSearchAndFilters: React.FC<BlogSearchAndFiltersProps> = ({
  onSearchChange,
  onCategoryFilter,
  onTagFilter,
  selectedCategory,
  selectedTag,
  availableCategories,
  availableTags,
  searchTerm,
}) => {
  return (
    <div className="fixed top-20 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Barre de recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans les articles..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtres par catégorie */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap">
                {selectedCategory || 'Toutes les catégories'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onCategoryFilter(null)}>
                Toutes les catégories
              </DropdownMenuItem>
              {availableCategories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => onCategoryFilter(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filtres par tags */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap">
                {selectedTag || 'Tous les thèmes'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-auto">
              <DropdownMenuItem onClick={() => onTagFilter(null)}>
                Tous les thèmes
              </DropdownMenuItem>
              {availableTags.map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  onClick={() => onTagFilter(tag)}
                >
                  {tag}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Badges des filtres actifs */}
          <div className="flex gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => onCategoryFilter(null)}>
                {selectedCategory}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => onTagFilter(null)}>
                {selectedTag}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSearchAndFilters;

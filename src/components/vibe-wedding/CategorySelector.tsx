import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CATEGORIES = [
  { value: 'Traiteur', label: 'Traiteur', icon: '🍽️' },
  { value: 'Lieu de réception', label: 'Lieu de réception', icon: '🏰' },
  { value: 'Photographe', label: 'Photographe', icon: '📸' },
  { value: 'Vidéaste', label: 'Vidéaste', icon: '🎥' },
  { value: 'Fleuriste', label: 'Fleuriste', icon: '💐' },
  { value: 'DJ/Musique', label: 'DJ/Musique', icon: '🎵' },
  { value: 'Coordination', label: 'Coordination', icon: '📋' },
  { value: 'Décoration', label: 'Décoration', icon: '🎨' },
  { value: 'Mise en beauté', label: 'Mise en beauté', icon: '💄' },
  { value: 'Robe de mariée', label: 'Robe de mariée', icon: '👗' },
  { value: 'Animations', label: 'Animations', icon: '🎪' },
  { value: 'Officiant de cérémonie', label: 'Officiant de cérémonie', icon: '💒' },
];

interface CategorySelectorProps {
  onSelect: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Quel type de prestataire recherchez-vous ?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((category) => (
            <Button
              key={category.value}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => onSelect(category.value)}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-sm text-center">{category.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySelector;

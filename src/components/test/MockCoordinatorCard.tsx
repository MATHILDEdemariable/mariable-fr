import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Euro, ExternalLink, Star } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface MockCoordinator {
  id: string;
  nom: string;
  description: string;
  ville: string;
  region: string;
  prix_a_partir_de: number;
  image: string;
  specialites: string[];
  rating: number;
}

interface MockCoordinatorCardProps {
  coordinator: MockCoordinator;
  onClick: (coordinator: MockCoordinator) => void;
}

const MockCoordinatorCard: React.FC<MockCoordinatorCardProps> = ({
  coordinator,
  onClick,
}) => {
  const location = `${coordinator.ville}, ${coordinator.region}`;

  return (
    <Card
      className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onClick(coordinator)}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={coordinator.image} 
            alt={coordinator.nom}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        <Badge className="absolute top-3 left-3 bg-white/80 text-black font-medium">
          Coordination
        </Badge>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/80 rounded px-2 py-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{coordinator.rating}</span>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-serif mb-2">{coordinator.nom}</h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {coordinator.description}
        </p>

        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" /> {location}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {coordinator.specialites.slice(0, 2).map((specialite, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {specialite}
            </Badge>
          ))}
          {coordinator.specialites.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{coordinator.specialites.length - 2}
            </Badge>
          )}
        </div>

        <div className="font-medium text-sm">
          <div className="flex items-center">
            <Euro className="h-4 w-4 mr-1" />
            À partir de {coordinator.prix_a_partir_de}€
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClick(coordinator);
          }}
          className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
        >
          <ExternalLink className="h-4 w-4 mr-1" /> En savoir plus
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MockCoordinatorCard;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoordinatorsPreview: React.FC = () => {
  // Coordinateurs exemple - en réalité, cela viendrait d'une base de données
  const coordinators = [
    {
      id: 1,
      name: "Sophie Martin",
      location: "Paris & Île-de-France",
      rating: 4.9,
      reviewCount: 47,
      specialties: ["Mariage de luxe", "Coordination jour-J"],
      image: "/lovable-uploads/coordinator-1.jpg",
      price: "À partir de 799€"
    },
    {
      id: 2,
      name: "Emma Dubois",
      location: "Lyon & Rhône-Alpes",
      rating: 4.8,
      reviewCount: 32,
      specialties: ["Mariage champêtre", "Coordination complète"],
      image: "/lovable-uploads/coordinator-2.jpg",
      price: "À partir de 699€"
    },
    {
      id: 3,
      name: "Claire Moreau",
      location: "Bordeaux & Nouvelle-Aquitaine",
      rating: 5.0,
      reviewCount: 28,
      specialties: ["Mariage en extérieur", "Jour-J"],
      image: "/lovable-uploads/coordinator-3.jpg",
      price: "À partir de 749€"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
          Nos coordinateurs de mariage
        </h2>
        <p className="text-lg text-gray-700">
          Découvrez quelques-uns de nos coordinateurs expérimentés pour votre jour J
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coordinators.map((coordinator) => (
          <Card key={coordinator.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="p-0">
              <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{coordinator.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {coordinator.location}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{coordinator.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({coordinator.reviewCount} avis)</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {coordinator.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-wedding-olive">{coordinator.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
          <Link to="/coordinateurs-mariage">
            <LinkIcon className="h-4 w-4 mr-2" />
            Voir tous les coordinateurs
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CoordinatorsPreview;

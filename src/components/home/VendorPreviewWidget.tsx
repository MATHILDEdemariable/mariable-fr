import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle } from 'lucide-react';

interface Vendor {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  certified: boolean;
}

const VendorPreviewWidget = () => {
  // Données d'exemple de prestataires du Centre-Val de Loire
  const vendors: Vendor[] = [
    {
      id: 1,
      name: "Château de Chambord",
      category: "Lieu de réception",
      location: "Chambord, 41250",
      rating: 4.8,
      reviews: 127,
      price: "À partir de 2500€",
      image: "/lovable-uploads/chambord-preview.jpg",
      certified: true
    },
    {
      id: 2,
      name: "Atelier Floral Orléanais", 
      category: "Fleuriste",
      location: "Orléans, 45000",
      rating: 4.9,
      reviews: 89,
      price: "À partir de 450€",
      image: "/lovable-uploads/fleuriste-preview.jpg",
      certified: true
    },
    {
      id: 3,
      name: "Photo Lumière Loire",
      category: "Photographe",
      location: "Tours, 37000", 
      rating: 4.7,
      reviews: 156,
      price: "À partir de 1200€",
      image: "/lovable-uploads/photo-preview.jpg",
      certified: true
    },
    {
      id: 4,
      name: "Saveurs du Val de Loire",
      category: "Traiteur",
      location: "Blois, 41000",
      rating: 4.8,
      reviews: 203,
      price: "À partir de 65€/pers",
      image: "/lovable-uploads/traiteur-preview.jpg", 
      certified: true
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {vendors.map((vendor) => (
        <Card key={vendor.id} className="prestataire-card group overflow-hidden h-full">
          <div className="aspect-video relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-premium-sage-light to-premium-sage-medium flex items-center justify-center">
              <span className="text-premium-charcoal font-medium">{vendor.name}</span>
            </div>
            {vendor.certified && (
              <Badge className="badge-certifie absolute top-3 left-3">
                <CheckCircle className="w-3 h-3 mr-1" />
                Certifié
              </Badge>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-premium-black group-hover:text-premium-sage transition-colors">
                    {vendor.name}
                  </h3>
                  <p className="text-sm text-premium-charcoal">{vendor.category}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-premium-charcoal">
                <MapPin className="w-4 h-4 mr-1" />
                {vendor.location}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{vendor.rating}</span>
                  <span className="text-sm text-premium-charcoal ml-1">({vendor.reviews})</span>
                </div>
                <div className="text-sm font-medium text-premium-sage">
                  {vendor.price}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VendorPreviewWidget;
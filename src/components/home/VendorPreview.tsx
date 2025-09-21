import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Heart } from 'lucide-react';

const VendorPreview = () => {
  const featuredVendors = [
    {
      id: 1,
      name: "Château de Malmaison",
      category: "Lieu de réception",
      location: "Île-de-France",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
      rating: 4.9,
      certified: true
    },
    {
      id: 2,
      name: "Atelier Lumière",
      category: "Photographe",
      location: "Provence-Alpes-Côte d'Azur",
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop",
      rating: 5.0,
      certified: true
    },
    {
      id: 3,
      name: "Saveurs d'Exception",
      category: "Traiteur",
      location: "Nouvelle-Aquitaine",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      rating: 4.8,
      certified: true
    },
    {
      id: 4,
      name: "Floralie Créative",
      category: "Fleuriste",
      location: "Auvergne-Rhône-Alpes",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      rating: 4.9,
      certified: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredVendors.map((vendor) => (
        <Card key={vendor.id} className="prestataire-card overflow-hidden border-premium-sage/20 hover:border-premium-sage hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="relative">
            <img 
              src={vendor.image} 
              alt={vendor.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 right-3">
              <Heart className="h-5 w-5 text-white/80 hover:text-premium-sage transition-colors cursor-pointer" />
            </div>
            {vendor.certified && (
              <Badge className="badge-certifie absolute top-3 left-3 text-xs">
                Certifié
              </Badge>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-xs bg-premium-sage/10 text-premium-sage">
                {vendor.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-premium-charcoal">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span>{vendor.rating}</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-premium-black mb-2 line-clamp-2">{vendor.name}</h3>
            
            <div className="flex items-center text-sm text-premium-charcoal">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{vendor.location}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default VendorPreview;
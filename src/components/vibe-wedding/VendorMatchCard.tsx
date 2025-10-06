import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VendorMatchCardProps {
  vendor: {
    id: string;
    nom: string;
    categorie: string;
    ville?: string;
    region?: string;
    description?: string;
    prix_a_partir_de?: number;
    matchScore?: number;
    photo_url?: string;
    partner?: boolean;
    featured?: boolean;
    isOutOfScope?: boolean;
    slug?: string;
  };
  onContact: () => void;
}

const VendorMatchCard: React.FC<VendorMatchCardProps> = ({ vendor, onContact }) => {
  const navigate = useNavigate();
  
  const formatPrice = (price?: number) => {
    if (!price) return "Sur devis";
    return `À partir de ${price.toLocaleString('fr-FR')}€`;
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => navigate(`/prestataire/${vendor.slug || vendor.id}`)}
    >
      {/* Image principale */}
      <div className="relative h-48 bg-gray-100">
        {vendor.photo_url ? (
          <img 
            src={vendor.photo_url} 
            alt={vendor.nom}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 text-sm">Aucune photo</span>
          </div>
        )}
        
        {/* Badge Certifié */}
        {(vendor.partner || vendor.featured) && (
          <Badge 
            className="absolute top-3 left-3 bg-wedding-olive text-white"
          >
            ✓ Certifié
          </Badge>
        )}

        {/* Score de match */}
        {vendor.matchScore && vendor.matchScore > 70 && (
          <Badge 
            className="absolute top-3 right-3 bg-white/90 text-wedding-olive border border-wedding-olive"
          >
            {vendor.matchScore}% match
          </Badge>
        )}

        {/* Badge "Autre localisation" */}
        {vendor.isOutOfScope && (
          <Badge 
            className="absolute bottom-3 right-3 bg-amber-500/90 text-white text-xs"
          >
            📍 Autre localisation
          </Badge>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-3">
        {/* Nom et catégorie */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {vendor.nom}
          </h3>
          <p className="text-sm text-gray-500">{vendor.categorie}</p>
        </div>

        {/* Localisation */}
        {(vendor.ville || vendor.region) && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {vendor.ville ? `${vendor.ville}, ` : ''}{vendor.region}
            </span>
          </div>
        )}

        {/* Note Google (fictive pour le moment) */}
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">4.8</span>
          <span className="text-gray-500">(127 avis)</span>
        </div>

        {/* Description courte */}
        {vendor.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {vendor.description}
          </p>
        )}

        {/* Prix et bouton contact */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="font-semibold text-wedding-olive">
            {formatPrice(vendor.prix_a_partir_de)}
          </span>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onContact();
            }}
            className="bg-wedding-olive hover:bg-wedding-olive/90"
          >
            Contacter
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VendorMatchCard;

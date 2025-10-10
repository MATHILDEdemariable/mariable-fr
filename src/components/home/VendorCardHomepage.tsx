import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Euro, Star, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import VendorContactModal from '@/components/vendors/VendorContactModal';

interface VendorCardHomepageProps {
  vendor: {
    id: string;
    nom: string;
    categorie: string;
    ville?: string;
    region?: string;
    prix_a_partir_de?: number;
    description_courte?: string;
    description?: string;
    photo_url?: string;
    partner?: boolean;
    featured?: boolean;
    slug?: string;
    note?: number;
    nombre_avis?: number;
  };
}

const VendorCardHomepage: React.FC<VendorCardHomepageProps> = ({ vendor }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  
  const description = vendor.description_courte || vendor.description || '';
  const hasLocation = vendor.ville && vendor.region;

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-wedding-olive/30">
        <CardContent className="p-0">
          <div className="relative">
            <AspectRatio ratio={16 / 9}>
              {vendor.photo_url ? (
                <img
                  src={vendor.photo_url}
                  alt={vendor.nom}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Aucune photo</span>
                </div>
              )}
            </AspectRatio>
            
            {vendor.partner && (
              <Badge 
                variant="default" 
                className="absolute top-3 left-3 bg-wedding-olive/90 backdrop-blur-sm text-white shadow-lg"
              >
                ✓ Certifié
              </Badge>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground line-clamp-1 mb-1">
                {vendor.nom}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {vendor.categorie}
              </Badge>
            </div>

            {hasLocation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{vendor.ville}, {vendor.region}</span>
              </div>
            )}

            {(vendor.note !== undefined && vendor.nombre_avis) && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{vendor.note.toFixed(1)}</span>
                <span className="text-muted-foreground">({vendor.nombre_avis} avis)</span>
              </div>
            )}

            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}

            {vendor.prix_a_partir_de && (
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Euro className="w-4 h-4" />
                <span>À partir de {vendor.prix_a_partir_de.toLocaleString()}€</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setShowContactModal(true)}
                size="sm"
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                Contacter
              </Button>
              
              {vendor.slug && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Link to={`/prestataire/${vendor.slug}`}>
                    Voir profil
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <VendorContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        vendorId={vendor.id}
        vendorName={vendor.nom}
      />
    </>
  );
};

export default VendorCardHomepage;

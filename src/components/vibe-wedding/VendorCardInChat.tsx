import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Euro, Mail, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import VendorContactModal from '@/components/vendors/VendorContactModal';

interface VendorCardInChatProps {
  vendor: {
    id: string;
    nom: string;
    categorie: string;
    ville?: string;
    region?: string;
    prix_a_partir_de?: number;
    prix_par_personne?: number;
    description?: string;
    email?: string;
    telephone?: string;
    slug?: string;
    prestataires_photos_preprod?: Array<{
      url: string;
      thumbnail_url?: string;
      principale?: boolean;
      is_cover?: boolean;
    }>;
  };
}

const VendorCardInChat: React.FC<VendorCardInChatProps> = ({ vendor }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  return (
    <Card className="hover:shadow-md transition-shadow border-premium-sage/20 overflow-hidden">
      {/* Image prestataire */}
      {vendor.prestataires_photos_preprod && vendor.prestataires_photos_preprod.length > 0 && (
        <div className="relative w-full h-48 bg-gray-200">
          <img
            src={vendor.prestataires_photos_preprod[0].thumbnail_url || vendor.prestataires_photos_preprod[0].url}
            srcSet={`
              ${vendor.prestataires_photos_preprod[0].thumbnail_url || vendor.prestataires_photos_preprod[0].url} 400w,
              ${vendor.prestataires_photos_preprod[0].url} 1200w
            `}
            sizes="(max-width: 768px) 100vw, 400px"
            alt={vendor.nom}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {vendor.categorie && (
            <div className="absolute top-2 left-2 bg-wedding-olive text-white px-2 py-1 rounded text-xs font-medium">
              {vendor.categorie}
            </div>
          )}
        </div>
      )}
      
      {/* Si pas de photo, afficher un placeholder avec catégorie */}
      {(!vendor.prestataires_photos_preprod || vendor.prestataires_photos_preprod.length === 0) && (
        <div className="relative w-full h-48 bg-gradient-to-br from-wedding-olive/20 to-wedding-cream/40 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📸</div>
            <p className="text-sm text-gray-600">{vendor.categorie}</p>
          </div>
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Info principale */}
          <div className="flex-1 space-y-2">
            <div>
              <h4 className="font-semibold text-base">{vendor.nom}</h4>
              <p className="text-xs text-muted-foreground">{vendor.categorie}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              {(vendor.ville || vendor.region) && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.ville || vendor.region}</span>
                </div>
              )}
              
              {(vendor.prix_a_partir_de || vendor.prix_par_personne) && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Euro className="w-4 h-4" />
                  <span>
                    {vendor.prix_a_partir_de 
                      ? `À partir de ${vendor.prix_a_partir_de}€`
                      : `${vendor.prix_par_personne}€/pers`
                    }
                  </span>
                </div>
              )}
            </div>

            {vendor.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {vendor.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => setIsContactModalOpen(true)}
              size="sm" 
              className="bg-premium-sage hover:bg-premium-sage-dark text-white"
            >
              <Mail className="w-4 h-4 mr-1" />
              Contacter
            </Button>
            
            {vendor.slug && (
              <Button 
                asChild
                variant="outline"
                size="sm"
              >
                <Link to={`/prestataire/${vendor.slug}`} target="_blank">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Profil
                </Link>
              </Button>
            )}
            
            {vendor.telephone && (
              <Button
                asChild
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                <a href={`tel:${vendor.telephone}`} title="Appeler">
                  <Phone className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Contact Modal */}
      <VendorContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        vendorId={vendor.id}
        vendorName={vendor.nom}
      />
    </Card>
  );
};

export default VendorCardInChat;

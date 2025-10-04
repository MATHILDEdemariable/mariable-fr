import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import VendorContactModal from '@/components/vendors/VendorContactModal';

interface VendorCardInProjectProps {
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
  };
}

const VendorCardInProject: React.FC<VendorCardInProjectProps> = ({ vendor }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Card className="p-3 hover:shadow-md transition-shadow">
        <div className="flex gap-3">
          {/* Placeholder pour photo miniature */}
          <div className="flex-shrink-0 w-16 h-16 bg-wedding-blush/20 rounded-md flex items-center justify-center">
            <span className="text-2xl">💍</span>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-wedding-charcoal truncate">
              {vendor.nom}
            </h3>
            <p className="text-xs text-muted-foreground mb-1">{vendor.categorie}</p>
            
            {(vendor.ville || vendor.region) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{vendor.ville || vendor.region}</span>
              </div>
            )}

            {(vendor.prix_a_partir_de || vendor.prix_par_personne) && (
              <p className="text-xs font-medium text-wedding-olive mb-2">
                À partir de {formatPrice(vendor.prix_a_partir_de || vendor.prix_par_personne || 0)}
                {vendor.prix_par_personne ? ' / pers' : ''}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsContactModalOpen(true)}
                size="sm"
                variant="outline"
                className="h-7 text-xs flex-1"
              >
                <Mail className="w-3 h-3 mr-1" />
                Contacter
              </Button>

              {vendor.slug && (
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs px-2"
                >
                  <Link to={`/prestataires/${vendor.slug}`} target="_blank">
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </Button>
              )}

              {vendor.telephone && (
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs px-2"
                >
                  <a href={`tel:${vendor.telephone}`}>
                    <Phone className="w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <VendorContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        vendorId={vendor.id}
        vendorName={vendor.nom}
      />
    </>
  );
};

export default VendorCardInProject;

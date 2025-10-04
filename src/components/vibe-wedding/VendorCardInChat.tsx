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
    note_moyenne?: number;
    prix_min?: number;
    prix_max?: number;
    description?: string;
    email?: string;
    telephone?: string;
    slug?: string;
  };
}

const VendorCardInChat: React.FC<VendorCardInChatProps> = ({ vendor }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  return (
    <Card className="hover:shadow-md transition-shadow border-premium-sage/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Info principale */}
          <div className="flex-1 space-y-2">
            <div>
              <h4 className="font-semibold text-base">{vendor.nom}</h4>
              <p className="text-xs text-muted-foreground">{vendor.categorie}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              {vendor.ville && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.ville}</span>
                </div>
              )}
              
              {vendor.note_moyenne && (
                <div className="flex items-center gap-1 text-premium-sage">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{vendor.note_moyenne.toFixed(1)}</span>
                </div>
              )}
              
              {vendor.prix_min && vendor.prix_max && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Euro className="w-4 h-4" />
                  <span>{vendor.prix_min} - {vendor.prix_max}€</span>
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

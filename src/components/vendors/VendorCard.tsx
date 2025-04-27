
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Euro, ExternalLink } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Database } from '@/integrations/supabase/types';

type Prestataire = Database['public']['Tables']['prestataires']['Row'];

interface VendorCardProps {
  vendor: Prestataire;
  onClick: (vendor: Prestataire) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onClick }) => {
  // Get the main image (first photo) with safety checks
  let mainImage = '/placeholder.svg';
  
  try {
    // Check if styles is already an array
    if (vendor.styles && Array.isArray(vendor.styles) && vendor.styles.length > 0) {
      mainImage = vendor.styles[0];
    } 
    // Check if styles is a string that can be parsed as JSON
    else if (vendor.styles && typeof vendor.styles === 'string') {
      try {
        const parsedStyles = JSON.parse(String(vendor.styles));
        if (Array.isArray(parsedStyles) && parsedStyles.length > 0) {
          mainImage = parsedStyles[0];
        }
      } catch (e) {
        console.warn('Error parsing vendor styles:', e);
        // Use default image
      }
    }
  } catch (error) {
    console.warn('Error processing vendor styles:', error);
    // Use default image
  }
  
  // Get location
  const location = `${vendor.ville || ''}, ${vendor.region || ''}`.trim();
  
  // Get formatted price
  const getFormattedPrice = () => {
    if (vendor.prix_par_personne) {
      return `Environ ${vendor.prix_par_personne}€/pers.`;
    } else if (vendor.prix_a_partir_de) {
      return `À partir de ${vendor.prix_a_partir_de} €`;
    } else {
      return "Prix sur demande";
    }
  };

  return (
    <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-all">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={mainImage} 
            alt={vendor.nom || "Prestataire de mariage"} 
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        <Badge 
          className="absolute top-3 left-3 bg-white/80 text-black font-medium"
        >
          {vendor.categorie || "Prestataire"}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-serif mb-1">{vendor.nom}</h3>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" /> {location}
        </div>
        
        <div className="mt-2 font-medium text-sm">
          <div className="flex items-center">
            <Euro className="h-4 w-4 mr-1" />
            {getFormattedPrice()}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          onClick={() => onClick(vendor)}
          className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
        >
          <ExternalLink className="h-4 w-4 mr-1" /> En savoir plus
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VendorCard;

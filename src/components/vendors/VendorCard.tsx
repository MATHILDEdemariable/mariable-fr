
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Euro, ExternalLink } from 'lucide-react';
import { AirtableVendor } from '@/types/airtable';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface VendorCardProps {
  vendor: AirtableVendor;
  onClick: (vendor: AirtableVendor) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onClick }) => {
  const { fields } = vendor;
  
  // Obtenir l'image principale (première photo)
  const mainImage = fields.Photos && fields.Photos.length > 0 
    ? fields.Photos[0].url 
    : '/placeholder.svg';
  
  // Obtenir la localisation (ville ou distance)
  const location = fields.Distance || fields.Ville || '';
  
  // Obtenir le prix formaté
  const getFormattedPrice = () => {
    if (fields["Prix par personne"]) {
      return `Environ ${fields["Prix par personne"]}€/pers.`;
    } else if (fields["Prix à partir de"]) {
      return `À partir de ${fields["Prix à partir de"]} €`;
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
            alt={fields.Nom || "Prestataire de mariage"} 
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        <Badge 
          className="absolute top-3 left-3 bg-white/80 text-black font-medium"
        >
          {fields.Catégorie || "Prestataire"}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-serif mb-1">{fields.Nom}</h3>
        
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

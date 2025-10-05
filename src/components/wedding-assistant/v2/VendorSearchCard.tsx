import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Euro } from 'lucide-react';

interface VendorSearchCardProps {
  vendor: {
    nom: string;
    categorie: string;
    description?: string;
    site_web?: string;
    email?: string;
    ville?: string;
    region?: string;
    fourchette_prix?: string;
  };
}

export const VendorSearchCard: React.FC<VendorSearchCardProps> = ({ vendor }) => {
  const website = vendor.site_web || vendor.email;
  
  return (
    <Card className="overflow-hidden border-wedding-olive/30 hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-serif text-foreground">{vendor.nom}</h3>
          {vendor.fourchette_prix && (
            <Badge variant="secondary" className="ml-2 flex items-center gap-1">
              <Euro className="h-3 w-3" />
              {vendor.fourchette_prix}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {vendor.categorie}
          </Badge>
          {(vendor.ville || vendor.region) && (
            <span className="text-xs flex items-center text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {vendor.ville || vendor.region}
            </span>
          )}
        </div>
        
        {vendor.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {vendor.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        {website && (
          <Button 
            size="sm" 
            variant="outline"
            className="w-full border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10"
            asChild
          >
            <a href={website.startsWith('http') ? website : `mailto:${website}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" /> 
              {vendor.site_web ? 'Visiter le site' : 'Contacter'}
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VendorSearchCard;

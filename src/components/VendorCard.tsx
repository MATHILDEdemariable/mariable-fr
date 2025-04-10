
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VendorRecommendation } from '@/types';
import { ExternalLink, MapPin, Euro, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface VendorCardProps {
  recommendation: VendorRecommendation;
}

export const VendorCard: React.FC<VendorCardProps> = ({ recommendation }) => {
  const { vendor, reason } = recommendation;
  
  return (
    <Card className="vendor-card overflow-hidden border-wedding-olive/30 hover:shadow-md transition-all p-3">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-lg font-serif">{vendor.nom}</h3>
        <span className="ml-auto text-base flex items-center">
          <Euro className="h-4 w-4 mr-1" />
          {vendor.budget}{vendor.type === 'Traiteur' ? '/pers' : ''}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="rounded-full text-xs">
          {vendor.type}
        </Badge>
        <span className="text-xs flex items-center text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" /> {vendor.lieu}
        </span>
      </div>
      
      <CardContent className="p-0 mb-3">
        <p className="text-sm text-gray-600">
          {reason}
        </p>
      </CardContent>
      
      <CardFooter className="p-0 flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              className="w-full border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10 flex items-center justify-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" /> Détails
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-4 w-72">
            <div className="space-y-2">
              <h4 className="font-semibold text-wedding-olive">Plus d'informations</h4>
              <p className="text-sm">Inscrivez-vous pour accéder à tous les détails de ce prestataire et à notre sélection complète.</p>
              <Button 
                className="w-full bg-wedding-olive hover:bg-wedding-olive/90 mt-2 flex items-center justify-center gap-1"
                asChild
              >
                <Link to="/commencer">
                  <UserPlus className="h-3.5 w-3.5" /> S'inscrire
                </Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          size="sm" 
          className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white flex items-center justify-center"
          asChild
        >
          <Link to="/commencer">
            <UserPlus className="h-3 w-3 mr-1" /> Découvrir
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VendorCard;

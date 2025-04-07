
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VendorRecommendation } from '@/types';
import { ExternalLink, MapPin, Euro } from 'lucide-react';

interface VendorCardProps {
  recommendation: VendorRecommendation;
}

export const VendorCard: React.FC<VendorCardProps> = ({ recommendation }) => {
  const { vendor, reason } = recommendation;
  
  return (
    <Card className="vendor-card overflow-hidden border-wedding-olive/30 hover:shadow-md transition-all">
      {vendor.image && (
        <div className="relative w-full h-32 overflow-hidden">
          <img 
            src={vendor.image} 
            alt={vendor.nom} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">💍 {vendor.nom}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline" className="bg-secondary/30">
                {vendor.type}
              </Badge>
              <span className="text-sm flex items-center">
                <MapPin className="h-3 w-3 mr-1" /> {vendor.lieu}
              </span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 flex items-center">
            <Euro className="h-3 w-3 mr-1" />
            {vendor.budget}{vendor.type === 'Traiteur' ? '/pers' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{reason}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {vendor.style.map((style) => (
            <Badge key={style} variant="outline" className="text-xs">
              {style}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          size="sm" 
          className="w-full text-sm bg-wedding-olive hover:bg-wedding-olive/90 text-white"
          onClick={() => window.open(vendor.lien, '_blank')}
        >
          <ExternalLink className="h-3 w-3 mr-1" /> Découvrir
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VendorCard;

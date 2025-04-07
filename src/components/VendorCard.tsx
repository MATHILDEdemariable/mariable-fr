
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VendorRecommendation } from '@/types';
import { ExternalLink, MapPin, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VendorCardProps {
  recommendation: VendorRecommendation;
}

export const VendorCard: React.FC<VendorCardProps> = ({ recommendation }) => {
  const { vendor, reason } = recommendation;
  
  return (
    <Card className="vendor-card overflow-hidden border-wedding-olive/30 hover:shadow-md transition-all p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-wedding-olive text-2xl">💍</span>
        <h3 className="text-xl font-serif">{vendor.nom}</h3>
        <span className="ml-auto text-lg font-semibold flex items-center">
          <Euro className="h-4 w-4 mr-1" />
          {vendor.budget}{vendor.type === 'Traiteur' ? '/pers' : ''}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="rounded-full">
          {vendor.type}
        </Badge>
        <span className="text-sm flex items-center text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" /> {vendor.lieu}
        </span>
      </div>
      
      <CardContent className="p-0 mb-4">
        <p className="text-gray-600">
          {reason}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {vendor.style.map((style) => (
            <Badge key={style} variant="outline" className="rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">
              {style}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-0">
        <Button 
          size="lg" 
          className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white flex items-center justify-center"
          asChild
        >
          <Link to="/commencer">
            <ExternalLink className="h-4 w-4 mr-2" /> Découvrir
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VendorCard;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VendorRecommendation } from '@/types';
import { FileText } from 'lucide-react';
import VendorInfoModal from './VendorInfoModal';

interface VendorCardProps {
  recommendation: VendorRecommendation;
}

export const VendorCard: React.FC<VendorCardProps> = ({ recommendation }) => {
  const { vendor, reason } = recommendation;
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <Card className="vendor-card overflow-hidden border-wedding-olive/30 hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">💍 {vendor.nom}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="outline" className="bg-secondary/30">
                  {vendor.type}
                </Badge>
                <span className="text-sm">{vendor.lieu}</span>
              </CardDescription>
            </div>
            <Badge variant="secondary" className="ml-2">
              {vendor.budget}€
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
            variant="outline" 
            size="sm" 
            className="w-full text-sm" 
            onClick={() => setShowModal(true)}
          >
            <FileText className="h-3 w-3 mr-1" /> 📄 Voir plus d'infos
          </Button>
        </CardFooter>
      </Card>

      <VendorInfoModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        vendor={vendor}
      />
    </>
  );
};

export default VendorCard;

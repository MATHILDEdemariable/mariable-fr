
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VendorMoreInfoProps {
  website?: string | null;
  vendorName: string;
}

const VendorMoreInfo: React.FC<VendorMoreInfoProps> = ({ 
  website, 
  vendorName 
}) => {
  // Ne pas afficher la section si aucune information n'est disponible
  if (!website) {
    return null;
  }

  const handleWebsiteClick = () => {
    if (website) {
      // S'assurer que l'URL commence par http:// ou https://
      const url = website.startsWith('http') ? website : `https://${website}`;
      window.open(url, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Plus d'informations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Découvrez plus de détails sur {vendorName} et leurs services.
          </p>
          
          <Button
            onClick={handleWebsiteClick}
            className="flex items-center gap-2 bg-wedding-beige hover:bg-wedding-beige-dark text-black"
          >
            <ExternalLink className="h-4 w-4" />
            Visiter le site web
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorMoreInfo;

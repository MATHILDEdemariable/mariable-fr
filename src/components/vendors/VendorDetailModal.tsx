
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AirtableVendor } from '@/types/airtable';
import { X, MapPin, Euro, Mail, Phone, Globe, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VendorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: AirtableVendor | null;
}

const VendorDetailModal: React.FC<VendorDetailModalProps> = ({ isOpen, onClose, vendor }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  if (!vendor) return null;
  
  const { fields } = vendor;
  const photos = fields.Photos || [];
  const hasBrochure = fields.Brochure && fields.Brochure.length > 0;
  
  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };
  
  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };
  
  const downloadBrochure = () => {
    if (hasBrochure) {
      window.open(fields.Brochure![0].url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif flex items-center gap-2">
            {fields.Nom}
            <Badge variant="outline" className="ml-2">
              {fields.Catégorie}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1" /> {fields.Distance || fields.Ville || 'Non spécifié'}
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </DialogClose>
        </DialogHeader>
        
        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="infos">Informations</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos" className="space-y-4">
            {photos.length > 0 ? (
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={photos[currentPhotoIndex].url} 
                    alt={`${fields.Nom} - photo ${currentPhotoIndex + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </AspectRatio>
                
                {photos.length > 1 && (
                  <>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full"
                      onClick={handlePrevPhoto}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full"
                      onClick={handleNextPhoto}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                      {photos.map((_, index) => (
                        <div 
                          key={index}
                          className={`h-1.5 w-1.5 rounded-full ${
                            index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPhotoIndex(index);
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-md">
                <p className="text-gray-500">Aucune photo disponible</p>
              </div>
            )}
            
            {hasBrochure && (
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={downloadBrochure}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger la brochure
              </Button>
            )}
            
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{fields.Description || 'Aucune description disponible'}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="infos" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Prix</h3>
              <p className="text-sm flex items-center">
                <Euro className="h-4 w-4 mr-1" />
                {fields["Prix par personne"] 
                  ? `Environ ${fields["Prix par personne"]}€ par personne`
                  : fields["Prix à partir de"] 
                    ? `À partir de ${fields["Prix à partir de"]} €` 
                    : "Prix sur demande"}
              </p>
            </div>
            
            {fields["Responsable Nom"] && (
              <div>
                <h3 className="font-medium mb-2">Responsable</h3>
                <p className="text-sm font-medium">{fields["Responsable Nom"]}</p>
                {fields["Responsable Bio"] && (
                  <p className="text-sm text-muted-foreground mt-1">{fields["Responsable Bio"]}</p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            {fields.Email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${fields.Email}`} className="text-sm hover:underline">{fields.Email}</a>
              </div>
            )}
            
            {fields.Téléphone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${fields.Téléphone}`} className="text-sm hover:underline">{fields.Téléphone}</a>
              </div>
            )}
            
            {fields["Site web"] && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <a href={fields["Site web"]} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                  {fields["Site web"]}
                </a>
              </div>
            )}
            
            {(!fields.Email && !fields.Téléphone && !fields["Site web"]) && (
              <p className="text-sm text-muted-foreground">Aucune information de contact disponible</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VendorDetailModal;

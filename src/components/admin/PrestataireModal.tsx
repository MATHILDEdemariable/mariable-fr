
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
import { Database } from '@/integrations/supabase/types';
import { X, MapPin, Euro, Mail, Phone, Globe, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from '@/integrations/supabase/client';
import { Prestataire } from './types';

type PrestatairePhoto = Database['public']['Tables']['prestataires_photos']['Row'];
type PrestataireBrochure = Database['public']['Tables']['prestataires_brochures']['Row'];

interface VendorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Prestataire | null;
}

const VendorDetailModal: React.FC<VendorDetailModalProps> = ({ isOpen, onClose, vendor }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photos, setPhotos] = useState<PrestatairePhoto[]>([]);
  const [brochures, setBrochures] = useState<PrestataireBrochure[]>([]);

  React.useEffect(() => {
    const fetchVendorMedia = async () => {
      if (vendor) {
        const { data: photoData, error: photoError } = await supabase
          .from('prestataires_photos')
          .select('*')
          .eq('prestataire_id', vendor.id);

        const { data: brochureData, error: brochureError } = await supabase
          .from('prestataires_brochures')
          .select('*')
          .eq('prestataire_id', vendor.id);

        if (photoData) setPhotos(photoData);
        if (brochureData) setBrochures(brochureData);
      }
    };

    fetchVendorMedia();
  }, [vendor]);
  
  if (!vendor) return null;
  
  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };
  
  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };
  
  const downloadBrochure = (url: string) => {
    window.open(url, '_blank');
  };

  const parsedStyles = vendor.styles ? JSON.parse(String(vendor.styles)) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif flex items-center gap-2">
            {vendor.nom}
            <Badge variant="outline" className="ml-2">
              {vendor.categorie}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1" /> 
            {vendor.ville ? `${vendor.ville}, ${vendor.region || ''}` : 'Non spécifié'}
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
                    alt={`${vendor.nom} - photo ${currentPhotoIndex + 1}`}
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
            
            {brochures.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={() => downloadBrochure(brochures[0].url)}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger la brochure
              </Button>
            )}
            
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{vendor.description || 'Aucune description disponible'}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="infos" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Prix</h3>
              <p className="text-sm flex items-center">
                <Euro className="h-4 w-4 mr-1" />
                {vendor.prix_par_personne 
                  ? `Environ ${vendor.prix_par_personne}€ par personne`
                  : vendor.prix_a_partir_de 
                    ? `À partir de ${vendor.prix_a_partir_de} €` 
                    : "Prix sur demande"}
              </p>
            </div>
            
            {vendor.responsable_nom && (
              <div>
                <h3 className="font-medium mb-2">Responsable</h3>
                <p className="text-sm font-medium">{vendor.responsable_nom}</p>
                {vendor.responsable_bio && (
                  <p className="text-sm text-muted-foreground mt-1">{vendor.responsable_bio}</p>
                )}
              </div>
            )}

            {parsedStyles.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Styles</h3>
                <div className="flex flex-wrap gap-1">
                  {parsedStyles.map((style: string) => (
                    <Badge key={style} variant="outline">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            {vendor.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${vendor.email}`} className="text-sm hover:underline">{vendor.email}</a>
              </div>
            )}
            
            {vendor.telephone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${vendor.telephone}`} className="text-sm hover:underline">{vendor.telephone}</a>
              </div>
            )}
            
            {vendor.site_web && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <a href={vendor.site_web} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                  {vendor.site_web}
                </a>
              </div>
            )}
            
            {(!vendor.email && !vendor.telephone && !vendor.site_web) && (
              <p className="text-sm text-muted-foreground">Aucune information de contact disponible</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VendorDetailModal;

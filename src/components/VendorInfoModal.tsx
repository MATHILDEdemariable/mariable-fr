
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Vendor } from '@/types';
import { X, MapPin, Euro, ExternalLink, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VendorInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
}

const VendorInfoModal: React.FC<VendorInfoModalProps> = ({ isOpen, onClose, vendor }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {vendor.nom}
            <Badge className="ml-2">{vendor.type}</Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1" /> {vendor.lieu}
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        {vendor.image && (
          <div className="w-full h-48 overflow-hidden rounded-md mb-4">
            <img 
              src={vendor.image} 
              alt={vendor.nom} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-sm">{vendor.description}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Prestations</h3>
            <ul className="text-sm list-disc pl-5 space-y-1">
              {vendor.prestations.map((prestation, index) => (
                <li key={index}>{prestation}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Style</h3>
            <div className="flex flex-wrap gap-1">
              {vendor.style.map((style) => (
                <Badge key={style} variant="outline">
                  {style}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Budget</h3>
            <p className="text-sm flex items-center">
              <Euro className="h-4 w-4 mr-1" />
              À partir de {vendor.budget} €{vendor.type === 'Traiteur' ? ' par personne' : ''}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Contact</h3>
            <p className="text-sm flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {vendor.contact}
            </p>
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Fermer
            </Button>
            <Button 
              className="bg-wedding-beige hover:bg-wedding-beige-dark text-black"
              onClick={() => window.open(vendor.lien, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Visiter le site
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorInfoModal;

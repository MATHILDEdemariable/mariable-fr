import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClubMariableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClubMariableModal: React.FC<ClubMariableModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-premium-sage-very-light flex items-center justify-center">
              <Gift className="w-6 h-6 text-premium-sage" />
            </div>
            <DialogTitle className="font-serif text-xl">Club Mariable</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Le Club Mariable arrive bientôt ! Bénéficiez de privilèges exclusifs auprès de nos partenaires.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-premium-sage-very-light/50 rounded-lg p-4 my-4">
          <h4 className="font-semibold text-foreground mb-2">Ce qui vous attend :</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-premium-sage" />
              Accès à des marques (robes, champagnes, papeterie)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-premium-sage" />
              Bons plans lieux, prestataires ou hébergement
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/mariable" onClick={onClose}>
            <Button className="w-full bg-premium-sage hover:bg-premium-sage-dark text-white">
              En savoir plus
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClubMariableModal;

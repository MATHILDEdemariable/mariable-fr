
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Sparkles } from 'lucide-react';
import StripeButton from './StripeButton';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ 
  isOpen, 
  onClose, 
  feature, 
  description 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-full">
              <Crown className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />
            Fonctionnalité Premium
          </DialogTitle>
          
          <DialogDescription className="text-center">
            {description || `Pour accéder à ${feature}, vous devez être abonné à notre version premium.`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Avec Premium, débloquez :
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Création d'étapes personnalisées</li>
              <li>• Suggestions IA avancées</li>
              <li>• Gestion d'équipe complète</li>
              <li>• Export PDF professionnel</li>
              <li>• Support prioritaire</li>
            </ul>
          </div>
          
          <div className="text-center">
            <StripeButton />
          </div>
        </div>
        
        <DialogFooter className="flex-col gap-2">
          <p className="text-xs text-muted-foreground text-center">
            Paiement sécurisé via Stripe • Déblocage immédiat
          </p>
          <Button variant="outline" onClick={onClose} className="w-full">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;

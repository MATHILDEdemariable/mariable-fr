
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, FileText, CheckSquare, Bot } from 'lucide-react';
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
            <Sparkles className="h-5 w-5 text-primary" />
            Envie d'aller plus loin ?
          </DialogTitle>
          
          <DialogDescription className="text-center">
            {description || `Débloquez ${feature} avec le compte Premium.`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-center">
              Le compte Premium à 29€ débloque :
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Export illimité de vos PDF personnalisés</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Accès complet aux checklists et guides</span>
              </li>
              <li className="flex items-start gap-2">
                <Bot className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Utilisation IA sans limite pour les checklist, retroplanning, moodboard</span>
              </li>
            </ul>
          </div>
          
          <div className="text-center">
            <StripeButton />
          </div>
        </div>
        
        <DialogFooter className="flex-col gap-2">
          <p className="text-xs text-muted-foreground text-center">
            Paiement sécurisé via Stripe • Accès immédiat et permanent
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

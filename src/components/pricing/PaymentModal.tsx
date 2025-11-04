
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StripeButton from '@/components/premium/StripeButton';
import { CreditCard } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-wedding-olive/20 p-4 rounded-full">
              <CreditCard className="h-8 w-8 text-wedding-olive" />
            </div>
          </div>
          
          <DialogTitle className="text-center">
            Abonnement Premium - 9,9€/mois
          </DialogTitle>
          
          <DialogDescription className="text-center">
            Sans engagement • Annulation en 2 clics
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Inclus dans l'abonnement :</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Toutes les fonctionnalités débloquées dont celles avec IA</li>
              <li>• Notre appli spéciale jour j pour créer facilement votre déroulé planning et votre équipe (proches, prestataires impliqués)</li>
              <li>• Support client whatsapp illimité</li>
              <li>• Guide PDF inclus</li>
              <li>• Code promo à saisir dans l'étape suivante</li>
            </ul>
          </div>
          
          <div className="text-center">
            <StripeButton />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

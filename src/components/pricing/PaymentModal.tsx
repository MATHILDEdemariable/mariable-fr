
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
            Formule Libre - 39€
          </DialogTitle>
          
          <DialogDescription className="text-center">
            Commencez votre organisation de mariage avec notre application personnalisée
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Inclus dans cette formule :</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Application personnalisée</li>
              <li>• Checklists & planning modifiables</li>
              <li>• Interface collaborative</li>
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

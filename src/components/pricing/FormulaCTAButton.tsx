
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PaymentModal from './PaymentModal';

interface FormulaCTAButtonProps {
  formula: 'libre' | 'sereine' | 'privilege';
}

const FormulaCTAButton: React.FC<FormulaCTAButtonProps> = ({ formula }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getButtonConfig = () => {
    switch (formula) {
      case 'libre':
        return {
          text: 'Commencer',
          component: (
            <>
              <Button 
                onClick={() => setShowPaymentModal(true)}
                className="bg-wedding-beige hover:bg-wedding-beige-dark text-black w-full"
              >
                Commencer
              </Button>
              <PaymentModal 
                isOpen={showPaymentModal} 
                onClose={() => setShowPaymentModal(false)} 
              />
            </>
          ),
        };
      case 'sereine':
        return {
          text: 'Faire une demande',
          component: (
            <Button asChild className="bg-wedding-beige hover:bg-wedding-beige-dark text-black w-full">
              <Link to="/reservation-jour-m">Faire une demande</Link>
            </Button>
          ),
        };
      case 'privilege':
        return {
          text: 'Faire une demande',
          component: (
            <Button asChild className="bg-wedding-beige hover:bg-wedding-beige-dark text-black w-full">
              <Link to="/reservation-jour-m">Faire une demande</Link>
            </Button>
          ),
        };
      default:
        return {
          text: 'Réserver',
          component: (
            <Button asChild className="bg-wedding-beige hover:bg-wedding-beige-dark text-black w-full">
              <Link to="/reservation-jour-m">Réserver</Link>
            </Button>
          ),
        };
    }
  };

  const config = getButtonConfig();

  return (
    <div className="mt-4">
      {config.component}
    </div>
  );
};

export default FormulaCTAButton;

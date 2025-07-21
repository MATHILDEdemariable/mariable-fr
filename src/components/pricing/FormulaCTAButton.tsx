
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import StripeButton from '@/components/premium/StripeButton';

interface FormulaCTAButtonProps {
  formula: 'libre' | 'sereine' | 'privilege';
}

const FormulaCTAButton: React.FC<FormulaCTAButtonProps> = ({ formula }) => {
  const getButtonConfig = () => {
    switch (formula) {
      case 'libre':
        return {
          text: 'Commencer',
          component: <StripeButton />,
        };
      case 'sereine':
        return {
          text: 'Faire une demande',
          component: (
            <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90 text-white w-full">
              <Link to="/reservation-jour-m">Faire une demande</Link>
            </Button>
          ),
        };
      case 'privilege':
        return {
          text: 'Faire une demande',
          component: (
            <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90 text-white w-full">
              <Link to="/reservation-jour-m">Faire une demande</Link>
            </Button>
          ),
        };
      default:
        return {
          text: 'Réserver',
          component: (
            <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90 text-white w-full">
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

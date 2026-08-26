import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

/**
 * Point d'entrée unique vers le paiement Premium : la page /paiement.
 * Aucun tarif ni lien Stripe n'est codé ici pour éviter les prix divergents.
 */
const StripeButton: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="text-center space-y-2">
        <p className="text-2xl font-bold text-wedding-olive">29€</p>
        <p className="text-sm text-gray-600">
          Paiement unique • Accès permanent
        </p>
      </div>

      <Button
        asChild
        className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white"
        size="lg"
      >
        <Link to="/paiement">Accéder au Premium</Link>
      </Button>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center justify-center gap-2">
          <Tag className="h-4 w-4" />
          <span>Code promo disponible à l'étape suivante</span>
        </div>
      </div>
    </div>
  );
};

export default StripeButton;

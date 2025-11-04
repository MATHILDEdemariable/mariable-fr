import React from 'react';
import { Helmet } from 'react-helmet-async';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';
import PremiumGate from '@/components/premium/PremiumGate';

const DrinksCalculatorPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Calculatrice Boisson | Mariable</title>
        <meta name="description" content="Calculez les quantités de boissons nécessaires pour votre mariage" />
      </Helmet>

      <PremiumGate 
        feature="Calculatrice Boisson"
        description="Calculez précisément les quantités de champagne, vin et spiritueux nécessaires pour votre mariage selon le nombre d'invités et les moments de la réception"
      >
        <DrinksCalculator />
      </PremiumGate>
    </>
  );
};

export default DrinksCalculatorPage;

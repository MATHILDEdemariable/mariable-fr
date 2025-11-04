import React from 'react';
import { Helmet } from 'react-helmet-async';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';

const DrinksCalculatorPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Calculatrice Boisson | Mariable</title>
        <meta name="description" content="Calculez les quantités de boissons nécessaires pour votre mariage" />
      </Helmet>

      <DrinksCalculator />
    </>
  );
};

export default DrinksCalculatorPage;

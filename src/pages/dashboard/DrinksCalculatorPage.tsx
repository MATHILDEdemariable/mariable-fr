import React from 'react';
import { Helmet } from 'react-helmet-async';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';

const DrinksCalculatorPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Calculateur Quantité Boissons Mariage | Mariable</title>
        <meta name="description" content="Estimez les quantités de boissons pour votre mariage : vin, champagne, soft. Calcul par nombre d'invités, moments et durée de réception." />
      </Helmet>

      <DrinksCalculator />
    </>
  );
};

export default DrinksCalculatorPage;

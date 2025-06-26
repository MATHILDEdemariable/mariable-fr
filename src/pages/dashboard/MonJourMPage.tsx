
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MonJourMDashboard from '@/components/dashboard/MonJourMDashboard';

const MonJourMPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Mon Jour-M | Mariable</title>
        <meta name="description" content="Organisez et coordonnez tous les détails de votre mariage" />
      </Helmet>
      
      <MonJourMDashboard />
    </>
  );
};

export default MonJourMPage;

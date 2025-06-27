
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMEquipeContent from '@/components/mon-jour-m/MonJourMEquipe';

const MonJourMEquipePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Équipe - Mon Jour-M | Mariable</title>
        <meta name="description" content="Gérez votre équipe de mariage et vos prestataires" />
      </Helmet>
      
      <MonJourMLayout>
        <MonJourMEquipeContent />
      </MonJourMLayout>
    </>
  );
};

export default MonJourMEquipePage;

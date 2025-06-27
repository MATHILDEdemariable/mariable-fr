
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMPlanningContent from '@/components/mon-jour-m/MonJourMPlanning';

const MonJourMPlanningPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Planning - Mon Jour-M | Mariable</title>
        <meta name="description" content="Organisez votre planning de mariage avec un système de tâches détaillé" />
      </Helmet>
      
      <MonJourMLayout>
        <MonJourMPlanningContent />
      </MonJourMLayout>
    </>
  );
};

export default MonJourMPlanningPage;

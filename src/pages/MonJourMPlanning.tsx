
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMPlanningMVP from '@/components/mon-jour-m/MonJourMPlanningMVP';

const MonJourMPlanningPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Mon Planning Jour-M | Mariable</title>
        <meta name="description" content="Organisez votre équipe et planifiez votre journée de mariage parfaite" />
      </Helmet>
      
      <MonJourMLayout>
        <MonJourMPlanningMVP />
      </MonJourMLayout>
    </>
  );
};

export default MonJourMPlanningPage;

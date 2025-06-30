
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMPlanningMVP from '@/components/mon-jour-m/MonJourMPlanningMVP';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

const MonJourMPlanningPage: React.FC = () => {
  const { coordination } = useMonJourMCoordination();

  return (
    <>
      <Helmet>
        <title>Mon Planning Jour-M | Mariable</title>
        <meta name="description" content="Organisez votre équipe et planifiez votre journée de mariage parfaite" />
      </Helmet>
      
      <MonJourMLayout coordinationId={coordination?.id}>
        <MonJourMPlanningMVP />
      </MonJourMLayout>
    </>
  );
};

export default MonJourMPlanningPage;

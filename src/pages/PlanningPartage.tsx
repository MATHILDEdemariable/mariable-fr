
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PlanningPublicView from '@/components/planning-public/PlanningPublicView';

const PlanningPartagePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Planning partagé | Mariable</title>
        <meta name="description" content="Consultez le planning de mariage partagé" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <PlanningPublicView />
    </>
  );
};

export default PlanningPartagePage;

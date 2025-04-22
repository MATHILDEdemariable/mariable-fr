
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { WeddingDayPlanner } from '@/components/wedding-day/WeddingDayPlanner';

const JourJ = () => {
  return (
    <ServiceTemplate
      title="Planning Jour-J"
      description="Créez votre déroulé de journée de mariage"
      content={<WeddingDayPlanner />}
    />
  );
};

export default JourJ;

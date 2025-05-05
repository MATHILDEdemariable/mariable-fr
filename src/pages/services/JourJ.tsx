
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { WeddingDayPlanner } from '@/components/wedding-day/WeddingDayPlanner';
import SEO from '@/components/SEO';

const JourJ = () => {
  return (
    <ServiceTemplate
      title="Planning Jour-J"
      description="Créez votre déroulé de journée de mariage"
      content={<WeddingDayPlanner />}
    >
      <SEO 
        title="Créer un planning jour J de mariage | Déroulé de cérémonie"
        description="Organisez parfaitement votre journée de mariage avec notre outil de planning. Créez un déroulé détaillé, partagez-le avec vos prestataires et profitez de votre grand jour."
        canonical="/services/jour-j"
      />
    </ServiceTemplate>
  );
};

export default JourJ;

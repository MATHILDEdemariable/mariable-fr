
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { WeddingDayScheduleGenerator } from '@/components/wedding-day/WeddingDayScheduleGenerator';

const CoordinationPage = () => {
  return (
    <>
      <Helmet>
        <title>Planning Jour J | Mariable</title>
        <meta name="description" content="Générateur de planning personnalisé pour votre jour J" />
      </Helmet>
      
      <div className="space-y-6 max-w-5xl mx-auto">
        <WeddingDayScheduleGenerator />
      </div>
    </>
  );
};

export default CoordinationPage;

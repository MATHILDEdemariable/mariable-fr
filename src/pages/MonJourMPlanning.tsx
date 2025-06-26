
import React from 'react';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMPlanningContent from '@/components/mon-jour-m/MonJourMPlanning';

const MonJourMPlanningPage: React.FC = () => {
  return (
    <MonJourMLayout>
      <MonJourMPlanningContent />
    </MonJourMLayout>
  );
};

export default MonJourMPlanningPage;

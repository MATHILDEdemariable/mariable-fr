
import React from 'react';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMEquipeContent from '@/components/mon-jour-m/MonJourMEquipe';

const MonJourMEquipePage: React.FC = () => {
  return (
    <MonJourMLayout>
      <MonJourMEquipeContent />
    </MonJourMLayout>
  );
};

export default MonJourMEquipePage;

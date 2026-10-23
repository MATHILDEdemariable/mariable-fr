
import React from 'react';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMDocumentsContent from '@/components/mon-jour-m/MonJourMDocuments';
import JourJHandoffSheets from '@/components/mon-jour-m/JourJHandoffSheets';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

const MonJourMDocumentsPage: React.FC = () => {
  const { coordination } = useMonJourMCoordination();

  return (
    <MonJourMLayout coordinationId={coordination?.id}>
      <JourJHandoffSheets />
      <MonJourMDocumentsContent />
    </MonJourMLayout>
  );
};

export default MonJourMDocumentsPage;

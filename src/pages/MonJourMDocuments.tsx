
import React from 'react';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMDocumentsContent from '@/components/mon-jour-m/MonJourMDocuments';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

const MonJourMDocumentsPage: React.FC = () => {
  const { coordination } = useMonJourMCoordination();

  return (
    <MonJourMLayout coordinationId={coordination?.id}>
      <MonJourMDocumentsContent />
    </MonJourMLayout>
  );
};

export default MonJourMDocumentsPage;

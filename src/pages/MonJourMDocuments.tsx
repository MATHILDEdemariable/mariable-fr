
import React from 'react';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMDocumentsContent from '@/components/mon-jour-m/MonJourMDocuments';

const MonJourMDocumentsPage: React.FC = () => {
  return (
    <MonJourMLayout>
      <MonJourMDocumentsContent />
    </MonJourMLayout>
  );
};

export default MonJourMDocumentsPage;

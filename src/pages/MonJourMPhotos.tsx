import React from 'react';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import PhotoListTemplate from '@/components/mon-jour-m/PhotoListTemplate';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

const MonJourMPhotosPage: React.FC = () => {
  const { coordination } = useMonJourMCoordination();
  return (
    <MonJourMLayout coordinationId={coordination?.id}>
      {coordination && <PhotoListTemplate coordinationId={coordination.id} />}
    </MonJourMLayout>
  );
};

export default MonJourMPhotosPage;

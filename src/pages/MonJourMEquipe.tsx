
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import SimpleTeamManager from '@/components/mon-jour-m/SimpleTeamManager';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

const MonJourMEquipePage: React.FC = () => {
  const { coordination } = useMonJourMCoordination();

  return (
    <>
      <Helmet>
        <title>Équipe - Mon Jour-M | Mariable</title>
        <meta name="description" content="Gérez votre équipe de mariage et vos prestataires" />
      </Helmet>
      
      <MonJourMLayout coordinationId={coordination?.id}>
        {coordination ? (
          <SimpleTeamManager coordination={coordination} />
        ) : (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
          </div>
        )}
      </MonJourMLayout>
    </>
  );
};

export default MonJourMEquipePage;

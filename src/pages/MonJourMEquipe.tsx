
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import SimpleTeamManager from '@/components/mon-jour-m/SimpleTeamManager';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

const MonJourMEquipePage: React.FC = () => {
  const { coordination } = useMonJourMCoordination();
  const { t } = useTranslation('monJourM');

  return (
    <>
      <Helmet>
        <title>{t('pages.team.metaTitle')}</title>
        <meta name="description" content={t('pages.team.metaDescription')} />
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


import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMPlanningMVP from '@/components/mon-jour-m/MonJourMPlanningMVP';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

const MonJourMPlanningPage: React.FC = () => {
  const { coordination } = useMonJourMCoordination();
  const { t } = useTranslation('monJourM');

  return (
    <>
      <Helmet>
        <title>{t('pages.planning.metaTitle')}</title>
        <meta name="description" content={t('pages.planning.metaDescription')} />
      </Helmet>
      
      <MonJourMLayout coordinationId={coordination?.id}>
        <MonJourMPlanningMVP />
      </MonJourMLayout>
    </>
  );
};

export default MonJourMPlanningPage;

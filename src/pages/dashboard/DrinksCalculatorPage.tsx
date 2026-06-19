import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';

const DrinksCalculatorPage: React.FC = () => {
  const { t } = useTranslation('weddingDay');
  return (
    <>
      <Helmet>
        <title>{t('drinks.pageTitle')}</title>
        <meta name="description" content={t('drinks.pageDesc')} />
      </Helmet>

      <DrinksCalculator />
    </>
  );
};

export default DrinksCalculatorPage;

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';
import DrinksPlanTable from '@/components/drinks/DrinksPlanTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DrinksCalculatorPage: React.FC = () => {
  const { t, i18n } = useTranslation('weddingDay');
  const isEnglish = i18n.language?.startsWith('en');
  return (
    <>
      <Helmet>
        <title>{t('drinks.pageTitle')}</title>
        <meta name="description" content={t('drinks.pageDesc')} />
      </Helmet>

      <Tabs defaultValue="plan" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="plan">{isEnglish ? 'Drinks plan' : 'Plan des boissons'}</TabsTrigger>
          <TabsTrigger value="calculator">{isEnglish ? 'Quantity calculator' : 'Calculateur de quantités'}</TabsTrigger>
        </TabsList>
        <TabsContent value="plan">
          <DrinksPlanTable />
        </TabsContent>
        <TabsContent value="calculator">
          <DrinksCalculator />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DrinksCalculatorPage;

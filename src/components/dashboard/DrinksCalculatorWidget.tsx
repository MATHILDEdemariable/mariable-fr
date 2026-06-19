
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DrinksCalculator from '@/components/drinks/DrinksCalculator'; 
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DrinksCalculatorWidget: React.FC = () => {
  const { t } = useTranslation('weddingDay');
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2">
        <CardTitle className="font-serif">{t('drinks.widgetTitle')}</CardTitle>
        <div className="mt-2 sm:mt-0">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 h-4 w-4" />
            {t('drinks.print')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DrinksCalculator />
      </CardContent>
    </Card>
  );
};

export default DrinksCalculatorWidget;

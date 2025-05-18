
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BudgetSummary from '@/components/dashboard/BudgetSummary';
import DetailedBudget from '@/components/dashboard/DetailedBudget';
import GuestManagement from '@/components/dashboard/GuestManagement';

const BudgetPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('summary');

  return (
    <>
      <Helmet>
        <title>Budget | Mariable</title>
        <meta name="description" content="Gérez le budget de votre mariage" />
      </Helmet>

      <div>
        <h1 className="text-3xl font-serif mb-6">Budget de Mariage</h1>

        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-1 sm:grid-cols-3">
            <TabsTrigger value="summary">Résumé</TabsTrigger>
            <TabsTrigger value="detailed">Budget Détaillé</TabsTrigger>
            <TabsTrigger value="guests">Gestion des Invités</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <BudgetSummary />
          </TabsContent>

          <TabsContent value="detailed">
            <DetailedBudget />
          </TabsContent>

          <TabsContent value="guests">
            <GuestManagement />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default BudgetPage;

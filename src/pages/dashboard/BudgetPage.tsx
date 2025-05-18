
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BudgetSummary from '@/components/dashboard/BudgetSummary';
import DetailedBudget from '@/components/dashboard/DetailedBudget';
import GuestManagement from '@/components/dashboard/GuestManagement';
import { BarChart, PieChart, Users } from 'lucide-react';

const BudgetPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('summary');

  return (
    <>
      <Helmet>
        <title>Budget | Mariable</title>
        <meta name="description" content="Gérez le budget de votre mariage" />
      </Helmet>

      <div>
        <h1 className="text-3xl font-serif mb-6 text-wedding-olive">Budget de Mariage</h1>

        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-1 sm:grid-cols-3 bg-wedding-cream/10">
            <TabsTrigger value="summary" className="flex items-center gap-2 data-[state=active]:bg-wedding-cream/30 data-[state=active]:text-wedding-olive">
              <PieChart className="h-4 w-4" />
              <span>Résumé</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-2 data-[state=active]:bg-wedding-cream/30 data-[state=active]:text-wedding-olive">
              <BarChart className="h-4 w-4" />
              <span>Budget Détaillé</span>
            </TabsTrigger>
            <TabsTrigger value="guests" className="flex items-center gap-2 data-[state=active]:bg-wedding-cream/30 data-[state=active]:text-wedding-olive">
              <Users className="h-4 w-4" />
              <span>Gestion des Invités</span>
            </TabsTrigger>
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

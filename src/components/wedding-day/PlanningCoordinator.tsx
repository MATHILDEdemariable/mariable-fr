
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@supabase/supabase-js';
import { PlanningProvider, usePlanning } from './context/PlanningContext';
import { PlanningForm } from './components/PlanningForm';
import { PlanningResults } from './components/PlanningResults';
import { PlanningActions } from './components/PlanningActions';

interface PlanningCoordinatorProps {
  user?: User | null;
}

const PlanningCoordinatorContent: React.FC = () => {
  const { activeTab, setActiveTab } = usePlanning();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-serif text-wedding-olive">Générateur de Planning Jour J</h1>
        <PlanningActions />
      </div>
      
      <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="form">
            Formulaire
          </TabsTrigger>
          <TabsTrigger value="results" disabled={activeTab === "form" && !setActiveTab}>
            Planning
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <PlanningForm />
        </TabsContent>
        
        <TabsContent value="results">
          <PlanningResults />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PlanningCoordinator: React.FC<PlanningCoordinatorProps> = ({ user }) => {
  return (
    <PlanningProvider user={user}>
      <PlanningCoordinatorContent />
    </PlanningProvider>
  );
};

export default PlanningCoordinator;

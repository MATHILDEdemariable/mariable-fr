
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@supabase/supabase-js';
import { PlanningProvider, usePlanning } from './context/PlanningContext';
import { PlanningForm } from './components/PlanningForm';
import { PlanningResults } from './components/PlanningResults';
import { PlanningActions } from './components/PlanningActions';
import AdviceSidebar from './components/AdviceSidebar';

interface PlanningCoordinatorProps {
  user?: User | null;
}

const PlanningCoordinatorContent: React.FC = () => {
  const { activeTab, setActiveTab } = usePlanning();
  
  return (
    <div className="flex gap-6 max-w-7xl mx-auto">
      {/* Main content area */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-serif text-wedding-olive">Générateur de Planning Jour J</h1>
          <PlanningActions />
        </div>
        
        <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger 
              value="form"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
            >
              Formulaire
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={activeTab === "form" && !setActiveTab}
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
            >
              Planning
            </TabsTrigger>
            <TabsTrigger 
              value="advice"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
            >
              Conseils
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="form">
            <PlanningForm />
          </TabsContent>
          
          <TabsContent value="results">
            <PlanningResults />
          </TabsContent>
          
          <TabsContent value="advice">
            <div className="w-full">
              <AdviceSidebar />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right sidebar - only show on planning tab */}
      {activeTab === "results" && (
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-6">
            <AdviceSidebar />
          </div>
        </div>
      )}
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

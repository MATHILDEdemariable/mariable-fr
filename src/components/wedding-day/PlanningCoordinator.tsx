
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@supabase/supabase-js';
import { PlanningProvider, usePlanning } from './context/PlanningContext';
import { PlanningForm } from './components/PlanningForm';
import { PlanningResults } from './components/PlanningResults';
import AdviceSidebar from './components/AdviceSidebar';
import TeamTasksSection from './components/TeamTasksSection';

interface PlanningCoordinatorProps {
  user?: User | null;
}

const PlanningCoordinatorContent: React.FC = () => {
  const { activeTab, setActiveTab } = usePlanning();
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      {/* Main content area */}
      <div className="flex-1 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-serif text-wedding-olive mb-4">Générateur de Planning Jour J</h1>
          
          {/* Note explicative */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>3 façons de créer votre planning :</strong> 
              ① Répondez au quizz pour obtenir en automatique un planning de déroulé jour-j personnalisé
              ② Créer ou modifier votre planning étape par étape 
              ③ Coordonnez et déléguez les tâches à votre équipe
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger 
              value="form"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
            >
              1. Formulaire
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={activeTab === "form" && !setActiveTab}
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
            >
              2. Planning
            </TabsTrigger>
            <TabsTrigger 
              value="coordination"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
            >
              3. Coordination
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="form">
            <PlanningForm />
          </TabsContent>
          
          <TabsContent value="results">
            <PlanningResults />
          </TabsContent>
          
          <TabsContent value="coordination">
            <div className="w-full">
              <TeamTasksSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right sidebar - only show on desktop and when on planning tab */}
      {activeTab === "results" && (
        <div className="hidden lg:block w-80 flex-shrink-0">
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

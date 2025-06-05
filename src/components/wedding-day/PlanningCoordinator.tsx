
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
    <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 w-full">
      {/* Main content area */}
      <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif text-wedding-olive mb-3 sm:mb-4">Générateur de Planning Jour J</h1>
          
          {/* Note explicative avec tons verts */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-wedding-olive/10 rounded-lg border border-wedding-olive/20">
            <p className="text-xs sm:text-sm text-wedding-olive leading-relaxed">
              <strong className="text-wedding-olive block sm:inline">3 façons de créer votre planning :</strong>
              <span className="block mt-1 sm:mt-2">① Répondez au quizz pour obtenir en automatique un planning de déroulé jour-j personnalisé</span>
              <span className="block mt-1">② Créer ou modifier votre planning étape par étape</span> 
              <span className="block mt-1">③ Coordonnez et déléguez les tâches à votre équipe</span>
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-auto">
            <TabsTrigger 
              value="form"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white text-xs sm:text-sm px-2 py-2 sm:py-2.5"
            >
              <span className="hidden sm:inline">1. Formulaire</span>
              <span className="sm:hidden">1. Form</span>
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={activeTab === "form" && !setActiveTab}
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white text-xs sm:text-sm px-2 py-2 sm:py-2.5"
            >
              <span className="hidden sm:inline">2. Planning</span>
              <span className="sm:hidden">2. Plan</span>
            </TabsTrigger>
            <TabsTrigger 
              value="coordination"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white text-xs sm:text-sm px-2 py-2 sm:py-2.5"
            >
              <span className="hidden sm:inline">3. Coordination</span>
              <span className="sm:hidden">3. Coord</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="mt-0">
            <PlanningForm />
          </TabsContent>
          
          <TabsContent value="results" className="mt-0">
            <PlanningResults />
          </TabsContent>
          
          <TabsContent value="coordination" className="mt-0">
            <div className="w-full">
              <TeamTasksSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right sidebar - only show on desktop and when on planning tab */}
      {activeTab === "results" && (
        <div className="hidden xl:block w-80 flex-shrink-0">
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

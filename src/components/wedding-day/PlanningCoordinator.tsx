import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { PlanningProvider } from './context/PlanningContext';
import PlanningForm from './components/PlanningForm';
import PlanningResults from './components/PlanningResults';

interface PlanningCoordinatorProps {
  user: User | null;
}

const PlanningCoordinator: React.FC<PlanningCoordinatorProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('form');

  useEffect(() => {
    // Persist tab state in localStorage
    const storedTab = localStorage.getItem('activePlanningTab');
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    // Update localStorage when activeTab changes
    localStorage.setItem('activePlanningTab', activeTab);
  }, [activeTab]);

  return (
    <PlanningProvider user={user}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-serif">Planning du Jour J</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="form">Formulaire</TabsTrigger>
              <TabsTrigger value="results">Résultats</TabsTrigger>
            </TabsList>
            <TabsContent value="form">
              <PlanningForm />
            </TabsContent>
            <TabsContent value="results">
              <PlanningResults />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PlanningProvider>
  );
};

export default PlanningCoordinator;

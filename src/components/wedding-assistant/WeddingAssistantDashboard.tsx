
import React, { useState } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ConversationalForm from './ConversationalForm';
import BriefsList from './BriefsList';
import PlanViewer from './PlanViewer';
import { useBriefContext } from './BriefContext';

const WeddingAssistantDashboard: React.FC = () => {
  const { currentBrief } = useBriefContext();
  const [activeTab, setActiveTab] = useState<string>('create');

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="create">Créer un Brief</TabsTrigger>
          <TabsTrigger value="manage">Gérer les Briefs</TabsTrigger>
          <TabsTrigger value="view" disabled={!currentBrief}>Voir le Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardContent className="pt-6">
              <ConversationalForm onComplete={() => setActiveTab('view')} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardContent className="pt-6">
              <BriefsList onViewPlan={() => setActiveTab('view')} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="view">
          <Card>
            <CardContent className="pt-6">
              {currentBrief ? (
                <PlanViewer brief={currentBrief} />
              ) : (
                <div className="text-center py-8">
                  Veuillez sélectionner un brief pour voir le plan
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeddingAssistantDashboard;

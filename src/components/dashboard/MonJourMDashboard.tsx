
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MonJourMPlanningContent from '@/components/mon-jour-m/MonJourMPlanning';
import MonJourMEquipeContent from '@/components/mon-jour-m/MonJourMEquipe';
import MonJourMDocumentsContent from '@/components/mon-jour-m/MonJourMDocuments';
import { useWeddingCoordination } from '@/hooks/useWeddingCoordination';

const MonJourMDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('planning');
  const { coordination, isLoading, refreshCoordination } = useWeddingCoordination();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshCoordination();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation de votre espace Mon Jour-M...</p>
        </div>
      </div>
    );
  }

  if (!coordination) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Erreur d'initialisation</h2>
          <p className="text-gray-600 mb-4">
            Impossible d'initialiser votre espace Mon Jour-M
          </p>
          <Button onClick={handleRefresh} variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec informations de base */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-serif text-wedding-black">
                {coordination.title}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Organisez et coordonnez tous les détails de votre mariage
              </p>
              {coordination.wedding_date && (
                <p className="text-sm text-wedding-olive font-medium mt-2">
                  {new Date(coordination.wedding_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Planning
          </TabsTrigger>
          <TabsTrigger value="equipe" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Équipe
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planning">
          <MonJourMPlanningContent />
        </TabsContent>

        <TabsContent value="equipe">
          <MonJourMEquipeContent />
        </TabsContent>

        <TabsContent value="documents">
          <MonJourMDocumentsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonJourMDashboard;

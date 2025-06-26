
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, FileText, Settings } from 'lucide-react';
import MonJourMPlanningContent from './MonJourMPlanning';
import MonJourMEquipeContent from './MonJourMEquipe';
import MonJourMDocumentsContent from './MonJourMDocuments';
import { useWeddingCoordination } from '@/hooks/useWeddingCoordination';

const MonJourMLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('planning');
  const { coordination, isLoading } = useWeddingCoordination();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation de votre espace Mon Jour-M...</p>
        </div>
      </div>
    );
  }

  if (!coordination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Erreur d'initialisation</h2>
            <p className="text-gray-600 mb-4">
              Impossible d'initialiser votre espace Mon Jour-M
            </p>
            <p className="text-sm text-gray-500">
              Veuillez actualiser la page ou nous contacter si le problème persiste.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-wedding-black mb-2">
              {coordination.title}
            </h1>
            <p className="text-gray-600">
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
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
    </div>
  );
};

export default MonJourMLayout;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { PlanningFormValues, PlanningEvent, savePlanningResponses } from './types/planningTypes';
import PlanningQuiz from './PlanningQuiz';
import PlanningTimeline from './PlanningTimeline';
import { exportDashboardToPDF } from '@/services/pdfExportService';

interface PlanningCoordinatorProps {
  user?: User | null;
}

const PlanningCoordinator: React.FC<PlanningCoordinatorProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string>("form");
  const [formData, setFormData] = useState<PlanningFormValues | null>(null);
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleFormSubmit = async (data: PlanningFormValues, generatedEvents: PlanningEvent[]) => {
    setFormData(data);
    setEvents(generatedEvents);
    setActiveTab("results");
    
    // Save responses to Supabase if a user is logged in
    if (user) {
      try {
        setLoading(true);
        await savePlanningResponses(
          supabase, 
          user.id, 
          user.email || undefined, 
          data, 
          generatedEvents
        );
        
        toast({
          title: "Planning sauvegardé",
          description: "Votre planning a été généré et sauvegardé avec succès."
        });
      } catch (error: any) {
        console.error("Error saving planning:", error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Une erreur est survenue lors de la sauvegarde du planning, mais vous pouvez toujours le visualiser et l'exporter.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleReset = () => {
    setFormData(null);
    setEvents([]);
    setActiveTab("form");
  };
  
  const handleExportPDF = async () => {
    if (!events.length) return;
    
    setExportLoading(true);
    
    try {
      toast({
        title: "Export PDF en cours",
        description: "Préparation de votre planning..."
      });
      
      const success = await exportDashboardToPDF(
        'planning-timeline',
        'Planning-Jour-J.pdf',
        'portrait',
        'Planning Jour J'
      );
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre planning a été exporté en PDF"
        });
      } else {
        toast({
          title: "Erreur d'export",
          description: "Une erreur s'est produite lors de l'export en PDF",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export en PDF",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  const handleShare = () => {
    // For now, just show a toast that this feature is coming soon
    toast({
      title: "Fonctionnalité à venir",
      description: "Le partage du planning sera bientôt disponible."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-serif text-wedding-olive">Générateur de Planning Jour J</h1>
        
        {events.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleReset}
            >
              <RefreshCw className="h-4 w-4" />
              Recommencer
            </Button>
            
            <Button
              variant="outline"
              className="bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive flex items-center gap-2"
              onClick={handleExportPDF}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-wedding-olive border-t-transparent rounded-full animate-spin"></div>
                  Export...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Exporter en PDF
                </>
              )}
            </Button>
            
            <Button
              className="bg-wedding-olive hover:bg-wedding-olive/80 flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="form" disabled={loading}>
            Formulaire
          </TabsTrigger>
          <TabsTrigger value="results" disabled={events.length === 0}>
            Planning
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Configurez votre jour J</CardTitle>
              <CardDescription>
                Répondez aux questions suivantes pour générer automatiquement le planning optimisé de votre journée de mariage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanningQuiz onSubmit={handleFormSubmit} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          {events.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Votre Planning Jour J</CardTitle>
                <CardDescription>
                  Voici le planning optimisé pour votre journée de mariage.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <PlanningTimeline events={events} />
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                <Button variant="outline" onClick={handleReset}>
                  Modifier les informations
                </Button>
                <Button 
                  className="bg-wedding-olive hover:bg-wedding-olive/80 w-full sm:w-auto"
                  onClick={handleExportPDF}
                  disabled={exportLoading}
                >
                  {exportLoading ? "Export en cours..." : "Télécharger en PDF"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Veuillez remplir le formulaire pour générer votre planning.</p>
                <Button 
                  className="mt-4 bg-wedding-olive hover:bg-wedding-olive/80"
                  onClick={() => setActiveTab("form")}
                >
                  Aller au formulaire
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanningCoordinator;

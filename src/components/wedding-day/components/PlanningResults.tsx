
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EnhancedDragDropTimeline from './EnhancedDragDropTimeline';
import { usePlanning } from '../context/PlanningContext';
import { useToast } from '@/components/ui/use-toast';
import { exportDashboardToPDF } from '@/services/pdfExportService';
import { supabase } from '@/integrations/supabase/client';
import { PlanningEvent } from '../types/planningTypes';

export const PlanningResults: React.FC = () => {
  const { events, setEvents, setActiveTab, exportLoading, setExportLoading, user, setFormData } = usePlanning();
  const { toast } = useToast();

  // Load saved planning data on component mount
  useEffect(() => {
    const loadSavedPlanning = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('planning_reponses_utilisateur')
          .select('*')
          .eq('user_id', user.id)
          .order('date_creation', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const savedPlanning = data[0];
          
          if (savedPlanning.planning_genere) {
            // Convert saved planning to PlanningEvent format
            const planningEvents = (savedPlanning.planning_genere as any[]).map(event => ({
              ...event,
              startTime: new Date(event.startTime),
              endTime: new Date(event.endTime)
            })) as PlanningEvent[];
            
            setEvents(planningEvents);
          }
          
          if (savedPlanning.reponses) {
            setFormData(savedPlanning.reponses as any);
          }
        }
      } catch (error) {
        console.error('Error loading saved planning:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger votre planning sauvegardé.",
          variant: "destructive"
        });
      }
    };

    loadSavedPlanning();
  }, [user, setEvents, setFormData, toast]);

  const handleReset = () => {
    setActiveTab("form");
  };

  const handleEventsUpdate = (updatedEvents: PlanningEvent[]) => {
    setEvents(updatedEvents);
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
        'enhanced-timeline',
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

  if (events.length === 0) {
    return (
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
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Votre Planning Jour J</CardTitle>
        <CardDescription>
          Voici le planning optimisé pour votre journée de mariage. Vous pouvez réorganiser les événements, ajouter des étapes personnalisées et modifier les détails directement.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div id="enhanced-timeline">
          <EnhancedDragDropTimeline 
            events={events} 
            onEventsUpdate={handleEventsUpdate}
          />
        </div>
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
  );
};

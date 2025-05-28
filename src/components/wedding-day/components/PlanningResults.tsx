
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import EnhancedDragDropTimeline from './EnhancedDragDropTimeline';
import TeamTasksSection from './TeamTasksSection';
import { usePlanning } from '../context/PlanningContext';
import { useToast } from '@/components/ui/use-toast';
import { exportPlanningJourJBrandedPDF } from '@/services/planningJourJBrandedExport';
import { supabase } from '@/integrations/supabase/client';
import { PlanningEvent } from '../types/planningTypes';

export const PlanningResults: React.FC = () => {
  const { events, setEvents, setActiveTab, exportLoading, setExportLoading, user, setFormData, formData } = usePlanning();
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

        if (error) {
          console.error('Error loading saved planning:', error);
          return; // Silent error handling
        }

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
        // Silent error handling - don't show error toast
      }
    };

    loadSavedPlanning();
  }, [user, setEvents, setFormData]);

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
        description: "Préparation de votre planning personnalisé..."
      });
      
      const success = await exportPlanningJourJBrandedPDF({
        events,
        weddingDate: formData?.date_mariage ? new Date(formData.date_mariage).toLocaleDateString('fr-FR') : undefined,
        coupleNames: formData?.nom_couple || "Votre mariage"
      });
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre planning Jour J a été exporté en PDF avec le design Mariable"
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
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
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Modifier les informations
            </Button>
            <Button 
              className="bg-wedding-olive hover:bg-wedding-olive/80 w-full sm:w-auto"
              onClick={handleExportPDF}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-wedding-olive border-t-transparent rounded-full animate-spin mr-2"></div>
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger en PDF
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <TeamTasksSection />
      </div>
    </div>
  );
};

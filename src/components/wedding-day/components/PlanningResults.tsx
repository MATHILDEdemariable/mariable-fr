
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PlanningTimeline from '../PlanningTimeline';
import { usePlanning } from '../context/PlanningContext';
import { useToast } from '@/components/ui/use-toast';
import { exportDashboardToPDF } from '@/services/pdfExportService';

export const PlanningResults: React.FC = () => {
  const { events, setActiveTab, exportLoading, setExportLoading } = usePlanning();
  const { toast } = useToast();

  const handleReset = () => {
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
  );
};

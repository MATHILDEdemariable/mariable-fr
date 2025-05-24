
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { usePlanning } from '../context/PlanningContext';
import { useToast } from '@/components/ui/use-toast';

export const PlanningActions: React.FC = () => {
  const { events, formData, setFormData, setEvents, setActiveTab, exportLoading, setExportLoading } = usePlanning();
  const { toast } = useToast();

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
      
      // Use the new branded planning PDF export service
      const { exportPlanningBrandedToPDF } = await import('@/services/planningBrandedExportService');
      
      const success = await exportPlanningBrandedToPDF({
        events,
        weddingDate: formData?.date_mariage ? new Date(formData.date_mariage).toLocaleDateString('fr-FR') : undefined,
        coupleNames: formData?.nom_couple || "Votre mariage"
      });
      
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

  // Only show actions when we have events
  if (!events.length) {
    return null;
  }

  return (
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
        variant="wedding"
        className="flex items-center gap-2"
        onClick={handleExportPDF}
        disabled={exportLoading}
      >
        {exportLoading ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Export...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Exporter en PDF
          </>
        )}
      </Button>
    </div>
  );
};

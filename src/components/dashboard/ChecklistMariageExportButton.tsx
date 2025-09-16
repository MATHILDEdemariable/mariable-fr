import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportDashboardToPDF } from '@/services/pdfExportService';

const ChecklistMariageExportButton: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      // Créer un conteneur temporaire avec toute la checklist
      const checklistElement = document.querySelector('[data-export-checklist]');
      if (!checklistElement) {
        // Si pas de conteneur spécifique, exporter le contenu principal
        const mainContent = document.querySelector('main') || document.body;
        await exportDashboardToPDF(
          mainContent.id || 'root',
          'ma-checklist-mariage.pdf',
          'portrait',
          'Ma Checklist de Mariage'
        );
      } else {
        await exportDashboardToPDF(
          'checklist-export-container',
          'ma-checklist-mariage.pdf',
          'portrait',
          'Ma Checklist de Mariage'
        );
      }

      toast({
        title: "Export réussi",
        description: "Votre checklist a été exportée en PDF avec succès !"
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter la checklist en PDF",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleExportPDF}
      disabled={isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      {isExporting ? 'Export...' : 'Export PDF'}
    </Button>
  );
};

export default ChecklistMariageExportButton;
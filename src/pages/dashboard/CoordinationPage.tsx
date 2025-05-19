
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { WeddingDayPlanner } from '@/components/wedding-day/WeddingDayPlanner';
import { exportDashboardToPDF } from '@/services/pdfExportService';

const CoordinationPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setLoading(true);
    
    try {
      toast({
        title: "Export PDF en cours",
        description: "Préparation de votre planning...",
      });
      
      // Ajout d'une classe spéciale pour l'export PDF
      const contentElement = document.getElementById('coordination-content');
      if (contentElement) {
        contentElement.classList.add('pdf-export-ready');
      }
      
      // Utiliser le service partagé d'exportation PDF avec des paramètres optimisés
      const success = await exportDashboardToPDF(
        'coordination-content', 
        'Planning-Jour-J.pdf', 
        'landscape',
        'Planning Jour J - Mariable'
      );
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre planning a été exporté en PDF",
        });
      } else {
        toast({
          title: "Erreur d'export",
          description: "Une erreur s'est produite lors de l'export en PDF",
          variant: "destructive"
        });
      }
      
      // Retirer la classe d'export
      if (contentElement) {
        contentElement.classList.remove('pdf-export-ready');
      }
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export en PDF",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-serif">Coordination Jour J</h1>
        <Button
          variant="outline"
          className="bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive"
          onClick={handleExportPDF}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              Export...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exporter en PDF
            </>
          )}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Planifiez votre journée</CardTitle>
          <CardDescription>
            Créez le planning détaillé de votre jour J, avec chaque moment important.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div id="coordination-content" className="pdf-optimized">
            <WeddingDayPlanner />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoordinationPage;

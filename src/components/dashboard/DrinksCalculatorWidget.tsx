
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DrinksCalculator from '@/components/drinks/DrinksCalculator'; 
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { exportDashboardToPDF } from '@/services/pdfExportService';

const DrinksCalculatorWidget: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleExportPDF = async () => {
    setLoading(true);
    
    try {
      toast({
        title: "Préparation du PDF",
        description: "Génération de votre calculateur en cours...",
      });
      
      // Ajout d'une classe spéciale pour l'export PDF
      const contentElement = document.getElementById('drinks-calculator-content');
      if (contentElement) {
        contentElement.classList.add('pdf-export-ready');
      }
      
      // Utiliser le service partagé d'exportation PDF
      const success = await exportDashboardToPDF(
        'drinks-calculator-content', 
        'Mariable-Calculateur-Boissons.pdf',
        'portrait',
        'Calculateur de Boissons - Mariable'
      );
      
      if (success) {
        toast({
          title: "PDF généré avec succès",
          description: "Votre calculateur de boissons a été exporté en PDF",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'exporter le calculateur en PDF",
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
        title: "Erreur",
        description: "Impossible d'exporter le calculateur en PDF",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2">
        <CardTitle className="font-serif">Calculateur de Boissons</CardTitle>
        <div className="mt-2 sm:mt-0 flex space-x-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive w-full sm:w-auto"
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
                Exporter
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent id="drinks-calculator-content" className="pdf-optimized">
        <DrinksCalculator />
      </CardContent>
    </Card>
  );
};

export default DrinksCalculatorWidget;

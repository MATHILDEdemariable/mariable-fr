
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { WeddingDayPlanner } from '@/components/wedding-day/WeddingDayPlanner';
import { exportDashboardToPDF } from '@/services/pdfExportService';

const CoordinationPage = () => {
  const { toast } = useToast();

  const handleExportPDF = async () => {
    toast({
      title: "Export PDF en cours",
      description: "Préparation de votre planning...",
    });
    
    setTimeout(async () => {
      const coordinationElement = document.querySelector('#coordination-content');
      
      if (!coordinationElement) {
        toast({
          title: "Erreur d'export",
          description: "Impossible de trouver le planning à exporter",
          variant: "destructive"
        });
        return;
      }
      
      const success = await exportDashboardToPDF('coordination-content', 'Planning-Jour-J.pdf', 'landscape');
      
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
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-serif">Coordination Jour J</h1>
        <Button
          variant="outline"
          className="bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive"
          onClick={handleExportPDF}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter en PDF
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
          <div id="coordination-content">
            <WeddingDayPlanner />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoordinationPage;

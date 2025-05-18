
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DrinksCalculator from '@/components/drinks/DrinksCalculator'; 
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DrinksCalculatorWidget: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleExportPDF = async () => {
    setLoading(true);
    
    try {
      // Sélectionner l'élément à exporter
      const element = document.getElementById('drinks-calculator-content');
      if (!element) throw new Error("Élément non trouvé");
      
      // Ajouter un style temporaire pour optimiser l'affichage pour l'export
      const tempStyle = document.createElement('style');
      tempStyle.innerHTML = `
        @media print {
          #drinks-calculator-export * {
            font-size: 11pt !important;
            line-height: 1.2 !important;
          }
          #drinks-calculator-export table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          #drinks-calculator-export table td, 
          #drinks-calculator-export table th {
            padding: 4px !important;
            border: 1px solid #ddd !important;
            text-align: center !important;
          }
          #drinks-calculator-export .results-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
            gap: 10px !important;
          }
          #drinks-calculator-export .result-card {
            break-inside: avoid !important;
            margin-bottom: 10px !important;
            border: 1px solid #eaeaea !important;
            padding: 8px !important;
            border-radius: 4px !important;
          }
          #drinks-calculator-export .title {
            font-size: 16pt !important;
            font-weight: bold !important;
            margin-bottom: 8pt !important;
          }
          #drinks-calculator-export .subtitle {
            font-size: 12pt !important;
            font-style: italic !important;
            margin-bottom: 12pt !important;
          }
        }
      `;
      document.head.appendChild(tempStyle);
      
      // Cloner l'élément pour le manipuler avant export
      const clone = element.cloneNode(true) as HTMLElement;
      clone.id = 'drinks-calculator-export';
      
      // Masquer les éléments non nécessaires dans le PDF
      const buttons = clone.querySelectorAll('button');
      buttons.forEach(button => button.style.display = 'none');
      
      // Ajouter des classes pour l'export
      const resultCards = clone.querySelectorAll('.result-item');
      resultCards.forEach(card => card.classList.add('result-card'));
      
      // Ajouter un titre pour le PDF
      const title = document.createElement('h1');
      title.textContent = 'Calculateur de Boissons - Mariable';
      title.classList.add('title');
      
      const subtitle = document.createElement('p');
      subtitle.textContent = `Généré le ${new Date().toLocaleDateString('fr-FR')}`;
      subtitle.classList.add('subtitle');
      
      clone.insertBefore(subtitle, clone.firstChild);
      clone.insertBefore(title, clone.firstChild);
      
      // Ajouter temporairement le clone au document
      document.body.appendChild(clone);
      
      // Optimiser pour l'impression
      clone.style.width = '21cm';
      clone.style.padding = '1cm';
      clone.style.backgroundColor = '#ffffff';
      
      // Convertir en canvas
      const canvas = await html2canvas(clone, {
        scale: 2, // Meilleure qualité
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Retirer le clone et le style
      document.body.removeChild(clone);
      document.head.removeChild(tempStyle);
      
      // Créer le PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210 - 20; // A4 width (210mm) avec des marges de 10mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Si l'image est plus haute que le format A4, ajuster pour plusieurs pages
      const pageHeight = 297 - 20; // A4 height (297mm) avec des marges de 10mm
      let heightLeft = imgHeight;
      let position = 10; // Position initiale (marge du haut)
      
      // Ajouter l'image
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Ajouter des pages supplémentaires si nécessaire
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Télécharger le PDF
      pdf.save('Mariable-Calculateur-Boissons.pdf');
      
      toast({
        title: "PDF généré avec succès",
        description: "Votre calculateur de boissons a été exporté en PDF",
      });
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
      <CardContent id="drinks-calculator-content">
        <DrinksCalculator />
      </CardContent>
    </Card>
  );
};

export default DrinksCalculatorWidget;

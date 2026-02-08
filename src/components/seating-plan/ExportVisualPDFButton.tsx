import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Lock, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportVisualPDFButtonProps {
  visualContainerId?: string;
}

const ExportVisualPDFButton = ({ visualContainerId = 'seating-plan-visual' }: ExportVisualPDFButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { 
    executeAction, 
    showPremiumModal, 
    closePremiumModal, 
    isPremium 
  } = usePremiumAction({
    feature: "Export visuel PDF",
    description: "Exportez la disposition visuelle de vos tables en PDF"
  });

  const handleExport = () => {
    executeAction(async () => {
      const visualElement = document.getElementById(visualContainerId);
      
      if (!visualElement) {
        toast({ 
          title: 'Erreur', 
          description: 'Vue visuelle non trouvée. Passez en vue visuelle pour exporter.', 
          variant: 'destructive' 
        });
        return;
      }

      setIsExporting(true);

      try {
        // Capture le canvas visuel
        const canvas = await html2canvas(visualElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });

        // Créer le PDF en format paysage
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Header avec branding
        pdf.setFillColor(127, 148, 116); // wedding-olive
        pdf.rect(0, 0, pageWidth, 20, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Plan de Table - Vue Visuelle', pageWidth / 2, 13, { align: 'center' });

        // Ajouter l'image capturée
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const maxImgHeight = pageHeight - 40;
        
        const finalHeight = Math.min(imgHeight, maxImgHeight);
        const finalWidth = (finalHeight / imgHeight) * imgWidth;
        
        const xPos = (pageWidth - finalWidth) / 2;
        pdf.addImage(imgData, 'PNG', xPos, 25, finalWidth, finalHeight);

        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Généré par Mariable.fr', pageWidth / 2, pageHeight - 5, { align: 'center' });

        pdf.save('plan-de-table-visuel.pdf');
        
        toast({ title: 'PDF visuel exporté avec succès' });
      } catch (error) {
        console.error('Erreur export PDF visuel:', error);
        toast({ 
          title: 'Erreur lors de l\'export', 
          variant: 'destructive' 
        });
      } finally {
        setIsExporting(false);
      }
    });
  };

  return (
    <>
      <Button 
        onClick={handleExport} 
        variant="outline" 
        className="w-full"
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <>
            {!isPremium && <Lock className="h-4 w-4 mr-2" />}
            <Download className="h-4 w-4 mr-2" />
          </>
        )}
        {isExporting ? 'Export...' : 'Export Visuel PDF'}
      </Button>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature="Export visuel PDF"
        description="Exportez la disposition visuelle de vos tables en PDF haute qualité"
      />
    </>
  );
};

export default ExportVisualPDFButton;

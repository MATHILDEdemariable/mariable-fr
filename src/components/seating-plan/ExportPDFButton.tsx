import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Lock, Loader2 } from 'lucide-react';
import { SeatingPlan, SeatingTable, SeatingAssignment } from '@/types/seating';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

interface ExportPDFButtonProps {
  plan: SeatingPlan | null;
  tables: SeatingTable[];
  guests: SeatingAssignment[];
}

const ExportPDFButton = ({ plan, tables, guests }: ExportPDFButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { 
    executeAction, 
    showPremiumModal, 
    closePremiumModal, 
    isPremium 
  } = usePremiumAction({
    feature: "Export PDF Plan de table",
    description: "Exportez votre plan de table complet en PDF"
  });

  const handleExport = () => {
    if (!plan) return;

    executeAction(() => {
      setIsExporting(true);
      
      try {
        const doc = new jsPDF();
        let yPos = 20;

        // === PAGE 1 - Header avec branding Mariable ===
        doc.setFillColor(127, 148, 116); // wedding-olive
        doc.rect(0, 0, 210, 35, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('Plan de Table', 105, 18, { align: 'center' });
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(plan.name || 'Mon mariage', 105, 28, { align: 'center' });

        yPos = 45;
        doc.setTextColor(60, 60, 60);

        // Informations du mariage
        if (plan.event_date || plan.venue_name) {
          doc.setFontSize(10);
          if (plan.event_date) {
            doc.text(`Date : ${new Date(plan.event_date).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}`, 20, yPos);
            yPos += 6;
          }
          if (plan.venue_name) {
            doc.text(`Lieu : ${plan.venue_name}`, 20, yPos);
            yPos += 6;
          }
          yPos += 4;
        }

        // Encadré statistiques
        const statsBoxY = yPos;
        doc.setDrawColor(127, 148, 116);
        doc.setLineWidth(0.5);
        doc.roundedRect(20, statsBoxY, 170, 25, 3, 3);
        
        const assignedGuests = guests.filter(g => g.table_id).length;
        const unassignedGuests = guests.filter(g => !g.table_id).length;
        const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
        const fillRate = totalCapacity > 0 ? Math.round((assignedGuests / totalCapacity) * 100) : 0;

        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(`${guests.length}`, 55, statsBoxY + 10, { align: 'center' });
        doc.text(`${tables.length}`, 105, statsBoxY + 10, { align: 'center' });
        doc.text(`${fillRate}%`, 155, statsBoxY + 10, { align: 'center' });
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Invités', 55, statsBoxY + 17, { align: 'center' });
        doc.text('Tables', 105, statsBoxY + 17, { align: 'center' });
        doc.text('Taux remplissage', 155, statsBoxY + 17, { align: 'center' });

        yPos = statsBoxY + 35;

        // Ligne de séparation
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(20, yPos, 190, yPos);
        yPos += 10;

        // Liste des tables avec invités
        doc.setFontSize(14);
        doc.setTextColor(127, 148, 116);
        doc.setFont(undefined, 'bold');
        doc.text('Répartition des invités', 20, yPos);
        yPos += 10;

        tables.forEach(table => {
          const tableGuests = guests.filter(g => g.table_id === table.id);
          
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          // Badge de table
          doc.setFillColor(127, 148, 116);
          doc.roundedRect(20, yPos - 5, 50, 8, 2, 2, 'F');
          
          doc.setFontSize(10);
          doc.setTextColor(255, 255, 255);
          doc.setFont(undefined, 'bold');
          doc.text(`${table.table_name}`, 22, yPos);
          
          doc.setTextColor(60, 60, 60);
          doc.setFont(undefined, 'normal');
          doc.text(`(${tableGuests.length}/${table.capacity})`, 75, yPos);
          yPos += 8;

          doc.setFontSize(9);
          tableGuests.forEach((guest, idx) => {
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
            
            let guestText = `  ${idx + 1}. ${guest.guest_name}`;
            
            // Indicateurs
            const indicators: string[] = [];
            if (guest.guest_type === 'vip') indicators.push('VIP');
            if (guest.dietary_restrictions) indicators.push('🍽️');
            
            if (indicators.length > 0) {
              guestText += ` [${indicators.join(' ')}]`;
            }
            
            doc.text(guestText, 25, yPos);
            yPos += 5;
          });

          yPos += 8;
        });

        // Invités non assignés s'il y en a
        if (unassignedGuests > 0) {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(12);
          doc.setTextColor(200, 100, 100);
          doc.setFont(undefined, 'bold');
          doc.text(`Invités non assignés (${unassignedGuests})`, 20, yPos);
          yPos += 8;

          const unassigned = guests.filter(g => !g.table_id);
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.setFont(undefined, 'normal');
          
          unassigned.forEach((guest, idx) => {
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
            doc.text(`  • ${guest.guest_name}`, 25, yPos);
            yPos += 5;
          });
        }

        // Footer sur chaque page
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Généré par Mariable.fr - Page ${i}/${totalPages}`, 105, 290, { align: 'center' });
        }

        doc.save('plan-de-table.pdf');
        toast({ title: 'PDF exporté avec succès' });
      } catch (error) {
        console.error('Erreur export PDF:', error);
        toast({ title: 'Erreur lors de l\'export PDF', variant: 'destructive' });
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
        {isExporting ? 'Export...' : 'Export PDF'}
      </Button>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature="Export PDF Plan de table"
        description="Exportez votre plan de table complet en PDF haute qualité"
      />
    </>
  );
};

export default ExportPDFButton;

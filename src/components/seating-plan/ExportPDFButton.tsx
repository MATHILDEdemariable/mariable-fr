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

/** Dessine le plan de salle complet sur une page A4 paysage, à partir des positions des tables. */
const drawVisualOnePager = (doc: jsPDF, plan: SeatingPlan, tables: SeatingTable[], guests: SeatingAssignment[]) => {
  doc.addPage('a4', 'landscape');
  const pageWidth = 297;
  doc.setFillColor(127, 148, 116);
  doc.rect(0, 0, pageWidth, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(`Plan de salle — ${plan.name || 'Mon mariage'}`, pageWidth / 2, 14, { align: 'center' });

  if (tables.length === 0) {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(11);
    doc.text('Aucune table créée pour le moment.', pageWidth / 2, 100, { align: 'center' });
    return;
  }

  // Positions identiques à la vue visuelle (avec les mêmes valeurs par défaut)
  const points = tables.map((table, index) => ({
    table,
    x: table.position_x ?? 100 + (index % 4) * 180,
    y: table.position_y ?? 100 + Math.floor(index / 4) * 180,
  }));
  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));
  const area = { left: 30, top: 42, width: 237, height: 130 };
  const scale = Math.min(
    maxX > minX ? area.width / (maxX - minX) : 1,
    maxY > minY ? area.height / (maxY - minY) : 1,
    0.6,
  );
  const offsetX = area.left + (area.width - (maxX - minX) * scale) / 2;
  const offsetY = area.top + (area.height - (maxY - minY) * scale) / 2;
  const radius = Math.max(7, Math.min(13, 900 / (tables.length * 10 + 30)));

  points.forEach(({ table, x, y }) => {
    const cx = offsetX + (x - minX) * scale;
    const cy = offsetY + (y - minY) * scale;
    const tableGuests = guests.filter((g) => g.table_id === table.id);

    doc.setDrawColor(127, 148, 116);
    doc.setFillColor(248, 245, 239);
    doc.setLineWidth(0.6);
    if (table.shape === 'round') doc.circle(cx, cy, radius, 'FD');
    else if (table.shape === 'oval') doc.ellipse(cx, cy, radius * 1.3, radius, 'FD');
    else doc.rect(cx - radius * 1.5, cy - radius * 0.8, radius * 3, radius * 1.6, 'FD');

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');
    doc.text(table.table_name.slice(0, 18), cx, cy - 0.5, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(6);
    doc.text(`${tableGuests.length}/${table.capacity}`, cx, cy + 3, { align: 'center' });

    doc.setFontSize(5);
    doc.setTextColor(90, 90, 90);
    tableGuests.slice(0, 12).forEach((guest, index) => {
      doc.text(guest.guest_name.slice(0, 22), cx, cy + radius + 3 + index * 2.2, { align: 'center' });
    });
    if (tableGuests.length > 12) {
      doc.text(`+${tableGuests.length - 12}`, cx, cy + radius + 3 + 12 * 2.2, { align: 'center' });
    }
  });

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Généré par Mariable.fr — Plan visuel · Listing détaillé par table dans les pages suivantes', pageWidth / 2, 203, { align: 'center' });
};

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

        // Footer sur chaque page du listing
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Généré par Mariable.fr - Listing ${i}/${totalPages}`, 105, 290, { align: 'center' });
        }

        // === One-pager visuel (paysage), placé en page 1 ===
        drawVisualOnePager(doc, plan, tables, guests);
        doc.movePage(doc.getNumberOfPages(), 1);

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
        {isExporting ? 'Export...' : 'Export PDF complet (plan + listing)'}
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

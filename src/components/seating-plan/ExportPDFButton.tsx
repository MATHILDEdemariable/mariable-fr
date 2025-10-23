import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { SeatingPlan, SeatingTable, SeatingAssignment } from '@/types/seating';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

interface ExportPDFButtonProps {
  plan: SeatingPlan | null;
  tables: SeatingTable[];
  guests: SeatingAssignment[];
}

const ExportPDFButton = ({ plan, tables, guests }: ExportPDFButtonProps) => {
  const handleExport = () => {
    if (!plan) return;

    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Page 1 - Vue d'ensemble
      doc.setFontSize(20);
      doc.text('Plan de Table', 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(plan.name, 20, yPos);
      yPos += 8;

      if (plan.event_date) {
        doc.setFontSize(10);
        doc.text(`Date: ${new Date(plan.event_date).toLocaleDateString('fr-FR')}`, 20, yPos);
        yPos += 6;
      }

      if (plan.venue_name) {
        doc.text(`Lieu: ${plan.venue_name}`, 20, yPos);
        yPos += 6;
      }

      yPos += 10;
      doc.setFontSize(12);
      doc.text(`Total invités: ${guests.length}`, 20, yPos);
      yPos += 6;
      doc.text(`Nombre de tables: ${tables.length}`, 20, yPos);
      yPos += 10;

      // Liste des tables avec invités
      doc.setFontSize(14);
      doc.text('Répartition des invités', 20, yPos);
      yPos += 10;

      tables.forEach(table => {
        const tableGuests = guests.filter(g => g.table_id === table.id);
        
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`${table.table_name} (${tableGuests.length}/${table.capacity})`, 20, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 6;

        doc.setFontSize(10);
        tableGuests.forEach((guest, idx) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          
          let guestText = `  ${idx + 1}. ${guest.guest_name}`;
          if (guest.guest_type === 'vip') guestText += ' ⭐';
          if (guest.dietary_restrictions) guestText += ' 🍽️';
          
          doc.text(guestText, 25, yPos);
          yPos += 5;
        });

        yPos += 8;
      });

      // Pages détaillées par table
      tables.forEach(table => {
        const tableGuests = guests.filter(g => g.table_id === table.id);
        
        doc.addPage();
        yPos = 20;

        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(table.table_name, 20, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 10;

        doc.setFontSize(12);
        doc.text(`Table ${table.table_number}`, 20, yPos);
        yPos += 6;
        doc.text(`Capacité: ${table.capacity} places`, 20, yPos);
        yPos += 6;
        doc.text(`Forme: ${table.shape === 'round' ? 'Ronde' : table.shape === 'rectangle' ? 'Rectangle' : 'Ovale'}`, 20, yPos);
        yPos += 10;

        doc.setFontSize(14);
        doc.text(`Invités (${tableGuests.length})`, 20, yPos);
        yPos += 10;

        tableGuests.forEach((guest, idx) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text(`${idx + 1}. ${guest.guest_name}`, 25, yPos);
          doc.setFont(undefined, 'normal');
          yPos += 6;

          doc.setFontSize(9);
          doc.text(`Type: ${guest.guest_type === 'adult' ? 'Adulte' : guest.guest_type === 'child' ? 'Enfant' : 'VIP'}`, 30, yPos);
          yPos += 5;

          if (guest.dietary_restrictions) {
            doc.setTextColor(255, 0, 0);
            doc.text(`Restrictions: ${guest.dietary_restrictions}`, 30, yPos);
            doc.setTextColor(0, 0, 0);
            yPos += 5;
          }

          if (guest.notes) {
            doc.setTextColor(100, 100, 100);
            doc.text(`Notes: ${guest.notes}`, 30, yPos);
            doc.setTextColor(0, 0, 0);
            yPos += 5;
          }

          yPos += 3;
        });
      });

      doc.save('plan-de-table.pdf');
      toast({ title: 'PDF exporté avec succès' });
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast({ title: 'Erreur lors de l\'export PDF', variant: 'destructive' });
    }
  };

  return (
    <Button onClick={handleExport} variant="outline" className="w-full">
      <Download className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  );
};

export default ExportPDFButton;

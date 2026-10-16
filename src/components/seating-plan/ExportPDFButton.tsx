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
const drawVisualOnePager = (doc: jsPDF, plan: SeatingPlan, tables: SeatingTable[], guests: SeatingAssignment[], showGuestNames = true) => {
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

    if (!showGuestNames) return;
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
  doc.text('Généré par Mariable.fr — Plan global des tables', pageWidth / 2, 203, { align: 'center' });
};

const ExportPDFButton = ({ plan, tables, guests }: ExportPDFButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { 
    executeAction, 
    showPremiumModal, 
    closePremiumModal, 
    isPremium 
  } = usePremiumAction({
    alwaysAllow: true,
    feature: "Export PDF Plan de table",
    description: "Exportez votre plan de table complet en PDF"
  });

  const handleExport = () => {
    if (!plan) return;

    executeAction(() => {
      setIsExporting(true);
      
      try {
        const doc = new jsPDF();
        const tableNameById = new Map(tables.map((table) => [table.id, table.table_name]));
        const formatMenu = (guest: SeatingAssignment) =>
          [guest.dietary_restrictions, guest.notes].filter(Boolean).join(' · ') || 'Menu standard';

        const drawPageHeader = (title: string) => {
          doc.setFillColor(127, 148, 116);
          doc.rect(0, 0, 210, 28, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(18);
          doc.setFont(undefined, 'bold');
          doc.text(title, 105, 13, { align: 'center' });
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          const subtitle = [plan.name || 'Mon mariage', plan.event_date ? new Date(plan.event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '', plan.venue_name || ''].filter(Boolean).join(' · ');
          doc.text(subtitle, 105, 22, { align: 'center' });
          doc.setTextColor(60, 60, 60);
          return 40;
        };

        // === Section 1 : liste nominative alphabétique ===
        let yPos = drawPageHeader('Liste nominative des invités');
        const sortedGuests = [...guests].sort((a, b) => a.guest_name.localeCompare(b.guest_name, 'fr', { sensitivity: 'base' }));
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text('Invité', 20, yPos);
        doc.text('Table', 150, yPos);
        yPos += 3;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPos, 190, yPos);
        yPos += 5;
        doc.setFont(undefined, 'normal');
        if (sortedGuests.length === 0) doc.text('Aucun invité pour le moment.', 20, yPos);
        sortedGuests.forEach((guest) => {
          if (yPos > 280) { doc.addPage(); yPos = 20; }
          doc.text(guest.guest_name.slice(0, 70), 20, yPos);
          doc.text(guest.table_id ? (tableNameById.get(guest.table_id) || '-').slice(0, 25) : 'Non placé', 150, yPos);
          yPos += 5.5;
        });

        // === Section 2 : table par table avec menus ===
        doc.addPage();
        yPos = drawPageHeader('Plan de table par table & menus');
        const tablesWithUnassigned = [
          ...tables.map((table) => ({ label: `${table.table_name} (${guests.filter(g => g.table_id === table.id).length}/${table.capacity})`, list: guests.filter(g => g.table_id === table.id) })),
          ...(guests.some(g => !g.table_id) ? [{ label: 'Invités non placés', list: guests.filter(g => !g.table_id) }] : []),
        ];
        tablesWithUnassigned.forEach(({ label, list }) => {
          if (yPos > 255) { doc.addPage(); yPos = 20; }
          doc.setFillColor(248, 245, 239);
          doc.rect(20, yPos - 5, 170, 8, 'F');
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(99, 116, 90);
          doc.text(label, 22, yPos);
          yPos += 8;
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
          list.forEach((guest) => {
            if (yPos > 280) { doc.addPage(); yPos = 20; }
            doc.setFont(undefined, 'normal');
            doc.text(guest.guest_name.slice(0, 50), 24, yPos);
            doc.setTextColor(110, 110, 110);
            doc.text(formatMenu(guest).slice(0, 55), 110, yPos);
            doc.setTextColor(60, 60, 60);
            yPos += 5.5;
          });
          yPos += 6;
        });

        // Pied de page
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Généré par Mariable.fr - ${i}/${totalPages + 1}`, 105, 290, { align: 'center' });
        }

        // === Section 3 : plan global sans noms ===
        drawVisualOnePager(doc, plan, tables, guests, false);

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
        {isExporting ? 'Export...' : 'Export PDF (liste, tables & menus, plan)'}
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

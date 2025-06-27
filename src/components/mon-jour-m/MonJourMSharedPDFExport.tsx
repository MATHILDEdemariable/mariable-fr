
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PlanningTask, addMinutesToTime } from '@/types/monjourm-mvp';
import jsPDF from 'jspdf';

interface MonJourMSharedPDFExportProps {
  tasks: PlanningTask[];
  weddingInfo: any;
  filterRole?: string;
}

const MonJourMSharedPDFExport: React.FC<MonJourMSharedPDFExportProps> = ({
  tasks,
  weddingInfo,
  filterRole
}) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Configuration
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(89, 120, 73); // wedding-olive
    doc.text(weddingInfo?.title || 'Planning Jour-M', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    if (filterRole) {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Vue filtrée : ${filterRole}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
    }
    
    if (weddingInfo?.wedding_date) {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      const weddingDate = new Date(weddingInfo.wedding_date);
      doc.text(
        weddingDate.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        pageWidth / 2,
        yPosition,
        { align: 'center' }
      );
      yPosition += 20;
    }
    
    // Résumé
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Résumé du planning', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const totalDuration = tasks.reduce((acc, task) => acc + task.duration, 0);
    const totalHours = Math.floor(totalDuration / 60);
    const totalMinutes = totalDuration % 60;
    
    doc.text(`• ${tasks.length} tâches planifiées`, margin, yPosition);
    yPosition += 5;
    doc.text(`• Durée totale : ${totalHours}h${totalMinutes > 0 ? `${totalMinutes}min` : ''}`, margin, yPosition);
    yPosition += 5;
    
    if (tasks.length > 0) {
      const startTime = tasks[0].start_time;
      const lastTask = tasks[tasks.length - 1];
      const endTime = addMinutesToTime(lastTask.start_time, lastTask.duration);
      doc.text(`• Plage horaire : ${startTime} - ${endTime}`, margin, yPosition);
    }
    yPosition += 15;
    
    // Liste des tâches
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Planning détaillé', margin, yPosition);
    yPosition += 10;
    
    tasks.forEach((task) => {
      // Vérifier si on a assez de place pour cette tâche
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }
      
      const endTime = addMinutesToTime(task.start_time, task.duration);
      
      // Titre et heure
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${task.start_time} - ${endTime}`, margin, yPosition);
      doc.setTextColor(89, 120, 73); // wedding-olive
      doc.text(task.title, margin + 40, yPosition);
      yPosition += 6;
      
      // Description
      if (task.description) {
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        const descriptionLines = doc.splitTextToSize(task.description, pageWidth - 2 * margin - 40);
        doc.text(descriptionLines, margin + 40, yPosition);
        yPosition += descriptionLines.length * 4;
      }
      
      // Badges
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      let badgeText = `${task.category}`;
      if (task.assigned_role) {
        badgeText += ` • ${task.assigned_role}`;
      }
      badgeText += ` • Priorité ${task.priority === 'high' ? 'Élevée' : task.priority === 'medium' ? 'Moyenne' : 'Faible'}`;
      doc.text(badgeText, margin + 40, yPosition);
      yPosition += 10;
      
      // Ligne de séparation
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
    });
    
    // Pied de page
    const pageCount = doc.internal.pages.length - 1; // -1 car le premier élément est vide
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Planning généré par Mariable • Page ${i}/${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Télécharger
    const filename = `planning-jour-m${filterRole ? `-${filterRole.toLowerCase()}` : ''}.pdf`;
    doc.save(filename);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={exportToPDF}
      className="flex items-center gap-2"
    >
      <Download className="h-3.5 w-3.5" />
      PDF
    </Button>
  );
};

export default MonJourMSharedPDFExport;

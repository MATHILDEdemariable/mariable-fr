
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PlanningEvent } from '@/components/wedding-day/types/planningTypes';

export interface PlanningBrandedExportData {
  events: PlanningEvent[];
  weddingDate?: string;
  coupleNames?: string;
}

export const exportPlanningBrandedToPDF = async (
  data: PlanningBrandedExportData,
  fileName: string = 'Mariable-Planning-Jour-J.pdf'
) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Set PDF metadata
    pdf.setProperties({
      title: 'Planning Jour J - Mariable',
      subject: 'Planning personnalisé pour votre journée de mariage',
      author: 'Mariable',
      creator: 'Mariable',
      keywords: 'mariage, planning, jour j, organisation'
    });

    // Mariable colors
    const colors = {
      olive: [127, 148, 116],
      cream: [248, 246, 240],
      light: [241, 247, 243],
      black: [0, 0, 0],
      gray: [107, 114, 128],
      white: [255, 255, 255]
    };

    let yPosition = 20;
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Header with branding
    pdf.setFillColor(...colors.olive);
    pdf.rect(0, 0, pageWidth, 35, 'F');
    
    // Logo text (replace with actual logo if available)
    pdf.setTextColor(...colors.white);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('Mariable', margin, 22);
    
    yPosition = 45;

    // Title section
    pdf.setTextColor(...colors.olive);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.text('Planning Jour J', margin, yPosition);
    
    yPosition += 12;
    
    // Subtitle
    pdf.setTextColor(...colors.gray);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(data.coupleNames || 'Votre mariage', margin, yPosition);
    
    if (data.weddingDate) {
      yPosition += 8;
      pdf.text(data.weddingDate, margin, yPosition);
    }
    
    yPosition += 20;

    // Events timeline
    pdf.setFillColor(...colors.light);
    pdf.rect(margin, yPosition - 5, contentWidth, 12, 'F');
    
    pdf.setTextColor(...colors.olive);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Planning détaillé', margin + 5, yPosition + 3);
    
    yPosition += 15;

    // Sort events by start time
    const sortedEvents = [...data.events].sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );

    // Group events by category for better organization
    const eventsByCategory = sortedEvents.reduce((acc, event) => {
      const category = event.category || 'Autres';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(event);
      return acc;
    }, {} as Record<string, PlanningEvent[]>);

    // Render events by category
    Object.entries(eventsByCategory).forEach(([category, events]) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Category header
      pdf.setFillColor(...colors.cream);
      pdf.rect(margin, yPosition - 2, contentWidth, 8, 'F');
      
      pdf.setTextColor(...colors.olive);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text(category, margin + 2, yPosition + 3);
      
      yPosition += 10;

      // Events in category
      events.forEach((event) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }

        const startTime = event.startTime.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        const endTime = event.endTime.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        // Time column
        pdf.setTextColor(...colors.black);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text(`${startTime} - ${endTime}`, margin + 2, yPosition);

        // Event title
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        const titleText = event.title.length > 40 ? 
          event.title.substring(0, 37) + '...' : 
          event.title;
        pdf.text(titleText, margin + 35, yPosition);

        // Duration
        pdf.setTextColor(...colors.gray);
        pdf.setFontSize(8);
        pdf.text(`(${event.duration} min)`, margin + 135, yPosition);

        yPosition += 6;

        // Add notes if available and highlighted
        if (event.isHighlight && event.notes) {
          pdf.setTextColor(...colors.gray);
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(7);
          const notesText = event.notes.length > 60 ? 
            event.notes.substring(0, 57) + '...' : 
            event.notes;
          pdf.text(notesText, margin + 37, yPosition);
          yPosition += 4;
        }
      });

      yPosition += 5; // Space between categories
    });

    // Recommendations section
    if (yPosition < 220) {
      yPosition += 10;
      
      pdf.setFillColor(...colors.light);
      pdf.rect(margin, yPosition - 5, contentWidth, 12, 'F');
      
      pdf.setTextColor(...colors.olive);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Conseils pour votre jour J', margin + 5, yPosition + 3);
      
      yPosition += 15;
      
      const recommendations = [
        'Prévoyez des créneaux de pause entre les moments forts',
        'Gardez du temps supplémentaire pour les photos',
        'Confirmez les horaires avec tous vos prestataires 48h avant',
        'Désignez une personne de confiance pour coordonner le planning'
      ];
      
      pdf.setTextColor(...colors.black);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      
      recommendations.forEach((rec) => {
        if (yPosition < 260) {
          pdf.text(`• ${rec}`, margin + 2, yPosition);
          yPosition += 6;
        }
      });
    }

    // Footer
    const footerY = 280;
    pdf.setDrawColor(...colors.gray);
    pdf.line(margin, footerY, margin + contentWidth, footerY);
    
    pdf.setTextColor(...colors.gray);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} sur mariable.fr`, margin, footerY + 8);
    pdf.text('Pour plus d\'outils de planification, visitez mariable.fr', margin, footerY + 15);

    // Save PDF
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating branded planning PDF:', error);
    return false;
  }
};

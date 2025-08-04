import jsPDF from 'jspdf';

interface PublicPlanningBrandedData {
  coordination: {
    title: string;
    wedding_date?: string;
  };
  tasks: Array<{
    title: string;
    start_time?: string;
    end_time?: string;
    description?: string;
    status: string;
    priority?: string;
    assigned_to?: string[];
  }>;
  teamMembers: Array<{
    name: string;
    role: string;
    type: string;
    contact?: string;
  }>;
  documents: Array<{
    title: string;
    description?: string;
  }>;
  pinterestLinks?: Array<{
    title: string;
    description?: string;
    pinterest_url: string;
  }>;
}

export const exportPublicPlanningBrandedToPDF = async (data: PublicPlanningBrandedData): Promise<boolean> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Header avec branding Mariable
    pdf.setFillColor(77, 85, 73); // wedding-olive
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MARIABLE', margin, 20);
    
    pdf.setFontSize(12);
    pdf.text('Planning Jour-J', pageWidth - margin - 50, 20);

    yPosition = 45;

    // Titre du planning
    pdf.setTextColor(77, 85, 73);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    const title = data.coordination.title.length > 50 ? 
      data.coordination.title.substring(0, 47) + '...' : 
      data.coordination.title;
    pdf.text(title, margin, yPosition);
    yPosition += 15;

    // Date du mariage
    if (data.coordination.wedding_date) {
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      const weddingDate = new Date(data.coordination.wedding_date);
      const formattedDate = weddingDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(formattedDate, margin, yPosition);
      yPosition += 15;
    }

    // Ligne de séparation
    pdf.setDrawColor(77, 85, 73);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Section Timeline
    pdf.setTextColor(77, 85, 73);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Timeline du Jour-J', margin, yPosition);
    yPosition += 12;

    // Tâches triées par heure
    const sortedTasks = [...data.tasks].sort((a, b) => {
      if (!a.start_time && !b.start_time) return 0;
      if (!a.start_time) return 1;
      if (!b.start_time) return -1;
      return a.start_time.localeCompare(b.start_time);
    });

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    sortedTasks.forEach((task) => {
      if (yPosition > 260) {
        pdf.addPage();
        yPosition = margin;
      }

      // Heure
      const timeStr = task.start_time ? 
        (task.end_time ? `${task.start_time} - ${task.end_time}` : task.start_time) : 
        'Heure TBD';
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(timeStr, margin, yPosition);
      
      // Titre de la tâche
      pdf.setFont('helvetica', 'normal');
      const taskTitle = task.title.length > 60 ? task.title.substring(0, 57) + '...' : task.title;
      pdf.text(taskTitle, margin + 30, yPosition);
      
      // Statut
      if (task.status === 'completed') {
        pdf.setTextColor(0, 150, 0);
        pdf.text('✓', pageWidth - margin - 15, yPosition);
        pdf.setTextColor(0, 0, 0);
      }
      
      yPosition += 6;

      // Description si disponible
      if (task.description && task.description.trim()) {
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        const desc = task.description.length > 80 ? task.description.substring(0, 77) + '...' : task.description;
        pdf.text(`   ${desc}`, margin, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        yPosition += 5;
      }
      
      yPosition += 3;
    });

    yPosition += 10;

    // Section Équipe
    if (data.teamMembers.length > 0) {
      if (yPosition > 220) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setTextColor(77, 85, 73);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Équipe du Jour-J', margin, yPosition);
      yPosition += 12;

      const people = data.teamMembers.filter(m => m.type === 'person' && m.role !== 'Autre prestataire');
      const vendors = data.teamMembers.filter(m => m.type === 'vendor' || m.role === 'Autre prestataire');

      if (people.length > 0) {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Équipe personnelle :', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        people.forEach((member) => {
          pdf.text(`• ${member.name} - ${member.role}`, margin + 5, yPosition);
          if (member.contact) {
            pdf.text(member.contact, margin + 80, yPosition);
          }
          yPosition += 5;
        });
        yPosition += 5;
      }

      if (vendors.length > 0) {
        if (yPosition > 240) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Prestataires :', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        vendors.forEach((vendor) => {
          pdf.text(`• ${vendor.name} - ${vendor.role}`, margin + 5, yPosition);
          if (vendor.contact) {
            pdf.text(vendor.contact, margin + 80, yPosition);
          }
          yPosition += 5;
        });
      }
    }

    // Section Documents et Pinterest (si présents)
    if (data.documents.length > 0 || (data.pinterestLinks && data.pinterestLinks.length > 0)) {
      if (yPosition > 220) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setTextColor(77, 85, 73);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Documents & Inspiration', margin, yPosition);
      yPosition += 12;

      if (data.documents.length > 0) {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Documents :', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        data.documents.forEach((doc) => {
          pdf.text(`• ${doc.title}`, margin + 5, yPosition);
          if (doc.description) {
            yPosition += 4;
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`  ${doc.description}`, margin + 7, yPosition);
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
          }
          yPosition += 6;
        });
      }

      if (data.pinterestLinks && data.pinterestLinks.length > 0) {
        yPosition += 5;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Inspiration Pinterest :', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        data.pinterestLinks.forEach((link) => {
          pdf.text(`• ${link.title}`, margin + 5, yPosition);
          yPosition += 4;
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`  ${link.pinterest_url}`, margin + 7, yPosition);
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(10);
          yPosition += 6;
        });
      }
    }

    // Footer avec branding
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      
      // Ligne de footer
      pdf.setDrawColor(77, 85, 73);
      pdf.setLineWidth(0.3);
      pdf.line(margin, 280, pageWidth - margin, 280);
      
      pdf.setFontSize(8);
      pdf.setTextColor(77, 85, 73);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MARIABLE.COM - Votre wedding planner digital', margin, 287);
      
      pdf.setTextColor(150, 150, 150);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page ${i}/${pageCount}`, pageWidth - margin - 15, 287);
    }

    // Sauvegarde
    const fileName = `planning-jour-j-${data.coordination.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('❌ Error exporting planning to PDF:', error);
    return false;
  }
};
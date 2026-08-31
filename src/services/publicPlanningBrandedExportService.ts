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
    duration?: number | null;
    description?: string;
    status: string;
    priority?: string;
    assigned_to?: string[];
  }>;
  teamMembers: Array<{
    name: string;
    role: string;
    type: string;
    phone?: string | null;
    email?: string | null;
    contact?: string | null;
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

const PAGE_BOTTOM_LIMIT = 270; // le footer est tracé à 280mm

export const exportPublicPlanningBrandedToPDF = async (data: PublicPlanningBrandedData): Promise<boolean> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = margin;

    // Saut de page si le bloc à écrire ne tient pas
    const ensureSpace = (blockHeight: number) => {
      if (yPosition + blockHeight > PAGE_BOTTOM_LIMIT) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Écrit un texte avec retour à la ligne et avance yPosition du nombre exact de lignes
    const writeWrapped = (
      text: string,
      x: number,
      maxWidth: number,
      lineHeight = 5
    ) => {
      const normalized = String(text).replace(/\r/g, '');
      const lines: string[] = pdf.splitTextToSize(normalized, maxWidth);
      lines.forEach((line) => {
        ensureSpace(lineHeight);
        pdf.text(line, x, yPosition);
        yPosition += lineHeight;
      });
    };

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
    writeWrapped(data.coordination.title, margin, contentWidth, 9);
    yPosition += 4;

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
      writeWrapped(formattedDate, margin, contentWidth, 7);
      yPosition += 4;
    }

    // Ligne de séparation
    pdf.setDrawColor(77, 85, 73);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 12;

    // Section Timeline
    pdf.setTextColor(77, 85, 73);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Timeline du Jour-J', margin, yPosition);
    yPosition += 10;

    // Tâches triées par heure
    const sortedTasks = [...data.tasks].sort((a, b) => {
      if (!a.start_time && !b.start_time) return 0;
      if (!a.start_time) return 1;
      if (!b.start_time) return -1;
      return a.start_time.localeCompare(b.start_time);
    });

    const timeColumnWidth = 32;

    sortedTasks.forEach((task) => {
      ensureSpace(12);
      const blockStartY = yPosition;

      // Heure (+ durée)
      const timeStr = task.start_time
        ? (task.end_time ? `${task.start_time} - ${task.end_time}` : task.start_time)
        : 'Heure TBD';

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(timeStr, margin, blockStartY);

      if (task.duration && task.duration > 0) {
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(120, 120, 120);
        pdf.text(`${task.duration} min`, margin, blockStartY + 4);
        pdf.setTextColor(0, 0, 0);
      }

      // Titre de la tâche (colonne de droite)
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      writeWrapped(task.title, margin + timeColumnWidth, contentWidth - timeColumnWidth, 5);

      // Description si disponible
      if (task.description && task.description.trim()) {
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        writeWrapped(
          task.description.trim(),
          margin + timeColumnWidth,
          contentWidth - timeColumnWidth,
          4.5
        );
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
      }

      // Garantir la hauteur minimale du bloc heure/durée
      const minBlockEnd = blockStartY + (task.duration && task.duration > 0 ? 9 : 5);
      if (yPosition < minBlockEnd) yPosition = minBlockEnd;

      yPosition += 3;
    });

    yPosition += 8;

    // Section Équipe
    if (data.teamMembers.length > 0) {
      const renderMember = (member: PublicPlanningBrandedData['teamMembers'][number]) => {
        ensureSpace(10);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        writeWrapped(`• ${member.name} - ${member.role}`, margin + 5, contentWidth - 5, 5);

        const contactParts = [member.phone, member.email, member.contact]
          .map((value) => (value ? String(value).trim() : ''))
          .filter((value, index, array) => value.length > 0 && array.indexOf(value) === index);

        if (contactParts.length > 0) {
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          writeWrapped(contactParts.join(' · '), margin + 9, contentWidth - 9, 4.5);
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(10);
        }
        yPosition += 1;
      };

      ensureSpace(24);
      pdf.setTextColor(77, 85, 73);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Équipe du Jour-J', margin, yPosition);
      yPosition += 10;

      const people = data.teamMembers.filter(m => m.type === 'person' && m.role !== 'Autre prestataire');
      const vendors = data.teamMembers.filter(m => m.type === 'vendor' || m.role === 'Autre prestataire');

      if (people.length > 0) {
        ensureSpace(14);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Équipe personnelle :', margin, yPosition);
        yPosition += 7;

        people.forEach(renderMember);
        yPosition += 4;
      }

      if (vendors.length > 0) {
        ensureSpace(14);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Prestataires :', margin, yPosition);
        yPosition += 7;

        vendors.forEach(renderMember);
        yPosition += 4;
      }
    }

    // Section Documents et Pinterest (si présents)
    if (data.documents.length > 0 || (data.pinterestLinks && data.pinterestLinks.length > 0)) {
      ensureSpace(24);
      pdf.setTextColor(77, 85, 73);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Documents & Inspiration', margin, yPosition);
      yPosition += 10;

      if (data.documents.length > 0) {
        ensureSpace(14);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Documents :', margin, yPosition);
        yPosition += 7;

        data.documents.forEach((doc) => {
          ensureSpace(10);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          writeWrapped(`• ${doc.title}`, margin + 5, contentWidth - 5, 5);

          if (doc.description && doc.description.trim()) {
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 100);
            writeWrapped(doc.description.trim(), margin + 9, contentWidth - 9, 4.5);
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
          }
          yPosition += 1;
        });
      }

      if (data.pinterestLinks && data.pinterestLinks.length > 0) {
        yPosition += 4;
        ensureSpace(14);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Inspiration Pinterest :', margin, yPosition);
        yPosition += 7;

        data.pinterestLinks.forEach((link) => {
          ensureSpace(10);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          writeWrapped(`• ${link.title}`, margin + 5, contentWidth - 5, 5);

          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          writeWrapped(link.pinterest_url, margin + 9, contentWidth - 9, 4);
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(10);
          yPosition += 1;
        });
      }
    }

    // Footer avec branding
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);

      pdf.setDrawColor(77, 85, 73);
      pdf.setLineWidth(0.3);
      pdf.line(margin, 280, pageWidth - margin, 280);

      pdf.setFontSize(8);
      pdf.setTextColor(77, 85, 73);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MARIABLE.FR - Votre wedding planner digital', margin, 287);

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

import { jsPDF } from 'jspdf';

interface PublicPlanningData {
  coordination: any;
  tasks: any[];
  teamMembers: any[];
  documents: any[];
  pinterestLinks: any[];
}

export const exportPublicPlanningToPDF = async (
  data: PublicPlanningData,
  fileName: string = 'Planning-Mariage-Public.pdf'
) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Configuration des couleurs et styles
    const primaryColor: [number, number, number] = [138, 113, 82]; // wedding-olive
    const textColor: [number, number, number] = [51, 51, 51];
    const lightGray: [number, number, number] = [128, 128, 128];

    let yPosition = 20;
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const lineHeight = 6;

    // En-tête
    pdf.setFontSize(24);
    pdf.setTextColor(...primaryColor);
    pdf.text(data.coordination.title || 'Planning du Mariage', margin, yPosition);
    yPosition += 15;

    if (data.coordination.wedding_date) {
      pdf.setFontSize(12);
      pdf.setTextColor(...lightGray);
      const date = new Date(data.coordination.wedding_date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(date, margin, yPosition);
      yPosition += 10;
    }

    // Mode consultation
    pdf.setFontSize(10);
    pdf.setTextColor(...lightGray);
    pdf.text('Mode consultation - Planning partagé en lecture seule', margin, yPosition);
    yPosition += 15;

    // Section Planning
    if (data.tasks.length > 0) {
      pdf.setFontSize(16);
      pdf.setTextColor(...primaryColor);
      pdf.text('📅 Planning du jour J', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(...textColor);

      data.tasks.forEach((task) => {
        // Vérifier si on a besoin d'une nouvelle page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        // Heure
        if (task.start_time) {
          pdf.setFont('helvetica', 'bold');
          pdf.text(task.start_time, margin, yPosition);
          pdf.setFont('helvetica', 'normal');
        }

        // Titre de la tâche
        const taskTitle = task.title || 'Tâche sans titre';
        pdf.text(taskTitle, margin + 25, yPosition);
        yPosition += lineHeight;

        // Description si présente
        if (task.description) {
          pdf.setTextColor(...lightGray);
          const lines = pdf.splitTextToSize(task.description, pageWidth - margin * 2 - 25);
          pdf.text(lines, margin + 25, yPosition);
          yPosition += lines.length * 4;
          pdf.setTextColor(...textColor);
        }

        yPosition += 2;
      });

      yPosition += 10;
    }

    // Section Équipe
    if (data.teamMembers.length > 0) {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setTextColor(...primaryColor);
      pdf.text('👥 Équipe', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(...textColor);

      const people = data.teamMembers.filter(m => m.type !== 'vendor');
      const vendors = data.teamMembers.filter(m => m.type === 'vendor');

      if (people.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Personnes:', margin, yPosition);
        pdf.setFont('helvetica', 'normal');
        yPosition += lineHeight;

        people.forEach((member) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }

          const memberInfo = `• ${member.name} (${member.role})`;
          pdf.text(memberInfo, margin + 5, yPosition);
          yPosition += 4;

          if (member.phone || member.email) {
            pdf.setTextColor(...lightGray);
            const contact = [member.phone, member.email].filter(Boolean).join(' - ');
            pdf.text(`  ${contact}`, margin + 5, yPosition);
            yPosition += 4;
            pdf.setTextColor(...textColor);
          }
        });

        yPosition += 5;
      }

      if (vendors.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Prestataires:', margin, yPosition);
        pdf.setFont('helvetica', 'normal');
        yPosition += lineHeight;

        vendors.forEach((vendor) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }

          const vendorInfo = `• ${vendor.name} (${vendor.role})`;
          pdf.text(vendorInfo, margin + 5, yPosition);
          yPosition += 4;

          if (vendor.phone || vendor.email) {
            pdf.setTextColor(...lightGray);
            const contact = [vendor.phone, vendor.email].filter(Boolean).join(' - ');
            pdf.text(`  ${contact}`, margin + 5, yPosition);
            yPosition += 4;
            pdf.setTextColor(...textColor);
          }
        });

        yPosition += 5;
      }
    }

    // Section Documents
    if (data.documents.length > 0) {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setTextColor(...primaryColor);
      pdf.text('📄 Documents', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(...textColor);

      data.documents.forEach((doc) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.text(`• ${doc.title}`, margin + 5, yPosition);
        yPosition += 4;

        if (doc.description) {
          pdf.setTextColor(...lightGray);
          pdf.text(`  ${doc.description}`, margin + 5, yPosition);
          yPosition += 4;
          pdf.setTextColor(...textColor);
        }
      });

      yPosition += 10;
    }

    // Section Pinterest
    if (data.pinterestLinks && data.pinterestLinks.length > 0) {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setTextColor(...primaryColor);
      pdf.text('📌 Inspirations Pinterest', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(...textColor);

      data.pinterestLinks.forEach((link: any) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.text(`• ${link.title}`, margin + 5, yPosition);
        yPosition += 4;

        if (link.description) {
          pdf.setTextColor(...lightGray);
          pdf.text(`  ${link.description}`, margin + 5, yPosition);
          yPosition += 4;
        }

        pdf.setTextColor(0, 0, 255);
        pdf.text(`  ${link.pinterest_url}`, margin + 5, yPosition);
        yPosition += 6;
        pdf.setTextColor(...textColor);
      });
    }

    // Pied de page
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(...lightGray);
      pdf.text(`Page ${i} / ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
      pdf.text('Généré par Mariable.fr', margin, pageHeight - 10);
    }

    // Métadonnées PDF
    pdf.setProperties({
      title: `Planning Mariage - ${data.coordination.title}`,
      subject: 'Planning de mariage partagé',
      author: 'Mariable',
      creator: 'Mariable',
      keywords: 'mariage, planning, organisation'
    });

    // Télécharger le PDF
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'export PDF public:', error);
    return false;
  }
};
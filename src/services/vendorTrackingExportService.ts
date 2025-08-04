import jsPDF from 'jspdf';

interface VendorTrackingData {
  vendors: Array<{
    vendor_name: string;
    category: string;
    status: string;
    budget?: string;
    feeling?: string;
    user_notes?: string;
    points_forts?: string;
    points_faibles?: string;
    contact_date?: Date | null;
    email?: string;
    phone?: string;
    location?: string;
  }>;
  userName?: string;
  weddingDate?: string;
}

export const exportVendorTrackingToPDF = async (data: VendorTrackingData): Promise<boolean> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Header avec logo/branding
    pdf.setFillColor(77, 85, 73); // wedding-olive
    pdf.rect(0, 0, pageWidth, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MARIABLE', margin, 17);
    
    pdf.setFontSize(12);
    pdf.text('Suivi des Prestataires', pageWidth - margin - 60, 17);

    yPosition = 40;

    // Titre principal
    pdf.setTextColor(77, 85, 73);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Mon Suivi des Prestataires', margin, yPosition);
    yPosition += 15;

    // Informations générales
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    if (data.userName) {
      pdf.text(`Nom : ${data.userName}`, margin, yPosition);
      yPosition += 6;
    }
    
    if (data.weddingDate) {
      pdf.text(`Date du mariage : ${data.weddingDate}`, margin, yPosition);
      yPosition += 6;
    }
    
    pdf.text(`Date d'export : ${new Date().toLocaleDateString('fr-FR')}`, margin, yPosition);
    pdf.text(`Nombre de prestataires : ${data.vendors.length}`, pageWidth - margin - 50, yPosition);
    yPosition += 15;

    // Ligne de séparation
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Statistiques rapides
    const statusCounts = data.vendors.reduce((acc, vendor) => {
      acc[vendor.status] = (acc[vendor.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Résumé par statut :', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    Object.entries(statusCounts).forEach(([status, count]) => {
      pdf.text(`• ${status} : ${count}`, margin + 5, yPosition);
      yPosition += 5;
    });
    yPosition += 10;

    // Table des prestataires
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Détail des prestataires :', margin, yPosition);
    yPosition += 10;

    // En-têtes de colonnes
    const colWidths = [50, 30, 30, 25, 35];
    const headers = ['Prestataire', 'Catégorie', 'Statut', 'Budget', 'Feeling'];
    
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    let xPos = margin + 2;
    headers.forEach((header, index) => {
      pdf.text(header, xPos, yPosition + 2);
      xPos += colWidths[index];
    });
    yPosition += 10;

    // Lignes de données
    pdf.setFont('helvetica', 'normal');
    data.vendors.forEach((vendor, index) => {
      if (yPosition > 260) { // Nouvelle page si nécessaire
        pdf.addPage();
        yPosition = margin;
      }

      // Alternance de couleur de fond
      if (index % 2 === 0) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
      }

      xPos = margin + 2;
      pdf.setFontSize(8);
      
      // Nom du prestataire (tronqué si trop long)
      const name = vendor.vendor_name.length > 25 ? vendor.vendor_name.substring(0, 22) + '...' : vendor.vendor_name;
      pdf.text(name, xPos, yPosition + 2);
      xPos += colWidths[0];
      
      // Catégorie
      pdf.text(vendor.category, xPos, yPosition + 2);
      xPos += colWidths[1];
      
      // Statut
      pdf.text(vendor.status, xPos, yPosition + 2);
      xPos += colWidths[2];
      
      // Budget
      pdf.text(vendor.budget || '-', xPos, yPosition + 2);
      xPos += colWidths[3];
      
      // Feeling
      pdf.text(vendor.feeling || '-', xPos, yPosition + 2);
      
      yPosition += 8;

      // Informations complémentaires sur une ligne séparée
      if (vendor.points_forts || vendor.points_faibles || vendor.user_notes) {
        pdf.setFontSize(7);
        pdf.setTextColor(100, 100, 100);
        let notes = '';
        if (vendor.points_forts) notes += `+ ${vendor.points_forts} `;
        if (vendor.points_faibles) notes += `- ${vendor.points_faibles} `;
        if (vendor.user_notes) notes += `📝 ${vendor.user_notes}`;
        
        if (notes.length > 80) notes = notes.substring(0, 77) + '...';
        pdf.text(notes, margin + 2, yPosition);
        yPosition += 6;
        pdf.setTextColor(0, 0, 0);
      }
    });

    // Footer
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i}/${pageCount}`, pageWidth - margin - 15, 290);
      pdf.text('Généré par Mariable.com', margin, 290);
    }

    // Sauvegarde
    const fileName = `suivi-prestataires-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('❌ Error exporting vendor tracking to PDF:', error);
    return false;
  }
};
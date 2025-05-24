
import { jsPDF } from 'jspdf';

export interface BudgetExportData {
  budgetData: any;
  totalBudget: number;
  guestCount: number;
  region: string;
  season: string;
}

export const exportBudgetToPDF = async (
  data: BudgetExportData,
  fileName: string = 'Mariable-Budget-Mariage.pdf'
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
      title: 'Budget de Mariage - Mariable',
      subject: 'Estimation budgétaire pour votre mariage',
      author: 'Mariable',
      creator: 'Mariable',
      keywords: 'mariage, budget, planification, organisation'
    });

    // Colors from Mariable design system
    const colors = {
      olive: [127, 148, 116],
      cream: [248, 246, 240],
      light: [241, 247, 243],
      black: [0, 0, 0],
      gray: [107, 114, 128]
    };

    let yPosition = 20;
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Header with logo placeholder
    pdf.setFillColor(...colors.olive);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Logo placeholder (you can replace with actual logo)
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.text('Mariable', margin, 25);
    
    yPosition = 50;

    // Title
    pdf.setTextColor(...colors.olive);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(28);
    pdf.text('Budget de Mariage', margin, yPosition);
    
    yPosition += 15;
    
    // Subtitle
    pdf.setTextColor(...colors.gray);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(14);
    pdf.text('Estimation personnalisée pour votre jour J', margin, yPosition);
    
    yPosition += 20;

    // Summary section
    pdf.setFillColor(...colors.light);
    pdf.rect(margin, yPosition - 5, contentWidth, 25, 'F');
    
    pdf.setTextColor(...colors.olive);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Résumé', margin + 5, yPosition + 5);
    
    yPosition += 15;
    
    pdf.setTextColor(...colors.black);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(`Budget total estimé: ${data.totalBudget.toLocaleString('fr-FR')} €`, margin + 5, yPosition);
    yPosition += 8;
    pdf.text(`Nombre d'invités: ${data.guestCount}`, margin + 5, yPosition);
    yPosition += 8;
    pdf.text(`Région: ${data.region}`, margin + 5, yPosition);
    yPosition += 8;
    pdf.text(`Saison: ${data.season}`, margin + 5, yPosition);
    
    yPosition += 20;

    // Budget breakdown section
    if (data.budgetData?.breakdown) {
      const breakdown = typeof data.budgetData.breakdown === 'string' 
        ? JSON.parse(data.budgetData.breakdown) 
        : data.budgetData.breakdown;

      if (breakdown?.categories) {
        pdf.setFillColor(...colors.light);
        pdf.rect(margin, yPosition - 5, contentWidth, 15, 'F');
        
        pdf.setTextColor(...colors.olive);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text('Répartition par catégorie', margin + 5, yPosition + 5);
        
        yPosition += 20;
        
        // Table headers
        pdf.setFillColor(...colors.cream);
        pdf.rect(margin, yPosition - 3, contentWidth, 10, 'F');
        
        pdf.setTextColor(...colors.black);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('Catégorie', margin + 2, yPosition + 3);
        pdf.text('Budget estimé', margin + 80, yPosition + 3);
        pdf.text('Coût réel', margin + 120, yPosition + 3);
        pdf.text('Reste à payer', margin + 155, yPosition + 3);
        
        yPosition += 12;
        
        // Categories
        breakdown.categories.forEach((category: any) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.text(category.name || '', margin + 2, yPosition);
          pdf.text(`${(category.totalEstimated || 0).toFixed(0)} €`, margin + 80, yPosition);
          pdf.text(`${(category.totalActual || 0).toFixed(0)} €`, margin + 120, yPosition);
          pdf.text(`${(category.totalRemaining || 0).toFixed(0)} €`, margin + 155, yPosition);
          
          yPosition += 8;
        });
        
        // Total line
        yPosition += 5;
        pdf.setDrawColor(...colors.olive);
        pdf.line(margin, yPosition, margin + contentWidth, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('TOTAL', margin + 2, yPosition);
        pdf.text(`${(breakdown.totalEstimated || 0).toFixed(0)} €`, margin + 80, yPosition);
        pdf.text(`${(breakdown.totalActual || 0).toFixed(0)} €`, margin + 120, yPosition);
        pdf.text(`${(breakdown.totalRemaining || 0).toFixed(0)} €`, margin + 155, yPosition);
      }
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
    console.error('Error generating budget PDF:', error);
    return false;
  }
};

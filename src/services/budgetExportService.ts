
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface BudgetItem {
  id: string;
  name: string;
  estimated: number;
  actual: number;
  deposit: number;
  remaining: number;
  payer?: string;
  comment?: string;
}

interface BudgetCategory {
  name: string;
  items: BudgetItem[];
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
}

interface BudgetExportData {
  categories: BudgetCategory[];
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
}

export const exportBudgetToPDF = async (budgetData: BudgetExportData): Promise<boolean> => {
  try {
    const doc = new jsPDF();
    
    // Set up the document
    doc.setFontSize(20);
    doc.text('Budget Détaillé de Mariage', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 32);
    
    let yPosition = 45;
    
    // Prepare data for the table
    const tableData: any[] = [];
    
    budgetData.categories.forEach((category) => {
      // Add category header
      tableData.push([
        { content: category.name, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: category.totalEstimated.toFixed(2) + ' €', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: category.totalActual.toFixed(2) + ' €', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: category.totalDeposit.toFixed(2) + ' €', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: category.totalRemaining.toFixed(2) + ' €', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: '', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: '', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }
      ]);
      
      // Add category items
      category.items.forEach((item) => {
        const comment = item.comment && item.comment.length > 20 
          ? item.comment.substring(0, 20) + '...' 
          : item.comment || '';
          
        tableData.push([
          item.name || '',
          (item.estimated || 0).toFixed(2) + ' €',
          (item.actual || 0).toFixed(2) + ' €',
          (item.deposit || 0).toFixed(2) + ' €',
          (item.remaining || 0).toFixed(2) + ' €',
          item.payer || '',
          comment
        ]);
      });
    });
    
    // Add total row
    tableData.push([
      { content: 'TOTAL', styles: { fontStyle: 'bold', fillColor: [200, 200, 200] } },
      { content: budgetData.totalEstimated.toFixed(2) + ' €', styles: { fontStyle: 'bold', fillColor: [200, 200, 200] } },
      { content: budgetData.totalActual.toFixed(2) + ' €', styles: { fontStyle: 'bold', fillColor: [200, 200, 200] } },
      { content: budgetData.totalDeposit.toFixed(2) + ' €', styles: { fontStyle: 'bold', fillColor: [200, 200, 200] } },
      { content: budgetData.totalRemaining.toFixed(2) + ' €', styles: { fontStyle: 'bold', fillColor: [200, 200, 200] } },
      { content: '', styles: { fontStyle: 'bold', fillColor: [200, 200, 200] } },
      { content: '', styles: { fontStyle: 'bold', fillColor: [200, 200, 200] } }
    ]);
    
    // Create the table
    (doc as any).autoTable({
      head: [['Élément', 'Estimé', 'Réel', 'Acompte', 'Reste', 'Qui paye ?', 'Note']],
      body: tableData,
      startY: yPosition,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [127, 148, 116], // wedding-olive color
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 35 }, // Élément
        1: { cellWidth: 20, halign: 'right' }, // Estimé
        2: { cellWidth: 20, halign: 'right' }, // Réel
        3: { cellWidth: 20, halign: 'right' }, // Acompte
        4: { cellWidth: 20, halign: 'right' }, // Reste
        5: { cellWidth: 25 }, // Qui paye ?
        6: { cellWidth: 30 } // Note
      },
      margin: { left: 14, right: 14 },
    });
    
    // Add a summary section if there's space
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    if (finalY < doc.internal.pageSize.height - 60) {
      doc.setFontSize(14);
      doc.text('Résumé', 14, finalY);
      
      doc.setFontSize(10);
      doc.text(`Budget total estimé: ${budgetData.totalEstimated.toFixed(2)} €`, 14, finalY + 12);
      doc.text(`Coût réel total: ${budgetData.totalActual.toFixed(2)} €`, 14, finalY + 20);
      doc.text(`Acomptes versés: ${budgetData.totalDeposit.toFixed(2)} €`, 14, finalY + 28);
      doc.text(`Reste à payer: ${budgetData.totalRemaining.toFixed(2)} €`, 14, finalY + 36);
      
      const difference = budgetData.totalActual - budgetData.totalEstimated;
      if (difference > 0) {
        doc.setTextColor(255, 0, 0);
        doc.text(`Dépassement de budget: +${difference.toFixed(2)} €`, 14, finalY + 44);
      } else if (difference < 0) {
        doc.setTextColor(0, 128, 0);
        doc.text(`Économies réalisées: ${Math.abs(difference).toFixed(2)} €`, 14, finalY + 44);
      }
    }
    
    // Save the PDF
    doc.save(`budget-detaille-${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

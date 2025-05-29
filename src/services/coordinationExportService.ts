
import jsPDF from 'jspdf';

interface CoordinationTask {
  id: string;
  title: string;
  category: string;
  assigned_to?: string;
}

interface ExportCoordinationOptions {
  tasks: CoordinationTask[];
  weddingDate?: string;
  coupleNames?: string;
}

export const exportCoordinationToPDF = async (options: ExportCoordinationOptions): Promise<boolean> => {
  try {
    const { tasks, weddingDate, coupleNames } = options;
    
    const pdf = new jsPDF();
    
    // Set fonts and colors matching the existing style
    const primaryColor = '#4A4A3A'; // wedding-olive
    const lightGray = '#666666';
    const darkGray = '#333333';
    
    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(primaryColor);
    pdf.text('Fiche de coordination', 20, 30);
    
    if (coupleNames) {
      pdf.setFontSize(16);
      pdf.setTextColor(lightGray);
      pdf.text(coupleNames, 20, 45);
    }
    
    if (weddingDate) {
      pdf.setFontSize(12);
      pdf.setTextColor(lightGray);
      pdf.text(`Date du mariage: ${weddingDate}`, 20, 55);
    }
    
    // Group tasks by category
    const categories = ['Préparatifs', 'Cérémonie', 'Cocktail', 'Repas', 'Gestion'];
    let yPosition = 75;
    
    categories.forEach(category => {
      const categoryTasks = tasks.filter(task => task.category === category);
      
      if (categoryTasks.length === 0) return;
      
      // Category header
      pdf.setFontSize(16);
      pdf.setTextColor(primaryColor);
      pdf.text(category, 20, yPosition);
      yPosition += 10;
      
      // Category tasks
      categoryTasks.forEach(task => {
        // Check if we need a new page
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        
        // Task title
        pdf.setFontSize(10);
        pdf.setTextColor(darkGray);
        const taskLines = pdf.splitTextToSize(task.title, 120);
        pdf.text(taskLines, 25, yPosition);
        
        // Assignment info
        if (task.assigned_to) {
          pdf.setFontSize(9);
          pdf.setTextColor(lightGray);
          pdf.text(`Assigné à: ${task.assigned_to}`, 150, yPosition);
        } else {
          pdf.setFontSize(9);
          pdf.setTextColor(lightGray);
          pdf.text('Non assigné', 150, yPosition);
        }
        
        yPosition += (taskLines.length * 4) + 5;
      });
      
      yPosition += 5; // Extra space between categories
    });
    
    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(lightGray);
      pdf.text(`Généré par Mariable - Page ${i}/${pageCount}`, 20, 290);
    }
    
    // Save the PDF
    const fileName = `coordination-${coupleNames?.replace(/\s+/g, '-') || 'mariage'}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating coordination PDF:', error);
    return false;
  }
};

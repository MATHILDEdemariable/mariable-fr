import jsPDF from 'jspdf';

interface Task {
  id: string;
  label: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: string;
  icon?: string;
}

interface ChecklistExportData {
  title: string;
  tasks: Task[];
  completed_tasks: string[];
  created_at: string;
}

export const exportApresJourJToPDF = async (data: ChecklistExportData): Promise<boolean> => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 6;
    let yPosition = margin;

    // Header avec branding
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('mariable.fr', pageWidth - margin, yPosition, { align: 'right' });
    yPosition += lineHeight * 2;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Checklist après le jour-J', margin, yPosition);
    yPosition += lineHeight * 1.5;

    // Date de création
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const createdDate = new Date(data.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Créée le ${createdDate}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Progress summary
    const completedCount = data.completed_tasks.length;
    const totalCount = data.tasks.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Progression: ${completedCount}/${totalCount} tâches (${progressPercent}%)`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Group tasks by category
    const groupedTasks = data.tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    // Render tasks by category in a single column
    Object.entries(groupedTasks).forEach(([category, tasks]) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }

      // Category header
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text(category, margin, yPosition);
      yPosition += lineHeight * 1.2;

      // Category tasks
      tasks.forEach((task) => {
        const isCompleted = data.completed_tasks.includes(task.id);
        
        // Check if we need a new page for this task
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        // Task checkbox and title
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        // Checkbox
        const checkboxX = margin + 5;
        const checkboxY = yPosition - 3;
        const checkboxSize = 3;
        
        doc.rect(checkboxX, checkboxY, checkboxSize, checkboxSize);
        if (isCompleted) {
          doc.text('✓', checkboxX + 0.5, checkboxY + 2.5);
        }

        // Task title
        const textX = margin + 15;
        const taskTitle = task.label;
        
        if (isCompleted) {
          doc.setTextColor(150, 150, 150);
        } else {
          doc.setTextColor(0, 0, 0);
        }
        
        doc.text(taskTitle, textX, yPosition);
        yPosition += lineHeight * 0.8;

        // Task description if exists
        if (task.description && task.description.trim()) {
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          const description = task.description;
          const descriptionLines = doc.splitTextToSize(description, pageWidth - textX - margin);
          doc.text(descriptionLines, textX, yPosition);
          yPosition += lineHeight * 0.6 * descriptionLines.length;
        }

        yPosition += lineHeight * 0.3; // Spacing between tasks
      });

      yPosition += lineHeight; // Spacing between categories
    });

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Généré par mariable.fr', margin, footerY);
    doc.text(`${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin, footerY, { align: 'right' });

    // Add page numbers if multiple pages
    const totalPages = doc.getNumberOfPages();
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i}/${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
    }

    // Save the PDF
    const fileName = `checklist-apres-jour-j-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    return false;
  }
};
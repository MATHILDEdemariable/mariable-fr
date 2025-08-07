import jsPDF from 'jspdf';

interface Task {
  label: string;
  description?: string;
  priority?: string;
  category?: string;
  icon?: string;
  completed?: boolean;
}

interface ChecklistExportData {
  title: string;
  tasks: Task[];
  completedTasks: string[];
  created_at: string;
}

export const exportAvantJourJToPDF = async (data: ChecklistExportData): Promise<boolean> => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 30;
    
    // Header avec branding
    pdf.setFontSize(20);
    pdf.setTextColor(139, 69, 19); // Brown color
    pdf.text('MARIABLE', pageWidth - 50, 20, { align: 'right' });
    
    // Titre principal
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    pdf.text(data.title, 20, yPosition);
    yPosition += 20;
    
    // Date de création
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    const createdDate = new Date(data.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Créée le ${createdDate}`, 20, yPosition);
    yPosition += 20;
    
    // Statistiques
    const totalTasks = data.tasks.length;
    const completedCount = data.completedTasks.length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Progression: ${completedCount}/${totalTasks} tâches (${progressPercentage}%)`, 20, yPosition);
    yPosition += 25;
    
    // Grouper les tâches par catégorie
    const tasksByCategory = data.tasks.reduce((acc, task) => {
      const category = task.category || 'Autres';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
    
    // Fonction pour obtenir la couleur selon la priorité
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high':
          return [220, 38, 127]; // Pink
        case 'medium':
          return [249, 115, 22]; // Orange
        case 'low':
          return [34, 197, 94]; // Green
        default:
          return [100, 100, 100]; // Gray
      }
    };
    
    // Afficher les tâches par catégorie
    Object.entries(tasksByCategory).forEach(([category, tasks]) => {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 30;
      }
      
      // Titre de la catégorie
      pdf.setFontSize(16);
      pdf.setTextColor(139, 69, 19);
      pdf.text(category.toUpperCase(), 20, yPosition);
      yPosition += 15;
      
      // Ligne de séparation
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;
      
      // Tâches de la catégorie
      tasks.forEach((task) => {
        const isCompleted = data.completedTasks.includes(task.label);
        
        // Vérifier si on a besoin d'une nouvelle page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 30;
        }
        
        // Checkbox
        pdf.setDrawColor(100, 100, 100);
        pdf.rect(20, yPosition - 8, 8, 8);
        
        if (isCompleted) {
          pdf.setTextColor(34, 197, 94);
          pdf.text('✓', 22, yPosition - 2);
        }
        
        // Texte de la tâche
        pdf.setFontSize(11);
        pdf.setTextColor(isCompleted ? 100 : 0, isCompleted ? 100 : 0, isCompleted ? 100 : 0);
        
        const maxWidth = pageWidth - 60;
        const lines = pdf.splitTextToSize(task.label, maxWidth);
        pdf.text(lines, 35, yPosition - 2);
        
        // Priorité
        if (task.priority && task.priority !== 'medium') {
          const priorityColor = getPriorityColor(task.priority);
          pdf.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
          pdf.setFontSize(9);
          
          const priorityText = task.priority === 'high' ? 'URGENT' : 'FAIBLE';
          pdf.text(priorityText, pageWidth - 50, yPosition - 2);
        }
        
        yPosition += lines.length * 6 + 5;
        
        // Description si présente
        if (task.description) {
          pdf.setFontSize(9);
          pdf.setTextColor(120, 120, 120);
          const descLines = pdf.splitTextToSize(task.description, maxWidth);
          pdf.text(descLines, 35, yPosition - 2);
          yPosition += descLines.length * 4 + 3;
        }
        
        yPosition += 3;
      });
      
      yPosition += 10;
    });
    
    // Footer sur chaque page
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Généré par Mariable.fr', 20, pageHeight - 10);
      pdf.text(`Page ${i}/${pageCount}`, pageWidth - 30, pageHeight - 10, { align: 'right' });
    }
    
    // Nom du fichier
    const fileName = `checklist-avant-jour-j-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Télécharger
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    return false;
  }
};
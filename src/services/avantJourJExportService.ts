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
    pdf.text('Checklist avant le jour-J', 20, yPosition);
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
    
    // Optimisation pour une seule page - Colonne unique avec espacement compact
    let currentColumn = 0;
    const columnWidth = pageWidth - 40;
    const tasksPerColumn = Math.floor((pageHeight - yPosition - 30) / 15);
    
    // Afficher toutes les tâches dans une liste compacte
    const allTasks = Object.entries(tasksByCategory).flatMap(([category, tasks]) => 
      [{ type: 'category', content: category }, ...tasks.map(task => ({ type: 'task', content: task }))]
    );
    
    allTasks.forEach((item, index) => {
      // Vérifier l'espace restant
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 30;
      }
      
      if (item.type === 'category') {
        // Titre de catégorie en style compact
        pdf.setFontSize(12);
        pdf.setTextColor(139, 69, 19);
        pdf.text(`${(item.content as string).toUpperCase()}`, 20, yPosition);
        yPosition += 8;
      } else {
        const task = item.content as Task;
        const isCompleted = data.completedTasks.includes(task.label);
        
        // Checkbox compact
        pdf.setDrawColor(100, 100, 100);
        pdf.rect(20, yPosition - 6, 6, 6);
        
        if (isCompleted) {
          pdf.setTextColor(34, 197, 94);
          pdf.setFontSize(8);
          pdf.text('✓', 21.5, yPosition - 2);
        }
        
        // Texte de la tâche en style compact
        pdf.setFontSize(9);
        pdf.setTextColor(isCompleted ? 120 : 0, isCompleted ? 120 : 0, isCompleted ? 120 : 0);
        
        // Limiter le texte pour tenir sur une ligne
        const maxTextWidth = columnWidth - 60;
        let taskText = task.label;
        if (pdf.getTextWidth(taskText) > maxTextWidth) {
          taskText = taskText.substring(0, 50) + '...';
        }
        
        pdf.text(taskText, 30, yPosition - 2);
        
        // Catégorie à droite
        if (task.category) {
          pdf.setFontSize(7);
          pdf.setTextColor(100, 100, 100);
          pdf.text(task.category, pageWidth - 50, yPosition - 2, { align: 'right' });
        }
        
        yPosition += 12;
      }
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

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportDashboardToPDF = async () => {
  try {
    // Sélection du dashboard
    const dashboardElement = document.querySelector('#dashboard-content');
    
    if (!dashboardElement) {
      throw new Error("Contenu du dashboard non trouvé");
    }
    
    // Création du PDF au format A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Conversion du HTML en canvas
    const canvas = await html2canvas(dashboardElement as HTMLElement, {
      scale: 2, // Meilleure qualité
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Récupération des dimensions
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Ajout de la première page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Ajout de pages supplémentaires si nécessaire
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Téléchargement du PDF
    pdf.save('Mariable-Dashboard.pdf');
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
    return false;
  }
};

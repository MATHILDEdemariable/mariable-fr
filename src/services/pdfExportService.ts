
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportDashboardToPDF = async (
  elementId: string = 'dashboard-content',
  fileName: string = 'Mariable-Dashboard.pdf',
  orientation: 'portrait' | 'landscape' = 'portrait'
) => {
  try {
    // Sélection de l'élément
    const element = document.querySelector(`#${elementId}`);
    
    if (!element) {
      throw new Error(`Élément avec l'ID ${elementId} non trouvé`);
    }
    
    // Création du PDF au format spécifié
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4'
    });
    
    // Conversion du HTML en canvas
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2, // Meilleure qualité
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Récupération des dimensions
    const imgData = canvas.toDataURL('image/png');
    
    // Définir largeur et hauteur selon orientation
    let pageWidth, pageHeight;
    
    if (orientation === 'landscape') {
      pageWidth = 297; // A4 height in mm quand en paysage
      pageHeight = 210; // A4 width in mm quand en paysage
    } else {
      pageWidth = 210; // A4 width in mm
      pageHeight = 297; // A4 height in mm
    }
    
    const imgWidth = pageWidth;
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
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
    return false;
  }
};

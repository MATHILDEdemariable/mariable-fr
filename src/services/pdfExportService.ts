
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
    
    // Ajout d'un style temporaire pour optimiser l'affichage pour l'export
    const tempStyle = document.createElement('style');
    tempStyle.innerHTML = `
      @media print {
        body * {
          font-size: 12pt !important;
          line-height: 1.2 !important;
        }
        .btn, button {
          display: none !important;
        }
        table {
          width: 100% !important;
          border-collapse: collapse !important;
        }
        table td, table th {
          padding: 4px !important;
          font-size: 10pt !important;
        }
        h1, h2, h3 {
          page-break-after: avoid !important;
          margin-bottom: 10pt !important;
        }
        .card, .shadow-sm {
          page-break-inside: avoid !important;
          margin-bottom: 15pt !important;
          box-shadow: none !important;
          border: 1px solid #eaeaea !important;
        }
        .responsive-export {
          width: 100% !important;
        }
      }
    `;
    document.head.appendChild(tempStyle);
    
    // Conversion du HTML en canvas avec une échelle optimisée
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 1.5, // Meilleure qualité
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200, // Force une largeur fixe pour la capture
      onclone: (doc) => {
        // Ajouter une classe pour identifier l'élément cloné
        const clonedElement = doc.querySelector(`#${elementId}`);
        if (clonedElement) {
          clonedElement.classList.add('responsive-export');
        }
        
        // Masquer les boutons et éléments non nécessaires dans le PDF
        const buttons = doc.querySelectorAll('button:not(.essential-button)');
        buttons.forEach(button => {
          (button as HTMLElement).style.display = 'none';
        });
      }
    });
    
    // Retirer le style temporaire
    document.head.removeChild(tempStyle);
    
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
    
    // Adapter l'image au format de la page avec marges
    const margin = 10; // marge en mm
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = margin;
    
    // Ajout du titre et de la date
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Tableau de bord Mariable", margin, position);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, margin, position + 8);
    
    // Ajuster la position de départ pour l'image
    position += 15;
    
    // Ajout de la première page
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - position - margin);
    
    // Ajout de pages supplémentaires si nécessaire
    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(
        imgData, 
        'PNG', 
        margin, 
        -(pageHeight - margin - position), 
        imgWidth, 
        imgHeight
      );
      heightLeft -= (pageHeight - (margin * 2));
    }
    
    // Optimiser la qualité du PDF
    pdf.setProperties({
      title: 'Mariable - Votre Tableau de Bord',
      subject: 'Organisation de mariage',
      creator: 'Mariable',
      keywords: 'mariage, planification, dashboard',
    });
    
    // Téléchargement du PDF
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
    return false;
  }
};

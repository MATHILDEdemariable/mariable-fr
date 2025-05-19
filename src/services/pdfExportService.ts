
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportDashboardToPDF = async (
  elementId: string = 'dashboard-content',
  fileName: string = 'Mariable-Dashboard.pdf',
  orientation: 'portrait' | 'landscape' = 'portrait',
  pageTitle: string = 'Tableau de bord Mariable'
) => {
  try {
    // Sélection de l'élément
    const element = document.querySelector(`#${elementId}`);
    
    if (!element) {
      throw new Error(`Élément avec l'ID ${elementId} non trouvé`);
    }
    
    // Ajout d'un style temporaire pour optimiser l'affichage pour l'export
    const tempStyle = document.createElement('style');
    tempStyle.innerHTML = `
      @media print {
        body * {
          font-size: 12pt !important;
          line-height: 1.3 !important;
        }
        .btn, button, .no-print {
          display: none !important;
        }
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          page-break-inside: avoid !important;
        }
        table td, table th {
          padding: 4px !important;
          font-size: 10pt !important;
          border: 1px solid #ddd !important;
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
        .text-right, .number {
          text-align: right !important;
        }
        .grid {
          display: grid !important;
        }
        .pdf-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 20px !important;
        }
        .pdf-container {
          width: 100% !important;
          max-width: 800px !important;
          margin: 0 auto !important;
          padding: 20px !important;
        }
        .pdf-title {
          font-size: 18pt !important;
          font-weight: bold !important;
          text-align: center !important;
          margin-bottom: 15pt !important;
          border-bottom: 1pt solid #ddd !important;
          padding-bottom: 10pt !important;
        }
        .pdf-subtitle {
          font-size: 14pt !important;
          font-weight: bold !important;
          margin-top: 15pt !important;
          margin-bottom: 10pt !important;
        }
        .pdf-section {
          margin-bottom: 15pt !important;
          page-break-inside: avoid !important;
        }
        .pdf-item {
          margin-bottom: 8pt !important;
          page-break-inside: avoid !important;
        }
        .pdf-timeline {
          display: grid !important;
          grid-template-columns: 120px 1fr !important;
          gap: 10px !important;
          margin-bottom: 8pt !important;
          border-bottom: 1px solid #eee !important;
          padding-bottom: 8pt !important;
        }
        .pdf-timeline-time {
          font-weight: bold !important;
        }
        .pdf-recommendation {
          background-color: #f9f9f9 !important;
          padding: 10pt !important;
          border: 1pt solid #ddd !important;
          border-radius: 5pt !important;
          margin-top: 15pt !important;
          page-break-inside: avoid !important;
        }
      }
    `;
    document.head.appendChild(tempStyle);
    
    // Création du PDF au format spécifié
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4'
    });
    
    // Préparer l'élément pour l'exportation
    const prepareElement = (doc: Document, elementId: string) => {
      const clonedElement = doc.querySelector(`#${elementId}`);
      if (clonedElement) {
        // Ajouter des classes pour améliorer le rendu PDF
        clonedElement.classList.add('responsive-export', 'pdf-container');
        
        // Ajouter un titre à l'export si nécessaire
        if (!clonedElement.querySelector('.pdf-title')) {
          const titleDiv = doc.createElement('div');
          titleDiv.classList.add('pdf-title');
          titleDiv.textContent = pageTitle;
          clonedElement.insertBefore(titleDiv, clonedElement.firstChild);
        }
        
        // Masquer les boutons et éléments non nécessaires
        const buttons = clonedElement.querySelectorAll('button:not(.essential-button)');
        buttons.forEach(button => (button as HTMLElement).style.display = 'none');
      }
    };
    
    // Conversion du HTML en canvas avec une échelle optimisée
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2, // Meilleure qualité
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: orientation === 'landscape' ? 1600 : 1200, // Force une largeur fixe pour la capture
      onclone: (doc) => prepareElement(doc, elementId)
    });
    
    // Retirer le style temporaire
    document.head.removeChild(tempStyle);
    
    // Définir dimensions selon orientation
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
    pdf.text("Mariable", margin, position);
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
      title: pageTitle,
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
  
  const imgData = canvas.toDataURL('image/png');
};

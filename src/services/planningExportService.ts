
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PlanningEvent } from '@/components/wedding-day/types/planningTypes';

export interface PlanningJourJData {
  events: PlanningEvent[];
  weddingDate?: string;
  coupleNames?: string;
}

export const exportPlanningJourJToPDF = async (
  data: PlanningJourJData,
  fileName: string = 'Mariable-Planning-Jour-J.pdf'
) => {
  try {
    // Create a temporary container for the export component
    const exportContainer = document.createElement('div');
    exportContainer.id = 'planning-export-container';
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '0';
    exportContainer.style.width = '210mm'; // A4 width
    exportContainer.style.minHeight = '297mm'; // A4 height
    exportContainer.style.backgroundColor = 'white';
    exportContainer.style.fontFamily = 'Raleway, Arial, sans-serif';
    
    // Import and render the export component
    const { default: PlanningJourJExport } = await import('@/components/wedding-day/PlanningJourJExport');
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');
    
    document.body.appendChild(exportContainer);
    
    // Create React element
    const exportElement = React.createElement(PlanningJourJExport, data);
    
    // Render the component
    const root = ReactDOM.createRoot(exportContainer);
    root.render(exportElement);
    
    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Apply export-specific styles for better PDF rendering
    const style = document.createElement('style');
    style.innerHTML = `
      #planning-export-container {
        font-family: 'Raleway', Arial, sans-serif !important;
        line-height: 1.4 !important;
        color: #000 !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      #planning-export-container * {
        font-family: 'Raleway', Arial, sans-serif !important;
        box-sizing: border-box !important;
      }
      #planning-export-container .font-serif {
        font-family: 'Playfair Display', serif !important;
      }
      #planning-export-container .export-event,
      #planning-export-container .export-category,
      #planning-export-container .export-section {
        page-break-inside: avoid !important;
      }
    `;
    document.head.appendChild(style);
    
    // Generate canvas from the rendered component with high quality
    const canvas = await html2canvas(exportContainer, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: Math.round(210 * 3.779527559), // A4 width in pixels at 96 DPI
      height: Math.round(297 * 3.779527559), // A4 height in pixels at 96 DPI
      windowWidth: 1200,
      windowHeight: 1600
    });
    
    // Create PDF optimized for single page
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Set PDF metadata
    pdf.setProperties({
      title: 'Planning Jour J - Mariable',
      subject: 'Planning personnalisé pour journée de mariage',
      author: 'Mariable',
      creator: 'Mariable',
      keywords: 'mariage, planning, jour j, organisation'
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = 210; // A4 width in mm
    const imgHeight = 297; // A4 height in mm
    
    // Add the image to fit exactly on one A4 page
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    
    // Clean up
    document.head.removeChild(style);
    document.body.removeChild(exportContainer);
    
    // Save PDF
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating planning jour j PDF:', error);
    return false;
  }
};

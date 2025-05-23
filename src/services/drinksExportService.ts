
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DrinkTier, DrinkMoment, DrinkConsumption } from '@/types/drinks';

export interface DrinksCalculatorData {
  guests: number;
  selectedMoments: DrinkMoment[];
  tier: DrinkTier;
  drinksPerPerson: DrinkConsumption;
  totalBottles: {
    champagne: number;
    wine: number;
    spirits: number;
  };
  totalCost: number;
}

export const exportDrinksCalculatorToPDF = async (
  data: DrinksCalculatorData,
  fileName: string = 'Mariable-Calculateur-Boissons.pdf'
) => {
  try {
    // Create a temporary container for the export component
    const exportContainer = document.createElement('div');
    exportContainer.id = 'drinks-export-container';
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '0';
    exportContainer.style.width = '800px';
    exportContainer.style.backgroundColor = 'white';
    
    // Import and render the export component
    const { default: DrinksCalculatorExport } = await import('@/components/drinks/DrinksCalculatorExport');
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');
    
    document.body.appendChild(exportContainer);
    
    // Create React element
    const exportElement = React.createElement(DrinksCalculatorExport, data);
    
    // Render the component
    const root = ReactDOM.createRoot(exportContainer);
    root.render(exportElement);
    
    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Apply export-specific styles
    const style = document.createElement('style');
    style.innerHTML = `
      #drinks-export-container {
        font-family: Arial, sans-serif !important;
        line-height: 1.5 !important;
        color: #000 !important;
      }
      #drinks-export-container * {
        font-family: Arial, sans-serif !important;
      }
      #drinks-export-container .export-field {
        page-break-inside: avoid !important;
      }
      #drinks-export-container .export-moment {
        page-break-inside: avoid !important;
      }
      #drinks-export-container .export-result {
        page-break-inside: avoid !important;
      }
    `;
    document.head.appendChild(style);
    
    // Generate canvas from the rendered component
    const canvas = await html2canvas(exportContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 800,
      height: exportContainer.scrollHeight
    });
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Clean up
    document.head.removeChild(style);
    document.body.removeChild(exportContainer);
    
    // Save PDF
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating drinks calculator PDF:', error);
    return false;
  }
};


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PlanningEvent } from '@/components/wedding-day/types/planningTypes';

interface PlanningExportData {
  events: PlanningEvent[];
  weddingDate?: string;
  coupleNames?: string;
}

export const exportPlanningBrandedPDF = async (data: PlanningExportData): Promise<boolean> => {
  try {
    // Create temporary container for PDF content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    tempContainer.style.padding = '20mm';
    tempContainer.style.boxSizing = 'border-box';

    // Generate branded PDF content
    tempContainer.innerHTML = generateBrandedContent(data);
    document.body.appendChild(tempContainer);

    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate PDF using html2canvas and jsPDF
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempContainer.scrollWidth,
      height: tempContainer.scrollHeight
    });

    // Clean up temporary container
    document.body.removeChild(tempContainer);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      // Content fits on one page
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Content needs multiple pages
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
    }

    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const filename = `planning-mariage-mariable-${date}.pdf`;

    // Save PDF
    pdf.save(filename);
    return true;

  } catch (error) {
    console.error('Error generating branded PDF:', error);
    return false;
  }
};

const generateBrandedContent = (data: PlanningExportData): string => {
  const currentDate = new Date().toLocaleDateString('fr-FR');
  
  return `
    <div style="min-height: 100%; display: flex; flex-direction: column;">
      <!-- Header with Mariable branding -->
      <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #7F9474;">
        <div style="font-size: 32px; font-weight: 700; color: #7F9474; font-family: serif; margin-bottom: 8px;">
          Mariable
        </div>
        <div style="font-size: 18px; color: #948970; font-weight: 500;">
          Planning de mariage personnalisé
        </div>
      </div>

      <!-- Wedding details -->
      <div style="text-align: center; margin-bottom: 40px; padding: 20px; background-color: #f8f6f0; border-radius: 12px;">
        <h1 style="font-size: 28px; font-weight: 700; color: #1A1F2C; margin: 0 0 12px 0; font-family: serif;">
          ${data.coupleNames || 'Votre Planning de Mariage'}
        </h1>
        ${data.weddingDate ? `
          <p style="font-size: 16px; color: #666; margin: 0;">
            ${data.weddingDate}
          </p>
        ` : ''}
      </div>

      <!-- Timeline events -->
      <div style="flex: 1;">
        <h2 style="font-size: 22px; font-weight: 600; color: #7F9474; margin-bottom: 24px; font-family: serif;">
          Déroulé de la journée
        </h2>
        
        <div style="display: grid; gap: 16px;">
          ${data.events.map(event => `
            <div style="display: flex; align-items: flex-start; padding: 16px; background-color: ${event.isHighlight ? '#7F9474' : '#ffffff'}; border: 2px solid ${event.isHighlight ? '#7F9474' : '#e5e7eb'}; border-radius: 8px; ${event.isHighlight ? 'color: white;' : 'color: #1A1F2C;'}">
              <div style="min-width: 80px; font-weight: 600; font-size: 14px; margin-right: 16px;">
                ${event.startTime}
              </div>
              <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">
                  ${event.title}
                </div>
                ${event.category ? `
                  <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">
                    ${event.category}
                  </div>
                ` : ''}
                ${event.notes ? `
                  <div style="font-size: 14px; opacity: 0.9;">
                    ${event.notes}
                  </div>
                ` : ''}
              </div>
              <div style="min-width: 60px; text-align: right; font-size: 12px; opacity: 0.8;">
                ${event.duration} min
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #666;">
          <div>
            Généré le ${currentDate}
          </div>
          <div style="font-weight: 600; color: #7F9474;">
            mariable.fr
          </div>
        </div>
        <div style="margin-top: 12px; font-size: 11px; color: #999; text-align: center;">
          Planning personnalisé créé avec Mariable - Votre partenaire pour un mariage réussi
        </div>
      </div>
    </div>
  `;
};

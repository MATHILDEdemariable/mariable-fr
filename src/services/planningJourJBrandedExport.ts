
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PlanningEvent } from '@/components/wedding-day/types/planningTypes';

interface PlanningJourJExportData {
  events: PlanningEvent[];
  weddingDate?: string;
  coupleNames?: string;
}

export const exportPlanningJourJBrandedPDF = async (data: PlanningJourJExportData): Promise<boolean> => {
  try {
    // Create temporary container for PDF content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.fontFamily = 'Raleway, system-ui, -apple-system, sans-serif';
    tempContainer.style.padding = '15mm';
    tempContainer.style.boxSizing = 'border-box';
    tempContainer.style.lineHeight = '1.4';

    // Generate compact branded PDF content
    tempContainer.innerHTML = generateCompactPlanningContent(data);
    document.body.appendChild(tempContainer);

    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 200));

    // Generate PDF using html2canvas and jsPDF
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempContainer.scrollWidth,
      height: tempContainer.scrollHeight,
      logging: false
    });

    // Clean up temporary container
    document.body.removeChild(tempContainer);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
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
    const filename = `planning-jour-j-mariable-${date}.pdf`;

    // Save PDF
    pdf.save(filename);
    return true;

  } catch (error) {
    console.error('Error generating branded planning PDF:', error);
    return false;
  }
};

const formatTime = (time: Date | string): string => {
  const date = typeof time === 'string' ? new Date(time) : time;
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

const groupEventsByCategory = (events: PlanningEvent[]) => {
  const categories = {
    'Préparatifs': ['préparatifs', 'preparation', 'préparatifs_final'],
    'Cérémonie': ['cérémonie', 'ceremony'],
    'Cocktail': ['cocktail', 'photos'],
    'Réception': ['repas', 'dinner'],
    'Soirée': ['soiree', 'party', 'musique'],
    'Transport': ['trajet', 'transport'],
    'Autres': []
  };

  const grouped: Record<string, PlanningEvent[]> = {};
  
  // Initialize all categories
  Object.keys(categories).forEach(cat => {
    grouped[cat] = [];
  });

  events.forEach(event => {
    let assigned = false;
    
    for (const [categoryName, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => 
        event.category?.toLowerCase().includes(keyword) ||
        event.title?.toLowerCase().includes(keyword)
      )) {
        grouped[categoryName].push(event);
        assigned = true;
        break;
      }
    }
    
    if (!assigned) {
      grouped['Autres'].push(event);
    }
  });

  // Remove empty categories
  return Object.fromEntries(
    Object.entries(grouped).filter(([_, events]) => events.length > 0)
  );
};

const getCategoryColor = (category: string) => {
  // Use only brand colors: green, beige, black
  switch (category) {
    case 'Préparatifs':
      return { primary: '#7F9474', light: '#f1f7f3', text: '#1a5d40' };
    case 'Cérémonie':
      return { primary: '#1a5d40', light: '#f8f6f0', text: '#000000' };
    case 'Cocktail':
      return { primary: '#7F9474', light: '#f1f7f3', text: '#1a5d40' };
    case 'Réception':
      return { primary: '#1a5d40', light: '#f8f6f0', text: '#000000' };
    case 'Soirée':
      return { primary: '#7F9474', light: '#f1f7f3', text: '#1a5d40' };
    case 'Transport':
      return { primary: '#1a5d40', light: '#f8f6f0', text: '#000000' };
    default:
      return { primary: '#7F9474', light: '#f8f6f0', text: '#000000' };
  }
};

const generateCompactPlanningContent = (data: PlanningJourJExportData): string => {
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const groupedEvents = groupEventsByCategory(data.events);
  
  return `
    <div style="font-family: 'Raleway', sans-serif; color: #000000; line-height: 1.4; max-width: 100%;">
      <!-- Compact Header with Logo -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #1a5d40;">
        <div style="flex: 1;">
          <h1 style="font-size: 28px; font-weight: 700; color: #1a5d40; margin: 0 0 8px 0; font-family: 'Playfair Display', serif;">
            Planning personnalisé
          </h1>
          <div style="font-size: 16px; color: #7F9474; font-weight: 600; margin: 0;">
            ${data.coupleNames || 'Votre mariage'}
          </div>
          ${data.weddingDate ? `
            <div style="font-size: 14px; color: #666; margin-top: 4px;">
              ${data.weddingDate}
            </div>
          ` : ''}
        </div>
        <div style="text-align: right;">
          <div style="font-size: 24px; font-weight: 700; color: #7F9474; font-family: 'Playfair Display', serif;">
            Mariable
          </div>
          <div style="font-size: 12px; color: #666; margin-top: 2px;">
            mariable.fr
          </div>
        </div>
      </div>

      <!-- Compact Planning Content -->
      <div style="max-width: 100%;">
        ${Object.entries(groupedEvents).map(([categoryName, events]) => {
          const colors = getCategoryColor(categoryName);
          
          return `
            <!-- Compact Category Section -->
            <div style="margin-bottom: 18px; page-break-inside: avoid;">
              <!-- Category Header -->
              <div style="margin-bottom: 12px;">
                <h2 style="font-size: 18px; font-weight: 600; color: ${colors.primary}; margin: 0 0 6px 0; font-family: 'Playfair Display', serif; padding: 8px 0; border-bottom: 1px solid ${colors.light};">
                  ${categoryName}
                </h2>
              </div>
              
              <!-- Compact Events List -->
              <div style="margin-left: 8px;">
                ${events.map((event, index) => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; margin-bottom: 6px; background: ${colors.light}; border-left: 3px solid ${colors.primary}; border-radius: 0 4px 4px 0;">
                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-weight: 600; color: ${colors.primary}; font-size: 14px; min-width: 50px;">
                          ${formatTime(event.startTime)}
                        </div>
                        <div style="font-weight: 600; color: ${colors.text}; font-size: 14px; flex: 1;">
                          ${event.title}
                        </div>
                      </div>
                      ${event.notes ? `
                        <div style="font-size: 12px; color: #666; margin-top: 4px; margin-left: 62px;">
                          ${event.notes}
                        </div>
                      ` : ''}
                    </div>
                    <div style="text-align: right; margin-left: 12px;">
                      ${event.endTime ? `
                        <div style="font-size: 12px; color: #666; margin-bottom: 2px;">
                          → ${formatTime(event.endTime)}
                        </div>
                      ` : ''}
                      <div style="font-size: 11px; color: ${colors.primary}; background: white; padding: 2px 8px; border-radius: 10px; font-weight: 600;">
                        ${event.duration} min
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
        
        <!-- Compact Summary Section -->
        <div style="margin-top: 24px; padding: 16px; background: #f8f6f0; border-radius: 6px; border: 1px solid #e8e5db;">
          <h2 style="font-size: 16px; font-weight: 600; color: #1a5d40; margin: 0 0 12px 0; font-family: 'Playfair Display', serif; text-align: center;">
            Résumé de votre journée
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
            ${Object.entries(groupedEvents).map(([categoryName, events]) => {
              const colors = getCategoryColor(categoryName);
              const totalDuration = events.reduce((sum, event) => sum + (event.duration || 0), 0);
              
              return `
                <div style="text-align: center; padding: 12px; background: white; border-radius: 4px; border: 1px solid ${colors.light};">
                  <div style="font-size: 12px; font-weight: 600; color: ${colors.primary}; margin-bottom: 4px;">
                    ${categoryName}
                  </div>
                  <div style="font-size: 10px; color: #666; margin-bottom: 2px;">
                    ${events.length} étape${events.length > 1 ? 's' : ''}
                  </div>
                  <div style="font-size: 10px; color: #666;">
                    ${Math.floor(totalDuration / 60)}h${totalDuration % 60 > 0 ? ` ${totalDuration % 60}min` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Compact Footer -->
      <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #e8e5db; text-align: center;">
        <div style="font-size: 11px; color: #666; margin-bottom: 4px;">
          Planning généré le ${currentDate}
        </div>
        <div style="font-size: 13px; font-weight: 600; color: #7F9474;">
          mariable.fr - Votre assistant mariage personnalisé
        </div>
      </div>
    </div>
  `;
};

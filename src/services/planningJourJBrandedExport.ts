
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
    tempContainer.style.lineHeight = '1.5';

    // Generate branded PDF content
    tempContainer.innerHTML = generateBrandedPlanningContent(data);
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
  switch (category) {
    case 'Préparatifs':
      return { primary: '#8B5CF6', light: '#F3E8FF', dark: '#6D28D9' };
    case 'Cérémonie':
      return { primary: '#7F9474', light: '#F1F7F3', dark: '#1a5d40' };
    case 'Cocktail':
      return { primary: '#d4af37', light: '#FEF3C7', dark: '#B45309' };
    case 'Réception':
      return { primary: '#1a5d40', light: '#ECFDF5', dark: '#064E3B' };
    case 'Soirée':
      return { primary: '#DC2626', light: '#FEF2F2', dark: '#991B1B' };
    case 'Transport':
      return { primary: '#6B7280', light: '#F9FAFB', dark: '#374151' };
    default:
      return { primary: '#6B7280', light: '#F9FAFB', dark: '#374151' };
  }
};

const generateBrandedPlanningContent = (data: PlanningJourJExportData): string => {
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const groupedEvents = groupEventsByCategory(data.events);
  
  return `
    <div style="min-height: 100%; display: flex; flex-direction: column; font-family: 'Raleway', sans-serif;">
      <!-- Header with Mariable branding -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #7F9474;">
        <div style="font-size: 28px; font-weight: 700; color: #7F9474; font-family: 'Playfair Display', serif; margin-bottom: 8px;">
          Mariable
        </div>
        <div style="font-size: 16px; color: #948970; font-weight: 500; margin-bottom: 20px;">
          Planning Jour J personnalisé
        </div>
        
        <!-- Wedding details card -->
        <div style="background: linear-gradient(135deg, #f8f6f0 0%, #f1f7f3 100%); padding: 20px; border-radius: 12px; margin: 20px auto; max-width: 400px; border: 1px solid #e8e5db;">
          <h1 style="font-size: 22px; font-weight: 700; color: #1A1F2C; margin: 0 0 8px 0; font-family: 'Playfair Display', serif;">
            ${data.coupleNames || 'Votre Planning de Mariage'}
          </h1>
          ${data.weddingDate ? `
            <p style="font-size: 14px; color: #666; margin: 0; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span style="display: inline-block; width: 4px; height: 4px; background: #7F9474; border-radius: 50%;"></span>
              ${data.weddingDate}
              <span style="display: inline-block; width: 4px; height: 4px; background: #7F9474; border-radius: 50%;"></span>
            </p>
          ` : ''}
        </div>
      </div>

      <!-- Planning content -->
      <div style="flex: 1;">
        ${Object.entries(groupedEvents).map(([categoryName, events]) => {
          const colors = getCategoryColor(categoryName);
          
          return `
            <div style="margin-bottom: 25px; page-break-inside: avoid;">
              <!-- Category header -->
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px 16px; background: ${colors.light}; border-left: 4px solid ${colors.primary}; border-radius: 8px;">
                <h2 style="font-size: 18px; font-weight: 600; color: ${colors.dark}; margin: 0; font-family: 'Playfair Display', serif;">
                  ${categoryName}
                </h2>
                <div style="margin-left: auto; font-size: 12px; color: ${colors.primary}; font-weight: 500;">
                  ${events.length} étape${events.length > 1 ? 's' : ''}
                </div>
              </div>
              
              <!-- Events grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
                ${events.map(event => `
                  <div style="background: white; border: 1px solid ${colors.light}; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
                    <!-- Time badge -->
                    <div style="position: absolute; top: 0; right: 0; background: ${colors.primary}; color: white; padding: 4px 12px; border-radius: 0 8px 0 8px; font-size: 12px; font-weight: 600;">
                      ${formatTime(event.startTime)}
                    </div>
                    
                    <div style="margin-top: 20px;">
                      <h3 style="font-size: 14px; font-weight: 600; color: #1A1F2C; margin: 0 0 8px 0; line-height: 1.3;">
                        ${event.title}
                      </h3>
                      
                      ${event.notes ? `
                        <p style="font-size: 12px; color: #666; margin: 0 0 8px 0; line-height: 1.4;">
                          ${event.notes}
                        </p>
                      ` : ''}
                      
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                        <span style="font-size: 11px; color: ${colors.primary}; background: ${colors.light}; padding: 2px 8px; border-radius: 12px; font-weight: 500;">
                          ${event.duration} min
                        </span>
                        
                        ${event.endTime ? `
                          <span style="font-size: 11px; color: #999;">
                            → ${formatTime(event.endTime)}
                          </span>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
        
        <!-- Summary section -->
        <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #f8f6f0 0%, #f1f7f3 100%); border-radius: 12px; border: 1px solid #e8e5db;">
          <h2 style="font-size: 16px; font-weight: 600; color: #1a5d40; margin: 0 0 15px 0; font-family: 'Playfair Display', serif; text-align: center;">
            Résumé de votre journée
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
            ${Object.entries(groupedEvents).map(([categoryName, events]) => {
              const colors = getCategoryColor(categoryName);
              const totalDuration = events.reduce((sum, event) => sum + (event.duration || 0), 0);
              
              return `
                <div style="text-align: center; padding: 12px; background: white; border-radius: 8px; border: 1px solid ${colors.light};">
                  <div style="font-size: 11px; font-weight: 600; color: ${colors.primary}; margin-bottom: 4px;">
                    ${categoryName}
                  </div>
                  <div style="font-size: 10px; color: #666;">
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

      <!-- Footer -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e8e5db; text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #666; margin-bottom: 8px;">
          <div>
            Généré le ${currentDate}
          </div>
          <div style="font-weight: 600; color: #7F9474;">
            mariable.fr
          </div>
        </div>
        <div style="font-size: 10px; color: #999; text-align: center;">
          Planning personnalisé créé avec Mariable - Votre partenaire pour un mariage réussi
        </div>
      </div>
    </div>
  `;
};


import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface BudgetItem {
  id: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  category: string;
}

interface BudgetCategory {
  name: string;
  items: BudgetItem[];
}

export interface BudgetExportData {
  categories: BudgetCategory[];
  totalBudget: number;
  coupleNames?: string;
}

export const exportBudgetToPDF = async (
  data: BudgetExportData,
  fileName: string = 'Mariable-Budget-Mariage.pdf'
) => {
  try {
    // Create a temporary container for the export component
    const exportContainer = document.createElement('div');
    exportContainer.id = 'budget-export-container';
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '0';
    exportContainer.style.width = '210mm'; // A4 width
    exportContainer.style.minHeight = '297mm'; // A4 height
    exportContainer.style.backgroundColor = 'white';
    exportContainer.style.fontFamily = 'Raleway, Arial, sans-serif';
    exportContainer.style.padding = '20mm';
    exportContainer.style.color = '#000';
    
    // Calculate totals
    const totalEstimated = data.categories.reduce((total, category) => {
      return total + category.items.reduce((catTotal, item) => catTotal + item.estimatedCost, 0);
    }, 0);
    
    const totalActual = data.categories.reduce((total, category) => {
      return total + category.items.reduce((catTotal, item) => catTotal + item.actualCost, 0);
    }, 0);

    // Build HTML content
    exportContainer.innerHTML = `
      <div style="font-family: 'Raleway', Arial, sans-serif; color: #000; line-height: 1.4;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #7F9474;">
          <h1 style="font-family: 'Playfair Display', serif; color: #7F9474; font-size: 28px; margin-bottom: 10px;">
            Budget de Mariage
          </h1>
          <p style="color: #666666; font-size: 16px; margin: 0;">
            ${data.coupleNames || "Votre mariage"}
          </p>
          <p style="color: #666666; font-size: 12px; margin: 5px 0 0 0;">
            Généré le ${new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <!-- Budget Summary -->
        <div style="margin-bottom: 30px;">
          <h2 style="font-family: 'Playfair Display', serif; color: #1a5d40; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #f1f7f3; padding-bottom: 5px;">
            Résumé du budget
          </h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            <div style="background-color: #f8f6f0; border: 1px solid #e8e5db; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-weight: 600; color: #7F9474; font-size: 14px; margin-bottom: 5px;">Budget prévu</div>
              <div style="font-size: 18px; font-weight: bold; color: #1a5d40;">${data.totalBudget.toLocaleString()}€</div>
            </div>
            <div style="background-color: #f8f6f0; border: 1px solid #e8e5db; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-weight: 600; color: #7F9474; font-size: 14px; margin-bottom: 5px;">Coût estimé</div>
              <div style="font-size: 18px; font-weight: bold; color: #1a5d40;">${totalEstimated.toLocaleString()}€</div>
            </div>
            <div style="background-color: #f8f6f0; border: 1px solid #e8e5db; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-weight: 600; color: #7F9474; font-size: 14px; margin-bottom: 5px;">Déjà dépensé</div>
              <div style="font-size: 18px; font-weight: bold; color: #1a5d40;">${totalActual.toLocaleString()}€</div>
            </div>
          </div>
          <div style="margin-top: 15px; padding: 10px; background-color: ${totalEstimated > data.totalBudget ? '#fee2e2' : '#f0fdf4'}; border-radius: 8px; text-align: center;">
            <span style="color: ${totalEstimated > data.totalBudget ? '#dc2626' : '#16a34a'}; font-weight: 600;">
              ${totalEstimated > data.totalBudget ? 'Dépassement' : 'Reste'}: ${Math.abs(data.totalBudget - totalEstimated).toLocaleString()}€
            </span>
          </div>
        </div>

        <!-- Categories -->
        <div>
          <h2 style="font-family: 'Playfair Display', serif; color: #1a5d40; font-size: 20px; margin-bottom: 20px; border-bottom: 1px solid #f1f7f3; padding-bottom: 5px;">
            Détail par catégorie
          </h2>
          ${data.categories.map(category => {
            const categoryEstimated = category.items.reduce((total, item) => total + item.estimatedCost, 0);
            const categoryActual = category.items.reduce((total, item) => total + item.actualCost, 0);
            
            return `
              <div style="margin-bottom: 25px; page-break-inside: avoid;">
                <div style="background-color: #f1f7f3; padding: 12px; border-radius: 8px 8px 0 0; border: 1px solid #e8e5db;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-weight: 600; color: #1a5d40; font-size: 16px; margin: 0;">${category.name}</h3>
                    <div style="font-size: 12px; color: #666666;">
                      Estimé: ${categoryEstimated.toLocaleString()}€ | Dépensé: ${categoryActual.toLocaleString()}€
                    </div>
                  </div>
                </div>
                <div style="border: 1px solid #e8e5db; border-top: none; border-radius: 0 0 8px 8px;">
                  ${category.items.map(item => `
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 15px; padding: 10px 15px; border-bottom: 1px solid #f1f7f3; align-items: center; font-size: 12px;">
                      <div style="font-weight: 500; color: #1a5d40;">${item.name}</div>
                      <div style="text-align: right; color: #666666;">${item.estimatedCost.toLocaleString()}€</div>
                      <div style="text-align: right; color: #666666; font-weight: ${item.actualCost > 0 ? '600' : 'normal'};">
                        ${item.actualCost > 0 ? item.actualCost.toLocaleString() + '€' : '-'}
                      </div>
                    </div>
                  `).join('')}
                  <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 15px; padding: 10px 15px; background-color: #f8f6f0; font-weight: 600; color: #1a5d40; font-size: 13px;">
                    <div>Total ${category.name}</div>
                    <div style="text-align: right;">${categoryEstimated.toLocaleString()}€</div>
                    <div style="text-align: right;">${categoryActual.toLocaleString()}€</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e8e5db; color: #666666; font-size: 10px;">
          <p style="margin: 0;">Budget généré le ${new Date().toLocaleDateString('fr-FR')} par Mariable</p>
          <p style="margin: 5px 0 0 0; font-weight: 600; color: #7F9474;">www.mariable.fr - Votre assistant mariage personnalisé</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(exportContainer);
    
    // Apply export-specific styles
    const style = document.createElement('style');
    style.innerHTML = `
      #budget-export-container {
        font-family: 'Raleway', Arial, sans-serif !important;
        line-height: 1.4 !important;
        color: #000 !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      #budget-export-container * {
        font-family: 'Raleway', Arial, sans-serif !important;
        box-sizing: border-box !important;
      }
      #budget-export-container .font-serif {
        font-family: 'Playfair Display', serif !important;
      }
    `;
    document.head.appendChild(style);
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate canvas
    const canvas = await html2canvas(exportContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: Math.round(210 * 3.779527559),
      height: Math.round(297 * 3.779527559),
      windowWidth: 1200,
      windowHeight: 1600
    });
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    pdf.setProperties({
      title: 'Budget de Mariage - Mariable',
      subject: 'Budget personnalisé pour mariage',
      author: 'Mariable',
      creator: 'Mariable',
      keywords: 'mariage, budget, planification, coûts'
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = 210;
    const imgHeight = 297;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    
    // Clean up
    document.head.removeChild(style);
    document.body.removeChild(exportContainer);
    
    // Save PDF
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating budget PDF:', error);
    return false;
  }
};

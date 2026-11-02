

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface BudgetCategory {
  name: string;
  items: Array<{
    id: string;
    name: string;
    estimated: number;
    actual: number;
    deposit: number;
    remaining: number;
    payment_note?: string;
  }>;
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
}

interface BudgetExportData {
  categories: BudgetCategory[];
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
  mode?: 'actual' | 'estimated';
  totalSecurityDeposit?: number;
}

const PIE_COLORS = ['#63745a', '#c9b99a', '#1a1a1a', '#8fa085', '#e2d7c3', '#4a5643', '#a89474', '#b8c4b0', '#6b6b6b', '#d9cbb0'];

// Camembert SVG des sous-totaux par catégorie (sauge / beige / noir)
const generatePieChart = (slices: Array<{ name: string; value: number }>): string => {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  if (total <= 0) return '';
  let angle = -Math.PI / 2;
  const paths = slices.map((slice, index) => {
    const color = PIE_COLORS[index % PIE_COLORS.length];
    if (slice.value >= total) return `<circle cx="60" cy="60" r="56" fill="${color}" />`;
    const start = angle;
    angle += (slice.value / total) * Math.PI * 2;
    const x1 = 60 + 56 * Math.cos(start), y1 = 60 + 56 * Math.sin(start);
    const x2 = 60 + 56 * Math.cos(angle), y2 = 60 + 56 * Math.sin(angle);
    const largeArc = angle - start > Math.PI ? 1 : 0;
    return `<path d="M60,60 L${x1},${y1} A56,56 0 ${largeArc} 1 ${x2},${y2} Z" fill="${color}" stroke="#ffffff" stroke-width="1" />`;
  }).join('');
  const legend = slices.map((slice, index) => `
    <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; margin-bottom: 3px;">
      <span style="width: 10px; height: 10px; background: ${PIE_COLORS[index % PIE_COLORS.length]}; display: inline-block;"></span>
      <span style="flex: 1;">${slice.name}</span>
      <strong>${formatCurrency(slice.value)} · ${Math.round((slice.value / total) * 100)} %</strong>
    </div>`).join('');
  return `
    <div style="display: flex; gap: 24px; align-items: center; margin-bottom: 14px; padding: 12px; border: 1px solid #d4ddd0;">
      <svg width="120" height="120" viewBox="0 0 120 120">${paths}</svg>
      <div style="flex: 1;">${legend}</div>
    </div>`;
};

export const exportBudgetToPDF = async (data: BudgetExportData): Promise<boolean> => {
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
    tempContainer.innerHTML = generateBudgetContent(data);
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
    const filename = `budget-${data.mode === 'estimated' ? 'previsionnel' : 'reel'}-mariage-mariable-${date}.pdf`;

    // Save PDF
    pdf.save(filename);
    return true;

  } catch (error) {
    console.error('Error generating budget PDF:', error);
    return false;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0 
  }).format(amount);
};

const generateBudgetContent = (data: BudgetExportData): string => {
  const currentDate = new Date().toLocaleDateString('fr-FR');
  if (data.mode === 'estimated') return generateEstimatedContent(data, currentDate);
  const pieChart = generatePieChart(data.categories.map((category) => ({ name: category.name, value: category.totalActual })).filter((slice) => slice.value > 0));
  const depositNote = data.totalSecurityDeposit ? `<div style="margin-top: 10px; font-size: 11px; color: #333;">Total des cautions engagées : <strong>${formatCurrency(data.totalSecurityDeposit)}</strong> (non débitées, hors budget)</div>` : '';
  
  return `
    <div style="min-height: 100%; display: flex; flex-direction: column; font-size: 11px; color: #1a1a1a;">
      <!-- Header -->
      <div style="background-color: #63745a; padding: 14px 20px; border-radius: 6px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 22px; font-weight: 700; color: #ffffff; font-family: serif;">Mariable</div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.8);">Budget de Mariage</div>
        </div>
        <div style="font-size: 10px; color: rgba(255,255,255,0.7);">${currentDate}</div>
      </div>

      <!-- Summary blocks -->
      <div style="display: flex; gap: 10px; margin-bottom: 14px;">
        <div style="flex: 1; text-align: center; padding: 10px; background-color: #f0f3ee; border-radius: 6px; border: 1px solid #d4ddd0;">
          <div style="font-size: 9px; font-weight: 600; color: #63745a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Budget Total</div>
          <div style="font-size: 18px; font-weight: 700; color: #1a1a1a;">${formatCurrency(data.totalActual)}</div>
        </div>
        <div style="flex: 1; text-align: center; padding: 10px; background-color: #f0f3ee; border-radius: 6px; border: 1px solid #d4ddd0;">
          <div style="font-size: 9px; font-weight: 600; color: #63745a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Acomptes Versés</div>
          <div style="font-size: 18px; font-weight: 700; color: #1a1a1a;">${formatCurrency(data.totalDeposit)}</div>
        </div>
        <div style="flex: 1; text-align: center; padding: 10px; background-color: #f0f3ee; border-radius: 6px; border: 1px solid #d4ddd0;">
          <div style="font-size: 9px; font-weight: 600; color: #63745a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Reste à Payer</div>
          <div style="font-size: 18px; font-weight: 700; color: #1a1a1a;">${formatCurrency(data.totalRemaining)}</div>
        </div>
      </div>

      ${pieChart}

      <!-- Table -->
      <div style="flex: 1;">
        <!-- Table header -->
        <div style="display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr; gap: 8px; padding: 8px 12px; background-color: #63745a; color: #ffffff; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3px; border-radius: 4px 4px 0 0;">
          <div>Élément</div>
          <div style="text-align: right;">Coût Réel</div>
          <div style="text-align: right;">Acompte</div>
          <div style="text-align: right;">Reste à Payer</div>
        </div>
        
        ${data.categories.map((category, catIndex) => `
          <div>
            <!-- Category row -->
            <div style="display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr; gap: 8px; padding: 7px 12px; background-color: ${catIndex % 2 === 0 ? '#f7f8f6' : '#ffffff'}; font-weight: 600; font-size: 12px; border-left: 3px solid #63745a; color: #1a1a1a;">
              <div>${category.name}</div>
              <div style="text-align: right;">${formatCurrency(category.totalActual)}</div>
              <div style="text-align: right;">${formatCurrency(category.totalDeposit)}</div>
              <div style="text-align: right;">${formatCurrency(category.totalRemaining)}</div>
            </div>
            
            ${category.items.filter(item => item.name).map((item, itemIndex) => `
              <div style="display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr; gap: 8px; padding: 5px 12px; border-bottom: 1px solid #eceeed; font-size: 11px; background-color: ${itemIndex % 2 === 0 ? '#ffffff' : '#fafbfa'};">
                <div style="padding-left: 16px; color: #333;">${item.name}</div>
                <div style="text-align: right;">${formatCurrency(item.actual)}</div>
                <div style="text-align: right;">${formatCurrency(item.deposit)}</div>
                <div style="text-align: right;">${formatCurrency(item.remaining)}</div>
              </div>
            `).join('')}
          </div>
        `).join('')}
        
        <!-- Total row -->
        <div style="display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr; gap: 8px; padding: 10px 12px; background-color: #63745a; color: #ffffff; font-weight: 700; font-size: 12px; border-radius: 0 0 4px 4px;">
          <div>TOTAL</div>
          <div style="text-align: right;">${formatCurrency(data.totalActual)}</div>
          <div style="text-align: right;">${formatCurrency(data.totalDeposit)}</div>
          <div style="text-align: right;">${formatCurrency(data.totalRemaining)}</div>
        </div>
        ${depositNote}
      </div>

      <!-- Footer -->
      <div style="margin-top: 16px; padding-top: 8px; border-top: 1px solid #d4ddd0; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #888;">
        <div>Généré le ${currentDate}</div>
        <div style="font-weight: 600; color: #63745a;">mariable.fr</div>
      </div>
    </div>
  `;
};

// PDF « Budget prévisionnel » : montants estimés uniquement + camembert
const generateEstimatedContent = (data: BudgetExportData, currentDate: string): string => {
  const pieChart = generatePieChart(data.categories.map((category) => ({ name: category.name, value: category.totalEstimated })).filter((slice) => slice.value > 0));
  const row = 'display: grid; grid-template-columns: 3fr 1fr; gap: 8px;';
  return `
    <div style="font-size: 11px; color: #1a1a1a;">
      <div style="background-color: #63745a; padding: 14px 20px; border-radius: 6px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 22px; font-weight: 700; color: #ffffff; font-family: serif;">Mariable</div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.8);">Budget prévisionnel</div>
        </div>
        <div style="font-size: 10px; color: rgba(255,255,255,0.7);">${currentDate}</div>
      </div>
      <div style="text-align: center; padding: 10px; background-color: #f0f3ee; border: 1px solid #d4ddd0; margin-bottom: 14px;">
        <div style="font-size: 9px; font-weight: 600; color: #63745a; text-transform: uppercase; letter-spacing: 0.5px;">Budget estimé total</div>
        <div style="font-size: 18px; font-weight: 700;">${formatCurrency(data.totalEstimated)}</div>
      </div>
      ${pieChart}
      <div style="${row} padding: 8px 12px; background-color: #63745a; color: #ffffff; font-weight: 600; font-size: 10px; text-transform: uppercase;">
        <div>Élément</div><div style="text-align: right;">Estimé</div>
      </div>
      ${data.categories.filter((category) => category.totalEstimated > 0 || category.items.some((item) => item.name)).map((category, catIndex) => `
        <div style="${row} padding: 7px 12px; background-color: ${catIndex % 2 === 0 ? '#f7f8f6' : '#ffffff'}; font-weight: 600; font-size: 12px; border-left: 3px solid #63745a;">
          <div>${category.name}</div><div style="text-align: right;">${formatCurrency(category.totalEstimated)}</div>
        </div>
        ${category.items.filter((item) => item.name).map((item) => `
          <div style="${row} padding: 5px 12px; border-bottom: 1px solid #eceeed;">
            <div style="padding-left: 16px; color: #333;">${item.name}</div><div style="text-align: right;">${formatCurrency(item.estimated)}</div>
          </div>`).join('')}
      `).join('')}
      <div style="${row} padding: 10px 12px; background-color: #63745a; color: #ffffff; font-weight: 700; font-size: 12px;">
        <div>TOTAL</div><div style="text-align: right;">${formatCurrency(data.totalEstimated)}</div>
      </div>
      <div style="margin-top: 16px; padding-top: 8px; border-top: 1px solid #d4ddd0; display: flex; justify-content: space-between; font-size: 9px; color: #888;">
        <div>Généré le ${currentDate}</div><div style="font-weight: 600; color: #63745a;">mariable.fr</div>
      </div>
    </div>
  `;
};

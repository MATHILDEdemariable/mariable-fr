

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
}

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
    const filename = `budget-mariage-mariable-${date}.pdf`;

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
  
  return `
    <div style="min-height: 100%; display: flex; flex-direction: column;">
      <!-- Header with Mariable branding -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #7F9474;">
        <div style="font-size: 32px; font-weight: 700; color: #7F9474; font-family: serif; margin-bottom: 8px;">
          Mariable
        </div>
        <div style="font-size: 18px; color: #948970; font-weight: 500;">
          Budget de mariage détaillé
        </div>
      </div>

      <!-- Budget summary - 1 seul total centré -->
      <div style="display: flex; justify-content: center; margin-bottom: 24px;">
        <div style="text-align: center; padding: 16px 32px; background: linear-gradient(135deg, #e8f5e9, #c8e6c9); border-radius: 12px; border: 2px solid #4caf50; max-width: 350px;">
          <h2 style="font-size: 13px; font-weight: 600; color: #2e7d32; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">
            Budget Total Estimé
          </h2>
          <p style="font-size: 28px; color: #1b5e20; font-weight: 700; margin: 0;">
            ${formatCurrency(data.totalEstimated)}
          </p>
        </div>
      </div>

      <!-- Budget table -->
      <div style="flex: 1;">
        <h2 style="font-size: 22px; font-weight: 600; color: #7F9474; margin-bottom: 24px; font-family: serif;">
          Répartition détaillée
        </h2>
        
        <!-- Table header -->
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr; gap: 12px; padding: 12px 16px; background-color: #7F9474; color: white; font-weight: 600; font-size: 14px; border-radius: 8px 8px 0 0;">
          <div>Catégorie / Élément</div>
          <div style="text-align: right;">Budget Estimé</div>
          <div style="text-align: right;">Coût Réel</div>
          <div style="text-align: right;">Acompte Versé</div>
          <div style="text-align: right;">Reste à Payer</div>
          <div style="text-align: center;">Commentaire</div>
        </div>
        
        ${data.categories.map(category => `
          <!-- Category row -->
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr; gap: 12px; padding: 12px 16px; background-color: #f8f6f0; font-weight: 600; border-left: 4px solid #7F9474;">
            <div>${category.name}</div>
            <div style="text-align: right;">${formatCurrency(category.totalEstimated)}</div>
            <div style="text-align: right;">${formatCurrency(category.totalActual)}</div>
            <div style="text-align: right;">${formatCurrency(category.totalDeposit)}</div>
            <div style="text-align: right;">${formatCurrency(category.totalRemaining)}</div>
            <div style="text-align: center;">-</div>
          </div>
          
          ${category.items.filter(item => item.name).map(item => `
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr; gap: 12px; padding: 8px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px; page-break-inside: avoid;">
              <div style="padding-left: 20px;">${item.name}</div>
              <div style="text-align: right;">${formatCurrency(item.estimated)}</div>
              <div style="text-align: right;">${formatCurrency(item.actual)}</div>
              <div style="text-align: right;">${formatCurrency(item.deposit)}</div>
              <div style="text-align: right;">${formatCurrency(item.remaining)}</div>
              <div style="text-align: center; font-size: 12px;">${item.payment_note || '-'}</div>
            </div>
          `).join('')}
        `).join('')}
        
        <!-- Total row -->
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr; gap: 12px; padding: 16px 16px 20px 16px; background-color: #7F9474; color: white; font-weight: 700; font-size: 16px; border-radius: 0 0 8px 8px; margin-bottom: 20px; page-break-inside: avoid;">
          <div>TOTAL</div>
          <div style="text-align: right;">${formatCurrency(data.totalEstimated)}</div>
          <div style="text-align: right;">${formatCurrency(data.totalActual)}</div>
          <div style="text-align: right;">${formatCurrency(data.totalDeposit)}</div>
          <div style="text-align: right;">${formatCurrency(data.totalRemaining)}</div>
          <div style="text-align: center;">-</div>
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
          Budget personnalisé créé avec Mariable - Votre partenaire pour un mariage réussi
        </div>
      </div>
    </div>
  `;
};

import jsPDF from 'jspdf';

export const exportQRCodePDF = (
  qrCodeDataUrl: string,
  url: string,
  title: string
) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFillColor(247, 244, 241);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setFontSize(28);
  pdf.setTextColor(127, 148, 116);
  const titleText = title || 'QR Code';
  const titleWidth = pdf.getTextWidth(titleText);
  pdf.text(titleText, (pageWidth - titleWidth) / 2, 30);

  pdf.setFontSize(14);
  pdf.setTextColor(60, 60, 60);
  const subtitleText = 'Scannez ce code avec votre smartphone';
  const subtitleWidth = pdf.getTextWidth(subtitleText);
  pdf.text(subtitleText, (pageWidth - subtitleWidth) / 2, 45);

  const qrSize = 100;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 60;
  
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 3, 3, 'F');
  
  pdf.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  const maxWidth = 160;
  const lines = pdf.splitTextToSize(url, maxWidth);
  const urlY = qrY + qrSize + 20;
  pdf.text(lines, pageWidth / 2, urlY, { align: 'center' });

  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  const footerText = 'Créé avec Mariable.fr';
  const footerWidth = pdf.getTextWidth(footerText);
  pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 15);

  const fileName = `qr-code-${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  pdf.save(fileName);
};

import jsPDF from 'jspdf';
import { MoodboardImage, MoodboardColor } from '@/hooks/useMoodboard';

interface MoodboardPdfData {
  coupleName: string;
  weddingDate: string;
  images: MoodboardImage[];
  colors: MoodboardColor[];
  ambiance: string;
}

// Helper to load image as data URL
const loadImageAsDataUrl = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

// Format date in French
const formatDateFr = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const generateMoodboardPdf = async (data: MoodboardPdfData): Promise<void> => {
  const { coupleName, weddingDate, images, colors, ambiance } = data;
  
  // Create PDF in A4 portrait format
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header
  let yPos = margin + 10;
  
  // "Moodboard" label
  pdf.setFontSize(8);
  pdf.setTextColor(180, 180, 180);
  pdf.text('MOODBOARD', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  // Couple name
  pdf.setFontSize(24);
  pdf.setTextColor(40, 40, 40);
  pdf.text(coupleName || 'Notre Mariage', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  // Wedding date
  if (weddingDate) {
    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text(formatDateFr(weddingDate), pageWidth / 2, yPos, { align: 'center' });
  }
  yPos += 12;

  // Photo grid area
  const gridStartY = yPos;
  const gridHeight = 150; // Height for the photo grid
  const gap = 2;

  // Calculate grid dimensions
  const gridWidth = contentWidth;
  const cellWidth = (gridWidth - 2 * gap) / 3;
  const rowHeight = (gridHeight - 2 * gap) / 3;

  // Load and place images
  const imagePositions = [
    // Row 1: 1 cell + 2 cells
    { x: margin, y: gridStartY, w: cellWidth, h: rowHeight },
    { x: margin + cellWidth + gap, y: gridStartY, w: cellWidth * 2 + gap, h: rowHeight },
    // Row 2: 2 cells + 1 cell
    { x: margin, y: gridStartY + rowHeight + gap, w: cellWidth * 2 + gap, h: rowHeight },
    { x: margin + cellWidth * 2 + gap * 2, y: gridStartY + rowHeight + gap, w: cellWidth, h: rowHeight },
    // Row 3: 3 cells
    { x: margin, y: gridStartY + rowHeight * 2 + gap * 2, w: cellWidth, h: rowHeight },
    { x: margin + cellWidth + gap, y: gridStartY + rowHeight * 2 + gap * 2, w: cellWidth, h: rowHeight },
    { x: margin + cellWidth * 2 + gap * 2, y: gridStartY + rowHeight * 2 + gap * 2, w: cellWidth, h: rowHeight },
  ];

  // Add images to PDF
  for (let i = 0; i < Math.min(images.length, imagePositions.length); i++) {
    try {
      const imgData = images[i].base64 || await loadImageAsDataUrl(images[i].preview);
      const pos = imagePositions[i];
      pdf.addImage(imgData, 'JPEG', pos.x, pos.y, pos.w, pos.h);
    } catch (error) {
      console.error(`Failed to add image ${i}:`, error);
      // Draw placeholder
      pdf.setFillColor(240, 240, 240);
      pdf.rect(imagePositions[i].x, imagePositions[i].y, imagePositions[i].w, imagePositions[i].h, 'F');
    }
  }

  yPos = gridStartY + gridHeight + 15;

  // Separator line
  pdf.setDrawColor(230, 230, 230);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Color palette label
  pdf.setFontSize(7);
  pdf.setTextColor(180, 180, 180);
  pdf.text('PALETTE DE COULEURS', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  // Color swatches
  const swatchSize = 12;
  const swatchGap = 8;
  const totalSwatchWidth = colors.length * swatchSize + (colors.length - 1) * swatchGap;
  let swatchX = (pageWidth - totalSwatchWidth) / 2;

  colors.forEach((color) => {
    // Parse hex color
    const hex = color.hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Draw color swatch
    pdf.setFillColor(r, g, b);
    pdf.rect(swatchX, yPos, swatchSize, swatchSize, 'F');

    // Color name
    pdf.setFontSize(6);
    pdf.setTextColor(80, 80, 80);
    const nameX = swatchX + swatchSize / 2;
    pdf.text(color.name, nameX, yPos + swatchSize + 4, { align: 'center' });

    // Hex code
    pdf.setFontSize(5);
    pdf.setTextColor(150, 150, 150);
    pdf.text(color.hex.toUpperCase(), nameX, yPos + swatchSize + 8, { align: 'center' });

    swatchX += swatchSize + swatchGap;
  });

  yPos += swatchSize + 18;

  // Ambiance
  if (ambiance) {
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.setFont('helvetica', 'italic');
    const ambianceText = `"${ambiance}"`;
    const splitAmbiance = pdf.splitTextToSize(ambianceText, contentWidth - 20);
    pdf.text(splitAmbiance, pageWidth / 2, yPos, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
  }

  // Footer
  pdf.setFontSize(7);
  pdf.setTextColor(180, 180, 180);
  pdf.text('mariable.fr', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save PDF
  const fileName = `moodboard-${(coupleName || 'mariage').toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
  pdf.save(fileName);
};

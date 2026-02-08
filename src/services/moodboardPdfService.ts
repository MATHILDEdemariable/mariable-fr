import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MoodboardImage, MoodboardColor } from '@/hooks/useMoodboard';

interface MoodboardPdfData {
  coupleName: string;
  weddingDate: string;
  images: MoodboardImage[];
  colors: MoodboardColor[];
  ambiance: string;
}

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

// Wait for all images to load
const waitForImages = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(img => {
      if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        setTimeout(resolve, 5000);
      });
    })
  );
};

// Create a clone with fixed A4 dimensions for PDF capture
const createPdfCaptureCopy = (element: HTMLElement): HTMLElement => {
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Fixed A4 dimensions at 96 DPI (794 x 1123 pixels)
  const A4_WIDTH = 794;
  const A4_HEIGHT = 1123;
  
  clone.style.cssText = `
    width: ${A4_WIDTH}px !important;
    height: ${A4_HEIGHT}px !important;
    max-width: ${A4_WIDTH}px !important;
    max-height: ${A4_HEIGHT}px !important;
    position: absolute;
    left: -9999px;
    top: 0;
    background: white;
    overflow: hidden;
  `;
  
  // Ensure all images preserve aspect ratio with object-fit: cover
  const images = clone.querySelectorAll('img');
  images.forEach(img => {
    img.style.objectFit = 'cover';
    img.style.width = '100%';
    img.style.height = '100%';
  });
  
  // Ensure grid cells have proper overflow
  const gridCells = clone.querySelectorAll('[class*="overflow-hidden"]');
  gridCells.forEach(cell => {
    (cell as HTMLElement).style.overflow = 'hidden';
  });
  
  return clone;
};

export const generateMoodboardPdf = async (data: MoodboardPdfData): Promise<void> => {
  const { coupleName } = data;
  
  const element = document.getElementById('moodboard-canvas');
  if (!element) {
    throw new Error('Moodboard canvas not found');
  }

  // Wait for all images to be loaded
  await waitForImages(element);

  // Create a fixed-size clone for capture
  const pdfClone = createPdfCaptureCopy(element);
  document.body.appendChild(pdfClone);

  // Wait for layout to stabilize
  await new Promise(resolve => setTimeout(resolve, 300));

  // Wait for images in clone to load
  await waitForImages(pdfClone);

  try {
    // Capture the clone with html2canvas
    const canvas = await html2canvas(pdfClone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
    });

    // Create PDF A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    
    // The canvas matches A4 ratio, so we can use full page
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

    const fileName = `moodboard-${(coupleName || 'mariage').toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
    pdf.save(fileName);
  } finally {
    // Always remove the clone
    document.body.removeChild(pdfClone);
  }
};
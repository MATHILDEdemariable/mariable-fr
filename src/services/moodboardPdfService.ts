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

export const generateMoodboardPdf = async (data: MoodboardPdfData): Promise<void> => {
  const { coupleName } = data;
  
  const element = document.getElementById('moodboard-canvas');
  if (!element) {
    throw new Error('Moodboard canvas not found');
  }

  // Wait for all images to be loaded
  await waitForImages(element);

  // Store original styles
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;

  // Force fixed dimensions for consistent capture
  element.style.width = '800px';
  element.style.maxWidth = '800px';

  // Wait for layout to stabilize
  await new Promise(resolve => setTimeout(resolve, 200));

  // Capture with html2canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: true,
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: 1200,
  });

  // Restore original styles
  element.style.width = originalWidth;
  element.style.maxWidth = originalMaxWidth;

  // Create PDF A4
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  
  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let finalWidth = imgWidth;
  let finalHeight = imgHeight;
  const maxHeight = pageHeight - 2 * margin;
  
  if (finalHeight > maxHeight) {
    finalHeight = maxHeight;
    finalWidth = (canvas.width * finalHeight) / canvas.height;
  }

  const xPos = (pageWidth - finalWidth) / 2;
  const yPos = margin;

  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', xPos, yPos, finalWidth, finalHeight);

  const fileName = `moodboard-${(coupleName || 'mariage').toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
  pdf.save(fileName);
};
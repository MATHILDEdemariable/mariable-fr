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

  console.log('🚀 generateMoodboardPdf started');

  // Wait for all images to be loaded
  await waitForImages(element);

  try {
    // Capture the element directly as displayed (no cloning)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
    });

    console.log('✅ html2canvas capture done:', canvas.width, 'x', canvas.height);

    // Create PDF A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 5;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    // Calculate aspect ratio to fit A4 without distortion
    const canvasRatio = canvas.width / canvas.height;
    const pageRatio = maxWidth / maxHeight;

    let imgWidth: number;
    let imgHeight: number;

    if (canvasRatio > pageRatio) {
      // Canvas is wider than A4 ratio → fit by width
      imgWidth = maxWidth;
      imgHeight = maxWidth / canvasRatio;
    } else {
      // Canvas is taller than A4 ratio → fit by height
      imgHeight = maxHeight;
      imgWidth = maxHeight * canvasRatio;
    }

    // Center on page
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = (pageHeight - imgHeight) / 2;

    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

    const fileName = `moodboard-${(coupleName || 'mariage').toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
    pdf.save(fileName);
    console.log('✅ generateMoodboardPdf completed successfully');
  } catch (error) {
    console.error('❌ generateMoodboardPdf failed:', error);
    throw error;
  }
};

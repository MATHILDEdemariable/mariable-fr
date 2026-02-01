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

export const generateMoodboardPdf = async (data: MoodboardPdfData): Promise<void> => {
  const { coupleName } = data;
  
  // Capturer le canvas HTML avec html2canvas
  const element = document.getElementById('moodboard-canvas');
  if (!element) {
    throw new Error('Moodboard canvas not found');
  }

  // Render avec scale élevée pour qualité
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: true,
  });

  // Créer PDF A4
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  
  // Calculer les dimensions de l'image pour tenir dans la page
  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Si l'image est trop haute, on réduit proportionnellement
  let finalWidth = imgWidth;
  let finalHeight = imgHeight;
  const maxHeight = pageHeight - 2 * margin;
  
  if (finalHeight > maxHeight) {
    finalHeight = maxHeight;
    finalWidth = (canvas.width * finalHeight) / canvas.height;
  }

  // Centrer horizontalement
  const xPos = (pageWidth - finalWidth) / 2;
  const yPos = margin;

  // Ajouter l'image capturée au PDF
  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', xPos, yPos, finalWidth, finalHeight);

  // Sauvegarder
  const fileName = `moodboard-${(coupleName || 'mariage').toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
  pdf.save(fileName);
};

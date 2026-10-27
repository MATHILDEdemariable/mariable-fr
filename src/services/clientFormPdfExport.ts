import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { ClientFormQuestion, formatClientFormAnswer } from '@/data/clientFormTemplates';

interface ClientFormOnePagerOptions {
  formTitle: string;
  respondentName: string;
  respondentEmail: string;
  submittedAt: string;
  questions: ClientFormQuestion[];
  answers: Record<string, unknown>;
  isEnglish: boolean;
}

const SAGE: [number, number, number] = [99, 116, 90];
const NOIR: [number, number, number] = [30, 30, 30];
const MUTED: [number, number, number] = [120, 120, 120];

/** Génère et télécharge le one-pager récapitulatif d'une réponse client. */
export const downloadClientFormOnePager = (options: ClientFormOnePagerOptions) => {
  console.log('🚀 downloadClientFormOnePager started');
  const { formTitle, respondentName, respondentEmail, submittedAt, questions, answers, isEnglish } = options;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const columnGap = 8;
  const columnWidth = (pageWidth - margin * 2 - columnGap) / 2;

  // En-tête
  doc.setFillColor(...SAGE);
  doc.rect(0, 0, pageWidth, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.text(respondentName || (isEnglish ? 'Client brief' : 'Fiche client'), margin, 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const dateText = submittedAt
    ? format(new Date(submittedAt), isEnglish ? 'MMMM d, yyyy' : 'd MMMM yyyy', { locale: isEnglish ? enUS : fr })
    : '';
  doc.text([formTitle, respondentEmail, dateText].filter(Boolean).join('  ·  '), margin, 20);

  // Réponses regroupées par section, sur deux colonnes pour tenir sur une page
  const sections: { name: string; items: { label: string; answer: string }[] }[] = [];
  questions.forEach((question) => {
    const answer = formatClientFormAnswer(answers[question.id]) || '—';
    let section = sections.find((item) => item.name === question.section);
    if (!section) { section = { name: question.section, items: [] }; sections.push(section); }
    section.items.push({ label: question.label, answer });
  });

  const columnY = [36, 36];
  let column = 0;
  const startY = 36;
  const bottom = pageHeight - 14;

  const ensureSpace = (height: number) => {
    if (columnY[column] + height <= bottom) return;
    if (column === 0 && columnY[1] + height <= bottom) { column = 1; return; }
    doc.addPage();
    columnY[0] = startY - 20; columnY[1] = startY - 20; column = 0;
  };

  sections.forEach((section) => {
    // Chaque rubrique va dans la colonne la moins remplie pour équilibrer la page
    column = columnY[0] <= columnY[1] ? 0 : 1;
    ensureSpace(14);
    const x = margin + column * (columnWidth + columnGap);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...SAGE);
    doc.text(section.name.toUpperCase(), x, columnY[column]);
    doc.setDrawColor(...SAGE);
    doc.line(x, columnY[column] + 1.5, x + columnWidth, columnY[column] + 1.5);
    columnY[column] += 6;

    section.items.forEach((item) => {
      doc.setFontSize(8);
      const labelLines = doc.splitTextToSize(item.label, columnWidth);
      doc.setFontSize(9.5);
      const answerLines = doc.splitTextToSize(item.answer, columnWidth);
      const blockHeight = labelLines.length * 3.5 + answerLines.length * 4.2 + 2.5;
      ensureSpace(blockHeight);
      const itemX = margin + column * (columnWidth + columnGap);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(labelLines, itemX, columnY[column]);
      columnY[column] += labelLines.length * 3.5;
      doc.setFontSize(9.5);
      doc.setTextColor(...NOIR);
      doc.text(answerLines, itemX, columnY[column] + 0.8);
      columnY[column] += answerLines.length * 4.2 + 2.5;
    });
    columnY[column] += 3;
  });

  // Pied de page
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text('Mariable Pro', margin, pageHeight - 6);

  const safeName = (respondentName || 'client').replace(/[^\p{L}\p{N}]+/gu, '-').toLowerCase();
  doc.save(`${isEnglish ? 'brief' : 'fiche'}-${safeName}.pdf`);
  console.log('✅ downloadClientFormOnePager completed');
};

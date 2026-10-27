import { jsPDF } from 'jspdf';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import type { ManualStep, ManualStepStatus } from '@/components/retroplanning/RetroplanningManuel';

type ExportView = 'list' | 'kanban' | 'calendar' | 'frise';

interface RetroplanningPdfOptions {
  steps: ManualStep[];
  view: ExportView;
  roleLabel: string; // '' = tout le monde
  weddingDate: string;
  calendarMonth: Date;
  isEnglish: boolean;
  stakeholderLabel: (key?: string) => string;
}

const SAGE: [number, number, number] = [99, 116, 90];
const NOIR: [number, number, number] = [30, 30, 30];
const MUTED: [number, number, number] = [120, 120, 120];
const STATUS_LABELS: Record<ManualStepStatus, { fr: string; en: string }> = {
  pending: { fr: 'À faire', en: 'To do' },
  in_progress: { fr: 'En cours', en: 'In progress' },
  completed: { fr: 'Terminé', en: 'Done' },
};

// Génère un vrai PDF (A4) depuis les données et le télécharge directement
export const exportRetroplanningPdf = (options: RetroplanningPdfOptions) => {
  console.log('🚀 exportRetroplanningPdf started:', { view: options.view, count: options.steps.length });
  const { steps, view, roleLabel, weddingDate, calendarMonth, isEnglish, stakeholderLabel } = options;
  const lang = isEnglish ? 'en' : 'fr';
  const dateLocale = isEnglish ? enUS : fr;
  const isLandscape = view === 'kanban' || view === 'calendar';
  const pdf = new jsPDF({ orientation: isLandscape ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const formatDate = (value: string) => (value ? format(new Date(value), isEnglish ? 'MMM d, yyyy' : 'dd MMM yyyy', { locale: dateLocale }) : '');

  const drawHeader = () => {
    pdf.setFillColor(...SAGE);
    pdf.rect(0, 0, pageWidth, 3, 'F');
    pdf.setFont('times', 'normal');
    pdf.setFontSize(20);
    pdf.setTextColor(...NOIR);
    pdf.text(isEnglish ? 'Overall wedding planning' : 'Planning global du mariage', margin, 16);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...MUTED);
    const viewNames: Record<ExportView, string> = isEnglish
      ? { list: 'List', kanban: 'Kanban', calendar: 'Calendar', frise: 'Timeline' }
      : { list: 'Liste', kanban: 'Kanban', calendar: 'Calendrier', frise: 'Frise' };
    const subtitle = [viewNames[view], roleLabel || (isEnglish ? 'Everyone' : 'Tout le monde'), weddingDate ? `${isEnglish ? 'Wedding' : 'Mariage'} : ${formatDate(weddingDate)}` : ''].filter(Boolean).join('  ·  ');
    pdf.text(subtitle, margin, 22);
    pdf.setTextColor(...SAGE);
    pdf.text('Mariable', pageWidth - margin, 16, { align: 'right' });
    pdf.setDrawColor(...SAGE);
    pdf.line(margin, 25, pageWidth - margin, 25);
    return 32;
  };

  let cursorY = drawHeader();
  const ensureSpace = (needed: number) => {
    if (cursorY + needed > pageHeight - 14) { pdf.addPage(); cursorY = drawHeader(); }
  };

  if (!steps.length) {
    pdf.setFontSize(11);
    pdf.text(isEnglish ? 'No tasks for this selection.' : 'Aucune tâche pour cette sélection.', margin, cursorY);
  } else if (view === 'list') {
    const cols = [margin, margin + 28, margin + 112, margin + 148];
    const drawTableHead = () => {
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8); pdf.setTextColor(...SAGE);
      [isEnglish ? 'DATE' : 'DATE', isEnglish ? 'TASK' : 'TÂCHE', isEnglish ? 'WHO' : 'QUI', isEnglish ? 'STATUS' : 'STATUT'].forEach((label, index) => pdf.text(label, cols[index], cursorY));
      cursorY += 5;
    };
    drawTableHead();
    steps.forEach((step) => {
      const titleLines = pdf.splitTextToSize(step.title, 80) as string[];
      const rowHeight = Math.max(titleLines.length * 4.5, 5) + 3;
      if (cursorY + rowHeight > pageHeight - 14) { pdf.addPage(); cursorY = drawHeader(); drawTableHead(); }
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(...NOIR);
      pdf.text(formatDate(step.date) || step.period || '—', cols[0], cursorY);
      pdf.text(titleLines, cols[1], cursorY);
      pdf.text(stakeholderLabel(step.stakeholder) || '—', cols[2], cursorY);
      pdf.setTextColor(...(step.status === 'completed' ? SAGE : MUTED));
      pdf.text(STATUS_LABELS[step.status]?.[lang] ?? '', cols[3], cursorY);
      cursorY += rowHeight;
      pdf.setDrawColor(225, 225, 225); pdf.line(margin, cursorY - 3, pageWidth - margin, cursorY - 3);
    });
  } else if (view === 'kanban') {
    const statuses: ManualStepStatus[] = ['pending', 'in_progress', 'completed'];
    const colWidth = (pageWidth - margin * 2 - 8) / 3;
    const columnY = [cursorY, cursorY, cursorY];
    const drawColumnHeads = () => statuses.forEach((status, index) => {
      const x = margin + index * (colWidth + 4);
      pdf.setFillColor(...SAGE); pdf.rect(x, cursorY, colWidth, 8, 'F');
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(255, 255, 255);
      pdf.text(`${STATUS_LABELS[status][lang]} (${steps.filter((s) => s.status === status).length})`, x + 3, cursorY + 5.5);
      columnY[index] = cursorY + 12;
    });
    drawColumnHeads();
    statuses.forEach((status, index) => {
      const x = margin + index * (colWidth + 4);
      steps.filter((step) => step.status === status).forEach((step) => {
        pdf.setFontSize(9);
        const lines = pdf.splitTextToSize(step.title, colWidth - 6) as string[];
        const cardHeight = lines.length * 4 + 10;
        if (columnY[index] + cardHeight > pageHeight - 14) return; // débordement : on tronque la colonne
        pdf.setFillColor(248, 245, 239); pdf.setDrawColor(210, 210, 200);
        pdf.rect(x, columnY[index], colWidth, cardHeight, 'FD');
        pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...NOIR);
        pdf.text(lines, x + 3, columnY[index] + 5);
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.5); pdf.setTextColor(...MUTED);
        pdf.text([formatDate(step.date) || step.period, stakeholderLabel(step.stakeholder)].filter(Boolean).join(' · '), x + 3, columnY[index] + cardHeight - 3);
        columnY[index] += cardHeight + 3;
      });
    });
  } else if (view === 'calendar') {
    pdf.setFont('times', 'normal'); pdf.setFontSize(14); pdf.setTextColor(...NOIR);
    pdf.text(format(calendarMonth, 'MMMM yyyy', { locale: dateLocale }), margin, cursorY);
    cursorY += 5;
    const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(calendarMonth), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(calendarMonth), { weekStartsOn: 1 }) });
    const cellWidth = (pageWidth - margin * 2) / 7;
    const weeks = Math.ceil(days.length / 7);
    const cellHeight = (pageHeight - cursorY - 20) / weeks;
    const weekDays = isEnglish ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8); pdf.setTextColor(...SAGE);
    weekDays.forEach((label, index) => pdf.text(label, margin + index * cellWidth + 2, cursorY + 4));
    cursorY += 6;
    days.forEach((day, index) => {
      const x = margin + (index % 7) * cellWidth;
      const y = cursorY + Math.floor(index / 7) * cellHeight;
      const dayKey = format(day, 'yyyy-MM-dd');
      if (dayKey === weddingDate) { pdf.setFillColor(232, 236, 228); pdf.rect(x, y, cellWidth, cellHeight, 'F'); }
      pdf.setDrawColor(210, 210, 210); pdf.rect(x, y, cellWidth, cellHeight);
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8);
      pdf.setTextColor(...(isSameMonth(day, calendarMonth) ? NOIR : MUTED));
      pdf.text(format(day, 'd'), x + 2, y + 4);
      let lineY = y + 8;
      pdf.setFontSize(6.5); pdf.setTextColor(...SAGE);
      steps.filter((step) => step.date === dayKey).forEach((step) => {
        if (lineY > y + cellHeight - 2) return;
        const label = (pdf.splitTextToSize(`• ${step.title}`, cellWidth - 3) as string[])[0];
        pdf.text(label, x + 1.5, lineY); lineY += 3.2;
      });
    });
  } else {
    // Frise : ligne verticale avec points datés
    const lineX = margin + 30;
    steps.forEach((step) => {
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(step.title, pageWidth - lineX - margin - 8) as string[];
      const blockHeight = lines.length * 5 + 9;
      ensureSpace(blockHeight);
      pdf.setDrawColor(...SAGE); pdf.line(lineX, cursorY - 4, lineX, cursorY + blockHeight - 4);
      pdf.setFillColor(...(step.status === 'completed' ? SAGE : [255, 255, 255] as [number, number, number]));
      pdf.circle(lineX, cursorY - 1, 1.8, 'FD');
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...MUTED);
      pdf.text(formatDate(step.date) || step.period || '', lineX - 4, cursorY, { align: 'right' });
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(...NOIR);
      pdf.text(lines, lineX + 6, cursorY);
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...SAGE);
      pdf.text([stakeholderLabel(step.stakeholder), step.category, STATUS_LABELS[step.status]?.[lang]].filter(Boolean).join(' · '), lineX + 6, cursorY + lines.length * 5);
      cursorY += blockHeight;
    });
  }

  const fileName = `Planning-Mariable-${view}${roleLabel ? `-${roleLabel.replace(/\s+/g, '-')}` : ''}.pdf`;
  pdf.save(fileName);
  console.log('✅ exportRetroplanningPdf completed:', fileName);
};

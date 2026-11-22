// Socle d'import Excel/CSV partagé : modèles téléchargeables, lecture tolérante des en-têtes, détection des doublons.
export interface ImportColumn {
  key: string;
  label: string;
  aliases: string[];
  example: string;
  required?: boolean;
}

export interface ImportModuleConfig {
  id: string;
  title: string;
  templateFileName: string;
  columns: ImportColumn[];
  /** Clé de doublon calculée sur une ligne lue (ex. email ou nom+prénom). */
  duplicateKey: (row: Record<string, string>) => string;
}

export const stripRequiredMark = (h: string) => h.replace(/\s*\*\s*$/, '');

export const normalizeHeader = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

export const normalizeKey = (value: string | null | undefined) =>
  normalizeHeader(String(value ?? ''));

/** Transforme les lignes brutes du fichier en objets { clé de colonne: valeur }. Lignes sans champ obligatoire ignorées. */
export const mapImportRows = (rawRows: Record<string, unknown>[], columns: ImportColumn[]) => {
  const valid: Record<string, string>[] = [];
  let skipped = 0;
  for (const rawRow of rawRows) {
    const headers = Object.keys(rawRow);
    const mapped: Record<string, string> = {};
    for (const column of columns) {
      const accepted = [column.label, column.key, ...column.aliases].map(normalizeHeader);
      const header = headers.find((h) => accepted.includes(normalizeHeader(stripRequiredMark(h))));
      mapped[column.key] = header ? String(rawRow[header] ?? '').trim().slice(0, 1000) : '';
    }
    const isEmpty = Object.values(mapped).every((v) => !v);
    if (isEmpty) continue;
    if (columns.some((c) => c.required && !mapped[c.key])) { skipped++; continue; }
    valid.push(mapped);
  }
  return { rows: valid, skipped };
};

/** Marque les doublons : déjà présents en base ou répétés dans le fichier. */
export const flagDuplicates = (rows: Record<string, string>[], existingKeys: Set<string>, duplicateKey: (r: Record<string, string>) => string) => {
  const seen = new Set<string>();
  return rows.map((row) => {
    const key = duplicateKey(row);
    const isDuplicate = !!key && (existingKeys.has(key) || seen.has(key));
    if (key) seen.add(key);
    return { row, isDuplicate };
  });
};

/** "1 250,50 €" → 1250.5 ; vide ou illisible → 0 */
export const parseAmount = (value: string | undefined) => {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(/\s/g, '');
  const normalized = cleaned.includes(',') && !cleaned.includes('.') ? cleaned.replace(',', '.') : cleaned.replace(/,/g, '');
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0;
};

/** Accepte 2027-06-12, 12/06/2027 ou un numéro de date Excel ; renvoie yyyy-MM-dd ou '' */
export const parseImportDate = (value: string | undefined) => {
  if (!value) return '';
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  const fr = trimmed.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (fr) return `${fr[3]}-${fr[2].padStart(2, '0')}-${fr[1].padStart(2, '0')}`;
  if (/^\d{5}$/.test(trimmed)) {
    const date = new Date(Date.UTC(1899, 11, 30) + Number(trimmed) * 86400000);
    return date.toISOString().slice(0, 10);
  }
  return '';
};

export const downloadImportTemplate = async (config: ImportModuleConfig) => {
  const XLSX = await import('xlsx');
  const header = config.columns.map((c) => c.label + (c.required ? ' *' : ''));
  const example = config.columns.map((c) => c.example);
  const sheet = XLSX.utils.aoa_to_sheet([header, example]);
  sheet['!cols'] = config.columns.map((c) => ({ wch: Math.max(14, c.label.length + 4) }));
  const help = XLSX.utils.aoa_to_sheet([
    ['Modèle Mariable — ' + config.title],
    ['Remplissez une ligne par élément dans l\'onglet « Données ». Les colonnes marquées * sont obligatoires.'],
    ['Supprimez la ligne d\'exemple avant d\'importer. Formats acceptés : .xlsx, .xls, .csv'],
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Données');
  XLSX.utils.book_append_sheet(workbook, help, 'Mode d\'emploi');
  XLSX.writeFile(workbook, config.templateFileName);
};

export const readImportFile = async (file: File) => {
  const XLSX = await import('xlsx');
  const workbook = XLSX.read(await file.arrayBuffer(), { cellDates: false });
  const sheetName = workbook.SheetNames.find((n) => normalizeHeader(n) === 'donnees') ?? workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], { defval: '', raw: false, dateNF: 'yyyy-mm-dd' });
};


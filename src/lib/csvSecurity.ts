/** Quote one spreadsheet cell and prevent user text from becoming a formula. */
export function escapeCsvCell(value: unknown): string {
  const text = String(value ?? '');
  const safeText = /^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)
    ? `'${text}`
    : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}
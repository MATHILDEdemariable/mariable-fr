import { describe, it, expect } from 'vitest';
import { mapImportRows, flagDuplicates, parseAmount, parseImportDate } from './excelImport';
import { guestImport, matchBudgetCategory, matchVendorStatus } from './importModules';

describe('excel import socle', () => {
  it('reads headers with accents, case and required mark', () => {
    const { rows, skipped } = mapImportRows([{ 'PRÉNOM *': 'Julie', nom: 'Durand' }, { Prénom: '', Nom: 'Sans' }], guestImport.columns);
    expect(rows[0].first_name).toBe('Julie');
    expect(rows[0].last_name).toBe('Durand');
    expect(skipped).toBe(1);
  });
  it('flags duplicates from database and inside the file', () => {
    const rows = [{ first_name: 'Julie', last_name: 'Durand', email: '' }, { first_name: 'julie', last_name: 'durand', email: '' }, { first_name: 'Marc', last_name: 'X', email: 'm@x.fr' }];
    const flagged = flagDuplicates(rows, new Set(['mxfr']), guestImport.duplicateKey);
    expect(flagged.map((f) => f.isDuplicate)).toEqual([false, true, true]);
  });
  it('parses French amounts and dates', () => {
    expect(parseAmount('1 250,50 €')).toBe(1250.5);
    expect(parseAmount('')).toBe(0);
    expect(parseImportDate('15/01/2027')).toBe('2027-01-15');
    expect(parseImportDate('2027-06-12')).toBe('2027-06-12');
  });
  it('maps free categories and statuses to Mariable values', () => {
    expect(matchBudgetCategory('Photographe')).toBe('Photo & Vidéo');
    expect(matchBudgetCategory('truc inconnu')).toBe('Divers');
    expect(matchVendorStatus('Devis reçu')).toBe('réponse reçue');
    expect(matchVendorStatus('')).toBe('à contacter');
  });
});

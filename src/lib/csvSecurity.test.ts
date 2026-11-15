import { describe, expect, it } from 'vitest';
import { escapeCsvCell } from './csvSecurity';

describe('spreadsheet-safe CSV cells', () => {
  it.each(['=SUM(1,2)', '+cmd', '-cmd', '@SUM(1)', '  =1', '\t=1', '\r=1', '\n=1'])(
    'neutralizes formula input %j', (value) => {
      expect(escapeCsvCell(value)).toBe(`"'${value}"`);
    },
  );
  it('quotes embedded delimiters, quotes and line breaks', () => {
    expect(escapeCsvCell('Jean, "Paul"\nParis')).toBe('"Jean, ""Paul""\nParis"');
  });
  it('preserves ordinary values and handles missing data', () => {
    expect(escapeCsvCell('Mathilde')).toBe('"Mathilde"');
    expect(escapeCsvCell(undefined)).toBe('""');
    expect(escapeCsvCell(42)).toBe('"42"');
  });
});
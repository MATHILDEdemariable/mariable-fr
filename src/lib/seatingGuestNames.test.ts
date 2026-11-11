import { describe, it, expect } from 'vitest';
import { normalizeGuestName } from './seatingGuestNames';

describe('normalizeGuestName', () => {
  it('treats the same guest written differently as one (anti-doublon)', () => {
    expect(normalizeGuestName('  Mathilde   Lambert ')).toBe(normalizeGuestName('mathilde lambert'));
    expect(normalizeGuestName('Hélène Dupré')).toBe(normalizeGuestName('helene dupre'));
  });
  it('keeps different guests distinct', () => {
    expect(normalizeGuestName('Mathilde Lambert')).not.toBe(normalizeGuestName('Mathieu Lambert'));
  });
});

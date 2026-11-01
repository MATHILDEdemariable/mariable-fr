import { describe, it, expect } from 'vitest';
import { getProTrialDaysLeft, isProTrialExpired } from './proTrial';

describe('essai Pro 1 mois', () => {
  const signup = '2026-01-01T00:00:00Z';
  it('reste actif 29 jours après inscription', () => {
    expect(isProTrialExpired(signup, new Date('2026-01-30T00:00:00Z'))).toBe(false);
  });
  it('expire 30 jours après inscription', () => {
    expect(isProTrialExpired(signup, new Date('2026-01-31T00:00:00Z'))).toBe(true);
  });
  it('compte 14 jours restants à J+16', () => {
    expect(getProTrialDaysLeft(signup, new Date('2026-01-17T00:00:00Z'))).toBe(14);
  });
});

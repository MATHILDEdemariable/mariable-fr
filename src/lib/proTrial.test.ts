import { describe, it, expect } from 'vitest';
import { getProTrialDaysLeft, isProTrialExpired } from './proTrial';

describe('essai Pro 2 mois', () => {
  const signup = '2026-01-01T00:00:00Z';
  it('reste actif 59 jours après inscription', () => {
    expect(isProTrialExpired(signup, new Date('2026-03-01T00:00:00Z'))).toBe(false);
  });
  it('expire 60 jours après inscription', () => {
    expect(isProTrialExpired(signup, new Date('2026-03-02T00:00:00Z'))).toBe(true);
  });
  it('compte 14 jours restants à J+46', () => {
    expect(getProTrialDaysLeft(signup, new Date('2026-02-16T00:00:00Z'))).toBe(14);
  });
});

import { describe, it, expect } from 'vitest';
import { buildGuideSlug, countGuideProfileCompletion, GUIDE_PROFILE_FIELDS } from './proGuideProfile';

describe('proGuideProfile', () => {
  it('counts only filled fields out of 9', () => {
    expect(GUIDE_PROFILE_FIELDS.length).toBe(9);
    expect(countGuideProfileCompletion({ nom: 'Agence', ville: ' ', email: 'a@b.fr' })).toBe(2);
  });
  it('builds a clean unique slug', () => {
    expect(buildGuideSlug('Instant Exception Événements', 'abcdef123')).toBe('instant-exception-evenements-abcdef');
  });
});

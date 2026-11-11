import { describe, it, expect } from 'vitest';
import { classifyDietaryRestriction } from './dietaryFamilies';

describe('classifyDietaryRestriction', () => {
  it('sans gluten et sans lactose = régime spécifique (orange)', () => {
    expect(classifyDietaryRestriction('Sans gluten')).toBe('specific');
    expect(classifyDietaryRestriction('sans lactose')).toBe('specific');
  });
  it('végétarien et vegan = vert', () => {
    expect(classifyDietaryRestriction('Végétarien')).toBe('vegetarian');
    expect(classifyDietaryRestriction('vegan')).toBe('vegetarian');
  });
  it('allergie = rouge', () => {
    expect(classifyDietaryRestriction('Allergie aux arachides')).toBe('allergy');
  });
  it('halal / casher = violet', () => {
    expect(classifyDietaryRestriction('Halal')).toBe('religious');
    expect(classifyDietaryRestriction('casher')).toBe('religious');
  });
  it('vide = aucun badge', () => {
    expect(classifyDietaryRestriction('')).toBeNull();
    expect(classifyDietaryRestriction(null)).toBeNull();
  });
});

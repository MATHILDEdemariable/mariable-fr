import { describe, it, expect } from 'vitest';
import { getStandardTableMeters, getRoomCapacity } from './seatingStandards';

describe('seatingStandards', () => {
  it('une ronde de 8 fait 1,50 m de diamètre', () => {
    expect(getStandardTableMeters('round', 8)).toEqual({ w: 1.5, h: 1.5 });
  });
  it('une table de 20 est plus grande qu’une table de 8', () => {
    expect(getStandardTableMeters('round', 20).w).toBeGreaterThan(getStandardTableMeters('round', 8).w);
    expect(getStandardTableMeters('rectangle', 20).w).toBe(6);
  });
  it('un mange-debout fait 0,80 m', () => {
    expect(getStandardTableMeters('standing', 4)).toEqual({ w: 0.8, h: 0.8 });
  });
  it('160 m² : ~106 assis en rondes, ~133 en banquets, ~246 debout', () => {
    expect(getRoomCapacity(160)).toEqual({ seatedRound: 106, seatedBanquet: 133, standing: 246 });
  });
});

// Standards traiteurs : dimensions de table (mètres) déduites de la forme et de la capacité
export type TableShape = 'round' | 'rectangle' | 'oval' | 'standing' | 'serpentine';

export const getStandardTableMeters = (shape: string, capacity: number): { w: number; h: number } => {
  const seats = Math.max(2, capacity || 2);
  if (shape === 'standing') return { w: 0.8, h: 0.8 };
  if (shape === 'round') {
    const d = seats <= 6 ? 1.2 : seats <= 8 ? 1.5 : seats <= 10 ? 1.8 : seats <= 12 ? 2 : seats <= 14 ? 2.4 : seats <= 16 ? 2.6 : seats <= 20 ? 3 : 3.4;
    return { w: d, h: d };
  }
  if (shape === 'rectangle') {
    // ~0,6 m linéaire par convive des deux côtés
    const w = Math.max(1.2, Math.round(seats * 0.3 * 10) / 10);
    return { w, h: seats >= 16 ? 1 : 0.9 };
  }
  if (shape === 'oval') {
    const w = Math.max(1.8, Math.round(seats * 0.24 * 10) / 10);
    return { w, h: seats >= 14 ? 1.3 : 1.1 };
  }
  // Serpentine : modules en vague, convives des deux côtés
  const w = Math.max(3, Math.round(seats * 0.35 * 10) / 10);
  return { w, h: 1.6 };
};

// Préconisations de capacité selon la surface (m²)
export const getRoomCapacity = (areaM2: number) => ({
  seatedRound: Math.floor(areaM2 / 1.5),
  seatedBanquet: Math.floor(areaM2 / 1.2),
  standing: Math.floor(areaM2 / 0.65),
});

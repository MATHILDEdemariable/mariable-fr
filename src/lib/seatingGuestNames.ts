/** Nom normalisé (casse, accents, espaces) pour détecter un invité déjà présent dans le plan de table. */
export const normalizeGuestName = (name: string | null | undefined) =>
  (name ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();

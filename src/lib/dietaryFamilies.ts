/** Familles de régimes du plan de table : 4 couleurs maximum pour rester lisible. */
export type DietaryFamily = 'allergy' | 'religious' | 'vegetarian' | 'specific';

export const DIETARY_FAMILIES: Record<DietaryFamily, { fr: string; en: string; dotClass: string; badgeClass: string }> = {
  allergy: { fr: 'Allergie / intolérance', en: 'Allergy / intolerance', dotClass: 'bg-red-500', badgeClass: 'border-red-300 bg-red-50 text-red-800' },
  religious: { fr: 'Halal / Casher', en: 'Halal / Kosher', dotClass: 'bg-purple-500', badgeClass: 'border-purple-300 bg-purple-50 text-purple-800' },
  vegetarian: { fr: 'Végétarien / Vegan', en: 'Vegetarian / Vegan', dotClass: 'bg-green-600', badgeClass: 'border-green-300 bg-green-50 text-green-800' },
  specific: { fr: 'Régime spécifique', en: 'Specific diet', dotClass: 'bg-orange-500', badgeClass: 'border-orange-300 bg-orange-50 text-orange-800' },
};

const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/** Classe un texte libre (« sans gluten », « allergie arachides »…) dans une famille ; null si vide / standard. */
export const classifyDietaryRestriction = (restriction: string | null | undefined): DietaryFamily | null => {
  const text = normalize(restriction?.trim() ?? '');
  if (!text || /^(aucun|aucune|none|non|standard|rien|-)$/.test(text)) return null;
  if (/allerg|anaphyla|arachide|cacahuete|peanut|fruits? a coque|nuts?\b|crustace|shellfish|fruits de mer|intoler/.test(text)) return 'allergy';
  if (/halal|casher|kasher|kosher|sans porc|no pork/.test(text)) return 'religious';
  if (/vegan|vegetal|vegeta|veggie|sans viande|no meat|pesco/.test(text)) return 'vegetarian';
  return 'specific';
};

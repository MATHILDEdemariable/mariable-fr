// Détection simple des spécificités invité depuis le champ « Menu & commentaires »
export type GuestTagKey = 'vegetarian' | 'vegan' | 'gluten' | 'allergy' | 'halal' | 'kosher' | 'child_menu' | 'pmr' | 'vip';

export const GUEST_TAG_LABELS: Record<GuestTagKey, { fr: string; en: string; className: string }> = {
  vegetarian: { fr: 'Végétarien', en: 'Vegetarian', className: 'bg-green-100 text-green-800 border-green-300' },
  vegan: { fr: 'Vegan', en: 'Vegan', className: 'bg-green-100 text-green-800 border-green-300' },
  gluten: { fr: 'Sans gluten', en: 'Gluten-free', className: 'bg-amber-100 text-amber-800 border-amber-300' },
  allergy: { fr: 'Allergie', en: 'Allergy', className: 'bg-red-100 text-red-800 border-red-300' },
  halal: { fr: 'Halal', en: 'Halal', className: 'bg-purple-100 text-purple-800 border-purple-300' },
  kosher: { fr: 'Casher', en: 'Kosher', className: 'bg-purple-100 text-purple-800 border-purple-300' },
  child_menu: { fr: 'Menu enfant', en: 'Kids menu', className: 'bg-sky-100 text-sky-800 border-sky-300' },
  pmr: { fr: 'PMR', en: 'Reduced mobility', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  vip: { fr: 'VIP', en: 'VIP', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
};

const TAG_PATTERNS: Array<[GuestTagKey, RegExp]> = [
  ['vegan', /\bv[ée]g(an|[ée]talien)/i],
  ['vegetarian', /v[ée]g[ée]tarien|vegetarian|\bveggie\b|\bv[ée]g[ée]\b/i],
  ['gluten', /gluten|c[œoe]liaque|celiac/i],
  ['allergy', /allerg|intol[ée]ran/i],
  ['halal', /halal/i],
  ['kosher', /casher|kasher|kosher/i],
  ['child_menu', /menu enfant|kids? menu|child(ren)?'?s? menu/i],
  ['pmr', /\bpmr\b|fauteuil|wheelchair|handicap|mobilit[ée] r[ée]duite|reduced mobility|disab/i],
  ['vip', /\bvip\b|t[ée]moin|best man|maid of honou?r/i],
];

export const detectGuestTags = (text: string | null | undefined): GuestTagKey[] => {
  if (!text) return [];
  const tags = TAG_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([key]) => key);
  // Vegan implique déjà végétarien : on évite le doublon
  return tags.includes('vegan') ? tags.filter((t) => t !== 'vegetarian') : tags;
};

// Palette proposée pour le code couleur invité (partagée avec le plan de table)
export const GUEST_COLOR_PALETTE = ['#E8B4B8', '#8FA3BF', '#63745A', '#C9A961', '#B8A9C9', '#E6A57E', '#9E9E9E'];

export const normalizeGuestName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ');

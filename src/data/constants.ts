export const VENDOR_CATEGORIES = [
  { key: 'venue', fr: 'Lieu', en: 'Venue', icon: '🏰' },
  { key: 'catering', fr: 'Traiteur', en: 'Catering', icon: '🍽️' },
  { key: 'photography', fr: 'Photographe', en: 'Photographer', icon: '📷' },
  { key: 'videography', fr: 'Vidéaste', en: 'Videographer', icon: '🎬' },
  { key: 'florist', fr: 'Fleuriste', en: 'Florist', icon: '💐' },
  { key: 'music', fr: 'Musique / DJ', en: 'Music / DJ', icon: '🎵' },
  { key: 'decoration', fr: 'Décoration', en: 'Decoration', icon: '🎨' },
  { key: 'hair_makeup', fr: 'Coiffure & Maquillage', en: 'Hair & Makeup', icon: '💄' },
  { key: 'wedding_planner', fr: 'Wedding Planner', en: 'Wedding Planner', icon: '📋' },
  { key: 'transportation', fr: 'Transport', en: 'Transportation', icon: '🚗' },
  { key: 'officiant', fr: 'Officiant', en: 'Officiant', icon: '💍' },
  { key: 'stationery', fr: 'Papeterie', en: 'Stationery', icon: '💌' },
  { key: 'other', fr: 'Autre', en: 'Other', icon: '✨' },
] as const;

export const PRICE_UNITS = [
  { key: 'forfait', fr: 'Forfait', en: 'Flat rate' },
  { key: 'per_person', fr: 'Par personne', en: 'Per person' },
  { key: 'per_hour', fr: 'Par heure', en: 'Per hour' },
  { key: 'per_day', fr: 'Par jour', en: 'Per day' },
] as const;

export type VendorCategoryKey = typeof VENDOR_CATEGORIES[number]['key'];
export type PriceUnitKey = typeof PRICE_UNITS[number]['key'];

export const getVendorCategory = (key: string) =>
  VENDOR_CATEGORIES.find(category => category.key === key) ?? VENDOR_CATEGORIES[VENDOR_CATEGORIES.length - 1];

export const getPriceUnit = (key: string) =>
  PRICE_UNITS.find(unit => unit.key === key) ?? PRICE_UNITS[0];

/** Correspondance catalogue -> catégories du budget détaillé */
export const CATALOG_TO_BUDGET_CATEGORY: Record<string, string> = {
  venue: 'Lieu de réception',
  catering: 'Traiteur & Boissons',
  photography: 'Photo & Vidéo',
  videography: 'Photo & Vidéo',
  florist: 'Décoration & Fleurs',
  decoration: 'Décoration & Fleurs',
  music: 'Musique & Animation',
  hair_makeup: 'Tenues & Accessoires',
  wedding_planner: 'Divers',
  transportation: 'Transport',
  officiant: 'Divers',
  stationery: 'Papeterie',
  other: 'Divers',
};

// Mapping unifié entre les catégories du panier et du budget
// Permet d'assurer la cohérence entre les deux systèmes

export type ServiceLevel = 'economique' | 'abordable' | 'premium' | 'luxe';

// Mapping des catégories panier vers les clés budget
export const UNIFIED_CATEGORIES: Record<string, { budgetKey: string; percentage: number }> = {
  'Lieu de réception': { budgetKey: 'lieu', percentage: 0.35 },
  'Photographe': { budgetKey: 'photo', percentage: 0.08 },
  'Vidéaste': { budgetKey: 'photo', percentage: 0.08 },
  'Traiteur': { budgetKey: 'traiteur', percentage: 0.35 },
  'DJ': { budgetKey: 'dj', percentage: 0.04 },
  'Fleuriste': { budgetKey: 'deco', percentage: 0.07 },
  'Décoration': { budgetKey: 'deco', percentage: 0.07 },
  'Mise en beauté': { budgetKey: 'tenues', percentage: 0.05 },
  'Robe de mariée': { budgetKey: 'tenues', percentage: 0.05 },
  'Voiture': { budgetKey: 'autres', percentage: 0.04 },
  'Coordination': { budgetKey: 'autres', percentage: 0.04 },
  'Invités': { budgetKey: 'autres', percentage: 0.04 },
};

// Prix standards par catégorie et niveau de service
export const PRICE_BY_SERVICE_LEVEL: Record<string, Record<ServiceLevel, number>> = {
  'Photographe': { economique: 800, abordable: 1200, premium: 1800, luxe: 3000 },
  'Vidéaste': { economique: 800, abordable: 1200, premium: 1800, luxe: 3000 },
  'DJ': { economique: 600, abordable: 1000, premium: 1800, luxe: 2500 },
  'Traiteur': { economique: 50, abordable: 70, premium: 100, luxe: 150 }, // Par invité
  'Lieu de réception': { economique: 2000, abordable: 5000, premium: 8000, luxe: 15000 },
  'Fleuriste': { economique: 500, abordable: 1200, premium: 2000, luxe: 4000 },
  'Décoration': { economique: 800, abordable: 2000, premium: 4000, luxe: 10000 },
  'Mise en beauté': { economique: 200, abordable: 400, premium: 600, luxe: 1000 },
  'Robe de mariée': { economique: 800, abordable: 1500, premium: 2500, luxe: 5000 },
  'Voiture': { economique: 200, abordable: 400, premium: 600, luxe: 1200 },
  'Coordination': { economique: 1000, abordable: 2000, premium: 3500, luxe: 7000 },
};

// Minimums absolus par catégorie et niveau
export const CATEGORY_MINIMUMS: Record<ServiceLevel, { photo: number; dj: number; traiteurParInvite: number }> = {
  economique: { photo: 800, dj: 600, traiteurParInvite: 50 },
  abordable: { photo: 1200, dj: 1000, traiteurParInvite: 70 },
  premium: { photo: 1800, dj: 1800, traiteurParInvite: 100 },
  luxe: { photo: 3000, dj: 2500, traiteurParInvite: 150 }
};

// Mapping des catégories panier vers les catégories budget détaillé
export const CART_TO_DETAILED_BUDGET: Record<string, string> = {
  'Lieu de réception': 'Lieu de réception',
  'Photographe': 'Photo & Vidéo',
  'Vidéaste': 'Photo & Vidéo',
  'Traiteur': 'Traiteur & Boissons',
  'DJ': 'Musique & Animation',
  'Fleuriste': 'Décoration & Fleurs',
  'Décoration': 'Décoration & Fleurs',
  'Mise en beauté': 'Tenues & Accessoires',
  'Robe de mariée': 'Tenues & Accessoires',
  'Voiture': 'Transport',
  'Coordination': 'Divers',
  'Invités': 'Divers',
};

// Fonction utilitaire pour obtenir le prix par défaut selon le niveau de service
export const getDefaultPrice = (category: string, serviceLevel: ServiceLevel): number => {
  return PRICE_BY_SERVICE_LEVEL[category]?.[serviceLevel] || 0;
};

// Fonction pour mapper une catégorie panier vers une catégorie budget
export const mapCartCategoryToBudget = (cartCategory: string): string => {
  return CART_TO_DETAILED_BUDGET[cartCategory] || 'Divers';
};

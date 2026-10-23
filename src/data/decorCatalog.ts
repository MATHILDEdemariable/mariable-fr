// Référentiel du module Décoration : catégories, zones, responsables, statuts et kit de départ.
export type DecorStatus = 'to_find' | 'ready' | 'validated';

type Label = { fr: string; en: string };

export const DECOR_CATEGORIES: Record<string, Label> = {
  papeterie: { fr: 'Papeterie & signalétique', en: 'Stationery & signage' },
  ambiance: { fr: 'Ambiance & petite déco', en: 'Ambience & small decor' },
  confort: { fr: 'Confort des invités', en: 'Guest comfort' },
  fleurs: { fr: 'Fleurs & végétal', en: 'Flowers & greenery' },
  animations: { fr: 'Animations & ateliers', en: 'Activities & workshops' },
};

export const DECOR_ZONES: Record<string, Label> = {
  accueil: { fr: 'Accueil & entrée', en: 'Welcome & entrance' },
  ceremonie: { fr: 'Cérémonie', en: 'Ceremony' },
  cocktail: { fr: "Cocktail / vin d'honneur", en: 'Cocktail hour' },
  diner: { fr: 'Dîner & tables', en: 'Dinner & tables' },
  soiree: { fr: 'Soirée & piste de danse', en: 'Party & dance floor' },
  communs: { fr: 'Espaces communs & toilettes', en: 'Common areas & restrooms' },
};

export const DECOR_RESPONSIBLES: Record<string, Label> = {
  couple: { fr: 'Les mariés', en: 'The couple' },
  planner: { fr: 'Wedding planner', en: 'Wedding planner' },
  temoins: { fr: 'Témoins / famille', en: 'Witnesses / family' },
  lieu: { fr: 'Lieu / traiteur', en: 'Venue / caterer' },
};

export const DECOR_STATUSES: { key: DecorStatus; fr: string; en: string }[] = [
  { key: 'to_find', fr: 'À trouver', en: 'To find' },
  { key: 'ready', fr: 'Prêt', en: 'Ready' },
  { key: 'validated', fr: 'Validé Jour J', en: 'Approved for the day' },
];

export interface DecorKitItem {
  name: Label;
  category: keyof typeof DECOR_CATEGORIES;
  zone: keyof typeof DECOR_ZONES;
}

// Les 12 éléments les plus fréquents pour ne pas partir d'une page blanche
export const DECOR_STARTER_KIT: DecorKitItem[] = [
  { name: { fr: 'Panneau de bienvenue', en: 'Welcome sign' }, category: 'papeterie', zone: 'accueil' },
  { name: { fr: 'Plan de table imprimé', en: 'Printed seating chart' }, category: 'papeterie', zone: 'cocktail' },
  { name: { fr: 'Marque-places', en: 'Place cards' }, category: 'papeterie', zone: 'diner' },
  { name: { fr: 'Menus de table', en: 'Table menus' }, category: 'papeterie', zone: 'diner' },
  { name: { fr: 'Livret de cérémonie', en: 'Ceremony booklet' }, category: 'papeterie', zone: 'ceremonie' },
  { name: { fr: 'Numéros ou noms de table', en: 'Table numbers or names' }, category: 'ambiance', zone: 'diner' },
  { name: { fr: 'Photophores & bougies', en: 'Candle holders & candles' }, category: 'ambiance', zone: 'diner' },
  { name: { fr: "Urne & livre d'or", en: 'Card box & guest book' }, category: 'ambiance', zone: 'accueil' },
  { name: { fr: 'Petits vases / soliflores', en: 'Bud vases' }, category: 'fleurs', zone: 'diner' },
  { name: { fr: 'Pétales ou confettis de sortie', en: 'Exit petals or confetti' }, category: 'fleurs', zone: 'ceremonie' },
  { name: { fr: 'Kit toilettes (lingettes, pansements, laque…)', en: 'Restroom kit (wipes, plasters, hairspray…)' }, category: 'confort', zone: 'communs' },
  { name: { fr: 'Panier de plaids & éventails', en: 'Blankets & fans basket' }, category: 'confort', zone: 'cocktail' },
];

export const decorLabel = (map: Record<string, Label>, key: string, isEnglish: boolean) =>
  map[key] ? (isEnglish ? map[key].en : map[key].fr) : key;

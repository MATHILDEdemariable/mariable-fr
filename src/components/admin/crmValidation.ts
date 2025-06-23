
import { Database } from '@/integrations/supabase/types';

type PrestataireCrmStatus = Database['public']['Enums']['prestataire_status'];
type PrestataireRegion = Database['public']['Enums']['prestataire_region'] | null;
type PrestataireCategorie = Database['public']['Enums']['prestataire_categorie'] | null;

// Status validation
const validStatusValues: PrestataireCrmStatus[] = [
  'acquisition',
  'verification', 
  'a_valider',
  'valide',
  'en_attente',
  'actif',
  'inactif',
  'blackliste',
  'exclu'
];

// Region validation - utilisant les valeurs directement puisque le type enum n'existe pas encore
const validRegionValues: string[] = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  'Provence-Alpes-Côte d\'Azur'
];

// Categorie validation - utilisant les valeurs directement
const validCategorieValues: string[] = [
  'Lieu de réception',
  'Traiteur',
  'Photographe',
  'Vidéaste',
  'Coordination',
  'DJ',
  'Fleuriste',
  'Robe de mariée',
  'Décoration'
];

export const validateAndCastStatus = (value: string): PrestataireCrmStatus | null => {
  if (validStatusValues.includes(value as PrestataireCrmStatus)) {
    return value as PrestataireCrmStatus;
  }
  return null;
};

export const validateAndCastRegion = (value: string): string | null => {
  if (validRegionValues.includes(value)) {
    return value;
  }
  return null;
};

export const validateAndCastCategorie = (value: string): string | null => {
  if (validCategorieValues.includes(value)) {
    return value;
  }
  return null;
};

export const isValidStatus = (value: string): value is PrestataireCrmStatus => {
  return validStatusValues.includes(value as PrestataireCrmStatus);
};

export const isValidRegion = (value: string): boolean => {
  return validRegionValues.includes(value);
};

export const isValidCategorie = (value: string): boolean => {
  return validCategorieValues.includes(value);
};

// Export des constantes pour les Select components
export { validStatusValues, validRegionValues, validCategorieValues };

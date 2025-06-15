
import { Prestataire } from "../types";

// Allowed values for categorie and region enums.
export const PRESTATAIRE_CATEGORIES = [
  "Lieu de réception",
  "Traiteur",
  "Photographe",
  "Vidéaste",
  "Coordination",
  "DJ",
  "Fleuriste",
  "Robe de mariée",
  "Décoration"
] as const;

export const PRESTATAIRE_REGIONS = [
  "Île-de-France",
  "Auvergne-Rhône-Alpes",
  "Bourgogne-Franche-Comté",
  "Bretagne",
  "Centre-Val de Loire",
  "Corse",
  "Grand Est",
  "Hauts-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire",
  "Provence-Alpes-Côte d'Azur"
] as const;

// Fix default values: don't assign "" to enum fields, use undefined.
export const DEFAULT_PRESTATAIRE: Partial<Prestataire> = {
  nom: "",
  categorie: undefined,
  ville: "",
  region: undefined,
  capacite_invites: null,
  prix_minimum: null,
  prix_a_partir_de: null,
  description: "",
  styles: [],
  prix_par_personne: null,
  email: "",
  telephone: "",
  site_web: "",
  show_prices: true,
  first_price_package_name: "",
  first_price_package: null,
  first_price_package_description: "",
  second_price_package_name: "",
  second_price_package: null,
  second_price_package_description: "",
  third_price_package_name: "",
  third_price_package: null,
  third_price_package_description: "",
  fourth_price_package_name: "",
  fourth_price_package: null,
  fourth_price_package_description: "",
};

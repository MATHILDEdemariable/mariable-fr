
export interface AirtableVendor {
  id: string;
  fields: {
    Nom?: string;
    Catégorie?: string;
    Photos?: Array<{
      url: string;
      filename: string;
      id: string;
      size: number;
      type: string;
    }>;
    Description?: string;
    "Prix à partir de"?: number;
    "Prix par personne"?: number;
    Ville?: string;
    Distance?: string;
    "Responsable Nom"?: string;
    "Responsable Bio"?: string;
    Email?: string;
    Téléphone?: string;
    "Site web"?: string;
    Brochure?: Array<{
      url: string;
      filename: string;
      id: string;
      size: number;
      type: string;
    }>;
    Visible?: boolean;
    Région?: string;
  };
  createdTime: string;
}

export interface AirtableResponse {
  records: AirtableVendor[];
  offset?: string;
}

export type VendorCategory = 
  | "Lieu de réception"
  | "Traiteur"
  | "Photographe"
  | "Vidéaste"
  | "Coordination"
  | "DJ"
  | "Fleuriste"
  | "Robe de mariée"
  | "Décoration"
  | "Tous";

export type RegionFrance = 
  | "Auvergne-Rhône-Alpes"
  | "Bourgogne-Franche-Comté"
  | "Bretagne"
  | "Centre-Val de Loire"
  | "Corse"
  | "Grand Est"
  | "Hauts-de-France"
  | "Île-de-France"
  | "Normandie"
  | "Nouvelle-Aquitaine"
  | "Occitanie"
  | "Pays de la Loire"
  | "Provence-Alpes-Côte d'Azur"
  | "France entière";

export interface VendorFilter {
  category: VendorCategory | null;
  search: string;
  region: string | null;
  priceRange: [number, number] | null;
}

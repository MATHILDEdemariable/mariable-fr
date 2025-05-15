
export { generateSchedule } from "./planning/generateSchedule";

// Add custom types for the prestataires_rows table
export type PrestataireRow = {
  id: string;
  nom: string;
  description?: string;
  categorie?: string;
  ville?: string;
  region?: string;
  visible?: boolean;
  // Add the relationships as properties with correct types
  prestataires_photos_preprod?: Array<{
    id: string;
    url: string;
    principale?: boolean;
  }>;
  prestataires_brochures_preprod?: Array<{
    id: string;
    url: string;
  }>;
  prestataires_meta?: Array<{
    id: number;
    meta_key?: string;
    meta_value?: string;
  }>;
};

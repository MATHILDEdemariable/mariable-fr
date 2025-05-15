
import { Database } from "@/integrations/supabase/types";
import { PrestataireRow } from "@/components/wedding-day/utils";

// Export the type for use in admin components
export type Prestataire = Database["public"]["Tables"]["prestataires_rows"]["Row"] & {
  prestataires_photos_preprod?: Array<{
    id: string;
    url: string;
    principale?: boolean;
    ordre?: number;
  }>;
  prestataires_brochures?: Array<{
    id: string;
    url: string;
  }>;
  prestataires_meta?: Array<{
    id: number;
    meta_key?: string;
    meta_value?: string;
  }>;
  documents?: Array<{
    id: string;
    url: string;
    filename?: string;
    type?: string;
  }>;
};

export type PrestataireInsert = Database["public"]["Tables"]["prestataires_rows"]["Insert"];


import { Database } from "@/integrations/supabase/types";
import { PrestataireRow } from "@/components/wedding-day/utils";

// Define PrestatairePhoto type
export interface PrestatairePhoto {
  id: string;
  prestataire_id: string;
  url: string;
  ordre?: number;
  principale?: boolean;
  size?: number;
  filename?: string;
  type?: string;
  created_at: string;
}

// Export the type for use in admin components
export type Prestataire = Database["public"]["Tables"]["prestataires_rows"]["Row"] & {
  fourth_price_package_name?: string | null;
  fourth_price_package?: number | null;
  fourth_price_package_description?: string | null;
  prestataires_photos_preprod?: Database["public"]["Tables"]["prestataires_photos_preprod"]["Row"][];
  prestataires_brochures?: Database["public"]["Tables"]["prestataires_brochures_preprod"]["Row"][];
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

export type PrestataireInsert = Database["public"]["Tables"]["prestataires_rows"]["Insert"] & {
  fourth_price_package_name?: string | null;
  fourth_price_package?: number | null;
  fourth_price_package_description?: string | null;
  status_crm?: 'acquisition' | 'contacted' | 'in_progress' | 'relance_1' | 'relance_2' | 'called' | 'waiting' | 'other' | null;
  date_derniere_contact?: string | null;
};

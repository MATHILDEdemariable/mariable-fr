
import { supabase } from "@/integrations/supabase/client";
import slugify from "@/utils/slugify";

/**
 * Génère un slug unique pour le nom passé, en vérifiant la base prestataires_rows.
 * Si le slug existe, un suffixe numérique est ajouté.
 */
export async function generateUniqueSlug(nom: string, excludeId?: string): Promise<string> {
  let baseSlug = slugify(nom) || "prestataire";
  let uniqueSlug = baseSlug;
  let i = 1;
  while (true) {
    const { data, error } = await supabase
      .from("prestataires_rows")
      .select("id")
      .eq("slug", uniqueSlug);

    if (error) {
      console.error("Error checking slug uniqueness, using timestamp fallback", error);
      return `${baseSlug}-${Date.now()}`;
    }

    // Si aucun résultat ou uniquement le même prestataire, c'est OK
    if (
      !data ||
      data.length === 0 ||
      (excludeId && data.length === 1 && data[0].id === excludeId)
    ) {
      return uniqueSlug;
    }
    i += 1;
    uniqueSlug = `${baseSlug}-${i}`;
  }
}

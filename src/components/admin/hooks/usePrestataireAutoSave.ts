
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Prestataire } from "../types";
import slugify from "@/utils/slugify";

/**
 * Génère un slug unique pour le nom passé, en vérifiant la base prestataires_rows.
 * Si le slug existe, un suffixe numérique est ajouté.
 */
async function generateUniqueSlug(nom: string, excludeId?: string): Promise<string> {
  let baseSlug = slugify(nom) || "prestataire";
  let uniqueSlug = baseSlug;
  let i = 1;
  while (true) {
    const { data, error } = await supabase
      .from("prestataires_rows")
      .select("id")
      .eq("slug", uniqueSlug);

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

export function usePrestataireAutoSave(prestataire: Prestataire | null, onSaved?: (p: Prestataire) => void) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveField = useCallback(
    async (field: keyof Prestataire, value: any) => {
      if (!prestataire?.id) return;
      setIsSaving(true);
      setError(null);

      let patch: Partial<Prestataire> = { [field]: value };

      // Si le nom change, regénérer un slug unique (hors ce presta)
      if (field === 'nom' && value) {
        patch.slug = await generateUniqueSlug(value, prestataire.id);
      }
      // Si slug manquant, le générer aussi
      if (!prestataire.slug && prestataire.nom) {
        patch.slug = await generateUniqueSlug(prestataire.nom, prestataire.id);
      }

      const { data, error } = await supabase
        .from("prestataires_rows")
        .update(patch)
        .eq("id", prestataire.id)
        .select()
        .single();

      setIsSaving(false);

      if (error) {
        setError(error.message);
        toast.error("Erreur lors de la sauvegarde : " + error.message);
      } else if (data) {
        toast.success("Modification sauvegardée");
        onSaved?.(data as Prestataire);
      }
    },
    [prestataire, onSaved]
  );

  return { isSaving, saveField, error };
}

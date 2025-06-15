
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Prestataire } from "../types";
import slugify from "@/utils/slugify";

export function usePrestataireAutoSave(prestataire: Prestataire | null, onSaved?: (p: Prestataire) => void) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour update un field
  const saveField = useCallback(
    async (field: keyof Prestataire, value: any) => {
      if (!prestataire?.id) return;
      setIsSaving(true);
      setError(null);

      // Construction du patch
      const patch: Partial<Prestataire> = { [field]: value };

      // Si le nom est modifié, on met à jour le slug aussi
      if (field === 'nom' && value) {
        patch.slug = slugify(value);
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
        toast.error("Erreur lors de la sauvegarde");
      } else if (data) {
        toast.success("Modification sauvegardée");
        onSaved?.(data as Prestataire);
      }
    },
    [prestataire, onSaved]
  );

  return { isSaving, saveField, error };
}

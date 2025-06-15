import React, { useState } from "react";
import { Prestataire } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { generateUniqueSlug } from "@/utils/generateUniqueSlug";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_PRESTATAIRE } from "./form-parts/constants";
import PrestatairePrimaryInfo from "./form-parts/PrestatairePrimaryInfo";
import PrestatairePackages from "./form-parts/PrestatairePackages";

const FrontStylePrestataireForm: React.FC<{
  prestataire: Prestataire | null;
  onClose: () => void;
  onSuccess: () => void;
  isCreating?: boolean;
}> = ({
  prestataire,
  onClose,
  onSuccess,
  isCreating = false,
}) => {
  const [fields, setFields] = useState<Partial<Prestataire>>(prestataire ?? DEFAULT_PRESTATAIRE);
  const [isSaving, setIsSaving] = useState(false);

  // Field update util
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // For 'categorie' and 'region', use undefined if empty, else valid value
    if (name === "categorie") {
      setFields((prev) => ({
        ...prev,
        categorie: value === "" ? undefined : (value as Prestataire["categorie"]), // safe due to select options
      }));
      return;
    }
    if (name === "region") {
      setFields((prev) => ({
        ...prev,
        region: value === "" ? undefined : (value as Prestataire["region"]),
      }));
      return;
    }
    
    const numericFields = [
      "capacite_invites", "prix_minimum", "prix_a_partir_de", "prix_par_personne",
      "first_price_package", "second_price_package", "third_price_package", "fourth_price_package"
    ];

    setFields((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
          ? (value === "" ? null : Number(value))
          : value,
    }));
  };

  // On save (create or edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Validate required fields
    const nom = (fields.nom ?? "").toString().trim();
    // categorie and region: must be a value from enum, not undefined
    const categorie = fields.categorie;
    if (!nom || !categorie) {
      toast.error("Merci de renseigner nom et catégorie");
      setIsSaving(false);
      return;
    }

    // Construct payload strictly according to API type (must not contain null on enums, only undefined or a valid value)
    const payload: any = {
      ...fields,
      nom,
      categorie,
      region: fields.region ?? undefined,
      styles: Array.isArray(fields.styles) ? fields.styles : [],
    };

    // Remove read-only or client-side only fields from payload
    delete payload.prestataires_photos_preprod;
    delete payload.prestataires_brochures;
    delete payload.prestataires_meta;
    delete payload.documents;

    const originalName = isCreating ? '' : (prestataire?.nom || '');
    const slugIsMissing = !payload.slug;

    if (nom && (nom !== originalName || slugIsMissing)) {
        payload.slug = await generateUniqueSlug(nom, isCreating ? undefined : prestataire?.id);
    }

    try {
      let result;
      if (isCreating) {
        // Ajout nouveau
        result = await supabase.from("prestataires_rows").insert([payload]).select().single();
        if (result.error) throw result.error;
        toast.success("Prestataire ajouté");
      } else {
        // Edition existant
        result = await supabase.from("prestataires_rows").update(payload).eq("id", prestataire?.id).select().single();
        if (result.error) throw result.error;
        toast.success("Modifié !");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error("Erreur : " + err?.message);
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <PrestatairePrimaryInfo fields={fields} handleChange={handleChange} setFields={setFields} />
      
      <label className="block font-medium">Description</label>
      <Textarea
        name="description"
        value={fields.description ?? ""}
        onChange={handleChange}
        className="w-full border rounded min-h-[80px] p-2"
      />

      <PrestatairePackages fields={fields} handleChange={handleChange} setFields={setFields} />

      {/* TODO: Section galerie photos & documents (utiliser components existants, ex: PhotoManager, BrochureManager) */}

      <div className="flex gap-4 pt-2 justify-between">
        <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>Annuler</Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="animate-spin mr-2 inline" size={18} />}
          {isCreating ? "Ajouter" : "Sauvegarder"}
        </Button>
      </div>
    </form>
  );
};

export default FrontStylePrestataireForm;

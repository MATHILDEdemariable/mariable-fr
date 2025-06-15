
import React, { useState } from "react";
import { Prestataire } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FrontStylePrestataireFormProps {
  prestataire: Prestataire | null;
  onClose: () => void;
  onSuccess: () => void;
  isCreating?: boolean;
}

// Allowed values for categorie and region enums.
const PRESTATAIRE_CATEGORIES = [
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

const PRESTATAIRE_REGIONS = [
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
const DEFAULT_PRESTATAIRE: Partial<Prestataire> = {
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
};

const FrontStylePrestataireForm: React.FC<FrontStylePrestataireFormProps> = ({
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
    setFields((prev) => ({
      ...prev,
      [name]:
        name === "capacite_invites" || name === "prix_minimum" || name === "prix_a_partir_de" || name === "prix_par_personne"
          ? value === "" ? null : Number(value)
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

    try {
      let result;
      if (isCreating) {
        // Ajout nouveau
        result = await supabase.from("prestataires_rows").insert([payload]);
        if (result.error) throw result.error;
        toast.success("Prestataire ajouté");
      } else {
        // Edition existant
        result = await supabase.from("prestataires_rows").update(payload).eq("id", prestataire?.id);
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

  // Réutiliser pour select, uploads, etc. Ici on fait simple : input texte, select, textarea, number
  // Formule de prix simplifiée, à détailler plus tard si besoin
  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <div className="flex-1 space-y-3">
          <label className="block font-medium">Nom</label>
          <Input name="nom" value={fields.nom ?? ""} onChange={handleChange} required />

          <label className="block font-medium">Catégorie</label>
          <select
            name="categorie"
            value={fields.categorie ?? ""}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Choisir une catégorie</option>
            {PRESTATAIRE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label className="block font-medium">Ville</label>
          <Input name="ville" value={fields.ville ?? ""} onChange={handleChange} />

          <label className="block font-medium">Région</label>
          <select
            name="region"
            value={fields.region ?? ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Choisir une région</option>
            {PRESTATAIRE_REGIONS.map((reg) => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </select>

          <label className="block font-medium">Capacité (si lieu)</label>
          <Input type="number" name="capacite_invites" value={fields.capacite_invites ?? ""} onChange={handleChange} />
        </div>
        <div className="flex-1 space-y-3">
          <label className="block font-medium">Prix minimum</label>
          <Input type="number" name="prix_minimum" value={fields.prix_minimum ?? ""} onChange={handleChange} />
          <label className="block font-medium">Prix à partir de</label>
          <Input type="number" name="prix_a_partir_de" value={fields.prix_a_partir_de ?? ""} onChange={handleChange} />
          <label className="block font-medium">Prix par personne</label>
          <Input type="number" name="prix_par_personne" value={fields.prix_par_personne ?? ""} onChange={handleChange} />

          <label className="block font-medium">Styles (séparés par virgules)</label>
          <Input
            name="styles"
            value={Array.isArray(fields.styles) ? fields.styles.join(", ") : ""}
            onChange={(e) => setFields((prev) => ({
              ...prev,
              styles: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
            }))}
          />
        </div>
      </div>
      <label className="block font-medium">Description</label>
      <textarea
        name="description"
        value={fields.description ?? ""}
        onChange={handleChange}
        className="w-full border rounded min-h-[80px] p-2"
      />

      {/* TODO: Section Formules de prix (à améliorer) */}
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

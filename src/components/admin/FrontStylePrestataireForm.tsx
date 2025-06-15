import React, { useState } from "react";
import { Prestataire } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { generateUniqueSlug } from "@/utils/generateUniqueSlug";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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

          <label className="block font-medium">Email</label>
          <Input type="email" name="email" value={fields.email ?? ""} onChange={handleChange} />

          <label className="block font-medium">Capacité (si lieu)</label>
          <Input type="number" name="capacite_invites" value={fields.capacite_invites ?? ""} onChange={handleChange} />
        </div>
        <div className="flex-1 space-y-3">
          <label className="block font-medium">Téléphone</label>
          <Input type="tel" name="telephone" value={fields.telephone ?? ""} onChange={handleChange} />

          <label className="block font-medium">Site Web</label>
          <Input type="url" name="site_web" value={fields.site_web ?? ""} onChange={handleChange} />

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
      <Textarea
        name="description"
        value={fields.description ?? ""}
        onChange={handleChange}
        className="w-full border rounded min-h-[80px] p-2"
      />

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Formules & Prix</h3>
        <div className="flex items-center space-x-2 mb-4">
            <Switch
                id="show_prices"
                checked={fields.show_prices ?? true}
                onCheckedChange={(checked) =>
                    setFields((prev) => ({ ...prev, show_prices: checked }))
                }
            />
            <label htmlFor="show_prices">Afficher les prix sur la page</label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Package 1 */}
            <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-semibold">Formule 1</h4>
                <label className="block font-medium">Nom</label>
                <Input name="first_price_package_name" value={fields.first_price_package_name ?? ''} onChange={handleChange} />
                <label className="block font-medium">Prix</label>
                <Input type="number" name="first_price_package" value={fields.first_price_package ?? ''} onChange={handleChange} />
                <label className="block font-medium">Description</label>
                <Textarea name="first_price_package_description" value={fields.first_price_package_description ?? ''} onChange={handleChange} className="min-h-[80px]" />
            </div>
            {/* Package 2 */}
            <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-semibold">Formule 2</h4>
                <label className="block font-medium">Nom</label>
                <Input name="second_price_package_name" value={fields.second_price_package_name ?? ''} onChange={handleChange} />
                <label className="block font-medium">Prix</label>
                <Input type="number" name="second_price_package" value={fields.second_price_package ?? ''} onChange={handleChange} />
                <label className="block font-medium">Description</label>
                <Textarea name="second_price_package_description" value={fields.second_price_package_description ?? ''} onChange={handleChange} className="min-h-[80px]" />
            </div>
            {/* Package 3 */}
            <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-semibold">Formule 3</h4>
                <label className="block font-medium">Nom</label>
                <Input name="third_price_package_name" value={fields.third_price_package_name ?? ''} onChange={handleChange} />
                <label className="block font-medium">Prix</label>
                <Input type="number" name="third_price_package" value={fields.third_price_package ?? ''} onChange={handleChange} />
                <label className="block font-medium">Description</label>
                <Textarea name="third_price_package_description" value={fields.third_price_package_description ?? ''} onChange={handleChange} className="min-h-[80px]" />
            </div>
            {/* Package 4 */}
            <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-semibold">Formule 4</h4>
                <label className="block font-medium">Nom</label>
                <Input name="fourth_price_package_name" value={fields.fourth_price_package_name ?? ''} onChange={handleChange} />
                <label className="block font-medium">Prix</label>
                <Input type="number" name="fourth_price_package" value={fields.fourth_price_package ?? ''} onChange={handleChange} />
                <label className="block font-medium">Description</label>
                <Textarea name="fourth_price_package_description" value={fields.fourth_price_package_description ?? ''} onChange={handleChange} className="min-h-[80px]" />
            </div>
        </div>
    </div>


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

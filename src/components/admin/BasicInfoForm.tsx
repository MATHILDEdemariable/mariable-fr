
import React, { useState } from "react";
import { Prestataire } from "./types";
import { Input } from "@/components/ui/input";
import { usePrestataireAutoSave } from "./hooks/usePrestataireAutoSave";

type BasicField = "nom" | "ville" | "description" | "email" | "telephone" | "site_web";

const FIELD_MAP: Array<{ key: BasicField; label: string; type?: string }> = [
  { key: "nom", label: "Nom" },
  { key: "ville", label: "Ville" },
  { key: "email", label: "Email", type: "email" },
  { key: "telephone", label: "Téléphone", type: "tel" },
  { key: "site_web", label: "Site Web", type: "url" },
  { key: "description", label: "Description" },
];

const BasicInfoForm: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => {
  const [draft, setDraft] = useState<Record<BasicField, string>>({
    nom: prestataire?.nom || "",
    ville: prestataire?.ville || "",
    description: prestataire?.description || "",
    email: prestataire?.email || "",
    telephone: prestataire?.telephone || "",
    site_web: prestataire?.site_web || "",
  });

  React.useEffect(() => {
    setDraft({
      nom: prestataire?.nom || "",
      ville: prestataire?.ville || "",
      description: prestataire?.description || "",
      email: prestataire?.email || "",
      telephone: prestataire?.telephone || "",
      site_web: prestataire?.site_web || "",
    });
  }, [prestataire]);

  const { isSaving, saveField } = usePrestataireAutoSave(prestataire);

  const handleChange = (key: BasicField, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
    saveField(key, value);
  };

  return (
    <div className="space-y-3">
      <h3 className="mb-2 font-semibold">Informations</h3>
      {FIELD_MAP.map(({ key, label, type }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-sm font-medium">{label}</label>
          <Input
            value={draft[key]}
            placeholder={label}
            type={type || "text"}
            onChange={(e) => handleChange(key, e.target.value)}
            className="max-w-xl"
            disabled={!prestataire}
          />
        </div>
      ))}
      <div className="text-xs text-gray-500 mt-2">
        {isSaving ? "Sauvegarde en cours..." : "Les modifications sont sauvegardées automatiquement."}
      </div>
    </div>
  );
};
export default BasicInfoForm;


import React, { useState } from "react";
import { Prestataire } from "./types";
import { Input } from "@/components/ui/input";
import { usePrestataireAutoSave } from "./hooks/usePrestataireAutoSave";

// Étape 1: Définir le type pour les champs de base autorisés
type BasicField = "nom" | "ville" | "region" | "description";

const FIELD_MAP: Array<{ key: BasicField; label: string; type?: string }> = [
  { key: "nom", label: "Nom" },
  { key: "ville", label: "Ville" },
  { key: "region", label: "Région" },
  { key: "description", label: "Description" },
];

const BasicInfoForm: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => {
  // Étape 2: Adapter le draft et tous les usages à BasicField
  const [draft, setDraft] = useState<Record<BasicField, string>>({
    nom: prestataire?.nom || "",
    ville: prestataire?.ville || "",
    region: prestataire?.region || "",
    description: prestataire?.description || "",
  });

  // Synchronise le draft si changement de props
  React.useEffect(() => {
    setDraft({
      nom: prestataire?.nom || "",
      ville: prestataire?.ville || "",
      region: prestataire?.region || "",
      description: prestataire?.description || "",
    });
  }, [prestataire]);

  const { isSaving, saveField } = usePrestataireAutoSave(prestataire);

  // La clé utilisée est toujours un BasicField 
  const handleChange = (key: BasicField, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
    saveField(key, value);
  };

  return (
    <div className="space-y-3">
      <h3 className="mb-2 font-semibold">Informations</h3>
      {FIELD_MAP.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-sm font-medium">{label}</label>
          <Input
            value={draft[key]}
            placeholder={label}
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


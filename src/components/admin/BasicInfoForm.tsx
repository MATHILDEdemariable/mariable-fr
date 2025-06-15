
import React, { useState } from "react";
import { Prestataire } from "./types";
import { Input } from "@/components/ui/input";
import { usePrestataireAutoSave } from "./hooks/usePrestataireAutoSave";

const FIELD_MAP: Array<{ key: keyof Prestataire; label: string; type?: string }> = [
  { key: "nom", label: "Nom" },
  { key: "ville", label: "Ville" },
  { key: "region", label: "Région" },
  { key: "description", label: "Description" },
];

const BasicInfoForm: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => {
  const [draft, setDraft] = useState({
    nom: prestataire?.nom || "",
    ville: prestataire?.ville || "",
    region: prestataire?.region || "",
    description: prestataire?.description || "",
  });

  // Permet de synchroniser le draft si changement de props
  React.useEffect(() => {
    setDraft({
      nom: prestataire?.nom || "",
      ville: prestataire?.ville || "",
      region: prestataire?.region || "",
      description: prestataire?.description || "",
    });
  }, [prestataire]);

  const { isSaving, saveField } = usePrestataireAutoSave(prestataire);

  // Gestion du changement de champ
  const handleChange = (key: keyof typeof draft, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
    saveField(key as keyof Prestataire, value);
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

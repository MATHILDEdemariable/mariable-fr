
import React from "react";
import { Prestataire } from "./types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePrestataireAutoSave } from "./hooks/usePrestataireAutoSave";

const switches = [
  { key: "visible", label: "Prestataire visible" },
  { key: "featured", label: "Mis en avant" },
  { key: "partner", label: "Partenaire" },
  { key: "show_contact_form", label: "Afficher formulaire de contact" },
  { key: "show_description", label: "Afficher description" },
  { key: "show_photos", label: "Afficher photos" },
  { key: "show_brochures", label: "Afficher brochures" },
  { key: "show_responsable", label: "Afficher responsable" },
];

const DisplayOptionsForm: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => {
  const { isSaving, saveField } = usePrestataireAutoSave(prestataire);

  return (
    <div className="space-y-3">
      <h3 className="mb-2 font-semibold">Options affichage</h3>
      {switches.map(({ key, label }) => (
        <div className="flex items-center gap-2" key={key}>
          <Label htmlFor={key}>{label}</Label>
          <Switch
            id={key}
            checked={!!(prestataire && (prestataire as any)[key])}
            onCheckedChange={val => saveField(key as any, val)}
          />
        </div>
      ))}
      <div className="text-xs text-gray-500 mt-2">
        {isSaving ? "Sauvegarde en cours..." : "Les modifications sont sauvegardées automatiquement."}
      </div>
    </div>
  );
};
export default DisplayOptionsForm;

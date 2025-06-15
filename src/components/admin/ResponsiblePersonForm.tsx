
import React, { useEffect, useState } from "react";
import { Prestataire } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePrestataireAutoSave } from "./hooks/usePrestataireAutoSave";

type RespField = "responsable_nom" | "responsable_bio" | "email" | "telephone";

const ResponsiblePersonForm: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => {
  const [draft, setDraft] = useState<Record<RespField, string>>({
    responsable_nom: prestataire?.responsable_nom || "",
    responsable_bio: prestataire?.responsable_bio || "",
    email: prestataire?.email || "",
    telephone: prestataire?.telephone || "",
  });

  useEffect(() => {
    setDraft({
      responsable_nom: prestataire?.responsable_nom || "",
      responsable_bio: prestataire?.responsable_bio || "",
      email: prestataire?.email || "",
      telephone: prestataire?.telephone || "",
    });
  }, [prestataire]);

  const { isSaving, saveField } = usePrestataireAutoSave(prestataire);

  const handleChange = (key: RespField, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
    saveField(key, value);
  };

  return (
    <div className="space-y-3">
      <h3 className="mb-2 font-semibold">Responsable</h3>
      <div className="flex flex-col gap-1">
        <Label>Nom</Label>
        <Input
          value={draft.responsable_nom}
          onChange={e => handleChange("responsable_nom", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Bio</Label>
        <Input
          value={draft.responsable_bio}
          onChange={e => handleChange("responsable_bio", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Email</Label>
        <Input
          value={draft.email}
          onChange={e => handleChange("email", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Téléphone</Label>
        <Input
          value={draft.telephone}
          onChange={e => handleChange("telephone", e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Label htmlFor="show_responsable">Afficher le responsable</Label>
        <Switch
          id="show_responsable"
          checked={!!prestataire?.show_responsable}
          onCheckedChange={val => saveField("show_responsable", val)}
        />
      </div>
      <div className="text-xs text-gray-500">
        {isSaving ? "Sauvegarde en cours..." : "Les modifications sont sauvegardées automatiquement."}
      </div>
    </div>
  );
};
export default ResponsiblePersonForm;

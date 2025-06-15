
import React, { useState, useEffect } from "react";
import { Prestataire } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePrestataireAutoSave } from "./hooks/usePrestataireAutoSave";

type PriceField =
  | "first_price_package_name"
  | "first_price_package"
  | "first_price_package_description"
  | "second_price_package_name"
  | "second_price_package"
  | "second_price_package_description"
  | "third_price_package_name"
  | "third_price_package"
  | "third_price_package_description"
  | "fourth_price_package_name"
  | "fourth_price_package"
  | "fourth_price_package_description";

const priceFields: Array<{
  key: PriceField;
  label: string;
  placeholder?: string;
  type?: string;
}> = [
  { key: "first_price_package_name", label: "Nom formule 1" },
  { key: "first_price_package", label: "Prix formule 1", type: "number" },
  { key: "first_price_package_description", label: "Description formule 1" },
  { key: "second_price_package_name", label: "Nom formule 2" },
  { key: "second_price_package", label: "Prix formule 2", type: "number" },
  { key: "second_price_package_description", label: "Description formule 2" },
  { key: "third_price_package_name", label: "Nom formule 3" },
  { key: "third_price_package", label: "Prix formule 3", type: "number" },
  { key: "third_price_package_description", label: "Description formule 3" },
  { key: "fourth_price_package_name", label: "Nom formule 4" },
  { key: "fourth_price_package", label: "Prix formule 4", type: "number" },
  { key: "fourth_price_package_description", label: "Description formule 4" },
];

const PricingPackagesForm: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => {
  const [draft, setDraft] = useState<
    Record<PriceField, string | number | null>
  >({
    first_price_package_name: prestataire?.first_price_package_name || "",
    first_price_package: prestataire?.first_price_package ?? "",
    first_price_package_description: prestataire?.first_price_package_description || "",
    second_price_package_name: prestataire?.second_price_package_name || "",
    second_price_package: prestataire?.second_price_package ?? "",
    second_price_package_description: prestataire?.second_price_package_description || "",
    third_price_package_name: prestataire?.third_price_package_name || "",
    third_price_package: prestataire?.third_price_package ?? "",
    third_price_package_description: prestataire?.third_price_package_description || "",
    fourth_price_package_name: prestataire?.fourth_price_package_name || "",
    fourth_price_package: prestataire?.fourth_price_package ?? "",
    fourth_price_package_description: prestataire?.fourth_price_package_description || "",
  });

  useEffect(() => {
    setDraft({
      first_price_package_name: prestataire?.first_price_package_name || "",
      first_price_package: prestataire?.first_price_package ?? "",
      first_price_package_description: prestataire?.first_price_package_description || "",
      second_price_package_name: prestataire?.second_price_package_name || "",
      second_price_package: prestataire?.second_price_package ?? "",
      second_price_package_description: prestataire?.second_price_package_description || "",
      third_price_package_name: prestataire?.third_price_package_name || "",
      third_price_package: prestataire?.third_price_package ?? "",
      third_price_package_description: prestataire?.third_price_package_description || "",
      fourth_price_package_name: prestataire?.fourth_price_package_name || "",
      fourth_price_package: prestataire?.fourth_price_package ?? "",
      fourth_price_package_description: prestataire?.fourth_price_package_description || "",
    });
  }, [prestataire]);

  const { isSaving, saveField } = usePrestataireAutoSave(prestataire);

  const handleChange = (key: PriceField, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
    saveField(key, value === "" ? null : value);
  };

  return (
    <div className="space-y-3">
      <h3 className="mb-2 font-semibold">Formules & Prix</h3>
      {priceFields.map(({ key, label, placeholder, type }) => (
        <div key={key} className="flex flex-col gap-1">
          <Label>{label}</Label>
          <Input
            value={draft[key] ?? ""}
            type={type ?? "text"}
            placeholder={placeholder ?? label}
            onChange={e => handleChange(key, e.target.value)}
            disabled={!prestataire}
            className="max-w-xl"
          />
        </div>
      ))}
      <div className="flex items-center gap-2 mt-2">
        <Label htmlFor="show_prices">Afficher les prix</Label>
        <Switch
          id="show_prices"
          checked={!!prestataire?.show_prices}
          onCheckedChange={val => saveField("show_prices", val)}
        />
      </div>
      <div className="text-xs text-gray-500">
        {isSaving ? "Sauvegarde en cours..." : "Les modifications sont sauvegardées automatiquement."}
      </div>
    </div>
  );
};
export default PricingPackagesForm;

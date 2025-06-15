
import React, { useState, useEffect } from "react";
import { Prestataire } from "./types";
import { usePrestataireAutoSave } from "./hooks/usePrestataireAutoSave";

// Idéalement on pourrait loader cette liste dynamiquement.
// Pour la démo, mettons une liste statique :
const STYLES_LISTE = [
  "Bohème",
  "Chic",
  "Rustique",
  "Classique",
  "Romantique",
  "Moderne",
  "Industriel",
  "Vintage",
  "Festif",
  "Minimaliste",
];

const StylesManager: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => {
  const { isSaving, saveField } = usePrestataireAutoSave(prestataire);
  // styles est censé être un tableau (jsonb)
  const [styles, setStyles] = useState<string[]>(Array.isArray(prestataire?.styles) ? prestataire?.styles : []);

  useEffect(() => {
    setStyles(Array.isArray(prestataire?.styles) ? prestataire.styles : []);
  }, [prestataire]);

  const toggleStyle = (style: string) => {
    let updated;
    if (styles.includes(style)) {
      updated = styles.filter((s) => s !== style);
    } else {
      updated = [...styles, style];
    }
    setStyles(updated);
    saveField("styles", updated);
  };

  return (
    <div>
      <h3 className="mb-2 font-semibold">Styles</h3>
      <div className="flex flex-wrap gap-2">
        {STYLES_LISTE.map((style) => (
          <label key={style} className={`flex items-center gap-2 px-2 py-1 rounded bg-gray-100 cursor-pointer ${styles.includes(style) ? "font-bold border border-primary" : ""}`}>
            <input
              type="checkbox"
              checked={styles.includes(style)}
              className="accent-primary"
              onChange={() => toggleStyle(style)}
            />
            {style}
          </label>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        {isSaving ? "Sauvegarde en cours..." : "Les modifications sont sauvegardées automatiquement."}
      </div>
    </div>
  );
};
export default StylesManager;

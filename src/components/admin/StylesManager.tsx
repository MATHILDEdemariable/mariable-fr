
import React from "react";
import { Prestataire } from "./types";

const StylesManager: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => (
  <div>
    <h3 className="mb-2 font-semibold">Styles</h3>
    <div>{Array.isArray(prestataire?.styles) ? prestataire?.styles?.join(", ") : ""}</div>
  </div>
);
export default StylesManager;

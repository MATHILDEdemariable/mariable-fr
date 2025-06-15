
import React from "react";
import { Prestataire } from "./types";

const BrochureManager: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => (
  <div>
    <h3 className="mb-2 font-semibold">Brochures</h3>
    <p>Ici gestion brochures (WIP)</p>
  </div>
);
export default BrochureManager;

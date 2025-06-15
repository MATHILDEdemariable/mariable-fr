
import React from "react";
import { Prestataire } from "./types";
const DisplayOptionsForm: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => (
  <div>
    <h3 className="mb-2 font-semibold">Options affichage</h3>
    <div>
      Visible: {prestataire?.visible ? "Oui" : "Non"}
    </div>
  </div>
);
export default DisplayOptionsForm;

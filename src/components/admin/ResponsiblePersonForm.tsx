
import React from "react";
import { Prestataire } from "./types";

const ResponsiblePersonForm: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => {
  return (
    <div>
      <h3 className="mb-2 font-semibold">Responsable</h3>
      <p>Responsable: {prestataire?.responsable_nom}</p>
    </div>
  );
};
export default ResponsiblePersonForm;


import React from "react";
import { Prestataire } from "./types";

// Cette version simple sera étoffée lors de l'intégration finale
const BasicInfoForm: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => {
  return (
    <div>
      <h3 className="mb-2 font-semibold">Informations</h3>
      <p>Exemple : Nom: {prestataire?.nom || ''}</p>
      {/* Ici viendront tous les champs d'info de base */}
    </div>
  );
};
export default BasicInfoForm;

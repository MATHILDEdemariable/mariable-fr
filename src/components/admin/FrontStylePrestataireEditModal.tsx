
import React from "react";
import FrontStylePrestataireForm from "./FrontStylePrestataireForm";
import { Prestataire } from "./types";

interface FrontStylePrestataireEditModalProps {
  open: boolean;
  onClose: () => void;
  prestataire: Prestataire | null;
  onSuccess: () => void;
  isCreating?: boolean;
}

const FrontStylePrestataireEditModal: React.FC<FrontStylePrestataireEditModalProps> = ({
  open,
  onClose,
  prestataire,
  onSuccess,
  isCreating = false,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg w-[90vw] max-w-5xl max-h-[98vh] overflow-y-auto p-0 relative flex flex-col lg:flex-row">
        {/* Section principale (infos, description, formules) */}
        <div className="flex-1 min-w-0 p-6">
          <FrontStylePrestataireForm
            prestataire={prestataire}
            onSuccess={onSuccess}
            onClose={onClose}
            isCreating={isCreating}
          />
        </div>
        {/* Sidebar (syntonise-toi au front : pricing/devsi etc.) */}
        {/* Ici tu peux ajouter une colonne visuelle si la page front a un calcul de devis/summary */}
      </div>
    </div>
  );
};

export default FrontStylePrestataireEditModal;

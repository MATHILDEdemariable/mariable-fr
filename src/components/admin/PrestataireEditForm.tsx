
import React from "react";
import UnifiedPrestataireEditForm from "./UnifiedPrestataireEditForm";
import { Prestataire } from "./types";

interface EditFormProps {
  isOpen: boolean;
  onClose: () => void;
  prestataire: Prestataire | null;
  onSuccess: () => void;
}

const PrestataireEditForm: React.FC<EditFormProps> = ({
  isOpen,
  onClose,
  prestataire,
  onSuccess,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-[98vh]">
        <UnifiedPrestataireEditForm 
          prestataire={prestataire}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};
export default PrestataireEditForm;

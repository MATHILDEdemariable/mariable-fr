
import React from "react";
import TabbedEditForm from "./TabbedEditForm";
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
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">
        <TabbedEditForm prestataire={prestataire} onClose={onClose} onSuccess={onSuccess} />
        <button onClick={onClose} className="absolute top-4 right-4">✕</button>
      </div>
    </div>
  );
};
export default PrestataireEditForm;

import React from "react";
import { Prestataire } from "./types";
import BasicInfoForm from "./BasicInfoForm";
import PricingPackagesForm from "./PricingPackagesForm";
import ResponsiblePersonForm from "./ResponsiblePersonForm";
import StylesManager from "./StylesManager";
import DisplayOptionsForm from "./DisplayOptionsForm";
import PhotoManager from "./PhotoManager";
import BrochureManager from "./BrochureManager";

interface UnifiedPrestataireEditFormProps {
  prestataire: Prestataire | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UnifiedPrestataireEditForm: React.FC<UnifiedPrestataireEditFormProps> = ({
  prestataire,
  onClose,
  onSuccess,
}) => {
  if (!prestataire) return <div>Chargement…</div>;

  return (
    <form className="max-w-3xl w-full mx-auto space-y-8 relative overflow-y-auto p-2">
      <h2 className="text-2xl font-bold mb-2 text-center">Modifier le prestataire</h2>

      {/* Informations de base */}
      <section className="bg-muted rounded-lg p-4 mb-2">
        <BasicInfoForm prestataire={prestataire} />
      </section>

      {/* Formules & Prix */}
      <section className="bg-muted rounded-lg p-4 mb-2">
        <PricingPackagesForm prestataire={prestataire} />
      </section>

      {/* Responsable */}
      <section className="bg-muted rounded-lg p-4 mb-2">
        <ResponsiblePersonForm prestataire={prestataire} />
      </section>

      {/* Styles */}
      <section className="bg-muted rounded-lg p-4 mb-2">
        <StylesManager prestataire={prestataire} />
      </section>

      {/* Options affichage */}
      <section className="bg-muted rounded-lg p-4 mb-2">
        <DisplayOptionsForm prestataire={prestataire} />
      </section>

      {/* Photos */}
      <section className="bg-muted rounded-lg p-4 mb-2">
        <PhotoManager prestataire={prestataire} onUpdate={onSuccess} />
      </section>

      {/* Brochures */}
      <section className="bg-muted rounded-lg p-4 mb-2">
        <BrochureManager prestataire={prestataire} onUpdate={onSuccess} />
      </section>

      <div className="flex justify-end gap-3 pt-2 sticky bottom-2 bg-white/70 z-20">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Fermer
        </button>
      </div>
    </form>
  );
};

export default UnifiedPrestataireEditForm;

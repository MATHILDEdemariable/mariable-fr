
import React from "react";
import { Prestataire } from "./types";

const PricingPackagesForm: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => {
  return (
    <div>
      <h3 className="mb-2 font-semibold">Formules & Prix</h3>
      {/* Les inputs de formules/prix iront ici */}
      <p>{prestataire?.first_price_package_name} : {prestataire?.first_price_package}</p>
    </div>
  );
};
export default PricingPackagesForm;

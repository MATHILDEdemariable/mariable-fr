
import React from "react";
import { Prestataire } from "./types";

// Version de base
const PhotoManager: React.FC<{ prestataire: Prestataire | null }> = ({ prestataire }) => (
  <div>
    <h3 className="mb-2 font-semibold">Photos</h3>
    <p>Ici : upload photos (WIP)</p>
  </div>
);
export default PhotoManager;

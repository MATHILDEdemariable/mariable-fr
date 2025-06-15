
import React from "react";
import { Prestataire } from "../types";
import { Input } from "@/components/ui/input";
import { PRESTATAIRE_CATEGORIES, PRESTATAIRE_REGIONS } from "./constants";

interface PrestatairePrimaryInfoProps {
  fields: Partial<Prestataire>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFields: React.Dispatch<React.SetStateAction<Partial<Prestataire>>>;
}

const PrestatairePrimaryInfo: React.FC<PrestatairePrimaryInfoProps> = ({ fields, handleChange, setFields }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-8">
      <div className="flex-1 space-y-3">
        <label className="block font-medium">Nom</label>
        <Input name="nom" value={fields.nom ?? ""} onChange={handleChange} required />

        <label className="block font-medium">Catégorie</label>
        <select
          name="categorie"
          value={fields.categorie ?? ""}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Choisir une catégorie</option>
          {PRESTATAIRE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label className="block font-medium">Ville</label>
        <Input name="ville" value={fields.ville ?? ""} onChange={handleChange} />

        <label className="block font-medium">Région</label>
        <select
          name="region"
          value={fields.region ?? ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Choisir une région</option>
          {PRESTATAIRE_REGIONS.map((reg) => (
            <option key={reg} value={reg}>{reg}</option>
          ))}
        </select>

        <label className="block font-medium">Email</label>
        <Input type="email" name="email" value={fields.email ?? ""} onChange={handleChange} />

        <label className="block font-medium">Capacité (si lieu)</label>
        <Input type="number" name="capacite_invites" value={fields.capacite_invites ?? ""} onChange={handleChange} />
      </div>
      <div className="flex-1 space-y-3">
        <label className="block font-medium">Téléphone</label>
        <Input type="tel" name="telephone" value={fields.telephone ?? ""} onChange={handleChange} />

        <label className="block font-medium">Site Web</label>
        <Input type="url" name="site_web" value={fields.site_web ?? ""} onChange={handleChange} />

        <label className="block font-medium">Prix minimum</label>
        <Input type="number" name="prix_minimum" value={fields.prix_minimum ?? ""} onChange={handleChange} />
        <label className="block font-medium">Prix à partir de</label>
        <Input type="number" name="prix_a_partir_de" value={fields.prix_a_partir_de ?? ""} onChange={handleChange} />
        <label className="block font-medium">Prix par personne</label>
        <Input type="number" name="prix_par_personne" value={fields.prix_par_personne ?? ""} onChange={handleChange} />

        <label className="block font-medium">Styles (séparés par virgules)</label>
        <Input
          name="styles"
          value={Array.isArray(fields.styles) ? fields.styles.join(", ") : ""}
          onChange={(e) => setFields((prev) => ({
            ...prev,
            styles: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
          }))}
        />
      </div>
    </div>
  );
};

export default PrestatairePrimaryInfo;


import React, { useState } from "react";
import { Prestataire } from "../types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PRESTATAIRE_CATEGORIES, PRESTATAIRE_REGIONS } from "./constants";
import { ChevronDown, X } from "lucide-react";

interface PrestatairePrimaryInfoProps {
  fields: Partial<Prestataire>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFields: React.Dispatch<React.SetStateAction<Partial<Prestataire>>>;
}

const PrestatairePrimaryInfo: React.FC<PrestatairePrimaryInfoProps> = ({ fields, handleChange, setFields }) => {
  const [isRegionPopoverOpen, setIsRegionPopoverOpen] = useState(false);
  
  const regions = (fields.regions as any) || [];
  const hasFranceEntiere = regions.includes("France entière");

  const handleRegionToggle = (region: string) => {
    const currentRegions = regions || [];
    
    // Si on sélectionne "France entière", désélectionner tout le reste
    if (region === "France entière") {
      if (hasFranceEntiere) {
        setFields(prev => ({ ...prev, regions: [] }));
      } else {
        setFields(prev => ({ ...prev, regions: ["France entière"] }));
      }
      return;
    }
    
    // Si "France entière" est sélectionné, le désélectionner
    let newRegions = currentRegions.filter((r: string) => r !== "France entière");
    
    if (currentRegions.includes(region)) {
      newRegions = newRegions.filter((r: string) => r !== region);
    } else {
      newRegions = [...newRegions, region];
    }
    
    setFields(prev => ({ ...prev, regions: newRegions }));
  };

  const removeRegion = (region: string) => {
    setFields(prev => ({
      ...prev,
      regions: (prev.regions as any || []).filter((r: string) => r !== region)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <div className="flex-1 space-y-3">
          <label className="block font-medium">Nom *</label>
          <Input name="nom" value={fields.nom ?? ""} onChange={handleChange} required />

          <label className="block font-medium">Catégorie *</label>
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

          <div>
            <label className="block font-medium mb-2">Régions *</label>
            <Popover open={isRegionPopoverOpen} onOpenChange={setIsRegionPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  type="button"
                >
                  {regions.length > 0 
                    ? `${regions.length} région(s) sélectionnée(s)`
                    : "Sélectionner les régions"
                  }
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-96 overflow-y-auto p-4">
                <div className="space-y-2">
                  {PRESTATAIRE_REGIONS.map((region) => {
                    const isDisabled = hasFranceEntiere && region !== "France entière";
                    return (
                      <div key={region} className="flex items-center space-x-2">
                        <Checkbox
                          id={region}
                          checked={regions.includes(region)}
                          onCheckedChange={() => handleRegionToggle(region)}
                          disabled={isDisabled}
                        />
                        <label 
                          htmlFor={region}
                          className={`text-sm flex-1 cursor-pointer ${isDisabled ? 'text-muted-foreground' : ''}`}
                        >
                          {region}
                          {region === "France entière" && " (exclusif)"}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Affichage des régions sélectionnées */}
            {regions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {regions.map((region: string) => (
                  <Badge key={region} variant="secondary" className="flex items-center gap-1">
                    {region}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeRegion(region)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

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

      {/* Section Avis Google */}
      <div className="border-t pt-4">
        <h3 className="font-medium text-lg mb-4">Avis Google</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Note Google (0-5)</label>
            <Input
              type="number"
              name="google_rating"
              step="0.1"
              min="0"
              max="5"
              value={fields.google_rating ?? ""}
              onChange={handleChange}
              placeholder="Ex: 4.9"
            />
          </div>
          <div>
            <label className="block font-medium">Nombre d'avis</label>
            <Input
              type="number"
              name="google_reviews_count"
              min="0"
              value={fields.google_reviews_count ?? ""}
              onChange={handleChange}
              placeholder="Ex: 36"
            />
          </div>
          <div>
            <label className="block font-medium">Google Place ID</label>
            <Input
              name="google_place_id"
              value={fields.google_place_id ?? ""}
              onChange={handleChange}
              placeholder="Ex: ChIJN1t_tDeuEmsRUsoyG83frY4"
            />
          </div>
          <div>
            <label className="block font-medium">URL Google Business</label>
            <Input
              type="url"
              name="google_business_url"
              value={fields.google_business_url ?? ""}
              onChange={handleChange}
              placeholder="Ex: https://g.page/nom-etablissement"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestatairePrimaryInfo;

import React, { useState } from "react";
import { Prestataire } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, FileText } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface BrochureManagerProps {
  prestataire: Prestataire | null;
  onUpdate: () => void;
}

const BrochureManager: React.FC<BrochureManagerProps> = ({ prestataire, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const brochures = prestataire?.prestataires_brochures ?? [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !prestataire) return;
    setIsUploading(true);

    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
        toast.error("Seuls les fichiers PDF sont autorisés pour les brochures.");
        setIsUploading(false);
        return;
    }

    const filePath = `${prestataire.id}/${uuidv4()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("prestataires-brochures").upload(filePath, file);
    if (uploadError) {
      toast.error(`Erreur d'upload: ${uploadError.message}`);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("prestataires-brochures").getPublicUrl(filePath);

    const newBrochureData = {
      prestataire_id: prestataire.id,
      url: publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    };

    const { error: insertError } = await supabase.from("prestataires_brochures_preprod").insert([newBrochureData]);
    if (insertError) {
      toast.error(`Erreur DB: ${insertError.message}`);
      await supabase.storage.from("prestataires-brochures").remove([filePath]);
    } else {
        toast.success("Brochure ajoutée.");
    }

    setIsUploading(false);
    onUpdate();
  };

  const handleDelete = async (brochureId: string, brochureUrl: string) => {
    if (!prestataire) return;
    const path = new URL(brochureUrl).pathname.split('/prestataires-brochures/')[1];
    const { error: storageError } = await supabase.storage.from("prestataires-brochures").remove([path]);
    if (storageError) {
      toast.error(`Erreur suppression fichier: ${storageError.message}`);
      return;
    }
    const { error: dbError } = await supabase.from("prestataires_brochures_preprod").delete().eq("id", brochureId);
    if (dbError) {
      toast.error(`Erreur DB: ${dbError.message}`);
      return;
    }
    toast.success("Brochure supprimée.");
    onUpdate();
  };
  
  if (!prestataire) return <p>Veuillez d'abord sauvegarder le prestataire.</p>;

  return (
    <div>
      <h3 className="mb-4 font-semibold text-lg">Gestion des Brochures</h3>
      <div className="mb-4">
        <Label htmlFor="brochure-upload">Ajouter une brochure (PDF)</Label>
        <div className="flex items-center gap-4">
          <Input id="brochure-upload" type="file" accept="application/pdf" onChange={handleUpload} disabled={isUploading} className="max-w-sm" />
          {isUploading && <Loader2 className="animate-spin" />}
        </div>
        <p className="text-sm text-muted-foreground mt-1">PDF. Max 10MB.</p>
      </div>

      <div className="space-y-2">
        {brochures.map((brochure) => (
          <div key={brochure.id} className="flex items-center gap-4 p-2 border rounded-lg bg-white">
            <FileText className="text-gray-500" />
            <a href={brochure.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm truncate hover:underline">
              {brochure.filename ?? 'Brochure'}
            </a>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(brochure.id, brochure.url)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {brochures.length === 0 && <p className="text-sm text-muted-foreground pt-2">Aucune brochure.</p>}
      </div>
    </div>
  );
};
export default BrochureManager;

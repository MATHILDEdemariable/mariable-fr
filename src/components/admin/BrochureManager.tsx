
import React, { useState } from "react";
import { Prestataire } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, FileText, Upload } from "lucide-react";
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
    
    console.log('📄 Starting brochure upload for prestataire:', prestataire.id);
    setIsUploading(true);

    const file = e.target.files[0];
    
    try {
      // Validation du fichier
      if (file.type !== "application/pdf") {
        toast.error("Seuls les fichiers PDF sont autorisés pour les brochures");
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        toast.error("Le fichier est trop volumineux (maximum 10MB)");
        return;
      }

      console.log('📄 Processing PDF file:', file.name);

      const filePath = `${prestataire.id}/${uuidv4()}-${file.name}`;
      
      // Upload vers le storage
      const { error: uploadError } = await supabase.storage
        .from("prestataires-brochures")
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        toast.error(`Erreur d'upload: ${uploadError.message}`);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("prestataires-brochures")
        .getPublicUrl(filePath);

      const newBrochureData = {
        prestataire_id: prestataire.id,
        url: publicUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
      };

      console.log('💾 Inserting brochure data:', newBrochureData);

      // Insertion en base
      const { error: insertError } = await supabase
        .from("prestataires_brochures_preprod")
        .insert([newBrochureData]);
        
      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        toast.error(`Erreur base de données: ${insertError.message}`);
        // Nettoyer le fichier uploadé en cas d'erreur
        await supabase.storage.from("prestataires-brochures").remove([filePath]);
      } else {
        console.log('✅ Brochure inserted successfully');
        toast.success("Brochure ajoutée avec succès");
        onUpdate(); // Rafraîchir les données
      }
      
    } catch (error) {
      console.error('❌ Unexpected error uploading brochure:', error);
      toast.error('Erreur inattendue lors de l\'upload');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async (brochureId: string, brochureUrl: string) => {
    if (!prestataire) return;
    
    console.log('🗑️ Deleting brochure:', brochureId);
    
    try {
      // Extraire le chemin du fichier depuis l'URL
      const urlParts = brochureUrl.split('/prestataires-brochures/');
      if (urlParts.length < 2) {
        console.error('❌ Invalid brochure URL format:', brochureUrl);
        toast.error('URL de brochure invalide');
        return;
      }
      
      const path = urlParts[1];
      
      // Supprimer de la base de données d'abord
      const { error: dbError } = await supabase
        .from("prestataires_brochures_preprod")
        .delete()
        .eq("id", brochureId);
        
      if (dbError) {
        console.error('❌ Database delete error:', dbError);
        toast.error(`Erreur base de données: ${dbError.message}`);
        return;
      }
      
      // Puis supprimer du storage
      const { error: storageError } = await supabase.storage
        .from("prestataires-brochures")
        .remove([path]);
        
      if (storageError) {
        console.error('⚠️ Storage delete warning:', storageError);
        // Ne pas bloquer si la suppression du storage échoue
      }
      
      toast.success("Brochure supprimée avec succès");
      onUpdate(); // Rafraîchir les données
      
    } catch (error) {
      console.error('❌ Unexpected error during deletion:', error);
      toast.error('Erreur inattendue lors de la suppression');
    }
  };
  
  if (!prestataire) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Veuillez d'abord sauvegarder le prestataire pour gérer les brochures.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Gestion des Brochures</h3>
        
        <div className="mb-4">
          <Label htmlFor="brochure-upload">Ajouter une brochure (PDF)</Label>
          <div className="flex items-center gap-4 mt-2">
            <Input 
              id="brochure-upload" 
              type="file" 
              accept="application/pdf" 
              onChange={handleUpload} 
              disabled={isUploading} 
              className="max-w-sm" 
            />
            {isUploading && (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                <span className="text-sm text-gray-600">Upload en cours...</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Format PDF uniquement. Taille maximum: 10MB.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {brochures.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Aucune brochure ajoutée</p>
            <p className="text-sm text-gray-400 mt-1">Utilisez le bouton ci-dessus pour ajouter une brochure PDF</p>
          </div>
        ) : (
          brochures.map((brochure) => (
            <div 
              key={brochure.id} 
              className="flex items-center gap-4 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <FileText className="text-red-500 h-6 w-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {brochure.filename ?? 'Brochure'}
                </div>
                <div className="text-xs text-gray-500">
                  PDF • {brochure.size ? `${Math.round(brochure.size / 1024)} KB` : 'Taille inconnue'}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(brochure.url, '_blank')}
                  title="Ouvrir la brochure"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Ouvrir
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(brochure.id, brochure.url)}
                  title="Supprimer la brochure"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrochureManager;

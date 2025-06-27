
import React, { useState, useEffect } from "react";
import { Prestataire } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Star, GripVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Database } from "@/integrations/supabase/types";

interface PhotoManagerProps {
  prestataire: Prestataire | null;
  onUpdate: () => void;
}

const PhotoManager: React.FC<PhotoManagerProps> = ({ prestataire, onUpdate }) => {
  const [photos, setPhotos] = useState<Database["public"]["Tables"]["prestataires_photos_preprod"]["Row"][]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log('🔄 PhotoManager - prestataire changed:', prestataire?.id);
    const sortedPhotos = [...(prestataire?.prestataires_photos_preprod ?? [])]
      .sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
    setPhotos(sortedPhotos);
  }, [prestataire?.prestataires_photos_preprod]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !prestataire) return;
    
    console.log('📁 Starting photo upload for prestataire:', prestataire.id);
    setIsUploading(true);

    const files = Array.from(e.target.files);
    const newPhotos: Database["public"]["Tables"]["prestataires_photos_preprod"]["Row"][] = [];

    for (const file of files) {
      try {
        console.log('📄 Processing file:', file.name);
        
        // Validation du fichier
        if (!file.type.startsWith('image/')) {
          toast.error(`Le fichier ${file.name} n'est pas une image valide`);
          continue;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB max
          toast.error(`Le fichier ${file.name} est trop volumineux (max 5MB)`);
          continue;
        }

        const filePath = `${prestataire.id}/${uuidv4()}-${file.name}`;
        
        // Upload vers le storage
        const { error: uploadError } = await supabase.storage
          .from("prestataires-photos")
          .upload(filePath, file);

        if (uploadError) {
          console.error('❌ Storage upload error:', uploadError);
          toast.error(`Erreur d'upload pour ${file.name}: ${uploadError.message}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("prestataires-photos")
          .getPublicUrl(filePath);

        const newPhotoData = {
          prestataire_id: prestataire.id,
          url: publicUrl,
          ordre: photos.length + newPhotos.length,
          principale: photos.length + newPhotos.length === 0,
          filename: file.name,
          size: file.size,
          type: file.type,
        };

        console.log('💾 Inserting photo data:', newPhotoData);

        // Insertion en base
        const { data: insertedPhoto, error: insertError } = await supabase
          .from("prestataires_photos_preprod")
          .insert([newPhotoData])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Database insert error:', insertError);
          toast.error(`Erreur base de données pour ${file.name}: ${insertError.message}`);
          // Nettoyer le fichier uploadé en cas d'erreur
          await supabase.storage.from("prestataires-photos").remove([filePath]);
        } else if (insertedPhoto) {
          console.log('✅ Photo inserted successfully:', insertedPhoto.id);
          newPhotos.push(insertedPhoto);
        }
      } catch (error) {
        console.error('❌ Unexpected error processing file:', file.name, error);
        toast.error(`Erreur inattendue pour ${file.name}`);
      }
    }

    if (newPhotos.length > 0) {
      setPhotos(prev => [...prev, ...newPhotos]);
      toast.success(`${newPhotos.length} photo(s) ajoutée(s) avec succès`);
    }

    setIsUploading(false);
    e.target.value = ''; // Reset input
  };

  const handleDelete = async (photoId: string, photoUrl: string) => {
    if (!prestataire) return;
    
    console.log('🗑️ Deleting photo:', photoId);
    
    try {
      // Extraire le chemin du fichier depuis l'URL
      const urlParts = photoUrl.split('/prestataires-photos/');
      if (urlParts.length < 2) {
        console.error('❌ Invalid photo URL format:', photoUrl);
        toast.error('URL de photo invalide');
        return;
      }
      
      const path = urlParts[1];
      
      // Supprimer de la base de données d'abord
      const { error: dbError } = await supabase
        .from("prestataires_photos_preprod")
        .delete()
        .eq("id", photoId);
        
      if (dbError) {
        console.error('❌ Database delete error:', dbError);
        toast.error(`Erreur base de données: ${dbError.message}`);
        return;
      }
      
      // Puis supprimer du storage
      const { error: storageError } = await supabase.storage
        .from("prestataires-photos")
        .remove([path]);
        
      if (storageError) {
        console.error('⚠️ Storage delete warning:', storageError);
        // Ne pas bloquer si la suppression du storage échoue
      }
      
      // Mettre à jour l'état local
      setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
      toast.success("Photo supprimée avec succès");
      
    } catch (error) {
      console.error('❌ Unexpected error during deletion:', error);
      toast.error('Erreur inattendue lors de la suppression');
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    if (!prestataire) return;
    
    console.log('⭐ Setting primary photo:', photoId);
    
    try {
      // Reset toutes les photos comme non-principales
      const { error: resetError } = await supabase
        .from("prestataires_photos_preprod")
        .update({ principale: false })
        .eq("prestataire_id", prestataire.id);
        
      if (resetError) {
        console.error('❌ Reset primary error:', resetError);
        toast.error("Erreur lors du reset: " + resetError.message);
        return;
      }
      
      // Définir la photo sélectionnée comme principale
      const { error: setError } = await supabase
        .from("prestataires_photos_preprod")
        .update({ principale: true })
        .eq("id", photoId);
        
      if (setError) {
        console.error('❌ Set primary error:', setError);
        toast.error("Erreur lors de la définition: " + setError.message);
        return;
      }
      
      // Mettre à jour l'état local
      setPhotos(prevPhotos => 
        prevPhotos.map(p => ({ ...p, principale: p.id === photoId }))
      );
      
      toast.success("Photo principale définie avec succès");
      
    } catch (error) {
      console.error('❌ Unexpected error setting primary:', error);
      toast.error('Erreur inattendue');
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    console.log('🔄 Reordering photos');
    
    const originalPhotos = [...photos];
    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedPhotos = items.map((photo, index) => ({...photo, ordre: index}));
    setPhotos(updatedPhotos);

    try {
      const updatePromises = updatedPhotos.map((photo) =>
        supabase
          .from("prestataires_photos_preprod")
          .update({ ordre: photo.ordre })
          .eq("id", photo.id)
      );
      
      const results = await Promise.all(updatePromises);
      
      if (results.some(res => res.error)) {
        console.error('❌ Reorder error:', results.find(res => res.error)?.error);
        toast.error("Erreur lors de la mise à jour de l'ordre");
        setPhotos(originalPhotos); // Rétablir en cas d'erreur
      } else {
        console.log('✅ Photos reordered successfully');
        toast.success("Ordre des photos mis à jour avec succès");
      }
    } catch (error) {
      console.error('❌ Unexpected reorder error:', error);
      toast.error("Erreur inattendue lors du réordonnancement");
      setPhotos(originalPhotos);
    }
  };

  if (!prestataire) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Veuillez d'abord sauvegarder le prestataire pour gérer les photos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Gestion des Photos</h3>
        
        <div className="mb-4">
          <Label htmlFor="photo-upload">Ajouter des photos</Label>
          <div className="flex items-center gap-4 mt-2">
            <Input 
              id="photo-upload" 
              type="file" 
              multiple 
              onChange={handleUpload} 
              disabled={isUploading} 
              className="max-w-sm" 
              accept="image/png,image/jpeg,image/webp,image/gif" 
            />
            {isUploading && (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                <span className="text-sm text-gray-600">Upload en cours...</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Formats supportés: JPEG, PNG, WEBP, GIF. Taille max: 5MB par photo.
          </p>
        </div>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="photos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {photos.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500">Aucune photo ajoutée</p>
                  <p className="text-sm text-gray-400 mt-1">Utilisez le bouton ci-dessus pour ajouter des photos</p>
                </div>
              ) : (
                photos.map((photo, index) => (
                  <Draggable key={photo.id} draggableId={photo.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-4 p-3 border rounded-lg transition-colors ${
                          snapshot.isDragging ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                          <GripVertical className="text-gray-400 h-5 w-5" />
                        </div>
                        
                        <img 
                          src={photo.url} 
                          alt={photo.filename ?? 'Photo'} 
                          className="w-20 h-20 object-cover rounded border"
                          onError={(e) => {
                            console.error('❌ Image load error:', photo.url);
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {photo.filename || 'Photo sans nom'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {photo.size ? `${Math.round(photo.size / 1024)} KB` : 'Taille inconnue'}
                          </div>
                        </div>
                        
                        <Button 
                          variant={photo.principale ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => handleSetPrimary(photo.id)}
                          title="Définir comme photo principale"
                          className="shrink-0"
                        >
                          <Star className={`mr-1 h-4 w-4 ${photo.principale ? "text-yellow-400 fill-current" : ""}`} />
                          {photo.principale ? "Principale" : "Définir"}
                        </Button>
                        
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(photo.id, photo.url)}
                          title="Supprimer la photo"
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default PhotoManager;

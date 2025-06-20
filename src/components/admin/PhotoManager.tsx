
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
    const sortedPhotos = [...(prestataire?.prestataires_photos_preprod ?? [])]
      .sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0))
      .map((p, index) => ({ ...p, ordre: index }));
    setPhotos(sortedPhotos);
  }, [prestataire?.prestataires_photos_preprod]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !prestataire) return;
    setIsUploading(true);

    const files = Array.from(e.target.files);
    const newPhotos: Database["public"]["Tables"]["prestataires_photos_preprod"]["Row"][] = [];

    for (const file of files) {
      const filePath = `${prestataire.id}/${uuidv4()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("prestataires-photos")
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Erreur d'upload: ${uploadError.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from("prestataires-photos").getPublicUrl(filePath);

      const newPhotoData = {
        prestataire_id: prestataire.id,
        url: publicUrl,
        ordre: photos.length + newPhotos.length,
        principale: photos.length + newPhotos.length === 0,
        filename: file.name,
        size: file.size,
        type: file.type,
      };

      const { data: insertedPhoto, error: insertError } = await supabase
        .from("prestataires_photos_preprod")
        .insert([newPhotoData])
        .select()
        .single();

      if (insertError) {
        toast.error(`Erreur DB: ${insertError.message}`);
        await supabase.storage.from("prestataires-photos").remove([filePath]);
      } else if (insertedPhoto) {
        newPhotos.push(insertedPhoto);
      }
    }

    if (newPhotos.length > 0) {
      setPhotos(prev => [...prev, ...newPhotos]);
      toast.success(`${newPhotos.length} photo(s) ajoutée(s)`);
    }

    setIsUploading(false);
    // onUpdate(); // Ne pas appeler pour éviter la fermeture du modal
  };

  const handleDelete = async (photoId: string, photoUrl: string) => {
    if (!prestataire) return;
    const path = new URL(photoUrl).pathname.split('/prestataires-photos/')[1];
    const { error: storageError } = await supabase.storage.from("prestataires-photos").remove([path]);
    if (storageError) {
      toast.error(`Erreur suppression fichier: ${storageError.message}`);
      return;
    }
    const { error: dbError } = await supabase.from("prestataires_photos_preprod").delete().eq("id", photoId);
    if (dbError) {
      toast.error(`Erreur DB: ${dbError.message}`);
      return;
    }
    setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
    toast.success("Photo supprimée.");
    // onUpdate(); // Ne pas appeler pour éviter la fermeture du modal
  };

  const handleSetPrimary = async (photoId: string) => {
    if (!prestataire) return;
    const { error: resetError } = await supabase.from("prestataires_photos_preprod").update({ principale: false }).eq("prestataire_id", prestataire.id);
    if (resetError) {
      toast.error("Erreur reset: " + resetError.message);
      return;
    }
    const { error: setError } = await supabase.from("prestataires_photos_preprod").update({ principale: true }).eq("id", photoId);
    if (setError) {
      toast.error("Erreur: " + setError.message);
      return;
    }
    setPhotos(prevPhotos => prevPhotos.map(p => ({ ...p, principale: p.id === photoId })));
    toast.success("Photo principale définie.");
    // onUpdate(); // Ne pas appeler pour éviter la fermeture du modal
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const originalPhotos = [...photos];
    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedPhotos = items.map((photo, index) => ({...photo, ordre: index}));
    setPhotos(updatedPhotos);

    const updatePromises = updatedPhotos.map((photo) =>
      supabase.from("prestataires_photos_preprod").update({ ordre: photo.ordre }).eq("id", photo.id)
    );
    const results = await Promise.all(updatePromises);
    if (results.some(res => res.error)) {
      toast.error("Erreur lors de la mise à jour de l'ordre.");
      setPhotos(originalPhotos); // Rétablir en cas d'erreur
    } else {
      toast.success("Ordre des photos mis à jour.");
    }
  };

  if (!prestataire) return <p>Veuillez d'abord sauvegarder le prestataire.</p>;

  return (
    <div>
      <h3 className="mb-4 font-semibold text-lg">Gestion des Photos</h3>
      <div className="mb-4">
        <Label htmlFor="photo-upload">Ajouter des photos</Label>
        <div className="flex items-center gap-4">
          <Input id="photo-upload" type="file" multiple onChange={handleUpload} disabled={isUploading} className="max-w-sm" accept="image/png, image/jpeg, image/webp, image/gif" />
          {isUploading && <Loader2 className="animate-spin" />}
        </div>
        <p className="text-sm text-muted-foreground mt-1">JPEG, PNG, WEBP, GIF. Max 5MB par photo.</p>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="photos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {photos.map((photo, index) => (
                <Draggable key={photo.id} draggableId={photo.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-4 p-2 border rounded-lg ${snapshot.isDragging ? "bg-blue-50" : "bg-white"}`}
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="text-gray-400" />
                      </div>
                      <img src={photo.url} alt={photo.filename ?? ''} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1 text-sm truncate">{photo.filename}</div>
                      <Button variant={photo.principale ? "default" : "outline"} size="sm" onClick={() => handleSetPrimary(photo.id)} title="Définir comme photo principale">
                        <Star className={`mr-2 h-4 w-4 ${photo.principale ? "text-yellow-400 fill-current" : ""}`} />
                        Principale
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(photo.id, photo.url)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default PhotoManager;

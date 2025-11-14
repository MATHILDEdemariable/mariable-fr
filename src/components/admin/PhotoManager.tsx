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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const sortedPhotos = [...(prestataire?.prestataires_photos_preprod ?? [])]
      .sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
    setPhotos(sortedPhotos);
  }, [prestataire?.prestataires_photos_preprod]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !prestataire) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files);

    try {
      for (const file of files) {
        const tempPath = `${prestataire.id}/temp_${uuidv4()}.jpg`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("prestataires-photos")
          .upload(tempPath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("prestataires-photos")
          .getPublicUrl(uploadData.path);

        const { data: compressed, error: compressError } = await supabase.functions.invoke(
          'compress-photo',
          { body: { photoUrl: publicUrl, prestataireId: prestataire.id } }
        );

        if (compressError || !compressed?.success) throw new Error('Compression failed');

        await supabase.storage.from("prestataires-photos").remove([uploadData.path]);

        await supabase.from("prestataires_photos_preprod").insert({
          prestataire_id: prestataire.id,
          url: compressed.fullUrl,
          thumbnail_url: compressed.thumbnailUrl,
          filename: compressed.filename,
          principale: photos.length === 0,
          ordre: photos.length,
        });
      }

      toast.success("Photos uploadées et optimisées");
      onUpdate();
      if (e.target) e.target.value = '';
    } catch (error: any) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (photoId: string, photoUrl: string) => {
    setIsDeleting(photoId);
    try {
      await supabase.from("prestataires_photos_preprod").delete().eq("id", photoId);
      toast.success("Photo supprimée");
      onUpdate();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(null);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedPhotos = items.map((photo, index) => ({ ...photo, ordre: index }));
    setPhotos(updatedPhotos);

    try {
      await Promise.all(
        updatedPhotos.map(photo => 
          supabase.from("prestataires_photos_preprod").update({ ordre: photo.ordre }).eq("id", photo.id)
        )
      );
      toast.success("Ordre mis à jour");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photo-upload">Photos</Label>
        <Input
          id="photo-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading || !prestataire}
        />
        {isUploading && <p className="text-sm text-muted-foreground mt-2">Upload et compression...</p>}
      </div>

      {photos.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="photos">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {photos.map((photo, index) => (
                  <Draggable key={photo.id} draggableId={photo.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <img src={photo.thumbnail_url || photo.url} alt="" className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">Photo {index + 1}</div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(photo.id, photo.url)}
                          disabled={!!isDeleting}
                        >
                          {isDeleting === photo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
      )}
    </div>
  );
};

export default PhotoManager;

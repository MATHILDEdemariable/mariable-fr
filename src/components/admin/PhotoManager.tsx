import React, { useState, useEffect } from "react";
import { Prestataire } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Star, GripVertical, AlertCircle, RefreshCw } from "lucide-react";
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
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const sortedPhotos = [...(prestataire?.prestataires_photos_preprod ?? [])]
      .sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0))
      .map((p, index) => ({ ...p, ordre: index }));
    setPhotos(sortedPhotos);
  }, [prestataire?.prestataires_photos_preprod]);

  const logUploadDiagnostic = async () => {
    console.log('🔍 PHOTO MANAGER: Starting upload diagnostic');
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('👤 PHOTO MANAGER: User status:', {
        authenticated: !!user,
        userId: user?.id,
        error: userError?.message
      });

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔐 PHOTO MANAGER: Session status:', {
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        error: sessionError?.message
      });

      return { user, session };
    } catch (error) {
      console.error('❌ PHOTO MANAGER: Diagnostic failed:', error);
      return { user: null, session: null };
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !prestataire) return;
    
    console.log('📷 PHOTO MANAGER: Starting photos upload for prestataire:', prestataire.id);
    setIsUploading(true);
    setUploadError(null);

    const files = Array.from(e.target.files);
    const newPhotos: Database["public"]["Tables"]["prestataires_photos_preprod"]["Row"][] = [];

    try {
      // Diagnostic initial
      const { user, session } = await logUploadDiagnostic();
      
      if (!user || !session) {
        throw new Error('Vous devez être connecté pour uploader des photos. Veuillez vous reconnecter.');
      }

      console.log('✅ PHOTO MANAGER: User authenticated:', user.id);

      for (const file of files) {
        console.log('📁 PHOTO MANAGER: Processing file:', {
          name: file.name,
          size: file.size,
          type: file.type
        });

        // Validation du fichier
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          console.warn(`⚠️ PHOTO MANAGER: File too large: ${file.name}`);
          toast.error(`Fichier trop volumineux: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
          continue;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          console.warn(`⚠️ PHOTO MANAGER: Invalid file type: ${file.type}`);
          toast.error(`Type de fichier non supporté: ${file.name}`);
          continue;
        }
        
        const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `${prestataire.id}/${fileName}`;
        console.log('📁 PHOTO MANAGER: Upload path:', filePath);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("prestataires-photos")
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('❌ PHOTO MANAGER: Upload error for file:', file.name, {
            error: uploadError,
            message: uploadError.message,
            name: uploadError.name
          });
          
          if (uploadError.message.includes('Invalid key') || uploadError.message.includes('Access denied')) {
            throw new Error(`Erreur d'autorisation pour ${file.name}: ${uploadError.message}`);
          } else {
            toast.error(`Erreur d'upload pour ${file.name}: ${uploadError.message}`);
            continue;
          }
        }

        console.log('✅ PHOTO MANAGER: Upload successful for:', file.name, uploadData);

        const { data: { publicUrl } } = supabase.storage
          .from("prestataires-photos")
          .getPublicUrl(uploadData.path);

        if (!publicUrl) {
          throw new Error(`Impossible d'obtenir l'URL publique pour ${file.name}`);
        }

        console.log('✅ PHOTO MANAGER: Public URL generated:', publicUrl);

        const newPhotoData = {
          prestataire_id: prestataire.id,
          url: publicUrl,
          ordre: photos.length + newPhotos.length,
          principale: photos.length + newPhotos.length === 0,
          filename: file.name,
          size: file.size,
          type: file.type,
        };

        console.log('💾 PHOTO MANAGER: Inserting photo data:', newPhotoData);

        const { data: insertedPhoto, error: insertError } = await supabase
          .from("prestataires_photos_preprod")
          .insert([newPhotoData])
          .select()
          .single();

        if (insertError) {
          console.error('❌ PHOTO MANAGER: DB insert error:', insertError);
          toast.error(`Erreur DB pour ${file.name}: ${insertError.message}`);
          // Supprimer le fichier uploadé en cas d'erreur DB
          await supabase.storage.from("prestataires-photos").remove([filePath]);
        } else if (insertedPhoto) {
          console.log('✅ PHOTO MANAGER: Photo inserted successfully:', insertedPhoto);
          newPhotos.push(insertedPhoto);
        }
      }

      if (newPhotos.length > 0) {
        setPhotos(prev => [...prev, ...newPhotos]);
        toast.success(`${newPhotos.length} photo(s) ajoutée(s)`);
        onUpdate(); // Refresh parent component
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur inconnue lors de l\'upload';
      console.error('❌ PHOTO MANAGER: Unexpected error during upload:', error);
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset input value
      e.target.value = '';
    }
  };

  const handleDelete = async (photoId: string, photoUrl: string) => {
    if (!prestataire) return;
    
    console.log('🗑️ Deleting photo:', photoId, photoUrl);
    
    try {
      const path = new URL(photoUrl).pathname.split('/prestataires-photos/')[1];
      console.log('📁 Deleting file at path:', path);
      
      const { error: storageError } = await supabase.storage
        .from("prestataires-photos")
        .remove([path]);
        
      if (storageError) {
        console.error('❌ Storage delete error:', storageError);
        toast.error(`Erreur suppression fichier: ${storageError.message}`);
        return;
      }
      
      console.log('✅ File deleted from storage');
      
      const { error: dbError } = await supabase
        .from("prestataires_photos_preprod")
        .delete()
        .eq("id", photoId);
        
      if (dbError) {
        console.error('❌ DB delete error:', dbError);
        toast.error(`Erreur DB: ${dbError.message}`);
        return;
      }
      
      console.log('✅ Photo deleted from database');
      setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
      toast.success("Photo supprimée.");
    } catch (error) {
      console.error('❌ Unexpected error during delete:', error);
      toast.error('Une erreur inattendue est survenue');
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    if (!prestataire) return;
    
    console.log('⭐ Setting primary photo:', photoId);
    
    try {
      const { error: resetError } = await supabase
        .from("prestataires_photos_preprod")
        .update({ principale: false })
        .eq("prestataire_id", prestataire.id);
        
      if (resetError) {
        console.error('❌ Reset error:', resetError);
        toast.error("Erreur reset: " + resetError.message);
        return;
      }
      
      const { error: setError } = await supabase
        .from("prestataires_photos_preprod")
        .update({ principale: true })
        .eq("id", photoId);
        
      if (setError) {
        console.error('❌ Set primary error:', setError);
        toast.error("Erreur: " + setError.message);
        return;
      }
      
      console.log('✅ Primary photo set successfully');
      setPhotos(prevPhotos => prevPhotos.map(p => ({ ...p, principale: p.id === photoId })));
      toast.success("Photo principale définie.");
    } catch (error) {
      console.error('❌ Unexpected error setting primary:', error);
      toast.error('Une erreur inattendue est survenue');
    }
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

  const handleRetry = () => {
    setUploadError(null);
    const fileInput = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  if (!prestataire) return <p>Veuillez d'abord sauvegarder le prestataire.</p>;

  return (
    <div>
      <h3 className="mb-4 font-semibold text-lg">Gestion des Photos</h3>
      <div className="mb-4 space-y-3">
        <Label htmlFor="photo-upload">Ajouter des photos</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Input 
              id="photo-upload" 
              type="file" 
              multiple 
              onChange={handleUpload} 
              disabled={isUploading} 
              className="max-w-sm" 
              accept="image/png, image/jpeg, image/webp, image/gif" 
            />
            {isUploading && (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                <span className="text-sm">Upload en cours...</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            JPEG, PNG, WEBP, GIF. Max 5MB par photo. Bucket: prestataires-photos
          </p>
        </div>

        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-700 text-sm">{uploadError}</p>
                <Button 
                  onClick={handleRetry} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Réessayer
                </Button>
              </div>
            </div>
          </div>
        )}
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

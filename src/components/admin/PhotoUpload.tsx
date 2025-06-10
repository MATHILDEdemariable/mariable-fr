
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { X, Upload, Star } from 'lucide-react';

interface PhotoUploadProps {
  prestataireId: string;
  photos: Array<{
    id: string;
    url: string;
    principale?: boolean;
    is_cover?: boolean;
    ordre?: number;
  }>;
  onPhotosUpdate: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  prestataireId, 
  photos, 
  onPhotosUpdate 
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${prestataireId}/${Date.now()}.${fileExt}`;
        
        // Upload to Supabase storage (assuming bucket exists)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('prestataires-photos')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('prestataires-photos')
          .getPublicUrl(fileName);

        // Save photo info to database
        const { error: dbError } = await supabase
          .from('prestataires_photos_preprod')
          .insert({
            prestataire_id: prestataireId,
            url: publicUrl,
            filename: file.name,
            size: file.size,
            type: file.type,
            ordre: photos.length + 1
          });

        if (dbError) {
          console.error('Database error:', dbError);
          toast({
            title: "Erreur",
            description: "Erreur lors de l'enregistrement de la photo",
            variant: "destructive"
          });
        }
      }
      
      toast({
        title: "Succès",
        description: "Photos uploadées avec succès"
      });
      
      onPhotosUpdate();
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload des photos",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('prestataires_photos_preprod')
        .delete()
        .eq('id', photoId);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Photo supprimée avec succès"
      });
      
      onPhotosUpdate();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  const handleSetCover = async (photoId: string) => {
    try {
      // Remove cover from all photos
      await supabase
        .from('prestataires_photos_preprod')
        .update({ is_cover: false })
        .eq('prestataire_id', prestataireId);

      // Set new cover
      const { error } = await supabase
        .from('prestataires_photos_preprod')
        .update({ is_cover: true })
        .eq('id', photoId);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Photo de couverture définie"
      });
      
      onPhotosUpdate();
    } catch (error) {
      console.error('Error setting cover:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photo-upload">Ajouter des photos</Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <Button disabled={uploading} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Upload...' : 'Upload'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.url}
              alt="Photo prestataire"
              className={`w-full h-32 object-cover rounded-md border-2 ${
                photo.is_cover ? 'border-yellow-400' : 'border-gray-200'
              }`}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant={photo.is_cover ? "default" : "outline"}
                onClick={() => handleSetCover(photo.id)}
                className="w-8 h-8 p-0"
              >
                <Star className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeletePhoto(photo.id)}
                className="w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {photo.is_cover && (
              <div className="absolute bottom-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs">
                Couverture
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoUpload;

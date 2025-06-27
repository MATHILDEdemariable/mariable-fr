
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImageUrl?: string | null;
  bucketName: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  currentImageUrl, 
  bucketName 
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${uuidv4()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      if (!publicUrl) {
        throw new Error("Impossible d'obtenir l'URL publique de l'image.");
      }

      setPreviewUrl(publicUrl);
      onImageUpload(publicUrl);
      toast.success('Image téléversée avec succès !');
    } catch (error: any) {
      toast.error(`Erreur lors du téléversement: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input 
        type="file" 
        accept="image/png, image/jpeg, image/webp" 
        onChange={handleFileChange} 
        disabled={uploading} 
      />
      {uploading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Téléversement en cours...</span>
        </div>
      )}
      {previewUrl && (
        <div className="mt-2">
          <p className="text-sm font-medium">Aperçu :</p>
          <img 
            src={previewUrl} 
            alt="Aperçu" 
            className="max-w-xs max-h-48 object-contain rounded-md border" 
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;


import React, { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, X, Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImageUrl?: string | null;
  bucketName: string;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  currentImageUrl, 
  bucketName,
  acceptedTypes = "image/png, image/jpeg, image/webp",
  maxSizeMB = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const validateFile = useCallback((file: File): string | null => {
    console.log('📁 Validating file:', file.name, file.type, file.size);
    
    // Vérifier le type de fichier
    const acceptedTypesList = acceptedTypes.split(',').map(t => t.trim());
    if (!acceptedTypesList.includes(file.type)) {
      return `Type de fichier non supporté. Types acceptés: ${acceptedTypes}`;
    }
    
    // Vérifier la taille
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Fichier trop volumineux. Taille maximum: ${maxSizeMB}MB`;
    }
    
    return null;
  }, [acceptedTypes, maxSizeMB]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('🔄 Starting image upload to bucket:', bucketName);

    // Validation du fichier
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      event.target.value = ''; // Reset input
      return;
    }

    setUploading(true);
    
    try {
      const fileName = `${uuidv4()}-${file.name}`;
      console.log('📤 Uploading file:', fileName);
      
      // Upload vers le storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) {
        console.error('❌ Storage upload error:', error);
        throw error;
      }

      console.log('✅ File uploaded successfully:', data.path);

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      if (!publicUrl) {
        throw new Error("Impossible d'obtenir l'URL publique de l'image");
      }

      console.log('🔗 Public URL generated:', publicUrl);

      // Mettre à jour l'aperçu
      setPreviewUrl(publicUrl);
      
      // Callback pour informer le parent
      onImageUpload(publicUrl);
      
      toast.success('Image téléversée avec succès !');
      
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      toast.error(`Erreur lors du téléversement: ${error.message}`);
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const handleRemovePreview = () => {
    setPreviewUrl(null);
    onImageUpload(''); // Notifier la suppression
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input 
          type="file" 
          accept={acceptedTypes}
          onChange={handleFileChange} 
          disabled={uploading}
          className="flex-1"
        />
        
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Upload...</span>
          </div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        {acceptedTypes.replace(/image\//g, '').toUpperCase()} • Max {maxSizeMB}MB
      </p>
      
      {previewUrl && (
        <div className="relative inline-block">
          <div className="relative group">
            <img 
              src={previewUrl} 
              alt="Aperçu" 
              className="max-w-xs max-h-48 object-contain rounded-lg border shadow-sm"
              onError={(e) => {
                console.error('❌ Image preview error:', previewUrl);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemovePreview}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Supprimer l'image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium">Aperçu de l'image</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(previewUrl, '_blank')}
              className="mt-1"
            >
              <Upload className="h-4 w-4 mr-1" />
              Voir en grand
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

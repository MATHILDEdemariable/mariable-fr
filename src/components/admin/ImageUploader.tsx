
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const logUploadDiagnostic = async () => {
    console.log('🔍 DIAGNOSTIC: Starting upload diagnostic for bucket:', bucketName);
    
    try {
      // Vérifier l'état de l'authentification
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('👤 DIAGNOSTIC: User auth status:', {
        user: user ? {
          id: user.id,
          email: user.email,
          role: user.role,
          aud: user.aud
        } : null,
        error: userError
      });

      // Vérifier les informations de session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔐 DIAGNOSTIC: Session status:', {
        session: session ? {
          access_token: session.access_token ? 'Present' : 'Missing',
          token_type: session.token_type,
          expires_at: session.expires_at
        } : null,
        error: sessionError
      });

      // Tenter de lister les buckets pour tester les permissions
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      console.log('🪣 DIAGNOSTIC: Storage buckets access:', {
        buckets: buckets?.map(b => ({ id: b.id, name: b.name, public: b.public })),
        error: bucketsError
      });

      // Tester les permissions spécifiques du bucket
      try {
        const { data: bucketFiles, error: bucketError } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 1 });
        console.log(`📁 DIAGNOSTIC: Bucket ${bucketName} access test:`, {
          canList: !bucketError,
          error: bucketError,
          fileCount: bucketFiles?.length || 0
        });
      } catch (bucketTestError) {
        console.log(`❌ DIAGNOSTIC: Bucket ${bucketName} access failed:`, bucketTestError);
      }

      return { user, session };
    } catch (error) {
      console.error('❌ DIAGNOSTIC: Diagnostic failed:', error);
      return { user: null, session: null };
    }
  };

  const attemptUpload = async (file: File, fileName: string, attempt: number = 1): Promise<string> => {
    console.log(`🔄 UPLOAD ATTEMPT ${attempt}: Starting upload of ${fileName} to ${bucketName}`);
    
    const uploadOptions = {
      cacheControl: '3600',
      upsert: false
    };

    console.log('📋 UPLOAD: Upload options:', uploadOptions);
    console.log('📄 UPLOAD: File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, uploadOptions);

    console.log(`📊 UPLOAD ATTEMPT ${attempt}: Result:`, {
      success: !error,
      data: data,
      error: error ? {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack
      } : null
    });

    if (error) {
      // Analyser le type d'erreur
      if (error.message.includes('Invalid key') || error.message.includes('Access denied')) {
        console.error('🔒 UPLOAD: Permission/Key error detected:', error);
        throw new Error(`Erreur d'autorisation: ${error.message}. Vérifiez vos permissions sur le bucket ${bucketName}.`);
      } else if (error.message.includes('already exists')) {
        console.warn(`⚠️ UPLOAD: File exists, trying with different name...`);
        const newFileName = `${uuidv4()}-retry-${fileName}`;
        return attemptUpload(file, newFileName, attempt + 1);
      } else {
        throw new Error(`Erreur d'upload (tentative ${attempt}): ${error.message}`);
      }
    }

    if (!data?.path) {
      throw new Error('Upload réussi mais chemin de fichier manquant');
    }

    console.log('✅ UPLOAD: Upload successful, getting public URL...');
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    if (!publicUrl) {
      throw new Error("Impossible d'obtenir l'URL publique de l'image.");
    }

    console.log('🌐 UPLOAD: Public URL generated:', publicUrl);
    return publicUrl;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📷 Starting image upload process');
    setUploading(true);
    setUploadError(null);
    
    try {
      // Diagnostic initial
      const { user, session } = await logUploadDiagnostic();
      
      if (!user || !session) {
        throw new Error('Vous devez être connecté pour téléverser des images. Veuillez vous reconnecter.');
      }

      // Validation du fichier
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error(`Le fichier est trop volumineux (${(file.size / 1024 / 1024).toFixed(1)}MB). Taille maximum: 5MB.`);
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Type de fichier non supporté: ${file.type}. Types autorisés: ${allowedTypes.join(', ')}`);
      }

      const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      console.log('📁 Generated filename:', fileName);
      
      const publicUrl = await attemptUpload(file, fileName);
      
      setPreviewUrl(publicUrl);
      onImageUpload(publicUrl);
      setRetryCount(0);
      toast.success('Image téléversée avec succès !');
      
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur inconnue lors du téléversement';
      console.error('❌ Complete upload error:', error);
      setUploadError(errorMessage);
      toast.error(`Erreur lors du téléversement: ${errorMessage}`);
    } finally {
      setUploading(false);
      // Reset input value to allow re-upload of same file
      event.target.value = '';
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setUploadError(null);
    const fileInput = document.querySelector(`input[type="file"]`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input 
          type="file" 
          accept="image/png, image/jpeg, image/webp, image/gif" 
          onChange={handleFileChange} 
          disabled={uploading} 
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground">
          Formats acceptés: PNG, JPEG, WEBP, GIF • Taille max: 5MB • Bucket: {bucketName}
        </p>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-blue-700">Téléversement en cours...</span>
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 text-sm">{uploadError}</p>
              {retryCount < 3 && (
                <Button 
                  onClick={handleRetry} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Réessayer ({retryCount + 1}/3)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Aperçu :</p>
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Aperçu" 
              className="max-w-xs max-h-48 object-contain rounded-md border shadow-sm" 
              onError={(e) => {
                console.error('❌ Image preview failed to load:', previewUrl);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="mt-1">
              <p className="text-xs text-muted-foreground break-all">{previewUrl}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

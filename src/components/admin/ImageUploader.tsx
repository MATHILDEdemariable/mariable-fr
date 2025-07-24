import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImageUrl?: string | null;
  bucketName: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImageUrl,
  bucketName
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentImageUrl || null);

  const generateUniqueFileName = (originalName: string) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
  };

  const validateFile = (file: File): string | null => {
    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.';
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Le fichier est trop volumineux. Taille maximum : 5MB.';
    }

    return null;
  };

  const attemptUpload = async (file: File, fileName: string, attempt: number = 1): Promise<string> => {
    console.log(`🚀 Tentative d'upload ${attempt} pour ${fileName}`);
    
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('❌ Erreur upload:', error);
        throw error;
      }

      console.log('✅ Upload réussi:', data);

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error(`❌ Erreur upload tentative ${attempt}:`, error);
      
      if (attempt < 3) {
        console.log(`🔄 Retry dans ${attempt}s...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        return attemptUpload(file, fileName, attempt + 1);
      }
      
      throw error;
    }
  };

  const logUploadDiagnostic = async () => {
    try {
      console.log('🔍 Diagnostic d\'upload:');
      
      // Vérifier l'authentification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('👤 Utilisateur:', user?.id || 'Non connecté');
      
      if (authError) {
        console.error('❌ Erreur auth:', authError);
      }

      // Vérifier la session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔐 Session:', session ? 'Active' : 'Inactive');
      
      if (sessionError) {
        console.error('❌ Erreur session:', sessionError);
      }

      // Tester l'accès au bucket
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      console.log('🗂️ Buckets disponibles:', buckets?.map(b => b.name) || []);
      
      if (bucketsError) {
        console.error('❌ Erreur buckets:', bucketsError);
      }

      // Vérifier si le bucket existe
      const bucketExists = buckets?.some(b => b.name === bucketName);
      console.log(`🗂️ Bucket "${bucketName}" existe:`, bucketExists);

      if (bucketExists) {
        // Tester la liste des fichiers
        const { data: files, error: listError } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 1 });
          
        console.log('📁 Test accès bucket:', listError ? 'Échec' : 'Réussi');
        if (listError) {
          console.error('❌ Erreur list:', listError);
        }
      }

    } catch (error) {
      console.error('🚨 Erreur diagnostic:', error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadProgress(0);

    // Validation
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      console.log('📤 Début upload:', file.name, file.size, file.type);
      
      // Diagnostic au premier échec
      await logUploadDiagnostic();

      // Générer un nom unique
      const fileName = generateUniqueFileName(file.name);
      console.log('📝 Nom fichier généré:', fileName);

      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload
      const publicUrl = await attemptUpload(file, fileName);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('✅ URL publique:', publicUrl);
      
      setUploadedUrl(publicUrl);
      onImageUpload(publicUrl);
      
      toast({
        title: "Succès",
        description: "Image uploadée avec succès"
      });

    } catch (error: any) {
      console.error('🚨 Erreur finale:', error);
      setError(error.message || 'Erreur lors de l\'upload');
      
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRetry = () => {
    setError(null);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input && input.files?.[0]) {
      handleFileChange({ target: input } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const removeImage = () => {
    setUploadedUrl(null);
    onImageUpload('');
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {!uploadedUrl ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <label htmlFor="image-upload" className="cursor-pointer">
              <span className="text-sm font-medium text-wedding-olive hover:text-wedding-olive/80">
                Cliquez pour sélectionner une image
              </span>
              <Input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={uploading}
                className="sr-only"
              />
            </label>
            <p className="text-xs text-gray-500">
              JPG, PNG ou WebP. Taille max : 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={uploadedUrl}
            alt="Image uploadée"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={removeImage}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Upload en cours...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-wedding-olive h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="text-sm text-red-800">{error}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={uploading}
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
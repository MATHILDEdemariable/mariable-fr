import * as tus from 'tus-js-client';
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = 'https://bgidfcqktsttzlwlumtz.supabase.co';
const BUCKET = 'guest-album';
const RESUMABLE_THRESHOLD = 6 * 1024 * 1024; // 6 Mo

export interface UploadPreparation {
  path: string;
  signedUrl: string;
  uploadToken: string;
  thumbPath: string | null;
  thumbUploadToken: string | null;
  kind: 'photo' | 'video';
}

/**
 * Génère une vignette JPEG 400px pour l'affichage. L'original n'est jamais modifié.
 * Retourne null si le navigateur ne sait pas décoder le fichier (ex: HEIC sur Chrome).
 */
export const generateThumbnail = async (file: File): Promise<Blob | null> => {
  if (!file.type.startsWith('image/')) return null;

  try {
    const bitmap = await createImageBitmap(file);
    const maxSize = 400;
    const scale = Math.min(maxSize / bitmap.width, maxSize / bitmap.height, 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8)
    );
  } catch (error) {
    console.warn('⚠️ generateThumbnail skipped:', error);
    return null;
  }
};

/** Lit la durée d'une vidéo côté navigateur (métadonnées uniquement). */
export const readVideoDuration = async (file: File): Promise<number | null> => {
  if (!file.type.startsWith('video/')) return null;

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const url = URL.createObjectURL(file);
    const cleanup = () => URL.revokeObjectURL(url);

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? Math.round(video.duration) : null;
      cleanup();
      resolve(duration);
    };
    video.onerror = () => {
      cleanup();
      resolve(null);
    };
    video.src = url;
  });
};

/**
 * Envoi du fichier ORIGINAL, octet pour octet (aucune compression / conversion).
 * Fichiers > 6 Mo : upload résumable TUS avec reprise après coupure réseau.
 */
export const uploadOriginal = async (
  file: File,
  preparation: UploadPreparation,
  onProgress: (percent: number) => void
): Promise<void> => {
  if (file.size > RESUMABLE_THRESHOLD) {
    try {
      await uploadResumable(file, preparation, onProgress);
      return;
    } catch (error) {
      console.warn('⚠️ Resumable upload failed, fallback to direct upload:', error);
    }
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .uploadToSignedUrl(preparation.path, preparation.uploadToken, file, {
      contentType: file.type || 'application/octet-stream',
    });

  if (error) throw error;
  onProgress(100);
};

const uploadResumable = (
  file: File,
  preparation: UploadPreparation,
  onProgress: (percent: number) => void
): Promise<void> =>
  new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 6000, 12000, 24000],
      headers: {
        authorization: `Bearer ${preparation.uploadToken}`,
        'x-upsert': 'true',
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: BUCKET,
        objectName: preparation.path,
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
      },
      chunkSize: 6 * 1024 * 1024,
      onError: (error) => reject(error),
      onProgress: (sent, total) => onProgress(Math.round((sent / total) * 100)),
      onSuccess: () => resolve(),
    });

    upload.findPreviousUploads().then((previous) => {
      if (previous.length) upload.resumeFromPreviousUpload(previous[0]);
      upload.start();
    });
  });

/** Envoi de la vignette générée (en plus de l'original). */
export const uploadThumbnail = async (
  thumbnail: Blob,
  preparation: UploadPreparation
): Promise<string | null> => {
  if (!preparation.thumbPath || !preparation.thumbUploadToken) return null;

  const { error } = await supabase.storage
    .from(BUCKET)
    .uploadToSignedUrl(preparation.thumbPath, preparation.thumbUploadToken, thumbnail, {
      contentType: 'image/jpeg',
    });

  if (error) {
    console.warn('⚠️ Thumbnail upload failed:', error);
    return null;
  }
  return preparation.thumbPath;
};

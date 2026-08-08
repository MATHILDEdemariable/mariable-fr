import React, { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ImagePlus, Loader2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  generateThumbnail,
  readVideoDuration,
  uploadOriginal,
  uploadThumbnail,
  type UploadPreparation,
} from '@/lib/albumUpload';

interface GuestUploaderProps {
  token: string;
  onUploaded: () => void;
}

type ItemStatus = 'pending' | 'uploading' | 'done' | 'error';

interface QueueItem {
  id: string;
  file: File;
  progress: number;
  status: ItemStatus;
  error?: string;
}

const MAX_PARALLEL = 3;

const GuestUploader: React.FC<GuestUploaderProps> = ({ token, onUploaded }) => {
  const [uploaderName, setUploaderName] = useState('');
  const [items, setItems] = useState<QueueItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateItem = useCallback((id: string, patch: Partial<QueueItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const handleSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setItems((current) => [
      ...current,
      ...files.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        progress: 0,
        status: 'pending' as ItemStatus,
      })),
    ]);
    event.target.value = '';
  };

  const uploadOne = useCallback(
    async (item: QueueItem) => {
      updateItem(item.id, { status: 'uploading', progress: 0, error: undefined });

      try {
        const durationSeconds = await readVideoDuration(item.file);

        const { data, error } = await supabase.functions.invoke('album-request-upload', {
          body: {
            token,
            fileName: item.file.name,
            mimeType: item.file.type,
            fileSize: item.file.size,
            durationSeconds,
          },
        });

        if (error || !data?.signedUrl) {
          throw new Error(data?.error || "L'envoi n'a pas pu démarrer");
        }

        const preparation = data as UploadPreparation;

        await uploadOriginal(item.file, preparation, (percent) =>
          updateItem(item.id, { progress: percent })
        );

        let thumbPath: string | null = null;
        const thumbnail = await generateThumbnail(item.file);
        if (thumbnail) {
          thumbPath = await uploadThumbnail(thumbnail, preparation);
        }

        const { error: confirmError } = await supabase.functions.invoke('album-confirm-upload', {
          body: {
            token,
            path: preparation.path,
            thumbPath,
            uploaderName,
            mimeType: item.file.type,
            fileSize: item.file.size,
            durationSeconds,
            kind: preparation.kind,
          },
        });

        if (confirmError) throw confirmError;

        updateItem(item.id, { status: 'done', progress: 100 });
      } catch (uploadError) {
        console.error('❌ Upload failed:', uploadError);
        updateItem(item.id, {
          status: 'error',
          error: uploadError instanceof Error ? uploadError.message : 'Envoi impossible',
        });
      }
    },
    [token, uploaderName, updateItem]
  );

  const startUploads = useCallback(async () => {
    const queue = items.filter((item) => item.status === 'pending' || item.status === 'error');
    if (!queue.length) return;

    setIsRunning(true);
    let cursor = 0;

    const worker = async () => {
      while (cursor < queue.length) {
        const item = queue[cursor];
        cursor += 1;
        await uploadOne(item);
      }
    };

    await Promise.all(Array.from({ length: MAX_PARALLEL }, worker));
    setIsRunning(false);
    onUploaded();
  }, [items, uploadOne, onUploaded]);

  const pendingCount = items.filter((item) => item.status !== 'done').length;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="uploader-name" className="text-sm font-medium">
          Votre prénom
        </label>
        <Input
          id="uploader-name"
          value={uploaderName}
          onChange={(event) => setUploaderName(event.target.value)}
          placeholder="Camille"
          maxLength={60}
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleSelectFiles}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full h-14 border-dashed"
        onClick={() => inputRef.current?.click()}
      >
        <ImagePlus className="mr-2 h-5 w-5" />
        Choisir mes photos et vidéos
      </Button>

      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border bg-background/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm">{item.file.name}</span>
                {item.status === 'done' && <CheckCircle2 className="h-4 w-4 shrink-0 text-wedding-olive" />}
                {item.status === 'uploading' && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
                {item.status === 'error' && (
                  <Button size="sm" variant="ghost" onClick={() => uploadOne(item)}>
                    <RefreshCw className="mr-1 h-3.5 w-3.5" />
                    Réessayer
                  </Button>
                )}
              </div>
              {item.status !== 'done' && <Progress value={item.progress} className="mt-2 h-1.5" />}
              {item.error && (
                <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {item.error}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        className="w-full h-12 uppercase tracking-wide"
        disabled={isRunning || pendingCount === 0}
        onClick={startUploads}
      >
        {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Envoyer {pendingCount > 0 ? `(${pendingCount})` : ''}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Vos fichiers sont envoyés en qualité originale. Gardez la page ouverte pendant l'envoi.
      </p>
    </div>
  );
};

export default GuestUploader;

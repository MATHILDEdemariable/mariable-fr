import React, { useCallback } from 'react';
import { Upload, X, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MoodboardImage } from '@/hooks/useMoodboard';

interface MoodboardUploaderProps {
  images: MoodboardImage[];
  onAddImages: (files: FileList | File[]) => void;
  onRemoveImage: (id: string) => void;
  disabled?: boolean;
}

const MoodboardUploader: React.FC<MoodboardUploaderProps> = ({
  images,
  onAddImages,
  onRemoveImage,
  disabled = false,
}) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const imageFiles = Array.from(files).filter((file) =>
          file.type.startsWith('image/')
        );
        onAddImages(imageFiles);
      }
    },
    [onAddImages, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onAddImages(e.target.files);
      }
      // Reset input to allow selecting the same file again
      e.target.value = '';
    },
    [onAddImages]
  );

  const canAddMore = images.length < 10;

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "border-2 border-dashed rounded-none p-8 text-center transition-colors",
            disabled
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-wedding-olive/50 hover:bg-wedding-olive/5 cursor-pointer"
          )}
        >
          <input
            type="file"
            id="moodboard-upload"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          <label
            htmlFor="moodboard-upload"
            className={cn("flex flex-col items-center gap-3", !disabled && "cursor-pointer")}
          >
            <div className="w-16 h-16 rounded-full bg-wedding-olive/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-wedding-olive" />
            </div>
            <div>
              <p className="font-medium text-gray-700">
                Glissez-déposez vos photos ici
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ou cliquez pour sélectionner ({images.length}/10 photos)
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Minimum 5 photos • Maximum 10 photos
            </p>
          </label>
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square group overflow-hidden rounded-none border border-gray-200"
            >
              <img
                src={image.preview}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  onClick={() => onRemoveImage(image.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs py-1 text-center">
                {index + 1}
              </div>
            </div>
          ))}

          {/* Add more button */}
          {canAddMore && !disabled && (
            <label
              htmlFor="moodboard-upload"
              className="aspect-square border-2 border-dashed border-gray-300 hover:border-wedding-olive/50 rounded-none flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-wedding-olive/5"
            >
              <ImagePlus className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Ajouter</span>
            </label>
          )}
        </div>
      )}

      {/* Status indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className={cn(
          images.length >= 5 ? "text-green-600" : "text-gray-500"
        )}>
          {images.length >= 5 
            ? `✓ ${images.length} photo${images.length > 1 ? 's' : ''} sélectionnée${images.length > 1 ? 's' : ''}`
            : `${5 - images.length} photo${5 - images.length > 1 ? 's' : ''} minimum requise${5 - images.length > 1 ? 's' : ''}`
          }
        </span>
        {images.length >= 10 && (
          <span className="text-amber-600">Maximum atteint</span>
        )}
      </div>
    </div>
  );
};

export default MoodboardUploader;

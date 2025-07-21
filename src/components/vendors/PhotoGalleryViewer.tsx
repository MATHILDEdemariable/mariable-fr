
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Photo {
  id: string;
  url: string;
  filename?: string;
}

interface PhotoGalleryViewerProps {
  photos: Photo[];
  vendorName: string;
}

const PhotoGalleryViewer: React.FC<PhotoGalleryViewerProps> = ({ 
  photos, 
  vendorName 
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Navigation au clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null || !isFullscreen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          e.preventDefault();
          closeFullscreen();
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedPhotoIndex, isFullscreen]);

  const openFullscreen = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setSelectedPhotoIndex(null);
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(
      selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1
    );
  };

  const goToNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(
      selectedPhotoIndex === photos.length - 1 ? 0 : selectedPhotoIndex + 1
    );
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-md">
        <p className="text-gray-500">Aucune photo disponible</p>
      </div>
    );
  }

  return (
    <>
      {/* Galerie de miniatures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg"
            onClick={() => openFullscreen(index)}
          >
            <img
              src={photo.url}
              alt={`${vendorName} - photo ${index + 1}`}
              className="w-full h-64 object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Visionneur plein écran */}
      <Dialog open={isFullscreen} onOpenChange={closeFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black">
          {selectedPhotoIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Image */}
              <img
                src={photos[selectedPhotoIndex].url}
                alt={`${vendorName} - photo ${selectedPhotoIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Bouton fermer */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={closeFullscreen}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation précédent/suivant */}
              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 text-white hover:bg-white/20"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 text-white hover:bg-white/20"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Indicateur de position */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedPhotoIndex + 1} / {photos.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGalleryViewer;

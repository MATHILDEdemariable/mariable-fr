import React from 'react';
import { MoodboardImage, MoodboardColor } from '@/hooks/useMoodboard';
import ColorPalette from './ColorPalette';

interface MoodboardCanvasProps {
  coupleName: string;
  weddingDate: string;
  images: MoodboardImage[];
  colors: MoodboardColor[];
  ambiance: string;
}

const MoodboardCanvas: React.FC<MoodboardCanvasProps> = ({
  coupleName,
  weddingDate,
  images,
  colors,
  ambiance,
}) => {
  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Get images with fallback
  const getImage = (index: number) => images[index]?.preview || '';

  return (
    <div 
      id="moodboard-canvas"
      className="bg-white border border-gray-200 shadow-lg mx-auto"
      style={{ 
        width: '100%', 
        maxWidth: '800px',
        aspectRatio: '210 / 297', // A4 portrait
      }}
    >
      <div className="h-full flex flex-col p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
            Moodboard
          </p>
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-gray-800">
            {coupleName || 'Notre Mariage'}
          </h1>
          {weddingDate && (
            <p className="text-sm text-gray-500 mt-2">
              {formatDate(weddingDate)}
            </p>
          )}
        </div>

        {/* Editorial Photo Grid */}
        <div className="flex-1 grid gap-2 md:gap-3" style={{
          gridTemplateRows: 'repeat(3, 1fr)',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}>
          {/* Row 1: 1 medium + 1 large spanning 2 cols */}
          {getImage(0) && (
            <div className="row-span-1 col-span-1 overflow-hidden">
              <img 
                src={getImage(0)} 
                alt="Inspiration 1"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {getImage(1) && (
            <div className="row-span-1 col-span-2 overflow-hidden">
              <img 
                src={getImage(1)} 
                alt="Inspiration 2"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Row 2: 1 large spanning 2 cols + 1 medium */}
          {getImage(2) && (
            <div className="row-span-1 col-span-2 overflow-hidden">
              <img 
                src={getImage(2)} 
                alt="Inspiration 3"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {getImage(3) && (
            <div className="row-span-1 col-span-1 overflow-hidden">
              <img 
                src={getImage(3)} 
                alt="Inspiration 4"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Row 3: 3 small */}
          {[4, 5, 6].map((idx) => (
            getImage(idx) && (
              <div key={idx} className="row-span-1 col-span-1 overflow-hidden">
                <img 
                  src={getImage(idx)} 
                  alt={`Inspiration ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )
          ))}

          {/* Additional images if more than 7 */}
          {images.length > 7 && (
            <>
              {[7, 8, 9].map((idx) => (
                getImage(idx) && (
                  <div key={idx} className="row-span-1 col-span-1 overflow-hidden">
                    <img 
                      src={getImage(idx)} 
                      alt={`Inspiration ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              ))}
            </>
          )}
        </div>

        {/* Color Palette */}
        <div className="mt-6 md:mt-8 pt-4 border-t border-gray-100">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 text-center mb-4">
            Palette de couleurs
          </p>
          <ColorPalette colors={colors} variant="compact" />
          {ambiance && (
            <p className="text-xs text-gray-500 italic text-center mt-3">
              "{ambiance}"
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 tracking-wider">
            mariable.fr
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodboardCanvas;

import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoomVideoEmbedProps {
  videoId: string;
  title?: string;
  description?: string;
  aspectRatio?: '16:9' | '4:3';
  className?: string;
  compact?: boolean;
}

export const LoomVideoEmbed: React.FC<LoomVideoEmbedProps> = ({
  videoId,
  title,
  description,
  aspectRatio = '16:9',
  className,
  compact = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Calculer le padding-bottom pour l'aspect ratio
  const paddingBottom = aspectRatio === '16:9' ? '56.25%' : '75%';

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Vérifier si c'est un placeholder
  const isPlaceholder = videoId === 'PLACEHOLDER_LOOM_ID';

  if (isPlaceholder) {
    return (
      <div className={cn("bg-muted rounded-lg p-6", className)}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Vidéo tutorielle à venir</p>
            <p className="text-sm">Cette vidéo sera bientôt disponible</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {title && (
        <h3 className="text-lg font-medium text-wedding-olive">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      <div className="relative w-full" style={{ paddingBottom }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center p-4">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Impossible de charger la vidéo
              </p>
            </div>
          </div>
        )}
        
        <iframe
          src={`https://www.loom.com/embed/${videoId}`}
          frameBorder="0"
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
          style={{ 
            width: '100%', 
            height: compact ? '250px' : '410px' 
          }}
          className={cn(
            "absolute top-0 left-0 rounded-lg",
            hasError && "hidden"
          )}
          title={title || 'Vidéo tutorielle'}
        />
      </div>
    </div>
  );
};

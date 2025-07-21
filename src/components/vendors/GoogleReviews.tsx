
import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GoogleReviewsProps {
  rating?: number | null;
  reviewsCount?: number | null;
  businessUrl?: string | null;
}

const GoogleReviews: React.FC<GoogleReviewsProps> = ({ 
  rating, 
  reviewsCount, 
  businessUrl 
}) => {
  // Ne pas afficher la section si aucune donnée n'est disponible
  if (!rating && !reviewsCount && !businessUrl) {
    return null;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${(rating % 1) * 100}%` }}
          >
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Avis Google</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            {rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                </div>
                <span className="font-medium text-lg">{rating.toFixed(1)}</span>
              </div>
            )}
            
            {reviewsCount && (
              <p className="text-sm text-muted-foreground">
                Basé sur {reviewsCount} avis Google
              </p>
            )}
          </div>
          
          {businessUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(businessUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Voir sur Google
            </Button>
          )}
        </div>
        
        {!rating && !reviewsCount && businessUrl && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Consultez les avis de ce prestataire
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(businessUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Voir sur Google
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleReviews;

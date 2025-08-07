import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JeuneMarie } from '@/types/jeunes-maries';
import { MapPin, Calendar, Users, Star, ExternalLink, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JeuneMariesListItemProps {
  jeuneMarie: JeuneMarie;
}

export const JeuneMariesListItem: React.FC<JeuneMariesListItemProps> = ({ jeuneMarie }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const renderStars = (note?: number) => {
    if (!note) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">{note}/5</span>
      </div>
    );
  };

  

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:border-wedding-olive/30">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Header section with couple info */}
        <div className="flex items-center gap-3 flex-1">
          <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-wedding-olive shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-base sm:text-lg font-semibold text-wedding-olive truncate">
              {jeuneMarie.nom_complet}
            </h3>
            
            {/* Mobile: Stack info vertically */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">{jeuneMarie.lieu_mariage} • {jeuneMarie.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span>{formatDate(jeuneMarie.date_mariage)}</span>
              </div>
              {jeuneMarie.nombre_invites && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span>{jeuneMarie.nombre_invites} invités</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating and badges section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {jeuneMarie.note_experience && (
            <div className="flex justify-start sm:justify-center">
              {renderStars(jeuneMarie.note_experience)}
            </div>
          )}
          
          <div className="flex gap-2">
            {jeuneMarie.budget_approximatif && (
              <Badge variant="outline" className="text-xs">
                {jeuneMarie.budget_approximatif}
              </Badge>
            )}
          </div>
        </div>

        {/* Action button - Full width on mobile */}
        <div className="w-full sm:w-auto sm:ml-2">
          <Button 
            asChild
            variant="outline"
            className="w-full sm:w-auto border-wedding-olive text-wedding-olive hover:bg-wedding-olive hover:text-white text-sm"
            size="sm"
          >
            <Link to={`/jeunes-maries/${jeuneMarie.slug}`}>
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Voir le détail
            </Link>
          </Button>
        </div>
      </div>

      {/* Experience preview - Always full width */}
      {jeuneMarie.experience_partagee && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {jeuneMarie.experience_partagee}
          </p>
        </div>
      )}
    </div>
  );
};
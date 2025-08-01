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

  const isFakeTestimonial = jeuneMarie.id?.startsWith('fake-');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-wedding-olive/30">
      <div className="flex items-center justify-between">
        {/* Left section - Main info */}
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-wedding-olive" />
            <div>
              <h3 className="font-serif text-lg font-semibold text-wedding-olive">
                {jeuneMarie.nom_complet}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{jeuneMarie.lieu_mariage}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(jeuneMarie.date_mariage)}</span>
                </div>
                {jeuneMarie.nombre_invites && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{jeuneMarie.nombre_invites} invités</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center section - Rating and badges */}
        <div className="flex items-center gap-4">
          {jeuneMarie.note_experience && renderStars(jeuneMarie.note_experience)}
          
          <div className="flex gap-2">
            {jeuneMarie.budget_approximatif && (
              <Badge variant="outline" className="text-xs">
                {jeuneMarie.budget_approximatif}
              </Badge>
            )}
            {isFakeTestimonial && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                Exemple
              </Badge>
            )}
          </div>
        </div>

        {/* Right section - Action button */}
        <div className="ml-6">
          <Button 
            asChild
            variant="outline"
            className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive hover:text-white"
          >
            <Link to={`/jeunes-maries/${jeuneMarie.slug}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir le détail
            </Link>
          </Button>
        </div>
      </div>

      {/* Experience preview */}
      {jeuneMarie.experience_partagee && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">
            {jeuneMarie.experience_partagee}
          </p>
        </div>
      )}
    </div>
  );
};
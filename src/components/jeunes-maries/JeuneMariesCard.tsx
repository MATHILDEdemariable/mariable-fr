import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JeuneMarie } from '@/types/jeunes-maries';
import { MapPin, Calendar, Users, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JeuneMariesCardProps {
  jeuneMarie: JeuneMarie;
}

export const JeuneMariesCard: React.FC<JeuneMariesCardProps> = ({ jeuneMarie }) => {
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
      </div>
    );
  };

  return (
    <Card className="h-full overflow-hidden border-wedding-olive/30 hover:shadow-lg transition-all duration-300 group">
      {jeuneMarie.photo_principale_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={jeuneMarie.photo_principale_url}
            alt={`Mariage de ${jeuneMarie.nom_complet}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-semibold text-wedding-olive line-clamp-1">
            {jeuneMarie.nom_complet}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{jeuneMarie.lieu_mariage}</span>
          </div>
          
          {jeuneMarie.note_experience && (
            <div className="flex items-center gap-2">
              {renderStars(jeuneMarie.note_experience)}
              <span className="text-sm text-muted-foreground">
                {jeuneMarie.note_experience}/5
              </span>
            </div>
          )}
        </div>

        {jeuneMarie.experience_partagee && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {jeuneMarie.experience_partagee}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {jeuneMarie.budget_approximatif && (
            <Badge variant="outline" className="text-xs">
              {jeuneMarie.budget_approximatif}
            </Badge>
          )}
          {jeuneMarie.prestataires_recommandes.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {jeuneMarie.prestataires_recommandes.length} recommandation{jeuneMarie.prestataires_recommandes.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          asChild
          className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white"
        >
          <Link to={`/jeunes-maries/${jeuneMarie.slug}`}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Voir l'expérience
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
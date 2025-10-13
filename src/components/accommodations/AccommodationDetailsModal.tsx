import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Accommodation } from '@/hooks/useAccommodations';
import { Home, Bed, Users, Calendar, MapPin, Phone, MessageSquare } from 'lucide-react';

const statusMap = {
  non_reserve: { label: 'Non réservé', variant: 'secondary' as const },
  reserve: { label: 'Réservé', variant: 'default' as const },
  paye: { label: 'Payé', variant: 'default' as const },
};

const typeMap: Record<string, string> = {
  hotel: 'Hôtel',
  chambre_hote: "Chambre d'hôte",
  airbnb: 'Airbnb',
  famille: 'Famille',
  autre: 'Autre',
};

interface AccommodationDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accommodation: Accommodation | null;
}

export const AccommodationDetailsModal = ({
  open,
  onOpenChange,
  accommodation,
}: AccommodationDetailsModalProps) => {
  if (!accommodation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-wedding-olive">
            {accommodation.nom_logement}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="w-4 h-4" />
                <span>Type de logement</span>
              </div>
              <p className="font-medium">{typeMap[accommodation.type_logement]}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge
                  variant={statusMap[accommodation.statut as keyof typeof statusMap].variant}
                  className={
                    accommodation.statut === 'paye'
                      ? 'bg-green-600'
                      : accommodation.statut === 'reserve'
                      ? 'bg-blue-600'
                      : ''
                  }
                >
                  {statusMap[accommodation.statut as keyof typeof statusMap].label}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bed className="w-4 h-4" />
                <span>Nombre de chambres</span>
              </div>
              <p className="font-medium">{accommodation.nombre_chambres}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Capacité</span>
              </div>
              <p className="font-medium">
                {accommodation.guests?.length || 0} / {accommodation.capacite_totale} personnes
              </p>
            </div>
          </div>

          {/* Prix */}
          {accommodation.prix_par_nuit && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Prix par nuit</div>
              <p className="text-2xl font-bold text-wedding-olive">
                {accommodation.prix_par_nuit}€
              </p>
            </div>
          )}

          {/* Dates */}
          {(accommodation.date_arrivee || accommodation.date_depart) && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Dates de séjour</span>
              </div>
              <p className="font-medium">
                {accommodation.date_arrivee && 
                  new Date(accommodation.date_arrivee).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                }
                {accommodation.date_arrivee && accommodation.date_depart && ' - '}
                {accommodation.date_depart && 
                  new Date(accommodation.date_depart).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                }
              </p>
            </div>
          )}

          {/* Invités assignés */}
          {accommodation.guests && accommodation.guests.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Invités assignés</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {accommodation.guests.map((guest, idx) => (
                  <Badge key={idx} variant="outline" className="text-sm">
                    {guest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Adresse */}
          {accommodation.adresse && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Adresse</span>
              </div>
              <p className="font-medium">{accommodation.adresse}</p>
            </div>
          )}

          {/* Contact */}
          {accommodation.contact && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>Contact</span>
              </div>
              <p className="font-medium">{accommodation.contact}</p>
            </div>
          )}

          {/* Commentaires */}
          {accommodation.commentaires && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span>Commentaires</span>
              </div>
              <p className="text-sm bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                {accommodation.commentaires}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

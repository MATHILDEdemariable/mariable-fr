import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, Mail, Phone, MapPin, Calendar, Users, Star, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { JeuneMarie } from '@/types/jeunes-maries';

interface JeuneMariesFormViewerProps {
  isOpen: boolean;
  onClose: () => void;
  jeuneMarie: JeuneMarie | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const JeuneMariesFormViewer: React.FC<JeuneMariesFormViewerProps> = ({
  isOpen,
  onClose,
  jeuneMarie,
  onApprove,
  onReject
}) => {
  if (!jeuneMarie) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approuve':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approuvé
          </Badge>
        );
      case 'rejete':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeté
          </Badge>
        );
      default:
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Heart className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-wedding-olive" />
            Témoignage de {jeuneMarie.nom_complet}
          </DialogTitle>
          <DialogDescription>
            Détails du formulaire soumis le {formatDate(jeuneMarie.date_soumission)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statut et actions */}
          <div className="flex items-center justify-between">
            {getStatusBadge(jeuneMarie.status_moderation)}
            
            {jeuneMarie.status_moderation === 'en_attente' && onApprove && onReject && (
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(jeuneMarie.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-800 border border-green-200 rounded hover:bg-green-200"
                >
                  <CheckCircle className="h-3 w-3" />
                  Approuver
                </button>
                <button
                  onClick={() => onReject(jeuneMarie.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-800 border border-red-200 rounded hover:bg-red-200"
                >
                  <XCircle className="h-3 w-3" />
                  Rejeter
                </button>
              </div>
            )}
          </div>

          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-wedding-olive">Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Couple</p>
                    <p className="font-medium">{jeuneMarie.nom_complet}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{jeuneMarie.email}</p>
                  </div>
                </div>
              </div>

              {jeuneMarie.telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium">{jeuneMarie.telephone}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date du mariage</p>
                    <p className="font-medium">{formatDate(jeuneMarie.date_mariage)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Lieu de réception</p>
                    <p className="font-medium">{jeuneMarie.lieu_mariage}</p>
                  </div>
                </div>
              </div>

              {jeuneMarie.region && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Région</p>
                    <p className="font-medium">{jeuneMarie.region}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jeuneMarie.nombre_invites && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Nombre d'invités</p>
                      <p className="font-medium">{jeuneMarie.nombre_invites}</p>
                    </div>
                  </div>
                )}
                {jeuneMarie.budget_approximatif && (
                  <div>
                    <p className="text-sm text-gray-500">Budget approximatif</p>
                    <p className="font-medium">{jeuneMarie.budget_approximatif}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expérience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-wedding-olive">Expérience partagée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {jeuneMarie.note_experience && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">Note globale</p>
                    <p className="font-medium">{jeuneMarie.note_experience}/5 étoiles</p>
                  </div>
                </div>
              )}

              {jeuneMarie.experience_partagee && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Expérience partagée</p>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-sm whitespace-pre-wrap">{jeuneMarie.experience_partagee}</p>
                  </div>
                </div>
              )}

              {jeuneMarie.conseils_couples && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Conseils pour les futurs mariés</p>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-sm whitespace-pre-wrap">{jeuneMarie.conseils_couples}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prestataires recommandés */}
          {jeuneMarie.prestataires_recommandes && Array.isArray(jeuneMarie.prestataires_recommandes) && jeuneMarie.prestataires_recommandes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-wedding-olive">Prestataires recommandés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jeuneMarie.prestataires_recommandes.map((prestataire: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{prestataire.nom}</p>
                          <p className="text-sm text-gray-600">{prestataire.categorie}</p>
                          {prestataire.note && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs">{prestataire.note}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {prestataire.commentaire && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Commentaire:</p>
                          <p className="text-sm">{prestataire.commentaire}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Consentement et photo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-wedding-olive">Informations supplémentaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Contact autorisé</p>
                  <p className="font-medium">
                    {jeuneMarie.accept_email_contact ? (
                      <span className="text-green-600">✓ Oui, accepte d'être contacté</span>
                    ) : (
                      <span className="text-red-600">✗ Ne souhaite pas être contacté</span>
                    )}
                  </p>
                </div>
              </div>

              {jeuneMarie.photo_principale_url && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Photo du mariage</p>
                  <div className="w-32 h-32 bg-gray-100 rounded border overflow-hidden">
                    <img 
                      src={jeuneMarie.photo_principale_url} 
                      alt="Photo du mariage"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {jeuneMarie.admin_notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Notes administrateur</p>
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="text-sm">{jeuneMarie.admin_notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  X, Calendar, MapPin, Users, Heart, Phone, Mail, 
  FileText, Download, ExternalLink, Edit, Save, User
} from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

interface JourMReservation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  partner_name?: string;
  wedding_date: string;
  wedding_location: string;
  guest_count: number;
  budget?: string;
  current_organization: string;
  deroulement_mariage?: string;
  delegation_tasks?: string;
  specific_needs?: string;
  hear_about_us?: string;
  documents_links?: string;
  uploaded_files?: Json;
  prestataires_reserves?: Json;
  contact_jour_j?: Json;
  services_souhaites?: Json;
  status: string;
  admin_notes?: string;
  processed_at?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  reservation: JourMReservation;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string, notes?: string) => void;
}

const JourMReservationDetail: React.FC<Props> = ({ reservation, onClose, onStatusUpdate }) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(reservation.admin_notes || '');
  const [selectedStatus, setSelectedStatus] = useState(reservation.status);

  const handleSaveNotes = () => {
    onStatusUpdate(reservation.id, selectedStatus, notes);
    setEditingNotes(false);
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    onStatusUpdate(reservation.id, newStatus, notes);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'nouveau': return 'destructive';
      case 'en_cours': return 'secondary';
      case 'traite': return 'default';
      case 'archive': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nouveau': return 'Nouveau';
      case 'en_cours': return 'En cours';
      case 'traite': return 'Traité';
      case 'archive': return 'Archivé';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  // Helper functions to safely handle Json types
  const getContactJourJ = () => {
    if (!reservation.contact_jour_j) return [];
    if (Array.isArray(reservation.contact_jour_j)) return reservation.contact_jour_j;
    return [];
  };

  const getServicesSouhaites = () => {
    if (!reservation.services_souhaites) return [];
    if (Array.isArray(reservation.services_souhaites)) return reservation.services_souhaites;
    return [];
  };

  const getUploadedFiles = () => {
    if (!reservation.uploaded_files) return [];
    if (Array.isArray(reservation.uploaded_files)) return reservation.uploaded_files;
    return [];
  };

  const getPrestatairesReserves = () => {
    if (!reservation.prestataires_reserves) return {};
    if (typeof reservation.prestataires_reserves === 'object') return reservation.prestataires_reserves;
    return {};
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Demande de {reservation.first_name} {reservation.last_name}
            </DialogTitle>
            <div className="flex items-center gap-3">
              <Badge variant={getStatusBadgeVariant(reservation.status)}>
                {getStatusLabel(reservation.status)}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-wedding-olive" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Prénom</label>
                    <p className="text-sm">{reservation.first_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom</label>
                    <p className="text-sm">{reservation.last_name}</p>
                  </div>
                </div>
                {reservation.partner_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Partenaire</label>
                    <p className="text-sm">{reservation.partner_name}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${reservation.email}`} className="text-sm text-blue-600 hover:underline">
                        {reservation.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Téléphone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${reservation.phone}`} className="text-sm text-blue-600 hover:underline">
                        {reservation.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wedding Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-wedding-olive" />
                  Informations mariage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date du mariage</label>
                    <p className="text-sm font-medium">{formatDate(reservation.wedding_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre d'invités</label>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium">{reservation.guest_count}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Lieu du mariage</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{reservation.wedding_location}</p>
                  </div>
                </div>
                {reservation.budget && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Budget</label>
                    <p className="text-sm">{reservation.budget}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organization Details */}
            <Card>
              <CardHeader>
                <CardTitle>Organisation actuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{reservation.current_organization}</p>
              </CardContent>
            </Card>

            {/* Wedding Schedule */}
            {reservation.deroulement_mariage && (
              <Card>
                <CardHeader>
                  <CardTitle>Déroulé du mariage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{reservation.deroulement_mariage}</p>
                </CardContent>
              </Card>
            )}

            {/* Service Providers */}
            {Object.keys(getPrestatairesReserves()).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Prestataires réservés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(getPrestatairesReserves()).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm font-medium capitalize">
                            {key.replace('_', ' ')}:
                          </span>
                          <span className="text-sm">{value as string}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Day-of Contacts */}
            {getContactJourJ().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-wedding-olive" />
                    Contacts Jour J
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getContactJourJ().map((contact: any, index) => (
                      <div key={index} className="border-l-4 border-wedding-olive pl-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-sm font-medium">Nom: </span>
                            <span className="text-sm">{contact.nom}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Téléphone: </span>
                            <span className="text-sm">{contact.telephone}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Rôle: </span>
                          <span className="text-sm">{contact.role}</span>
                        </div>
                        {contact.commentaire && (
                          <div>
                            <span className="text-sm font-medium">Commentaire: </span>
                            <span className="text-sm">{contact.commentaire}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            {(reservation.delegation_tasks || reservation.specific_needs || reservation.hear_about_us) && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations complémentaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reservation.delegation_tasks && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Délégation des tâches</h4>
                      <p className="text-sm whitespace-pre-wrap">{reservation.delegation_tasks}</p>
                    </div>
                  )}
                  {reservation.specific_needs && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Besoins spécifiques</h4>
                      <p className="text-sm whitespace-pre-wrap">{reservation.specific_needs}</p>
                    </div>
                  )}
                  {reservation.hear_about_us && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Comment nous ont-ils connus</h4>
                      <p className="text-sm">{reservation.hear_about_us}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Admin Actions & Documents */}
          <div className="space-y-6">
            {/* Admin Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions administratives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Statut</label>
                  <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nouveau">Nouveau</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="traite">Traité</SelectItem>
                      <SelectItem value="archive">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">Notes internes</label>
                    {!editingNotes ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingNotes(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleSaveNotes}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {editingNotes ? (
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ajouter des notes internes..."
                      rows={4}
                    />
                  ) : (
                    <div className="min-h-[80px] p-3 border rounded-md bg-gray-50">
                      <p className="text-sm whitespace-pre-wrap">
                        {notes || 'Aucune note'}
                      </p>
                    </div>
                  )}
                </div>

                {reservation.processed_at && (
                  <div className="text-xs text-gray-500">
                    <p>Traité le: {formatDateTime(reservation.processed_at)}</p>
                    {reservation.processed_by && (
                      <p>Par: {reservation.processed_by}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Requested */}
            {getServicesSouhaites().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services souhaités</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getServicesSouhaites().map((service: any, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-wedding-olive rounded-full"></div>
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-wedding-olive" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reservation.documents_links && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Liens documents</h4>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{reservation.documents_links}</p>
                    </div>
                  </div>
                )}

                {getUploadedFiles().length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Fichiers uploadés ({getUploadedFiles().length})
                    </h4>
                    <div className="space-y-2">
                      {getUploadedFiles().map((file: any, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              {file.size && (
                                <p className="text-xs text-gray-500">
                                  {Math.round(file.size / 1024)} KB
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {getUploadedFiles().length === 0 && !reservation.documents_links && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucun document fourni
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Informations système</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-500 space-y-1">
                <p>Créé le: {formatDateTime(reservation.created_at)}</p>
                <p>Modifié le: {formatDateTime(reservation.updated_at)}</p>
                <p>ID: {reservation.id}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JourMReservationDetail;

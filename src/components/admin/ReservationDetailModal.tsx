
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Calendar, MapPin, Users, Phone, Mail, Heart, DollarSign, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Reservation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  partner_name: string;
  wedding_date: string;
  wedding_location: string;
  guest_count: number;
  budget: string;
  status: string;
  created_at: string;
  services_souhaites: any[];
  specific_needs: string;
  uploaded_files: any[];
  admin_notes: string;
  current_organization: string;
  deroulement_mariage: string;
  delegation_tasks: string;
  hear_about_us: string;
  contact_jour_j: any;
  prestataires_reserves: any;
}

interface ReservationDetailModalProps {
  reservation: Reservation;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [adminNotes, setAdminNotes] = useState(reservation.admin_notes || '');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const saveAdminNotes = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('jour_m_reservations')
        .update({ admin_notes: adminNotes })
        .eq('id', reservation.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Notes administratives sauvegardées"
      });
      onUpdate();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const downloadFile = (file: any) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  const exportToPDF = () => {
    // Ici on pourrait intégrer une librairie comme jsPDF
    toast({
      title: "Export PDF",
      description: "Fonctionnalité en cours de développement"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails de la réservation</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Informations du couple
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{reservation.first_name} {reservation.last_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {reservation.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {reservation.phone}
                  </div>
                </div>
                {reservation.partner_name && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Partenaire: {reservation.partner_name}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Détails du mariage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Détails du mariage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(reservation.wedding_date), 'dd MMMM yyyy', { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{reservation.wedding_location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{reservation.guest_count} invités</span>
                </div>
              </div>
              {reservation.budget && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Budget: {reservation.budget}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services souhaités */}
          {reservation.services_souhaites && reservation.services_souhaites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Services souhaités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {reservation.services_souhaites.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations détaillées */}
          <Card>
            <CardHeader>
              <CardTitle>Informations détaillées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reservation.current_organization && (
                <div>
                  <h4 className="font-medium mb-2">Organisation actuelle</h4>
                  <p className="text-sm text-muted-foreground">{reservation.current_organization}</p>
                </div>
              )}
              
              {reservation.deroulement_mariage && (
                <div>
                  <h4 className="font-medium mb-2">Déroulement souhaité</h4>
                  <p className="text-sm text-muted-foreground">{reservation.deroulement_mariage}</p>
                </div>
              )}

              {reservation.delegation_tasks && (
                <div>
                  <h4 className="font-medium mb-2">Tâches à déléguer</h4>
                  <p className="text-sm text-muted-foreground">{reservation.delegation_tasks}</p>
                </div>
              )}

              {reservation.specific_needs && (
                <div>
                  <h4 className="font-medium mb-2">Besoins spécifiques</h4>
                  <p className="text-sm text-muted-foreground">{reservation.specific_needs}</p>
                </div>
              )}

              {reservation.hear_about_us && (
                <div>
                  <h4 className="font-medium mb-2">Comment nous ont-ils connus</h4>
                  <p className="text-sm text-muted-foreground">{reservation.hear_about_us}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents uploadés */}
          {reservation.uploaded_files && reservation.uploaded_files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents attachés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reservation.uploaded_files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file.name || `Document ${index + 1}`}</span>
                        {file.size && (
                          <span className="text-xs text-muted-foreground">
                            ({Math.round(file.size / 1024)} KB)
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes administratives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notes administratives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ajouter des notes internes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
              <Button onClick={saveAdminNotes} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder les notes'}
              </Button>
            </CardContent>
          </Card>

          {/* Informations système */}
          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div>ID: {reservation.id}</div>
                <div>Créé le: {format(new Date(reservation.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}</div>
                <div>Statut: <Badge>{reservation.status}</Badge></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDetailModal;

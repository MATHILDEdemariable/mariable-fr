import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Trash2, ExternalLink, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from 'qrcode';

interface RSVPEventCardProps {
  event: {
    id: string;
    event_name: string;
    event_date: string | null;
    event_location: string | null;
    unique_link_slug: string;
    welcome_message: string | null;
    created_at: string;
  };
  onDelete: (eventId: string) => void;
  onViewResponses: () => void;
}

interface RSVPStats {
  confirmed: number;
  confirmedAdults: number;
  confirmedChildren: number;
  declined: number;
  maybe: number;
  total: number;
}

const RSVPEventCard: React.FC<RSVPEventCardProps> = ({ event, onDelete, onViewResponses }) => {
  const [stats, setStats] = useState<RSVPStats>({ 
    confirmed: 0, 
    confirmedAdults: 0, 
    confirmedChildren: 0, 
    declined: 0, 
    maybe: 0, 
    total: 0 
  });
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const { toast } = useToast();

  const publicUrl = `${window.location.origin}/rsvp/${event.unique_link_slug}`;

  useEffect(() => {
    loadStats();
  }, [event.id]);

  useEffect(() => {
    if (showQRCode) {
      generateQRCode();
    }
  }, [showQRCode]);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_rsvp_responses')
        .select('attendance_status, number_of_guests, number_of_adults, number_of_children')
        .eq('event_id', event.id);

      if (error) throw error;

      const confirmedAdults = data?.filter(r => r.attendance_status === 'oui')
        .reduce((sum, r) => sum + (r.number_of_adults || r.number_of_guests || 1), 0) || 0;
      const confirmedChildren = data?.filter(r => r.attendance_status === 'oui')
        .reduce((sum, r) => sum + (r.number_of_children || 0), 0) || 0;
      const confirmedGuests = confirmedAdults + confirmedChildren;
      
      const declinedGuests = data?.filter(r => r.attendance_status === 'non')
        .reduce((sum, r) => sum + (r.number_of_guests || 1), 0) || 0;
      const maybeGuests = data?.filter(r => r.attendance_status === 'peut-être')
        .reduce((sum, r) => sum + (r.number_of_guests || 1), 0) || 0;

      setStats({
        confirmed: confirmedGuests,
        confirmedAdults: confirmedAdults,
        confirmedChildren: confirmedChildren,
        declined: declinedGuests,
        maybe: maybeGuests,
        total: confirmedGuests + declinedGuests + maybeGuests,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(publicUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Erreur lors de la génération du QR Code:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: 'Lien copié !',
      description: 'Le lien RSVP a été copié dans le presse-papier',
    });
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">{event.event_name}</CardTitle>
          {event.event_date && (
            <p className="text-sm text-muted-foreground">
              {new Date(event.event_date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          {event.event_location && (
            <p className="text-sm text-muted-foreground">{event.event_location}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <span className="truncate">/rsvp/{event.unique_link_slug}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-xs text-muted-foreground">Confirmés</div>
              {stats.confirmed > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  👤 {stats.confirmedAdults} • 👶 {stats.confirmedChildren}
                </div>
              )}
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
              <div className="text-xs text-muted-foreground">Absents</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.maybe}</div>
              <div className="text-xs text-muted-foreground">Peut-être</div>
            </div>
          </div>

          <div className="pt-2">
            <Badge variant="outline" className="w-full justify-center">
              {stats.total} personne{stats.total > 1 ? 's' : ''} au total
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewResponses}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir les détails
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQRCode(true)}
          >
            <QrCode className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer l'événement ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes les réponses associées seront également supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(event.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code - {event.event_name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {qrCodeDataUrl && (
              <img src={qrCodeDataUrl} alt="QR Code RSVP" className="w-64 h-64" />
            )}
            <p className="text-sm text-center text-muted-foreground">
              Scannez ce QR code pour accéder au formulaire RSVP
            </p>
            <Button onClick={copyToClipboard} variant="outline" className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copier le lien
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RSVPEventCard;
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Info } from 'lucide-react';
import RSVPEventCard from '@/components/dashboard/RSVPEventCard';
import { useNavigate } from 'react-router-dom';
import slugify from '@/utils/slugify';

interface RSVPEvent {
  id: string;
  event_name: string;
  event_date: string | null;
  event_location: string | null;
  unique_link_slug: string;
  welcome_message: string | null;
  require_phone: boolean;
  require_dietary_restrictions: boolean;
  max_guests_per_invite: number;
  created_at: string;
}

const RSVPManagement: React.FC = () => {
  const [events, setEvents] = useState<RSVPEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [eventName, setEventName] = useState('Notre Mariage');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('Nous serions ravis de vous compter parmi nous pour célébrer notre union !');
  const [requirePhone, setRequirePhone] = useState(false);
  const [requireDietary, setRequireDietary] = useState(true);
  const [maxGuests, setMaxGuests] = useState(2);
  const [customSlug, setCustomSlug] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wedding_rsvp_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les événements RSVP',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateUniqueSlug = async (baseName: string): Promise<string> => {
    let slug = customSlug || slugify(baseName);
    let counter = 1;

    while (true) {
      const { data } = await supabase
        .from('wedding_rsvp_events')
        .select('id')
        .eq('unique_link_slug', slug);

      if (!data || data.length === 0) {
        return slug;
      }

      slug = `${customSlug || slugify(baseName)}-${counter}`;
      counter++;
    }
  };

  const handleCreateEvent = async () => {
    if (!eventName.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez saisir un nom pour l\'événement',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const uniqueSlug = await generateUniqueSlug(eventName);

      const { data, error } = await supabase
        .from('wedding_rsvp_events')
        .insert({
          user_id: user.id,
          event_name: eventName,
          event_date: eventDate || null,
          event_location: eventLocation || null,
          unique_link_slug: uniqueSlug,
          welcome_message: welcomeMessage,
          require_phone: requirePhone,
          require_dietary_restrictions: requireDietary,
          max_guests_per_invite: maxGuests,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Événement créé !',
        description: `Le lien RSVP a été généré : /rsvp/${uniqueSlug}`,
      });

      setEvents([data, ...events]);
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'événement RSVP',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setEventName('Notre Mariage');
    setEventDate('');
    setEventLocation('');
    setWelcomeMessage('Nous serions ravis de vous compter parmi nous pour célébrer notre union !');
    setRequirePhone(false);
    setRequireDietary(true);
    setMaxGuests(2);
    setCustomSlug('');
  };

  const handleDelete = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('wedding_rsvp_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.filter(e => e.id !== eventId));
      toast({
        title: 'Événement supprimé',
        description: 'L\'événement RSVP a été supprimé avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'événement',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">RSVP Invités</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos confirmations de présence en ligne
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Info className="h-4 w-4 mr-2" />
                Tuto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Comment utiliser le RSVP ?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Créer l'événement</h4>
                    <p className="text-sm text-muted-foreground">
                      Créez un formulaire RSVP avec vos informations (date, lieu, message personnalisé)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Partager le lien ou QR code</h4>
                    <p className="text-sm text-muted-foreground">
                      Partagez le lien unique ou le QR code avec vos invités par email, WhatsApp, etc.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Gérer les réponses</h4>
                    <p className="text-sm text-muted-foreground">
                      Suivez en temps réel les confirmations de présence et exportez la liste des invités
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Créer un formulaire RSVP
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouvel événement RSVP</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="event_name">Nom de l'événement *</Label>
                <Input
                  id="event_name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Notre Mariage"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Date de l'événement</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_location">Lieu</Label>
                  <Input
                    id="event_location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Château de Versailles"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom_slug">Lien personnalisé (optionnel)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/rsvp/</span>
                  <Input
                    id="custom_slug"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(slugify(e.target.value))}
                    placeholder="marie-et-pierre-2025"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcome_message">Message de bienvenue</Label>
                <Textarea
                  id="welcome_message"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={4}
                  placeholder="Message personnalisé pour vos invités..."
                />
              </div>

              <div className="space-y-4">
                <Label>Options du formulaire</Label>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="require_phone" className="font-normal cursor-pointer">
                    Téléphone obligatoire
                  </Label>
                  <Switch
                    id="require_phone"
                    checked={requirePhone}
                    onCheckedChange={setRequirePhone}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="require_dietary" className="font-normal cursor-pointer">
                    Demander les restrictions alimentaires
                  </Label>
                  <Switch
                    id="require_dietary"
                    checked={requireDietary}
                    onCheckedChange={setRequireDietary}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_guests">Nombre maximum d'invités par formulaire</Label>
                  <Input
                    id="max_guests"
                    type="number"
                    min="1"
                    max="10"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Annuler
              </Button>
                <Button
                  onClick={handleCreateEvent}
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Créer l\'événement'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Aucun événement RSVP</h3>
            <p className="text-muted-foreground mb-6">
              Créez votre premier formulaire de confirmation de présence
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un formulaire RSVP
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <RSVPEventCard
              key={event.id}
              event={event}
              onDelete={handleDelete}
              onViewResponses={() => navigate(`/dashboard/rsvp/${event.id}/responses`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RSVPManagement;
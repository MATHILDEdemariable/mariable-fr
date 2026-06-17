import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Info, Trash2 } from 'lucide-react';
import RSVPEventCard from '@/components/dashboard/RSVPEventCard';
import { useNavigate } from 'react-router-dom';
import slugify from '@/utils/slugify';

interface SubEvent {
  id?: string;
  sub_event_name: string;
  sub_event_date: string;
  sub_event_time: string;
  sub_event_location: string;
}

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
  sub_events?: SubEvent[];
}

const RSVPManagement: React.FC = () => {
  const { t } = useTranslation('weddingDay');
  const [events, setEvents] = useState<RSVPEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();


  // Form state
  const [eventName, setEventName] = useState(t('rsvp.defaultEventName'));
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState(t('rsvp.defaultWelcomeMessage'));
  const [requirePhone, setRequirePhone] = useState(false);
  const [requireDietary, setRequireDietary] = useState(true);
  const [maxGuests, setMaxGuests] = useState(2);
  const [customSlug, setCustomSlug] = useState('');
  
  // Sub-events state
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);

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

      // Charger les sous-événements pour chaque événement
      if (data && data.length > 0) {
        const eventsWithSubEvents = await Promise.all(
          data.map(async (event) => {
            const { data: subEventsData } = await supabase
              .from('wedding_rsvp_sub_events')
              .select('*')
              .eq('parent_event_id', event.id);
            return { ...event, sub_events: subEventsData || [] };
          })
        );
        setEvents(eventsWithSubEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      toast({
        title: t('rsvp.errors.title'),
        description: t('rsvp.errors.loadEvents'),
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

  const addSubEvent = () => {
    setSubEvents([...subEvents, {
      sub_event_name: '',
      sub_event_date: '',
      sub_event_time: '',
      sub_event_location: ''
    }]);
  };

  const removeSubEvent = (index: number) => {
    setSubEvents(subEvents.filter((_, i) => i !== index));
  };

  const updateSubEvent = (index: number, field: keyof SubEvent, value: string) => {
    const updated = [...subEvents];
    updated[index] = { ...updated[index], [field]: value };
    setSubEvents(updated);
  };

  const handleCreateEvent = async () => {
    {
      if (!eventName.trim()) {
        toast({
          title: t('rsvp.errors.title'),
          description: t('rsvp.errors.nameRequired'),
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

        // Créer les sous-événements
        if (subEvents.length > 0 && data) {
          const validSubEvents = subEvents.filter(se => se.sub_event_name.trim());
          if (validSubEvents.length > 0) {
            const { error: subError } = await supabase
              .from('wedding_rsvp_sub_events')
              .insert(
                validSubEvents.map(se => ({
                  parent_event_id: data.id,
                  sub_event_name: se.sub_event_name,
                  sub_event_date: se.sub_event_date || null,
                  sub_event_time: se.sub_event_time || null,
                  sub_event_location: se.sub_event_location || null,
                }))
              );
            if (subError) console.error('Erreur création sous-événements:', subError);
          }
        }

        toast({
          title: t('rsvp.created'),
          description: t('rsvp.createdDesc', { slug: uniqueSlug }),
        });

        setEvents([{ ...data, sub_events: subEvents }, ...events]);
        setIsDialogOpen(false);
        resetForm();
      } catch (error) {
        console.error('Erreur lors de la création:', error);
        toast({
          title: t('rsvp.errors.title'),
          description: t('rsvp.errors.createEvent'),
          variant: 'destructive',
        });
      } finally {
      setCreating(false);
      }
    }
  };

  const resetForm = () => {
    setEventName(t('rsvp.defaultEventName'));
    setEventDate('');
    setEventLocation('');
    setWelcomeMessage(t('rsvp.defaultWelcomeMessage'));
    setRequirePhone(false);
    setRequireDietary(true);
    setMaxGuests(2);
    setCustomSlug('');
    setSubEvents([]);
  };

  const handleDelete = async (eventId: string) => {
    {
      try {
        const { error } = await supabase
          .from('wedding_rsvp_events')
          .delete()
          .eq('id', eventId);

        if (error) throw error;

        setEvents(events.filter(e => e.id !== eventId));
        toast({
          title: t('rsvp.deleted'),
          description: t('rsvp.deletedDesc'),
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: t('rsvp.errors.title'),
          description: t('rsvp.errors.deleteEvent'),
          variant: 'destructive',
        });
      }
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
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('rsvp.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('rsvp.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Info className="h-4 w-4 mr-2" />
                  {t('rsvp.tutoBtn')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('rsvp.tutoTitle')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <span className="font-bold text-primary">{n}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{t(`rsvp.tutoStep${n}Title`)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t(`rsvp.tutoStep${n}Desc`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('rsvp.createBtn')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('rsvp.createDialogTitle')}</DialogTitle>
                </DialogHeader>


                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_name">{t('rsvp.eventNameLabel')}</Label>
                    <Input
                      id="event_name"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder={t('rsvp.eventNamePlaceholder')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event_date">{t('rsvp.eventDateLabel')}</Label>
                      <Input
                        id="event_date"
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event_location">{t('rsvp.eventLocationLabel')}</Label>
                      <Input
                        id="event_location"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder={t('rsvp.eventLocationPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom_slug">{t('rsvp.customSlugLabel')}</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">/rsvp/</span>
                      <Input
                        id="custom_slug"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(slugify(e.target.value))}
                        placeholder={t('rsvp.customSlugPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="welcome_message">{t('rsvp.welcomeLabel')}</Label>
                    <Textarea
                      id="welcome_message"
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      rows={4}
                      placeholder={t('rsvp.welcomePlaceholder')}
                    />
                  </div>

                  <div className="border-t pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold">{t('rsvp.subEventsLabel')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('rsvp.subEventsHint')}
                        </p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={addSubEvent}>
                        <Plus className="h-4 w-4 mr-1" />
                        {t('rsvp.addSub')}
                      </Button>
                    </div>

                    {subEvents.map((subEvent, index) => (
                      <Card key={index} className="border-dashed">
                        <CardContent className="pt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">{t('rsvp.subEventNum', { num: index + 2 })}</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSubEvent(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label>{t('rsvp.subEventNameLabel')}</Label>
                            <Input
                              value={subEvent.sub_event_name}
                              onChange={(e) => updateSubEvent(index, 'sub_event_name', e.target.value)}
                              placeholder={t('rsvp.subEventNamePlaceholder')}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>{t('rsvp.dateLabel')}</Label>
                              <Input
                                type="date"
                                value={subEvent.sub_event_date}
                                onChange={(e) => updateSubEvent(index, 'sub_event_date', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t('rsvp.timeLabel')}</Label>
                              <Input
                                value={subEvent.sub_event_time}
                                onChange={(e) => updateSubEvent(index, 'sub_event_time', e.target.value)}
                                placeholder={t('rsvp.timePlaceholder')}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>{t('rsvp.subEventLocationLabel')}</Label>
                            <Input
                              value={subEvent.sub_event_location}
                              onChange={(e) => updateSubEvent(index, 'sub_event_location', e.target.value)}
                              placeholder={t('rsvp.subEventLocationPlaceholder')}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <Label>{t('rsvp.formOptions')}</Label>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="require_phone" className="font-normal cursor-pointer">
                        {t('rsvp.requirePhone')}
                      </Label>
                      <Switch
                        id="require_phone"
                        checked={requirePhone}
                        onCheckedChange={setRequirePhone}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="require_dietary" className="font-normal cursor-pointer">
                        {t('rsvp.requireDietary')}
                      </Label>
                      <Switch
                        id="require_dietary"
                        checked={requireDietary}
                        onCheckedChange={setRequireDietary}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_guests">{t('rsvp.maxGuestsLabel')}</Label>
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
                    {t('rsvp.cancel')}
                  </Button>
                  <Button
                    onClick={handleCreateEvent}
                    disabled={creating}
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('rsvp.creating')}
                      </>
                    ) : (
                      t('rsvp.createCta')
                    )}
                  </Button>
                </div>

              </DialogContent>
            </Dialog>
          </div>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">{t('rsvp.emptyTitle')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('rsvp.emptyDesc')}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('rsvp.createBtn')}
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
      
    </>
  );
};

export default RSVPManagement;

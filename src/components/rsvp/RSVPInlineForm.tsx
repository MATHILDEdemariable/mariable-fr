import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Heart, Calendar, MapPin, Plus, Minus } from 'lucide-react';
import { z } from 'zod';

interface SubEvent {
  id: string;
  sub_event_name: string;
  sub_event_date: string | null;
  sub_event_time: string | null;
  sub_event_location: string | null;
}

interface RSVPEvent {
  id: string;
  event_name: string;
  event_date: string | null;
  event_location: string | null;
  welcome_message: string | null;
  require_phone: boolean;
  require_dietary_restrictions: boolean;
  max_guests_per_invite: number;
}

interface SubEventResponse {
  sub_event_id: string;
  attending: boolean;
  number_of_adults: number;
  number_of_children: number;
}

interface RSVPInlineFormProps {
  eventSlug: string;
  onSuccess?: () => void;
  primaryColor?: string;
}

const RSVPInlineForm: React.FC<RSVPInlineFormProps> = ({ eventSlug, onSuccess, primaryColor = '#E8736E' }) => {
  const { toast } = useToast();

  const [event, setEvent] = useState<RSVPEvent | null>(null);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'oui' | 'non' | 'peut-être'>('oui');
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sub-events responses
  const [subEventResponses, setSubEventResponses] = useState<SubEventResponse[]>([]);

  useEffect(() => {
    loadEvent();
  }, [eventSlug]);

  const loadEvent = async () => {
    try {
      console.log('🔍 Chargement événement RSVP:', eventSlug);
      const { data, error } = await supabase
        .from('wedding_rsvp_events')
        .select('*')
        .eq('unique_link_slug', eventSlug)
        .single();

      if (error) throw error;
      console.log('✅ Événement trouvé:', data);
      setEvent(data);

      // Charger les sous-événements
      if (data) {
        const { data: subEventsData, error: subError } = await supabase
          .from('wedding_rsvp_sub_events')
          .select('*')
          .eq('parent_event_id', data.id)
          .order('sub_event_date', { ascending: true });

        console.log('📋 Sous-événements:', subEventsData, subError);
        
        if (subEventsData && subEventsData.length > 0) {
          setSubEvents(subEventsData);
          setSubEventResponses(
            subEventsData.map(se => ({
              sub_event_id: se.id,
              attending: true,
              number_of_adults: 1,
              number_of_children: 0
            }))
          );
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement événement:', error);
      toast({
        title: 'Événement introuvable',
        description: 'Le formulaire RSVP n\'est pas disponible',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubEventResponse = (subEventId: string, field: keyof SubEventResponse, value: boolean | number) => {
    setSubEventResponses(prev =>
      prev.map(ser =>
        ser.sub_event_id === subEventId ? { ...ser, [field]: value } : ser
      )
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const totalGuests = numberOfAdults + numberOfChildren;
    
    const rsvpSchema = z.object({
      guest_first_name: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères').max(50),
      guest_last_name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
      guest_email: z.string().email('Email invalide').optional().or(z.literal('')),
      number_of_adults: z.number().int().min(1, 'Au moins 1 adulte requis'),
      number_of_children: z.number().int().min(0),
      total_guests: z.number().int().min(1).max(event?.max_guests_per_invite || 10, `Maximum ${event?.max_guests_per_invite || 10} personnes`),
    });

    try {
      rsvpSchema.parse({
        guest_first_name: guestFirstName,
        guest_last_name: guestLastName,
        guest_email: guestEmail,
        number_of_adults: numberOfAdults,
        number_of_children: numberOfChildren,
        total_guests: totalGuests,
      });

      if (event?.require_phone && !guestPhone.trim()) {
        newErrors.guest_phone = 'Le téléphone est obligatoire';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs dans le formulaire',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const totalGuests = numberOfAdults + numberOfChildren;
      const fullGuestName = `${guestFirstName.trim()} ${guestLastName.trim()}`;
      
      const { data: responseData, error: responseError } = await supabase
        .from('wedding_rsvp_responses')
        .insert({
          event_id: event!.id,
          guest_name: fullGuestName,
          guest_email: guestEmail.trim() || null,
          guest_phone: guestPhone.trim() || null,
          attendance_status: attendanceStatus,
          number_of_guests: attendanceStatus === 'oui' ? totalGuests : 1,
          number_of_adults: attendanceStatus === 'oui' ? numberOfAdults : 1,
          number_of_children: attendanceStatus === 'oui' ? numberOfChildren : 0,
          dietary_restrictions: dietaryRestrictions.trim() || null,
          message: message.trim() || null,
        })
        .select()
        .single();

      if (responseError) throw responseError;

      // Insérer les réponses aux sous-événements
      if (subEvents.length > 0 && attendanceStatus === 'oui') {
        const subResponsesToInsert = subEventResponses
          .filter(ser => ser.attending)
          .map(ser => ({
            response_id: responseData.id,
            sub_event_id: ser.sub_event_id,
            attending: ser.attending,
            number_of_adults: ser.number_of_adults,
            number_of_children: ser.number_of_children
          }));

        if (subResponsesToInsert.length > 0) {
          await supabase
            .from('wedding_rsvp_sub_responses')
            .insert(subResponsesToInsert);
        }
      }

      setSubmitted(true);
      toast({
        title: 'Réponse enregistrée !',
        description: 'Merci d\'avoir confirmé votre présence',
      });
      
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer votre réponse. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: primaryColor }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Le formulaire RSVP n'est pas disponible.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="py-12 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <div>
          <h3 className="text-2xl font-serif mb-2">Merci !</h3>
          <p className="text-gray-500">Votre réponse a été enregistrée avec succès.</p>
        </div>
        {attendanceStatus === 'oui' && (
          <p className="text-sm text-gray-400">
            Nous avons hâte de vous voir ! <Heart className="inline h-4 w-4" style={{ color: primaryColor }} />
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center pb-4 border-b">
        <h3 className="text-2xl font-serif">{event.event_name}</h3>
        {event.event_date && (
          <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(event.event_date)}
          </p>
        )}
      </div>

      {/* Prénom & Nom */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="inline_first_name" className="text-sm">Prénom *</Label>
          <Input
            id="inline_first_name"
            value={guestFirstName}
            onChange={(e) => setGuestFirstName(e.target.value)}
            placeholder="Votre prénom"
            required
            className="rounded-md"
          />
          {errors.guest_first_name && <p className="text-xs text-red-500">{errors.guest_first_name}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="inline_last_name" className="text-sm">Nom *</Label>
          <Input
            id="inline_last_name"
            value={guestLastName}
            onChange={(e) => setGuestLastName(e.target.value)}
            placeholder="Votre nom"
            required
            className="rounded-md"
          />
          {errors.guest_last_name && <p className="text-xs text-red-500">{errors.guest_last_name}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="inline_email" className="text-sm">Email</Label>
        <Input
          id="inline_email"
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          placeholder="votre@email.com"
          className="rounded-md"
        />
      </div>

      {/* Téléphone */}
      {event.require_phone && (
        <div className="space-y-1">
          <Label htmlFor="inline_phone" className="text-sm">Téléphone *</Label>
          <Input
            id="inline_phone"
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="06 12 34 56 78"
            required
            className="rounded-md"
          />
          {errors.guest_phone && <p className="text-xs text-red-500">{errors.guest_phone}</p>}
        </div>
      )}

      {/* Statut présence */}
      <div className="space-y-2">
        <Label className="text-sm">Serez-vous présent(e) ? *</Label>
        <RadioGroup
          value={attendanceStatus}
          onValueChange={(value) => setAttendanceStatus(value as 'oui' | 'non' | 'peut-être')}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oui" id="inline_oui" />
            <Label htmlFor="inline_oui" className="font-normal cursor-pointer text-sm">Oui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non" id="inline_non" />
            <Label htmlFor="inline_non" className="font-normal cursor-pointer text-sm">Non</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="peut-être" id="inline_peut_etre" />
            <Label htmlFor="inline_peut_etre" className="font-normal cursor-pointer text-sm">Peut-être</Label>
          </div>
        </RadioGroup>
      </div>

      {attendanceStatus === 'oui' && (
        <>
          {/* Nombre de personnes */}
          <div className="grid grid-cols-2 gap-4 py-4 px-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label className="text-sm">Adultes</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setNumberOfAdults(Math.max(1, numberOfAdults - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-6 text-center">{numberOfAdults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setNumberOfAdults(Math.min(event.max_guests_per_invite, numberOfAdults + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Enfants</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setNumberOfChildren(Math.max(0, numberOfChildren - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-6 text-center">{numberOfChildren}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setNumberOfChildren(numberOfChildren + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sous-événements */}
          {subEvents.length > 0 && (
            <div className="space-y-3 py-4">
              <Label className="text-sm font-medium">Participation aux événements</Label>
              {subEvents.map((subEvent) => {
                const response = subEventResponses.find(r => r.sub_event_id === subEvent.id);
                return (
                  <div 
                    key={subEvent.id} 
                    className="p-4 border rounded-lg space-y-3"
                    style={{ borderColor: response?.attending ? primaryColor : '#e5e7eb' }}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`sub_${subEvent.id}`}
                        checked={response?.attending ?? false}
                        onCheckedChange={(checked) =>
                          updateSubEventResponse(subEvent.id, 'attending', !!checked)
                        }
                      />
                      <div className="flex-1">
                        <Label htmlFor={`sub_${subEvent.id}`} className="font-medium cursor-pointer">
                          {subEvent.sub_event_name}
                        </Label>
                        {subEvent.sub_event_date && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDate(subEvent.sub_event_date)}
                            {subEvent.sub_event_time && ` - ${subEvent.sub_event_time}`}
                          </p>
                        )}
                        {subEvent.sub_event_location && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {subEvent.sub_event_location}
                          </p>
                        )}
                      </div>
                    </div>

                    {response?.attending && (
                      <div className="grid grid-cols-2 gap-3 ml-6">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500">Adultes:</Label>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateSubEventResponse(subEvent.id, 'number_of_adults', Math.max(1, (response?.number_of_adults || 1) - 1))
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-4 text-center">{response?.number_of_adults}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateSubEventResponse(subEvent.id, 'number_of_adults', (response?.number_of_adults || 1) + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500">Enfants:</Label>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateSubEventResponse(subEvent.id, 'number_of_children', Math.max(0, (response?.number_of_children || 0) - 1))
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-4 text-center">{response?.number_of_children}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateSubEventResponse(subEvent.id, 'number_of_children', (response?.number_of_children || 0) + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Restrictions alimentaires */}
          {event.require_dietary_restrictions && (
            <div className="space-y-1">
              <Label htmlFor="inline_dietary" className="text-sm">Restrictions alimentaires</Label>
              <Textarea
                id="inline_dietary"
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                placeholder="Allergies, régimes particuliers..."
                rows={2}
                className="rounded-md"
              />
            </div>
          )}
        </>
      )}

      {/* Message */}
      <div className="space-y-1">
        <Label htmlFor="inline_message" className="text-sm">Message (optionnel)</Label>
        <Textarea
          id="inline_message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Un petit mot pour les mariés..."
          rows={2}
          className="rounded-md"
        />
      </div>

      <Button
        type="submit"
        className="w-full py-6 text-base font-medium"
        style={{ backgroundColor: primaryColor }}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Envoi en cours...
          </>
        ) : (
          'Confirmer ma réponse'
        )}
      </Button>
    </form>
  );
};

export default RSVPInlineForm;

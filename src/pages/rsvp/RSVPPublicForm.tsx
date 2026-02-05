import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Heart, Calendar, MapPin } from 'lucide-react';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';

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

const RSVPPublicForm: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
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
  const [guestAddress, setGuestAddress] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'oui' | 'non' | 'peut-être'>('oui');
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [adults, setAdults] = useState<Array<{ firstName: string; lastName: string }>>([
    { firstName: '', lastName: '' }
  ]);

  // Sub-events responses
  const [subEventResponses, setSubEventResponses] = useState<SubEventResponse[]>([]);

  useEffect(() => {
    loadEvent();
  }, [slug]);

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_rsvp_events')
        .select('*')
        .eq('unique_link_slug', slug)
        .single();

      if (error) throw error;
      setEvent(data);

      // Charger les sous-événements
      if (data) {
        const { data: subEventsData } = await supabase
          .from('wedding_rsvp_sub_events')
          .select('*')
          .eq('parent_event_id', data.id)
          .order('sub_event_date', { ascending: true });

        if (subEventsData && subEventsData.length > 0) {
          setSubEvents(subEventsData);
          // Initialiser les réponses pour chaque sous-événement
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
      console.error('Erreur lors du chargement de l\'événement:', error);
      toast({
        title: 'Événement introuvable',
        description: 'Le lien RSVP que vous avez utilisé n\'est pas valide',
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
      guest_phone: z.string().optional(),
      guest_address: z.string().max(300).optional(),
      number_of_adults: z.number().int().min(1, 'Au moins 1 adulte requis'),
      number_of_children: z.number().int().min(0),
      total_guests: z.number().int().min(1).max(event?.max_guests_per_invite || 10, `Maximum ${event?.max_guests_per_invite || 10} personnes`),
      dietary_restrictions: z.string().max(500).optional(),
      message: z.string().max(1000).optional(),
    });

    try {
      rsvpSchema.parse({
        guest_first_name: guestFirstName,
        guest_last_name: guestLastName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        guest_address: guestAddress,
        number_of_adults: numberOfAdults,
        number_of_children: numberOfChildren,
        total_guests: totalGuests,
        dietary_restrictions: dietaryRestrictions,
        message: message,
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
          guest_address: guestAddress.trim() || null,
          attendance_status: attendanceStatus,
          number_of_guests: attendanceStatus === 'oui' ? totalGuests : 1,
          number_of_adults: attendanceStatus === 'oui' ? numberOfAdults : 1,
          number_of_children: attendanceStatus === 'oui' ? numberOfChildren : 0,
          dietary_restrictions: dietaryRestrictions.trim() || null,
          message: message.trim() || null,
        })
        .select('id')
        .single();

      if (responseError) throw responseError;

      // Insérer les invités détaillés
      if (attendanceStatus === 'oui' && numberOfAdults > 0) {
        const guestsToInsert = [];

        // Principal invité
        guestsToInsert.push({
          response_id: responseData.id,
          guest_first_name: guestFirstName.trim(),
          guest_last_name: guestLastName.trim(),
          guest_type: 'adult',
          dietary_restrictions: dietaryRestrictions.trim() || null
        });

        // Accompagnants adultes
        for (let i = 1; i < numberOfAdults; i++) {
          if (adults[i]?.firstName && adults[i]?.lastName) {
            guestsToInsert.push({
              response_id: responseData.id,
              guest_first_name: adults[i].firstName.trim(),
              guest_last_name: adults[i].lastName.trim(),
              guest_type: 'adult',
              dietary_restrictions: dietaryRestrictions.trim() || null
            });
          }
        }

        // Enfants
        for (let i = 0; i < numberOfChildren; i++) {
          guestsToInsert.push({
            response_id: responseData.id,
            guest_first_name: `Enfant ${i + 1}`,
            guest_last_name: guestLastName.trim(),
            guest_type: 'child',
            dietary_restrictions: null
          });
        }

        const { error: guestsError } = await supabase
          .from('wedding_rsvp_guests')
          .insert(guestsToInsert);

        if (guestsError) throw guestsError;
      }

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
          const { error: subError } = await supabase
            .from('wedding_rsvp_sub_responses')
            .insert(subResponsesToInsert);

          if (subError) console.error('Erreur sous-réponses:', subError);
        }
      }

      setSubmitted(true);
      toast({
        title: 'Réponse enregistrée !',
        description: 'Merci d\'avoir confirmé votre présence',
      });
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
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-olive/5 to-wedding-sage/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-olive/5 to-wedding-sage/10">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Événement introuvable</h2>
            <p className="text-muted-foreground">
              Le lien RSVP que vous avez utilisé n'est pas valide ou a expiré.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Confirmation RSVP - {event.event_name}</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-olive/5 to-wedding-sage/10 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="py-12 text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Merci !</h2>
                <p className="text-muted-foreground">
                  Votre réponse a été enregistrée avec succès.
                </p>
              </div>
              {attendanceStatus === 'oui' && (
                <p className="text-sm text-muted-foreground">
                  Nous sommes impatients de vous voir le jour J ! <Heart className="inline h-4 w-4 text-red-500" />
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>RSVP - {event.event_name}</title>
        <meta name="description" content={event.welcome_message || `Confirmez votre présence à ${event.event_name}`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-wedding-olive/5 to-wedding-sage/10 py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-4xl font-serif">{event.event_name}</CardTitle>
            {event.event_date && (
              <p className="text-lg text-muted-foreground">
                {formatDate(event.event_date)}
              </p>
            )}
            {event.event_location && (
              <p className="text-muted-foreground">{event.event_location}</p>
            )}
            {event.welcome_message && (
              <p className="text-muted-foreground italic mt-4">{event.welcome_message}</p>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Prénom */}
              <div className="space-y-2">
                <Label htmlFor="guest_first_name">Votre prénom *</Label>
                <Input
                  id="guest_first_name"
                  value={guestFirstName}
                  onChange={(e) => setGuestFirstName(e.target.value)}
                  placeholder="Marie"
                  required
                />
                {errors.guest_first_name && (
                  <p className="text-sm text-red-500">{errors.guest_first_name}</p>
                )}
              </div>

              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="guest_last_name">Votre nom *</Label>
                <Input
                  id="guest_last_name"
                  value={guestLastName}
                  onChange={(e) => setGuestLastName(e.target.value)}
                  placeholder="Dupont"
                  required
                />
                {errors.guest_last_name && (
                  <p className="text-sm text-red-500">{errors.guest_last_name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="guest_email">Email</Label>
                <Input
                  id="guest_email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="marie@exemple.com"
                />
                {errors.guest_email && (
                  <p className="text-sm text-red-500">{errors.guest_email}</p>
                )}
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="guest_phone">
                  Téléphone {event.require_phone && '*'}
                </Label>
                <Input
                  id="guest_phone"
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  required={event.require_phone}
                />
                {errors.guest_phone && (
                  <p className="text-sm text-red-500">{errors.guest_phone}</p>
                )}
              </div>

              {/* Adresse postale */}
              <div className="space-y-2">
                <Label htmlFor="guest_address">Adresse postale (optionnel)</Label>
                <Textarea
                  id="guest_address"
                  value={guestAddress}
                  onChange={(e) => setGuestAddress(e.target.value)}
                  placeholder="Rue, Code postal, Ville, Pays"
                  rows={3}
                />
                {errors.guest_address && (
                  <p className="text-sm text-red-500">{errors.guest_address}</p>
                )}
              </div>

              {/* Statut présence */}
              <div className="space-y-3">
                <Label>Serez-vous présent(e) ? *</Label>
                <RadioGroup
                  value={attendanceStatus}
                  onValueChange={(value) => setAttendanceStatus(value as 'oui' | 'non' | 'peut-être')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oui" id="oui" />
                    <Label htmlFor="oui" className="font-normal cursor-pointer">
                      Oui, je serai présent(e)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non" id="non" />
                    <Label htmlFor="non" className="font-normal cursor-pointer">
                      Non, je ne pourrai pas venir
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="peut-être" id="peut-etre" />
                    <Label htmlFor="peut-etre" className="font-normal cursor-pointer">
                      Peut-être, je ne suis pas certain(e)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Nombre d'invités pour l'événement principal */}
              {attendanceStatus === 'oui' && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {event.event_name}
                    {event.event_date && (
                      <span className="text-sm font-normal text-muted-foreground">
                        - {formatDate(event.event_date)}
                      </span>
                    )}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="number_of_adults">Nombre d'adultes *</Label>
                      <Input
                        id="number_of_adults"
                        type="number"
                        min="1"
                        max={event.max_guests_per_invite}
                        value={numberOfAdults}
                        onChange={(e) => {
                          const newCount = parseInt(e.target.value) || 1;
                          setNumberOfAdults(newCount);
                          const newAdults = Array(newCount).fill(null).map((_, i) => 
                            adults[i] || { firstName: '', lastName: '' }
                          );
                          setAdults(newAdults);
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number_of_children">Nombre d'enfants</Label>
                      <Input
                        id="number_of_children"
                        type="number"
                        min="0"
                        max={event.max_guests_per_invite}
                        value={numberOfChildren}
                        onChange={(e) => setNumberOfChildren(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Noms des accompagnants adultes */}
                  {numberOfAdults > 1 && (
                    <div className="space-y-4 border-t pt-4">
                      <Label className="text-base font-medium">
                        Noms des adultes accompagnants
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Personne 1 : {guestFirstName || '(Prénom)'} {guestLastName || '(Nom)'}
                      </p>
                      
                      {Array.from({ length: numberOfAdults - 1 }).map((_, index) => (
                        <div key={index} className="space-y-2 border-l-2 border-primary pl-4">
                          <p className="text-sm font-medium">Personne {index + 2}</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Prénom"
                              value={adults[index + 1]?.firstName || ''}
                              onChange={(e) => {
                                const newAdults = [...adults];
                                newAdults[index + 1] = { 
                                  ...newAdults[index + 1], 
                                  firstName: e.target.value 
                                };
                                setAdults(newAdults);
                              }}
                              required
                            />
                            <Input
                              placeholder="Nom"
                              value={adults[index + 1]?.lastName || ''}
                              onChange={(e) => {
                                const newAdults = [...adults];
                                newAdults[index + 1] = { 
                                  ...newAdults[index + 1], 
                                  lastName: e.target.value 
                                };
                                setAdults(newAdults);
                              }}
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sous-événements */}
              {attendanceStatus === 'oui' && subEvents.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Événements complémentaires</h3>
                  <p className="text-sm text-muted-foreground">
                    Indiquez votre présence pour chaque événement
                  </p>
                  
                  {subEvents.map((subEvent) => {
                    const response = subEventResponses.find(r => r.sub_event_id === subEvent.id);
                    
                    return (
                      <div key={subEvent.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`sub-${subEvent.id}`}
                                checked={response?.attending || false}
                                onCheckedChange={(checked) => 
                                  updateSubEventResponse(subEvent.id, 'attending', checked as boolean)
                                }
                              />
                              <Label htmlFor={`sub-${subEvent.id}`} className="font-semibold cursor-pointer">
                                {subEvent.sub_event_name}
                              </Label>
                            </div>
                            {(subEvent.sub_event_date || subEvent.sub_event_time) && (
                              <p className="text-sm text-muted-foreground ml-6 flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                {subEvent.sub_event_date && formatDate(subEvent.sub_event_date)}
                                {subEvent.sub_event_time && ` à ${subEvent.sub_event_time}`}
                              </p>
                            )}
                            {subEvent.sub_event_location && (
                              <p className="text-sm text-muted-foreground ml-6 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {subEvent.sub_event_location}
                              </p>
                            )}
                          </div>
                        </div>

                        {response?.attending && (
                          <div className="grid grid-cols-2 gap-4 ml-6">
                            <div className="space-y-2">
                              <Label>Adultes</Label>
                              <Input
                                type="number"
                                min="0"
                                max={event.max_guests_per_invite}
                                value={response.number_of_adults}
                                onChange={(e) => 
                                  updateSubEventResponse(subEvent.id, 'number_of_adults', parseInt(e.target.value) || 0)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Enfants</Label>
                              <Input
                                type="number"
                                min="0"
                                max={event.max_guests_per_invite}
                                value={response.number_of_children}
                                onChange={(e) => 
                                  updateSubEventResponse(subEvent.id, 'number_of_children', parseInt(e.target.value) || 0)
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Restrictions alimentaires */}
              {event.require_dietary_restrictions && attendanceStatus === 'oui' && (
                <div className="space-y-2">
                  <Label htmlFor="dietary_restrictions">Restrictions alimentaires</Label>
                  <Textarea
                    id="dietary_restrictions"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    placeholder="Allergies, régime végétarien, etc."
                    rows={3}
                    maxLength={500}
                  />
                </div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Un message pour les mariés ?</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Laissez un petit mot..."
                  rows={4}
                  maxLength={1000}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
                disabled={submitting}
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Confirmer ma réponse'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RSVPPublicForm;

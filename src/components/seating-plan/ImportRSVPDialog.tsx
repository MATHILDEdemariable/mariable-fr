import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, CheckCircle } from 'lucide-react';

interface RSVPEvent {
  id: string;
  event_name: string;
  event_date: string | null;
}

interface RSVPGuest {
  id: string;
  response_id: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_type: 'adult' | 'child';
  dietary_restrictions: string | null;
}

interface RSVPResponse {
  id: string;
  guest_name: string;
  number_of_adults: number;
  number_of_children: number;
  dietary_restrictions: string | null;
  attendance_status: string;
  guests?: RSVPGuest[];
}

interface ImportRSVPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  onImported: () => void;
}

const ImportRSVPDialog = ({ open, onOpenChange, planId, onImported }: ImportRSVPDialogProps) => {
  const [events, setEvents] = useState<RSVPEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [responses, setResponses] = useState<RSVPResponse[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadEvents();
    }
  }, [open]);

  const loadEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('wedding_rsvp_events')
      .select('id, event_name, event_date')
      .eq('user_id', user.id)
      .order('event_date', { ascending: false });

    setEvents(data || []);
  };

  const loadResponses = async (eventId: string) => {
    const { data: responsesData } = await supabase
      .from('wedding_rsvp_responses')
      .select('*')
      .eq('event_id', eventId)
      .eq('attendance_status', 'oui');

    if (!responsesData) {
      setResponses([]);
      return;
    }

    // Charger les invités détaillés
    const { data: guestsData } = await supabase
      .from('wedding_rsvp_guests')
      .select('*')
      .in('response_id', responsesData.map(r => r.id));

    // Associer les invités aux réponses
    const responsesWithGuests = responsesData.map(response => ({
      ...response,
      guests: (guestsData?.filter(g => g.response_id === response.id) || []).map(g => ({
        ...g,
        guest_type: g.guest_type as 'adult' | 'child'
      }))
    }));

    setResponses(responsesWithGuests);
    setSelectedGuests(new Set(responsesWithGuests.map(r => r.id)));
  };

  const handleEventChange = async (eventId: string) => {
    setSelectedEvent(eventId);
    await loadResponses(eventId);
  };

  const toggleGuest = (guestId: string) => {
    const newSelected = new Set(selectedGuests);
    if (newSelected.has(guestId)) {
      newSelected.delete(guestId);
    } else {
      newSelected.add(guestId);
    }
    setSelectedGuests(newSelected);
  };

  const handleImport = async () => {
    if (!selectedEvent || selectedGuests.size === 0) return;

    setLoading(true);
    try {
      const guestsToImport: any[] = [];
      
      for (const responseId of Array.from(selectedGuests)) {
        const response = responses.find(r => r.id === responseId);
        if (!response) continue;

        // Si invités détaillés disponibles
        if (response.guests && response.guests.length > 0) {
          response.guests.forEach((guest, index) => {
            const isMainGuest = index === 0;
            
            // Format d'affichage selon la position
            let displayName: string;
            if (isMainGuest) {
              // Principal : "Mathilde Lambert"
              displayName = `${guest.guest_first_name} ${guest.guest_last_name}`;
            } else {
              // Accompagnants : "+1 Mathilde L."
              const lastNameInitial = guest.guest_last_name.charAt(0).toUpperCase();
              displayName = `+1 ${guest.guest_first_name} ${lastNameInitial}.`;
            }
            
            guestsToImport.push({
              seating_plan_id: planId,
              table_id: null,
              guest_name: displayName,
              rsvp_response_id: response.id,
              guest_type: guest.guest_type,
              dietary_restrictions: guest.dietary_restrictions
            });
          });
        } else {
          // Fallback : ancien système sans détails
          for (let i = 0; i < (response.number_of_adults || 0); i++) {
            guestsToImport.push({
              seating_plan_id: planId,
              table_id: null,
              guest_name: i === 0 ? response.guest_name : `${response.guest_name} (Accompagnant ${i})`,
              rsvp_response_id: response.id,
              guest_type: 'adult',
              dietary_restrictions: response.dietary_restrictions
            });
          }

          for (let i = 0; i < (response.number_of_children || 0); i++) {
            guestsToImport.push({
              seating_plan_id: planId,
              table_id: null,
              guest_name: `${response.guest_name} - Enfant ${i + 1}`,
              rsvp_response_id: response.id,
              guest_type: 'child',
              dietary_restrictions: response.dietary_restrictions
            });
          }
        }
      }

      const { error } = await supabase
        .from('seating_assignments')
        .insert(guestsToImport);

      if (error) throw error;

      toast({
        title: 'Import réussi',
        description: `${guestsToImport.length} invité(s) importé(s) en "Non placés"`
      });

      onImported();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Importer depuis RSVP
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun événement RSVP trouvé
            </p>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Sélectionner un événement</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedEvent || ''}
                  onChange={(e) => handleEventChange(e.target.value)}
                >
                  <option value="">-- Choisir --</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.event_name} - {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'Date non définie'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEvent && responses.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Invités confirmés ({selectedGuests.size}/{responses.length})
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedGuests.size === responses.length) {
                          setSelectedGuests(new Set());
                        } else {
                          setSelectedGuests(new Set(responses.map(r => r.id)));
                        }
                      }}
                    >
                      {selectedGuests.size === responses.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                    </Button>
                  </div>

                  <ScrollArea className="h-[300px] border rounded-md p-4">
                    <div className="space-y-2">
                      {responses.map(response => {
                        const totalGuests = (response.number_of_adults || 0) + (response.number_of_children || 0);
                        return (
                          <div
                            key={response.id}
                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                            onClick={() => toggleGuest(response.id)}
                          >
                            <Checkbox
                              checked={selectedGuests.has(response.id)}
                              onCheckedChange={() => toggleGuest(response.id)}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{response.guest_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {response.guests && response.guests.length > 0 
                                  ? response.guests.map(g => `${g.guest_first_name} ${g.guest_last_name}`).join(', ')
                                  : `${totalGuests} personne(s)`
                                }
                                {response.dietary_restrictions && ' • Restrictions alimentaires'}
                              </p>
                            </div>
                            {selectedGuests.has(response.id) && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleImport}
            disabled={loading || selectedGuests.size === 0}
          >
            {loading ? 'Import...' : `Importer ${selectedGuests.size} invité(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportRSVPDialog;

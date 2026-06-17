import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Download, Loader2, Phone, Mail, Users, UtensilsCrossed, MessageSquare, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RSVPGuest {
  id: string;
  response_id: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_type: 'adult' | 'child';
  dietary_restrictions: string | null;
}

interface SubEvent {
  id: string;
  sub_event_name: string;
  sub_event_date: string | null;
  sub_event_time: string | null;
}

interface SubResponse {
  id: string;
  sub_event_id: string;
  attending: boolean;
  number_of_adults: number;
  number_of_children: number;
}

interface RSVPResponse {
  id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  guest_address: string | null;
  attendance_status: 'oui' | 'non' | 'peut-être';
  number_of_guests: number;
  number_of_adults: number | null;
  number_of_children: number | null;
  dietary_restrictions: string | null;
  message: string | null;
  submitted_at: string;
  guests?: RSVPGuest[];
  sub_responses?: SubResponse[];
}

const RSVPResponses: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [responses, setResponses] = useState<RSVPResponse[]>([]);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResponses();
  }, [eventId]);

  const loadResponses = async () => {
    try {
      // Charger l'événement
      const { data: eventData, error: eventError } = await supabase
        .from('wedding_rsvp_events')
        .select('event_name')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      setEventName(eventData.event_name);

      // Charger les sous-événements
      const { data: subEventsData } = await supabase
        .from('wedding_rsvp_sub_events')
        .select('*')
        .eq('parent_event_id', eventId)
        .order('sub_event_date', { ascending: true });

      setSubEvents(subEventsData || []);

      // Charger les réponses
      const { data, error } = await supabase
        .from('wedding_rsvp_responses')
        .select('*')
        .eq('event_id', eventId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Charger les invités détaillés et les sous-réponses
      if (data && data.length > 0) {
        const responseIds = data.map(r => r.id);
        
        const { data: guestsData } = await supabase
          .from('wedding_rsvp_guests')
          .select('*')
          .in('response_id', responseIds);

        const { data: subResponsesData } = await supabase
          .from('wedding_rsvp_sub_responses')
          .select('*')
          .in('response_id', responseIds);

        // Associer les invités et sous-réponses aux réponses
        const responsesWithData = data.map(response => ({
          ...response,
          guests: guestsData?.filter(g => g.response_id === response.id) || [],
          sub_responses: subResponsesData?.filter(sr => sr.response_id === response.id) || []
        }));

        setResponses(responsesWithData as RSVPResponse[]);
      } else {
        setResponses([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réponses:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les réponses RSVP',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Nom principal', 'Invités détaillés', 'Email', 'Téléphone', 'Adresse', 'Statut', 'Adultes', 'Enfants', 'Total', 'Restrictions', 'Message', 'Date réponse'];
    
    // Ajouter les colonnes pour les sous-événements
    subEvents.forEach(se => {
      headers.push(`${se.sub_event_name} - Présent`, `${se.sub_event_name} - Adultes`, `${se.sub_event_name} - Enfants`);
    });

    const rows = responses.map(r => {
      const baseRow = [
        r.guest_name,
        r.guests && r.guests.length > 0 
          ? r.guests.map(g => `${g.guest_first_name} ${g.guest_last_name}`).join(', ')
          : '-',
        r.guest_email || '',
        r.guest_phone || '',
        r.guest_address || '',
        r.attendance_status,
        r.number_of_adults || r.number_of_guests || 1,
        r.number_of_children || 0,
        (r.number_of_adults || r.number_of_guests || 1) + (r.number_of_children || 0),
        r.dietary_restrictions || '',
        r.message || '',
        new Date(r.submitted_at).toLocaleString('fr-FR'),
      ];

      // Ajouter les données des sous-événements
      subEvents.forEach(se => {
        const subResp = r.sub_responses?.find(sr => sr.sub_event_id === se.id);
        if (subResp && subResp.attending) {
          baseRow.push('Oui', String(subResp.number_of_adults), String(subResp.number_of_children));
        } else {
          baseRow.push('Non', '0', '0');
        }
      });

      return baseRow;
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rsvp-${eventName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: 'Export réussi',
      description: 'Le fichier CSV a été téléchargé',
    });
  };

  const filteredResponses = responses.filter(r =>
    r.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.guest_phone?.includes(searchTerm)
  );

  const confirmedResponses = filteredResponses.filter(r => r.attendance_status === 'oui');
  const declinedResponses = filteredResponses.filter(r => r.attendance_status === 'non');
  const maybeResponses = filteredResponses.filter(r => r.attendance_status === 'peut-être');

  const totalConfirmedAdults = confirmedResponses.reduce((sum, r) => sum + (r.number_of_adults || r.number_of_guests || 1), 0);
  const totalConfirmedChildren = confirmedResponses.reduce((sum, r) => sum + (r.number_of_children || 0), 0);
  const totalConfirmedGuests = totalConfirmedAdults + totalConfirmedChildren;

  // Calculer les totaux par sous-événement
  const subEventTotals = subEvents.map(se => {
    let adults = 0;
    let children = 0;
    confirmedResponses.forEach(r => {
      const subResp = r.sub_responses?.find(sr => sr.sub_event_id === se.id);
      if (subResp && subResp.attending) {
        adults += subResp.number_of_adults;
        children += subResp.number_of_children;
      }
    });
    return { ...se, adults, children, total: adults + children };
  });

  const ResponseCard: React.FC<{ response: RSVPResponse; statusColor: string }> = ({ response, statusColor }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{response.guest_name}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(response.submitted_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Badge className={statusColor}>
            {response.attendance_status}
          </Badge>
        </div>

        {response.guests && response.guests.length > 0 ? (
          <div className="space-y-1">
            {response.guests.map((guest) => (
              <div key={guest.id} className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {guest.guest_type === 'adult' ? '👤' : '👶'} {guest.guest_first_name} {guest.guest_last_name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              👤 {response.number_of_adults || response.number_of_guests || 1} adulte{(response.number_of_adults || response.number_of_guests || 1) > 1 ? 's' : ''}
              {(response.number_of_children || 0) > 0 && (
                <> • 👶 {response.number_of_children} enfant{response.number_of_children! > 1 ? 's' : ''}</>
              )}
            </span>
          </div>
        )}

        {/* Afficher les sous-événements */}
        {response.sub_responses && response.sub_responses.length > 0 && (
          <div className="border-t pt-2 space-y-1">
            {response.sub_responses.filter(sr => sr.attending).map(sr => {
              const subEvent = subEvents.find(se => se.id === sr.sub_event_id);
              return (
                <div key={sr.id} className="flex items-center gap-2 text-sm text-wedding-olive">
                  <Calendar className="h-3 w-3" />
                  <span>{subEvent?.sub_event_name}: {sr.number_of_adults} ad. + {sr.number_of_children} enf.</span>
                </div>
              );
            })}
          </div>
        )}

        {response.guest_email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{response.guest_email}</span>
          </div>
        )}

        {response.guest_phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{response.guest_phone}</span>
          </div>
        )}

        {response.dietary_restrictions && (
          <div className="flex items-start gap-2 text-sm">
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="flex-1">{response.dietary_restrictions}</span>
          </div>
        )}

        {response.message && (
          <div className="flex items-start gap-2 text-sm pt-2 border-t">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="flex-1 italic">{response.message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/rsvp')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{eventName}</h1>
          <p className="text-muted-foreground">
            {responses.length} réponse{responses.length > 1 ? 's' : ''} • 
            {totalConfirmedAdults} adulte{totalConfirmedAdults > 1 ? 's' : ''} + 
            {totalConfirmedChildren} enfant{totalConfirmedChildren > 1 ? 's' : ''} confirmé{totalConfirmedGuests > 1 ? 's' : ''} 
            (Total: {totalConfirmedGuests})
          </p>
        </div>
      </div>

      {/* Résumé des sous-événements */}
      {subEventTotals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subEventTotals.map(se => (
            <Card key={se.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-wedding-olive" />
                  {se.sub_event_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-wedding-olive">{se.total}</p>
                <p className="text-sm text-muted-foreground">
                  {se.adults} adulte{se.adults > 1 ? 's' : ''} + {se.children} enfant{se.children > 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un invité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Tableur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne Confirmés */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Confirmés</h2>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              {confirmedResponses.length}
            </Badge>
          </div>
          {confirmedResponses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune confirmation
              </CardContent>
            </Card>
          ) : (
            confirmedResponses.map((response) => (
              <ResponseCard
                key={response.id}
                response={response}
                statusColor="bg-green-100 text-green-700 border-green-200"
              />
            ))
          )}
        </div>

        {/* Colonne Absents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Absents</h2>
            <Badge className="bg-red-100 text-red-700 border-red-200">
              {declinedResponses.length}
            </Badge>
          </div>
          {declinedResponses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucun refus
              </CardContent>
            </Card>
          ) : (
            declinedResponses.map((response) => (
              <ResponseCard
                key={response.id}
                response={response}
                statusColor="bg-red-100 text-red-700 border-red-200"
              />
            ))
          )}
        </div>

        {/* Colonne Peut-être */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Peut-être</h2>
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              {maybeResponses.length}
            </Badge>
          </div>
          {maybeResponses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune réponse incertaine
              </CardContent>
            </Card>
          ) : (
            maybeResponses.map((response) => (
              <ResponseCard
                key={response.id}
                response={response}
                statusColor="bg-orange-100 text-orange-700 border-orange-200"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RSVPResponses;

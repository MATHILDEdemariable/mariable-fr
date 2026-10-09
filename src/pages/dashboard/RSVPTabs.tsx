import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWeddingScope } from '@/hooks/useWeddingScope';
import GuestListManager from '@/components/rsvp/GuestListManager';
import GuestPageCustomizer from '@/components/rsvp/GuestPageCustomizer';
import RSVPManagement from './RSVPManagement';

type GuestView = 'liste' | 'rsvp' | 'mini-site';
const GUEST_VIEWS: GuestView[] = ['liste', 'rsvp', 'mini-site'];

/** Mini-site des mariés : personnalisation directe de la feuille invités de chaque formulaire */
const GuestMiniSitePanel: React.FC<{ isEnglish: boolean; onCreateForm: () => void }> = ({ isEnglish, onCreateForm }) => {
  const { weddingId } = useWeddingScope();
  const { toast } = useToast();
  const [events, setEvents] = useState<any[] | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      let query: any = (supabase as any).from('wedding_rsvp_events').select('id, event_name, unique_link_slug, customization');
      query = weddingId ? query.eq('wedding_id', weddingId) : query.eq('user_id', user.id);
      const { data, error } = await query.order('created_at', { ascending: true });
      if (error) console.error('❌ GuestMiniSitePanel load failed:', error);
      setEvents(data ?? []);
    };
    loadEvents();
  }, [weddingId]);

  if (events === null) return <p className="text-sm text-muted-foreground">{isEnglish ? 'Loading…' : 'Chargement…'}</p>;
  if (events.length === 0) {
    return (
      <div className="border border-border p-6 text-center space-y-3">
        <p>{isEnglish ? 'Create a response form first: the mini-site is attached to it.' : 'Créez d’abord un formulaire réponse : le mini-site y est rattaché.'}</p>
        <Button className="rounded-none" onClick={onCreateForm}>{isEnglish ? 'Go to response form' : 'Aller au formulaire réponse'}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {events.map((event) => {
        const publicUrl = `${window.location.origin}/rsvp/${event.unique_link_slug}`;
        return (
          <section key={event.id} className="border border-border p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="font-serif text-xl">{event.event_name}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-none" asChild>
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />{isEnglish ? 'Preview' : 'Prévisualiser'}
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none"
                  onClick={() => { navigator.clipboard?.writeText(publicUrl); toast({ title: isEnglish ? 'Link copied' : 'Lien copié' }); }}
                >
                  <Copy className="h-4 w-4 mr-1" />{isEnglish ? 'Copy link' : 'Copier le lien'}
                </Button>
              </div>
            </div>
            <GuestPageCustomizer inline eventId={event.id} initialCustomization={event.customization} />
          </section>
        );
      })}
    </div>
  );
};

const RSVPTabs: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedView = searchParams.get('vue') as GuestView | null;
  const currentView: GuestView = requestedView && GUEST_VIEWS.includes(requestedView) ? requestedView : 'liste';

  const handleViewChange = (view: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('vue', view);
    setSearchParams(next, { replace: true });
  };

  const viewLabels: Record<GuestView, string> = {
    liste: isEnglish ? '📋 Guest list' : '📋 Liste des invités',
    rsvp: isEnglish ? '💌 Response form (RSVP)' : '💌 Formulaire réponse (RSVP)',
    'mini-site': isEnglish ? '🌐 Couple’s mini-site' : '🌐 Mini-site des mariés',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif">{isEnglish ? 'Guest management' : 'Gestion Invités'}</h1>
          <p className="text-muted-foreground mt-2">
            {isEnglish ? 'Your list, the response form and the page shared with your guests.' : 'Votre liste, le formulaire réponse et la page partagée à vos invités.'}
          </p>
        </div>
        <Select value={currentView} onValueChange={handleViewChange}>
          <SelectTrigger className="w-full md:w-80 h-12 rounded-none font-serif text-base" aria-label={isEnglish ? 'Choose a view' : 'Choisir une vue'}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            {GUEST_VIEWS.map((view) => (
              <SelectItem key={view} value={view} className="font-serif text-base min-h-[44px]">{viewLabels[view]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentView === 'liste' && <GuestListManager />}
      {currentView === 'rsvp' && <RSVPManagement />}
      {currentView === 'mini-site' && <GuestMiniSitePanel isEnglish={!!isEnglish} onCreateForm={() => handleViewChange('rsvp')} />}
    </div>
  );
};

export default RSVPTabs;

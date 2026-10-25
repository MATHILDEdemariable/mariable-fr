import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Check, X, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PhotoItem {
  id: string;
  title: string;
  toCapture: boolean;
  guestIds: string[];
  customNames: string[];
}

interface Guest {
  id: string;
  guest_first_name: string;
  guest_last_name: string;
}

interface PhotoListReadOnlyProps {
  coordinationId: string;
  /** Mode Conducteur : le wedding planner coche les photos prises (synchronisé en direct). */
  editable?: boolean;
}

const PHOTO_STATUS_CATEGORY = 'photo_list_status';

const PhotoListReadOnly: React.FC<PhotoListReadOnlyProps> = ({ coordinationId, editable = false }) => {
  const { t, i18n } = useTranslation('monJourM');

  // Les intitulés enregistrés sont en français : on les réaffiche dans la langue courante.
  const frDefaultTitles = (i18n.getFixedT('fr', 'monJourM')('photoList.defaults', { returnObjects: true }) as string[]) || [];
  const currentDefaultTitles = (t('photoList.defaults', { returnObjects: true }) as string[]) || [];
  const displayTitle = (title: string) => {
    const index = frDefaultTitles.indexOf(title);
    return index >= 0 ? currentDefaultTitles[index] ?? title : title;
  };

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const isEnglish = i18n.language?.startsWith('en');

  const loadDoneIds = async () => {
    const { data } = await supabase.from('coordination_documents').select('description')
      .eq('coordination_id', coordinationId).eq('category', PHOTO_STATUS_CATEGORY).maybeSingle();
    try { setDoneIds(data?.description ? JSON.parse(data.description) : []); } catch { setDoneIds([]); }
  };

  useEffect(() => {
    loadData();
    loadDoneIds();
    const channel = supabase
      .channel(`photo-status-${coordinationId}-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'coordination_documents', filter: `coordination_id=eq.${coordinationId}` }, () => loadDoneIds())
      .subscribe();
    // Les visiteurs anonymes ne reçoivent pas toujours le temps réel : rafraîchissement de secours
    const interval = window.setInterval(loadDoneIds, 20000);
    return () => { window.clearInterval(interval); supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinationId]);

  const togglePhotoDone = async (photoId: string) => {
    const next = doneIds.includes(photoId) ? doneIds.filter((id) => id !== photoId) : [...doneIds, photoId];
    setDoneIds(next);
    try {
      const { data: existing } = await supabase.from('coordination_documents').select('id')
        .eq('coordination_id', coordinationId).eq('category', PHOTO_STATUS_CATEGORY).maybeSingle();
      const payload = { description: JSON.stringify(next) };
      const { error } = existing
        ? await supabase.from('coordination_documents').update(payload).eq('id', existing.id)
        : await supabase.from('coordination_documents').insert({ ...payload, coordination_id: coordinationId, category: PHOTO_STATUS_CATEGORY, title: 'Photos prises', file_url: '' });
      if (error) throw error;
    } catch (error) {
      console.error('❌ togglePhotoDone failed:', error);
      setDoneIds(doneIds);
    }
  };

  const loadData = async () => {
    try {
      // Charger la liste de photos
      const { data: docData, error: docError } = await supabase
        .from('coordination_documents')
        .select('description')
        .eq('coordination_id', coordinationId)
        .eq('category', 'photo_list')
        .maybeSingle();

      if (docError && docError.code !== 'PGRST116') throw docError;

      if (docData?.description) {
        try {
          const parsed = JSON.parse(docData.description);
          // Gérer les deux formats (ancien avec sections, nouveau plat)
          if (Array.isArray(parsed) && parsed[0]?.items) {
            const flatPhotos: PhotoItem[] = [];
            parsed.forEach((section: any) => {
              section.items?.forEach((item: any) => {
                flatPhotos.push({
                  id: item.id,
                  title: item.text || item.title,
                  toCapture: item.checked ?? item.toCapture ?? true,
                  guestIds: item.guestIds || [],
                  customNames: item.customNames || []
                });
              });
            });
            setPhotos(flatPhotos);
          } else if (Array.isArray(parsed)) {
            setPhotos(parsed);
          }
        } catch (e) {
          console.error('Erreur parsing photo list:', e);
        }
      }

      // Charger les infos des invités pour les noms
      const { data: coordination } = await supabase
        .from('wedding_coordination')
        .select('user_id, wedding_id')
        .eq('id', coordinationId)
        .single<{ user_id: string; wedding_id: string | null }>();

      if (coordination?.user_id) {
        let guestsQuery: any = supabase
          .from('wedding_guest_list')
          .select('id, guest_first_name, guest_last_name')
          .eq('user_id', coordination.user_id);

        if (coordination.wedding_id) {
          guestsQuery = guestsQuery.eq('wedding_id', coordination.wedding_id);
        }

        const { data: guestsData } = await guestsQuery;

        setGuests(guestsData || []);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGuestName = (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    return guest ? `${guest.guest_first_name} ${guest.guest_last_name}` : '';
  };

  const getPersonsList = (photo: PhotoItem): string => {
    const names: string[] = [];
    
    // Ajouter les noms depuis la liste d'invités
    photo.guestIds.forEach(id => {
      const name = getGuestName(id);
      if (name) names.push(name);
    });
    
    // Ajouter les noms personnalisés
    names.push(...photo.customNames);
    
    return names.length > 0 ? names.join(', ') : t('photoList.readOnly.coupleOnly');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          {t('photoList.readOnly.loading')}
        </CardContent>
      </Card>
    );
  }

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t('photoList.readOnly.empty')}</p>
        </CardContent>
      </Card>
    );
  }

  const photosToCapture = photos.filter(p => p.toCapture);
  const photosSkipped = photos.filter(p => !p.toCapture);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-pink-500" />
          {t('photoList.readOnly.title', { count: photosToCapture.length })}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('photoList.readOnly.subtitle')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photos à faire */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {photosToCapture.filter((p) => doneIds.includes(p.id)).length} / {photosToCapture.length} {isEnglish ? 'photos taken' : 'photos prises'}
          </p>
          {photosToCapture.map((photo) => {
            const isDone = doneIds.includes(photo.id);
            const Wrapper: any = editable ? 'button' : 'div';
            return (
            <Wrapper
              key={photo.id}
              type={editable ? 'button' : undefined}
              aria-pressed={editable ? isDone : undefined}
              onClick={editable ? () => togglePhotoDone(photo.id) : undefined}
              className={`w-full text-left p-3 border min-h-[56px] ${isDone ? 'bg-muted/60' : 'bg-background'} ${editable ? 'hover:border-wedding-olive' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center ${isDone ? 'bg-wedding-olive' : 'border border-muted-foreground/40'}`}>
                    {isDone && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm ${isDone ? 'line-through text-muted-foreground' : ''}`}>{displayTitle(photo.title)}{isDone && <span className="ml-2 text-xs text-wedding-olive no-underline">{isEnglish ? 'Done' : 'C’est fait'}</span>}</h4>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                    <Users className="h-3 w-3" />
                    <span>{getPersonsList(photo)}</span>
                  </div>
                </div>
              </div>
            </Wrapper>
            );
          })}
        </div>

        {/* Photos non prévues */}
        {photosSkipped.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-gray-500 mb-2">
              {t('photoList.readOnly.optional', { count: photosSkipped.length })}
            </p>
            <div className="space-y-1">
              {photosSkipped.map((photo) => (
                <div
                  key={photo.id}
                  className="flex items-center gap-2 p-2 text-gray-400 text-sm"
                >
                  <X className="h-4 w-4" />
                  <span className="line-through">{displayTitle(photo.title)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoListReadOnly;

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import GuestUploader from '@/components/album/GuestUploader';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Film, Heart } from 'lucide-react';

interface AlbumItem {
  id: string;
  uploaderName: string | null;
  kind: 'photo' | 'video';
  durationSeconds: number | null;
  thumbUrl: string | null;
}

interface AlbumInfo {
  state: 'active' | 'not_found' | 'disabled' | 'expired' | 'quota' | 'owner_inactive';
  title?: string;
  welcomeMessage?: string | null;
  mediaCount?: number;
  mediaLimit?: number;
  items?: AlbumItem[];
}

const STATE_MESSAGES: Record<string, string> = {
  not_found: "Ce lien n'est pas valide.",
  disabled: 'Cet album est actuellement fermé par les mariés.',
  expired: "Cet album n'accepte plus de nouveaux souvenirs.",
  quota: 'Cet album est complet, merci pour vos souvenirs !',
  owner_inactive: "Cet album n'est plus actif.",
};

const GuestAlbumPublic: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [info, setInfo] = useState<AlbumInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAlbum = useCallback(async () => {
    if (!token) return;
    try {
      const { data, error } = await supabase.functions.invoke('album-public-info', {
        body: { token },
      });
      if (error) throw error;
      setInfo(data as AlbumInfo);
    } catch (error) {
      console.error('❌ Album loading failed:', error);
      setInfo({ state: 'not_found' });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAlbum();
  }, [loadAlbum]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5EF]">
        <Loader2 className="h-6 w-6 animate-spin text-wedding-olive" />
      </div>
    );
  }

  const isOpen = info?.state === 'active';

  return (
    <div className="min-h-screen bg-[#F8F5EF] px-4 py-10">
      <Helmet>
        <title>Album photo des invités | Mariable</title>
        <meta name="description" content="Déposez vos photos et vidéos du mariage en quelques secondes." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="mx-auto w-full max-w-lg space-y-6">
        <header className="text-center">
          <Heart className="mx-auto mb-3 h-6 w-6 text-wedding-olive" />
          <h1 className="font-serif text-2xl text-foreground">
            {info?.title ?? 'Album des invités'}
          </h1>
          {info?.welcomeMessage && (
            <p className="mt-2 text-sm text-muted-foreground">{info.welcomeMessage}</p>
          )}
        </header>

        {!isOpen ? (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              {STATE_MESSAGES[info?.state ?? 'not_found']}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-5">
              <GuestUploader token={token!} onUploaded={loadAlbum} />
            </CardContent>
          </Card>
        )}

        {info?.items && info.items.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Déjà partagés
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {info.items
                .filter((item) => item.kind === 'photo')
                .map((item) => (
                  <div key={item.id} className="aspect-square overflow-hidden rounded-sm bg-muted">
                    {item.thumbUrl ? (
                      <img
                        src={item.thumbUrl}
                        alt={`Souvenir partagé par ${item.uploaderName ?? 'un invité'}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        Photo
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {info.items.some((item) => item.kind === 'video') && (
              <ul className="space-y-1 rounded-sm border bg-background/60 p-3">
                {info.items
                  .filter((item) => item.kind === 'video')
                  .map((item) => (
                    <li key={item.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Film className="h-3.5 w-3.5" />
                      Vidéo de {item.uploaderName ?? 'un invité'}
                      {item.durationSeconds ? ` · ${item.durationSeconds}s` : ''}
                    </li>
                  ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default GuestAlbumPublic;

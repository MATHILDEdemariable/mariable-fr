import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import PremiumModal from '@/components/premium/PremiumModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Loader2, Trash2, EyeOff, Eye, Film, QrCode } from 'lucide-react';

interface Album {
  id: string;
  title: string;
  welcome_message: string | null;
  share_token: string;
  is_active: boolean;
  expires_at: string;
  media_limit: number;
}

interface Media {
  id: string;
  uploader_name: string | null;
  kind: string;
  storage_path: string;
  thumb_path: string | null;
  duration_seconds: number | null;
  is_hidden: boolean;
  created_at: string;
}

const AlbumPage: React.FC = () => {
  const { toast } = useToast();
  const { isPremium, loading: profileLoading } = useUserProfile();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [album, setAlbum] = useState<Album | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({});
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [title, setTitle] = useState('Notre album de mariage');
  const [welcomeMessage, setWelcomeMessage] = useState(
    'Partagez vos plus belles photos et vidéos de la journée !'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const shareUrl = useMemo(
    () => (album ? `${window.location.origin}/album/${album.share_token}` : ''),
    [album]
  );

  const loadMedia = useCallback(async (albumId: string) => {
    const { data, error } = await supabase
      .from('guest_album_media')
      .select('id, uploader_name, kind, storage_path, thumb_path, duration_seconds, is_hidden, created_at')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ loadMedia failed:', error);
      return;
    }
    setMedia(data || []);

    const paths = (data || []).filter((item) => item.thumb_path).map((item) => item.thumb_path as string);
    if (paths.length) {
      const { data: signed } = await supabase.storage.from('guest-album').createSignedUrls(paths, 3600);
      const urls: Record<string, string> = {};
      (signed || []).forEach((entry) => {
        if (entry.path && entry.signedUrl) urls[entry.path] = entry.signedUrl;
      });
      setThumbUrls(urls);
    }
  }, []);

  const loadAlbum = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getUser();
      if (!session.user) return;

      const { data, error } = await supabase
        .from('guest_albums')
        .select('id, title, welcome_message, share_token, is_active, expires_at, media_limit')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setAlbum(data);
        setTitle(data.title);
        setWelcomeMessage(data.welcome_message || '');
        await loadMedia(data.id);
      }
    } catch (error) {
      console.error('❌ loadAlbum failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadMedia]);

  useEffect(() => {
    loadAlbum();
  }, [loadAlbum]);

  useEffect(() => {
    if (!shareUrl) return;
    QRCode.toDataURL(shareUrl, { width: 600, margin: 2, color: { dark: '#3F4A38', light: '#FFFFFF' } })
      .then(setQrDataUrl)
      .catch((error) => console.error('❌ QR generation failed:', error));
  }, [shareUrl]);

  const handleCreateAlbum = async () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    setIsSaving(true);
    try {
      const { data: session } = await supabase.auth.getUser();
      if (!session.user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('guest_albums')
        .insert({
          user_id: session.user.id,
          title: title.trim() || 'Notre album de mariage',
          welcome_message: welcomeMessage.trim() || null,
          share_token: nanoid(10),
        })
        .select('id, title, welcome_message, share_token, is_active, expires_at, media_limit')
        .single();

      if (error) throw error;
      setAlbum(data);
      toast({ title: 'Album créé', description: 'Votre lien invités est prêt.' });
    } catch (error) {
      console.error('❌ handleCreateAlbum failed:', error);
      toast({ title: 'Erreur', description: "Impossible de créer l'album.", variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateAlbum = async (patch: Partial<Album>) => {
    if (!album) return;
    const { error } = await supabase.from('guest_albums').update(patch).eq('id', album.id);
    if (error) {
      toast({ title: 'Erreur', description: 'Mise à jour impossible.', variant: 'destructive' });
      return;
    }
    setAlbum({ ...album, ...patch });
  };

  const handleToggleHidden = async (item: Media) => {
    const { error } = await supabase
      .from('guest_album_media')
      .update({ is_hidden: !item.is_hidden })
      .eq('id', item.id);
    if (error) return;
    setMedia((current) =>
      current.map((entry) => (entry.id === item.id ? { ...entry, is_hidden: !entry.is_hidden } : entry))
    );
  };

  const handleDelete = async (item: Media) => {
    const paths = [item.storage_path, item.thumb_path].filter(Boolean) as string[];
    await supabase.storage.from('guest-album').remove(paths);
    const { error } = await supabase.from('guest_album_media').delete().eq('id', item.id);
    if (error) {
      toast({ title: 'Erreur', description: 'Suppression impossible.', variant: 'destructive' });
      return;
    }
    setMedia((current) => current.filter((entry) => entry.id !== item.id));
  };

  const handleDownload = async (item: Media) => {
    const { data, error } = await supabase.storage
      .from('guest-album')
      .createSignedUrl(item.storage_path, 3600, { download: true });
    if (error || !data?.signedUrl) {
      toast({ title: 'Erreur', description: 'Téléchargement impossible.', variant: 'destructive' });
      return;
    }
    window.open(data.signedUrl, '_blank');
  };

  const daysLeft = album
    ? Math.max(0, Math.ceil((new Date(album.expires_at).getTime() - Date.now()) / 86400000))
    : 0;

  if (isLoading || profileLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-wedding-olive" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Album photo des invités | Mariable</title>
        <meta name="description" content="Collectez les photos et vidéos de vos invités via un QR code." />
      </Helmet>

      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="mb-2 font-serif text-3xl text-foreground">Album photo des invités</h1>
          <p className="text-muted-foreground">
            Un QR code à poser sur les tables : vos invités déposent leurs photos et vidéos en qualité
            originale, sans compte ni application.
          </p>
        </header>

        {!album ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Créer votre album</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titre" />
              <Textarea
                value={welcomeMessage}
                onChange={(event) => setWelcomeMessage(event.target.value)}
                placeholder="Message d'accueil pour vos invités"
                rows={3}
              />
              <Button onClick={handleCreateAlbum} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer l'album
              </Button>
              <p className="text-xs text-muted-foreground">
                Inclus dans Premium : 400 médias pendant 90 jours.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <QrCode className="h-5 w-5" />
                  Lien et QR code
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {album.is_active ? 'Actif' : 'Désactivé'}
                  </span>
                  <Switch
                    checked={album.is_active}
                    onCheckedChange={(checked) => handleUpdateAlbum({ is_active: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-[200px_1fr]">
                {qrDataUrl && (
                  <div className="space-y-2 text-center">
                    <img src={qrDataUrl} alt="QR code de l'album invités" className="mx-auto w-40" />
                    <a href={qrDataUrl} download="album-mariage-qr.png">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </a>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input readOnly value={shareUrl} />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        toast({ title: 'Lien copié' });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {media.length} / {album.media_limit} médias
                    </Badge>
                    <Badge variant="secondary">{daysLeft} jours restants</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Imprimez le QR code avec l'adresse en clair en dessous : environ un tiers des invités
                    saisissent le lien plutôt que de scanner.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Souvenirs reçus</CardTitle>
              </CardHeader>
              <CardContent>
                {media.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun souvenir pour le moment. Partagez le QR code à vos invités.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {media.map((item) => (
                      <div key={item.id} className="overflow-hidden rounded-sm border bg-background">
                        <div className="flex aspect-square items-center justify-center bg-muted">
                          {item.kind === 'photo' && item.thumb_path && thumbUrls[item.thumb_path] ? (
                            <img
                              src={thumbUrls[item.thumb_path]}
                              alt={`Souvenir de ${item.uploader_name ?? 'un invité'}`}
                              loading="lazy"
                              className={`h-full w-full object-cover ${item.is_hidden ? 'opacity-40' : ''}`}
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                              <Film className="h-5 w-5" />
                              {item.kind === 'video'
                                ? `${item.duration_seconds ?? '?'}s`
                                : 'Aperçu indisponible'}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 p-2">
                          <p className="truncate text-xs text-muted-foreground">
                            {item.uploader_name ?? 'Invité'}
                          </p>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleDownload(item)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleToggleHidden(item)}>
                              {item.is_hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          feature="Album photo des invités"
        />
      </div>
    </>
  );
};

export default AlbumPage;

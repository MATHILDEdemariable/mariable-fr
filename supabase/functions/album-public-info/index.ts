import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { serviceClient, loadAlbumByToken } from '../_shared/album.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { token } = await req.json();
    if (!token || typeof token !== 'string') {
      return json({ error: 'Token manquant' }, 400);
    }

    const supabase = serviceClient();
    const { album, state, mediaCount } = await loadAlbumByToken(supabase, token);

    if (!album) return json({ state: 'not_found' }, 200);

    const base = {
      state,
      title: album.title,
      welcomeMessage: album.welcome_message,
      mediaCount,
      mediaLimit: album.media_limit,
    };

    if (state !== 'active' && state !== 'quota') {
      return json(base, 200);
    }

    // Derniers dépôts : vignettes signées pour les photos, métadonnées seules pour les vidéos
    const { data: media } = await supabase
      .from('guest_album_media')
      .select('id, uploader_name, kind, thumb_path, duration_seconds, created_at')
      .eq('album_id', album.id)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .limit(60);

    const items = [];
    for (const m of media ?? []) {
      let thumbUrl: string | null = null;
      if (m.kind === 'photo' && m.thumb_path) {
        const { data: signed } = await supabase.storage
          .from('guest-album')
          .createSignedUrl(m.thumb_path, 3600);
        thumbUrl = signed?.signedUrl ?? null;
      }
      items.push({
        id: m.id,
        uploaderName: m.uploader_name,
        kind: m.kind,
        durationSeconds: m.duration_seconds,
        createdAt: m.created_at,
        thumbUrl,
      });
    }

    return json({ ...base, items }, 200);
  } catch (error) {
    console.error('❌ album-public-info failed:', error);
    return json({ error: 'Erreur serveur' }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

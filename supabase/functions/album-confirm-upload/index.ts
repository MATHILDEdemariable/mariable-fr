import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { serviceClient, loadAlbumByToken } from '../_shared/album.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const token: string = body?.token;
    const storagePath: string = body?.path;
    const thumbPath: string | null = body?.thumbPath ?? null;
    const uploaderName: string = (body?.uploaderName ?? '').toString().trim().slice(0, 60);
    const mimeType: string = body?.mimeType ?? 'application/octet-stream';
    const fileSize: number = Number(body?.fileSize ?? 0);
    const durationSeconds: number | null =
      body?.durationSeconds != null ? Math.round(Number(body.durationSeconds)) : null;
    const kind: string = body?.kind === 'video' ? 'video' : 'photo';

    if (!token || !storagePath) return json({ error: 'Requête invalide' }, 400);

    const supabase = serviceClient();
    const { album, state } = await loadAlbumByToken(supabase, token);
    if (!album || (state !== 'active' && state !== 'quota')) {
      return json({ error: 'Album indisponible', state }, 403);
    }
    if (!storagePath.startsWith(`${album.id}/`)) {
      return json({ error: 'Chemin invalide' }, 400);
    }

    const { data, error } = await supabase
      .from('guest_album_media')
      .insert({
        album_id: album.id,
        uploader_name: uploaderName || null,
        storage_path: storagePath,
        thumb_path: thumbPath,
        mime_type: mimeType,
        file_size: fileSize,
        duration_seconds: durationSeconds,
        kind,
      })
      .select('id')
      .single();

    if (error) {
      console.error('❌ insert media failed:', error);
      return json({ error: 'Enregistrement impossible' }, 500);
    }

    return json({ id: data.id }, 200);
  } catch (error) {
    console.error('❌ album-confirm-upload failed:', error);
    return json({ error: 'Erreur serveur' }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

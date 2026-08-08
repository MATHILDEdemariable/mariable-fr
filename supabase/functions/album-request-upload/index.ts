import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import {
  serviceClient,
  loadAlbumByToken,
  fingerprintOf,
  MAX_VIDEO_BYTES,
  MAX_VIDEO_SECONDS,
  MAX_PHOTO_BYTES,
  RATE_LIMIT_PER_HOUR,
} from '../_shared/album.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const token: string = body?.token;
    const fileName: string = body?.fileName ?? '';
    const mimeType: string = body?.mimeType ?? '';
    const fileSize: number = Number(body?.fileSize ?? 0);
    const durationSeconds: number | null =
      body?.durationSeconds != null ? Number(body.durationSeconds) : null;

    if (!token || !fileName || !fileSize) {
      return json({ error: 'Requête invalide' }, 400);
    }

    const isVideo = mimeType.startsWith('video/');
    const isImage = mimeType.startsWith('image/') || /\.(heic|heif)$/i.test(fileName);

    if (!isVideo && !isImage) {
      return json({ error: 'Format non accepté (photos et vidéos uniquement)' }, 400);
    }
    if (isVideo && fileSize > MAX_VIDEO_BYTES) {
      return json({ error: 'Vidéo trop lourde (150 Mo maximum)' }, 400);
    }
    if (isVideo && durationSeconds && durationSeconds > MAX_VIDEO_SECONDS) {
      return json({ error: 'Vidéo trop longue (90 secondes maximum)' }, 400);
    }
    if (!isVideo && fileSize > MAX_PHOTO_BYTES) {
      return json({ error: 'Photo trop lourde' }, 400);
    }

    const supabase = serviceClient();
    const { album, state, bytesUsed } = await loadAlbumByToken(supabase, token);

    if (!album || state !== 'active') {
      return json({ error: 'Album indisponible', state }, 403);
    }
    if (bytesUsed + fileSize > Number(album.bytes_limit)) {
      return json({ error: 'Album indisponible', state: 'quota' }, 403);
    }

    // Rate limit anti-abus par empreinte
    const fingerprint = await fingerprintOf(req);
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('guest_album_upload_events')
      .select('id', { count: 'exact', head: true })
      .eq('album_id', album.id)
      .eq('fingerprint', fingerprint)
      .gte('created_at', since);

    if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
      return json({ error: 'Trop d\'envois, réessayez dans un moment' }, 429);
    }

    const ext = (fileName.split('.').pop() || 'bin').toLowerCase().slice(0, 8);
    const mediaId = crypto.randomUUID();
    const path = `${album.id}/${mediaId}.${ext}`;
    const thumbPath = `${album.id}/thumbs/${mediaId}.jpg`;

    const { data: upload, error: uploadError } = await supabase.storage
      .from('guest-album')
      .createSignedUploadUrl(path);

    if (uploadError || !upload) {
      console.error('❌ createSignedUploadUrl failed:', uploadError);
      return json({ error: 'Impossible de préparer l\'envoi' }, 500);
    }

    const { data: thumbUpload } = await supabase.storage
      .from('guest-album')
      .createSignedUploadUrl(thumbPath);

    await supabase.from('guest_album_upload_events').insert({
      album_id: album.id,
      fingerprint,
    });

    return json({
      path,
      signedUrl: upload.signedUrl,
      uploadToken: upload.token,
      thumbPath,
      thumbSignedUrl: thumbUpload?.signedUrl ?? null,
      thumbUploadToken: thumbUpload?.token ?? null,
      kind: isVideo ? 'video' : 'photo',
    }, 200);
  } catch (error) {
    console.error('❌ album-request-upload failed:', error);
    return json({ error: 'Erreur serveur' }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

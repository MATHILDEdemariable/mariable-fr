import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { serviceClient } from '../_shared/album.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const authClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(
      authHeader.replace('Bearer ', '')
    );
    if (claimsError || !claimsData?.claims) return json({ error: 'Unauthorized' }, 401);
    const userId = claimsData.claims.sub as string;

    const { mediaIds } = await req.json();
    if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
      return json({ error: 'Requête invalide' }, 400);
    }

    const supabase = serviceClient();
    const { data: media } = await supabase
      .from('guest_album_media')
      .select('id, storage_path, album_id, guest_albums!inner(user_id)')
      .in('id', mediaIds.slice(0, 50));

    const urls: Record<string, string> = {};
    for (const m of media ?? []) {
      // deno-lint-ignore no-explicit-any
      if ((m as any).guest_albums?.user_id !== userId) continue;
      const { data: signed } = await supabase.storage
        .from('guest-album')
        .createSignedUrl(m.storage_path, 3600);
      if (signed?.signedUrl) urls[m.id] = signed.signedUrl;
    }

    return json({ urls }, 200);
  } catch (error) {
    console.error('❌ album-media-url failed:', error);
    return json({ error: 'Erreur serveur' }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

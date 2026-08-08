import { createClient } from 'npm:@supabase/supabase-js@2';

export const MAX_VIDEO_BYTES = 150 * 1024 * 1024; // 150 Mo
export const MAX_VIDEO_SECONDS = 90;
export const MAX_PHOTO_BYTES = 60 * 1024 * 1024;
export const RATE_LIMIT_PER_HOUR = 80;

export const ALLOWED_MIME_PREFIXES = ['image/', 'video/'];

export const serviceClient = () =>
  createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  );

export interface AlbumRow {
  id: string;
  user_id: string;
  title: string;
  welcome_message: string | null;
  is_active: boolean;
  expires_at: string;
  media_limit: number;
  bytes_limit: number;
}

export type AlbumState = 'active' | 'not_found' | 'disabled' | 'expired' | 'quota' | 'owner_inactive';

export async function loadAlbumByToken(
  supabase: ReturnType<typeof serviceClient>,
  token: string
): Promise<{ album: AlbumRow | null; state: AlbumState; mediaCount: number; bytesUsed: number }> {
  const { data: album } = await supabase
    .from('guest_albums')
    .select('id, user_id, title, welcome_message, is_active, expires_at, media_limit, bytes_limit')
    .eq('share_token', token)
    .maybeSingle();

  if (!album) return { album: null, state: 'not_found', mediaCount: 0, bytesUsed: 0 };
  if (!album.is_active) return { album, state: 'disabled', mediaCount: 0, bytesUsed: 0 };
  if (new Date(album.expires_at) <= new Date()) {
    return { album, state: 'expired', mediaCount: 0, bytesUsed: 0 };
  }

  // Le propriétaire doit toujours être Premium
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_type, subscription_expires_at')
    .eq('id', album.user_id)
    .maybeSingle();

  const isPremium =
    profile?.subscription_type === 'premium' &&
    (!profile?.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

  if (!isPremium) return { album, state: 'owner_inactive', mediaCount: 0, bytesUsed: 0 };

  const { data: media } = await supabase
    .from('guest_album_media')
    .select('file_size')
    .eq('album_id', album.id);

  const mediaCount = media?.length ?? 0;
  const bytesUsed = (media ?? []).reduce((sum, m: { file_size: number }) => sum + Number(m.file_size || 0), 0);

  if (mediaCount >= album.media_limit || bytesUsed >= Number(album.bytes_limit)) {
    return { album, state: 'quota', mediaCount, bytesUsed };
  }

  return { album, state: 'active', mediaCount, bytesUsed };
}

export async function fingerprintOf(req: Request): Promise<string> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';
  const bytes = new TextEncoder().encode(`${ip}|${ua}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

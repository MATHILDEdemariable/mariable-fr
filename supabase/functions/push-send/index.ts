// Edge function : push-send
// Envoie une notification push à un utilisateur, une liste d'utilisateurs, ou tous.
//
// Body JSON :
//   {
//     "user_ids": ["uuid", ...]   // optionnel
//     "all": true,                // optionnel — envoie à tous les abonnés
//     "notification": {
//        "title": "Mariable",
//        "body": "...",
//        "url": "/dashboard",
//        "icon": "/icons/icon-192.png",
//        "tag": "rappel-jx",
//        "data": { ... }
//     }
//   }
//
// Auth : requiert le SERVICE_ROLE_KEY OU une clé interne `x-internal-key`.
// Pour les appels admin via supabase.functions.invoke depuis un user admin,
// on accepte aussi un user authentifié faisant partie de `admin_users`.

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const VAPID_PUBLIC = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:contact@mariable.fr';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const service = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // --- Authorization ---
    const authHeader = req.headers.get('Authorization') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    let authorized = false;

    if (authHeader === `Bearer ${serviceKey}`) {
      authorized = true;
    } else if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const userClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: claimsData } = await userClient.auth.getClaims(token);
      const uid = claimsData?.claims?.sub;
      if (uid) {
        const { data: admin } = await service
          .from('admin_users')
          .select('user_id')
          .eq('user_id', uid)
          .maybeSingle();
        if (admin) authorized = true;
      }
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const notif = body?.notification;
    if (!notif?.title) {
      return new Response(JSON.stringify({ error: 'notification.title required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Fetch target subscriptions ---
    let query = service.from('push_subscriptions').select('*').eq('enabled', true);
    if (body?.all !== true) {
      const ids: string[] = Array.isArray(body?.user_ids) ? body.user_ids : [];
      if (ids.length === 0) {
        return new Response(JSON.stringify({ error: 'user_ids or all required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      query = query.in('user_id', ids);
    }

    const { data: subs, error: fetchErr } = await query;
    if (fetchErr) {
      return new Response(JSON.stringify({ error: fetchErr.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = JSON.stringify(notif);
    let sent = 0, failed = 0;
    const expiredEndpoints: string[] = [];

    await Promise.allSettled(
      (subs ?? []).map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload
          );
          sent++;
        } catch (err: any) {
          failed++;
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            expiredEndpoints.push(s.endpoint);
          }
          console.error('push error', err?.statusCode, err?.body);
        }
      })
    );

    // Cleanup expired subscriptions
    if (expiredEndpoints.length > 0) {
      await service.from('push_subscriptions').delete().in('endpoint', expiredEndpoints);
    }

    return new Response(
      JSON.stringify({ success: true, sent, failed, expired: expiredEndpoints.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('push-send fatal', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

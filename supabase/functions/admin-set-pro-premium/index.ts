import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { requireAdmin } from '../_shared/adminAuth.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Active / retire le Pro Premium d'un compte (admin uniquement, écriture service role)
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;

    const body = await req.json().catch(() => ({}));
    const userId = typeof body.user_id === 'string' ? body.user_id : '';
    const enable = body.enable === true;
    if (!/^[0-9a-f-]{36}$/i.test(userId)) return json({ success: false, error: 'user_id invalide' }, 400);

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const update: Record<string, unknown> = {
      subscription_type: enable ? 'pro_premium' : 'free',
      subscription_expires_at: enable ? expiresAt.toISOString() : null,
    };
    if (enable) update.account_type = 'b2b';

    const { data, error } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', userId)
      .select('id, account_type, subscription_type, subscription_expires_at');
    if (error) throw error;

    let profile = data?.[0];
    if (!profile) {
      // Profil absent : on le crée
      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, ...update })
        .select('id, account_type, subscription_type, subscription_expires_at')
        .single();
      if (insertError) throw insertError;
      profile = inserted;
    }

    console.log('✅ admin-set-pro-premium', { userId, enable });
    return json({ success: true, profile });
  } catch (error) {
    console.error('❌ admin-set-pro-premium failed:', error);
    return json({ success: false, error: (error as Error).message }, 500);
  }
});

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const jsonHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

/** Vérifie le JWT de l'appelant. Retourne l'utilisateur ou une réponse 401 à renvoyer telle quelle. */
export async function requireUser(req: Request): Promise<{ user: { id: string; email?: string } } | { response: Response }> {
  const authHeader = req.headers.get('Authorization') ?? '';
  const unauthorized = { response: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: jsonHeaders }) };
  if (!authHeader.startsWith('Bearer ')) return unauthorized;
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: { headers: { Authorization: authHeader } },
  });
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return unauthorized;
  return { user: { id: data.user.id, email: data.user.email ?? undefined } };
}

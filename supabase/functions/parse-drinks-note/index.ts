import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const MOMENTS = ['Apéritif', 'Entrée', 'Plat', 'Fromage', 'Dessert', 'Soirée', 'Brunch'];
const TYPES = ['Champagne', 'Vin blanc', 'Vin rouge', 'Rosé', 'Bière', 'Cocktail', 'Spiritueux', 'Sans alcool'];
const DAYS = ['Jour 1', 'Jour 2', 'Jour 3'];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Non authentifié' }, 401);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: 'Non authentifié' }, 401);

    const body = await req.json().catch(() => ({}));
    const note = typeof body?.note === 'string' ? body.note.trim() : '';
    if (note.length < 5 || note.length > 15000) return json({ error: 'Note invalide (5 à 15 000 caractères)' }, 400);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: `Tu extrais un plan des boissons de mariage depuis une note libre (email traiteur, caviste...). Une ligne par boisson. day parmi ${DAYS.join(', ')} (Jour 1 par défaut, brunch du lendemain = Jour 2). moment parmi ${MOMENTS.join(', ')} (cocktail/vin d'honneur = Apéritif, soirée dansante = Soirée). drinkType parmi ${TYPES.join(', ')}. N'invente rien : laisse vide ce qui n'est pas mentionné.` },
          { role: 'user', content: note },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_drinks',
            parameters: {
              type: 'object',
              properties: {
                rows: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      day: { type: 'string', enum: DAYS }, moment: { type: 'string', enum: MOMENTS }, drinkType: { type: 'string', enum: TYPES },
                      drinkName: { type: 'string' }, pairing: { type: 'string' }, quantity: { type: 'string' }, supplier: { type: 'string' }, notes: { type: 'string' },
                    },
                    required: ['day', 'moment', 'drinkType', 'drinkName'],
                  },
                },
              },
              required: ['rows'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'return_drinks' } },
      }),
    });
    if (response.status === 429) return json({ error: 'Trop de demandes, réessayez dans un instant.' }, 429);
    if (response.status === 402) return json({ error: 'Crédits IA épuisés.' }, 402);
    if (!response.ok) {
      console.error('❌ AI gateway error:', response.status, await response.text());
      return json({ error: 'Analyse impossible' }, 500);
    }
    const result = await response.json();
    const args = result.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const rows = args ? JSON.parse(args).rows ?? [] : [];
    return json({ rows });
  } catch (error) {
    console.error('❌ parse-drinks-note failed:', error);
    return json({ error: 'Analyse impossible' }, 500);
  }
});

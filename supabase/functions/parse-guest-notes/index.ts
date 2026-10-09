// Transforme des notes en vrac en lignes d'invités (prénom, nom, email, téléphone, adulte/enfant, notes)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { noteText } = await req.json();
    if (!noteText || typeof noteText !== 'string' || noteText.trim().length < 2 || noteText.length > 10000) {
      return jsonResponse({ error: 'Note vide ou trop longue' }, 400);
    }
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) return jsonResponse({ error: 'LOVABLE_API_KEY not configured' }, 500);

    const instructions = `Extrais chaque invité de mariage mentionné dans la note. Une ligne par personne (un couple = 2 lignes, "+2 enfants" = 2 lignes enfants avec prénom si connu).
Champs : first_name, last_name (nom de famille hérité si évident, sinon ""), email, phone, guest_type ("adult" ou "child"), notes (régime, allergie, âge, lien… ou "").
200 invités maximum. Réponds UNIQUEMENT avec un JSON : {"guests":[{"first_name":"","last_name":"","email":"","phone":"","guest_type":"adult","notes":""}]}`;

    const upstream = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'system', content: instructions }, { role: 'user', content: noteText }],
        response_format: { type: 'json_object' },
      }),
    });
    if (!upstream.ok) {
      const errorText = await upstream.text();
      console.error('❌ AI Gateway error:', upstream.status, errorText);
      const message = upstream.status === 429 ? 'Trop de demandes, réessayez dans un instant.'
        : upstream.status === 402 ? 'Crédits IA épuisés.' : 'Service IA indisponible.';
      return jsonResponse({ error: message }, upstream.status);
    }
    const data = await upstream.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return jsonResponse({ error: "L'IA n'a trouvé aucun invité." }, 502);
    const parsed = JSON.parse(jsonMatch[0]);
    const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
    const guests = (Array.isArray(parsed.guests) ? parsed.guests : []).slice(0, 200).map((g: any) => ({
      first_name: clean(g.first_name, 100),
      last_name: clean(g.last_name, 100),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(g.email, 200)) ? clean(g.email, 200) : '',
      phone: clean(g.phone, 40),
      guest_type: g.guest_type === 'child' ? 'child' : 'adult',
      notes: clean(g.notes, 500),
    })).filter((g: any) => g.first_name || g.last_name);
    console.log('✅ parse-guest-notes:', guests.length, 'guests');
    return jsonResponse({ guests });
  } catch (error) {
    console.error('❌ parse-guest-notes failed:', error);
    return jsonResponse({ error: (error as Error).message }, 500);
  }
});

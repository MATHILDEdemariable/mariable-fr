// Transforme une note texte libre en étapes de rétroplanning (titre, date, période, catégorie)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { noteText, weddingDate, language } = await req.json();
    const isEnglish = language === 'en';
    if (!noteText || typeof noteText !== 'string' || noteText.trim().length < 3 || noteText.length > 8000) {
      return jsonResponse({ error: isEnglish ? 'Note is empty or too long' : 'Note vide ou trop longue' }, 400);
    }
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) return jsonResponse({ error: 'LOVABLE_API_KEY not configured' }, 500);

    const today = new Date().toISOString().slice(0, 10);
    const instructions = `Tu es wedding planner. Transforme la note en étapes de rétroplanning.
Date du jour : ${today}. Date du mariage : ${weddingDate || 'inconnue'}.
Pour chaque étape : title (court, verbe d'action), date (yyyy-MM-dd calculée depuis la date du mariage si possible, sinon ""), period (ex. "J-6 mois", "J-2 semaines", "Jour J"), category (ex. Lieu, Traiteur, Photo, Tenue, Invités, Administratif, Déco, Musique), note (détail utile ou ""), stakeholder (qui s'en charge, UNIQUEMENT parmi : planner, couple, bride, groom, parents, witnesses, ou "" si non précisé).
Si la note est vague, propose des étapes réalistes. 30 étapes maximum. Langue de sortie : ${isEnglish ? 'anglais' : 'français'}.
Réponds UNIQUEMENT avec un JSON : {"steps":[{"title":"","date":"","period":"","category":"","note":"","stakeholder":""}]}`;

    const upstream = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST',
      signal: req.signal,
      headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'fetch' },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        instructions,
        input: noteText,
        stream: true,
        store: false,
        reasoning: { effort: 'low', summary: 'auto' },
        include: ['reasoning.encrypted_content'],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const errorText = await upstream.text();
      console.error('❌ AI Gateway error:', upstream.status, errorText);
      const message = upstream.status === 429
        ? (isEnglish ? 'Too many requests, try again shortly.' : 'Trop de demandes, réessayez dans un instant.')
        : upstream.status === 402
          ? (isEnglish ? 'AI credits exhausted.' : 'Crédits IA épuisés.')
          : (isEnglish ? 'AI service unavailable.' : 'Service IA indisponible.');
      return jsonResponse({ error: message }, upstream.status);
    }

    // Lecture du flux SSE et accumulation du texte final
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let outputText = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
          const event = JSON.parse(payload);
          if (event.type === 'response.output_text.delta') outputText += event.delta ?? '';
        } catch { /* ligne partielle ignorée */ }
      }
    }

    const jsonMatch = outputText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON in AI output');
      return jsonResponse({ error: isEnglish ? 'AI returned no steps.' : "L'IA n'a renvoyé aucune étape." }, 502);
    }
    const parsed = JSON.parse(jsonMatch[0]);
    const steps = (Array.isArray(parsed.steps) ? parsed.steps : []).slice(0, 30).map((step: any) => ({
      title: String(step.title ?? '').slice(0, 200),
      date: /^\d{4}-\d{2}-\d{2}$/.test(step.date ?? '') ? step.date : '',
      period: String(step.period ?? '').slice(0, 50),
      category: String(step.category ?? '').slice(0, 80),
      note: String(step.note ?? '').slice(0, 1000),
      stakeholder: ['planner', 'couple', 'bride', 'groom', 'parents', 'witnesses'].includes(step.stakeholder) ? step.stakeholder : '',
    })).filter((step: any) => step.title);

    console.log('✅ parse-retroplanning-notes:', steps.length, 'steps');
    return jsonResponse({ steps });
  } catch (error) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    console.error('❌ parse-retroplanning-notes failed:', error);
    return jsonResponse({ error: (error as Error).message }, 500);
  }
});

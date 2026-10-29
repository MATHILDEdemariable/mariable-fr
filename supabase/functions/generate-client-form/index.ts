// Transforme un texte libre (notes, liste de questions) en formulaire client structuré
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const QUESTION_TYPES = ['short', 'long', 'date', 'time', 'number', 'choice', 'multi'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { sourceText, language } = await req.json();
    const isEnglish = language === 'en';
    if (!sourceText || typeof sourceText !== 'string' || sourceText.trim().length < 3 || sourceText.length > 8000) {
      return jsonResponse({ error: isEnglish ? 'Text is empty or too long' : 'Texte vide ou trop long' }, 400);
    }
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) return jsonResponse({ error: 'LOVABLE_API_KEY not configured' }, 500);

    const instructions = `Tu es wedding planner. À partir du texte, crée un formulaire à envoyer à un couple pour cadrer son mariage.
Retourne : title (court), intro (1-2 phrases chaleureuses), questions (40 max). Chaque question : section (rubrique courte, ex. "Le mariage", "Budget", "Style"), label (question claire), type parmi ${QUESTION_TYPES.join(', ')} (short=réponse courte, long=paragraphe, choice=choix unique, multi=choix multiples), options (tableau de choix si choice/multi, sinon []), required (booléen).
Si le texte est vague, propose des questions pertinentes. Langue de sortie : ${isEnglish ? 'anglais' : 'français'}.
Réponds UNIQUEMENT avec un JSON : {"title":"","intro":"","questions":[{"section":"","label":"","type":"short","options":[],"required":false}]}`;

    const upstream = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST',
      signal: req.signal,
      headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'fetch' },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        instructions,
        input: sourceText,
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
      return jsonResponse({ error: isEnglish ? 'AI returned no form.' : "L'IA n'a renvoyé aucun formulaire." }, 502);
    }
    const parsed = JSON.parse(jsonMatch[0]);
    const questions = (Array.isArray(parsed.questions) ? parsed.questions : []).slice(0, 40).map((question: any) => {
      const type = QUESTION_TYPES.includes(question.type) ? question.type : 'short';
      const options = (Array.isArray(question.options) ? question.options : []).map((option: unknown) => String(option).slice(0, 120)).filter(Boolean).slice(0, 20);
      return {
        section: String(question.section ?? '').slice(0, 80),
        label: String(question.label ?? '').slice(0, 300),
        type: (type === 'choice' || type === 'multi') && options.length === 0 ? 'short' : type,
        options: type === 'choice' || type === 'multi' ? options : undefined,
        required: question.required === true,
      };
    }).filter((question: any) => question.label);

    console.log('✅ generate-client-form:', questions.length, 'questions');
    return jsonResponse({ title: String(parsed.title ?? '').slice(0, 200), intro: String(parsed.intro ?? '').slice(0, 1000), questions });
  } catch (error) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    console.error('❌ generate-client-form failed:', error);
    return jsonResponse({ error: (error as Error).message }, 500);
  }
});

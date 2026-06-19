import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { weddingDate, language } = await req.json();
    const lang = language === 'en' ? 'en' : 'fr';

    
    if (!weddingDate) {
      throw new Error('Wedding date is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const currentDate = new Date().toISOString().split('T')[0];
    
    console.log('🎯 Génération rétroplanning pour:', { weddingDate, currentDate });

    const systemPromptFR = `Tu es un expert en organisation de mariages. Tu dois créer un rétroplanning détaillé, dynamique et actionnable pour un mariage.

IMPORTANT: Le rétroplanning doit être DYNAMIQUE - toutes les dates doivent être calculées en fonction de la date du mariage et s'ajuster automatiquement.

Date du mariage: ${weddingDate}
Date actuelle: ${currentDate}

Tu dois retourner un JSON structuré avec:

1. "timeline": Un tableau de périodes avec:
   - "period": nom de la période (ex: "12-9 mois avant", "J-3 mois")
   - "monthsBefore": nombre de mois avant le mariage (pour calcul dynamique)
   - "tasks": tableau de tâches à accomplir pendant cette période
   - "priority": "high", "medium" ou "low"

2. "categories": Un tableau de catégories avec:
   - "name": nom de la catégorie
   - "color": couleur hex
   - "tasks": tableau de tâches spécifiques
   - "completed": false par défaut
   - "dueMonthsBefore": mois avant le mariage

3. "milestones": Un tableau d'étapes clés avec:
   - "title": titre de l'étape
   - "date": calculée dynamiquement
   - "description": description
   - "monthsBefore": mois avant le mariage

Crée un rétroplanning COMPLET avec au moins 8 périodes, 10 catégories et 15 étapes clés. Tout le texte doit être en FRANÇAIS.`;

    const systemPromptEN = `You are a wedding planning expert. You must create a detailed, dynamic and actionable retroplanning for a wedding.

IMPORTANT: The retroplanning must be DYNAMIC - all dates must be calculated based on the wedding date and adjust automatically.

Wedding date: ${weddingDate}
Current date: ${currentDate}

You must return a structured JSON with:

1. "timeline": An array of periods with:
   - "period": period name (e.g. "12-9 months before", "3 months out")
   - "monthsBefore": number of months before the wedding (for dynamic calculation)
   - "tasks": array of tasks to complete during this period
   - "priority": "high", "medium" or "low"

2. "categories": An array of categories with:
   - "name": category name
   - "color": hex color
   - "tasks": array of specific tasks
   - "completed": false by default
   - "dueMonthsBefore": months before the wedding

3. "milestones": An array of key milestones with:
   - "title": milestone title
   - "date": dynamically calculated
   - "description": description
   - "monthsBefore": months before the wedding

Create a COMPLETE retroplanning with at least 8 periods, 10 categories and 15 milestones. All text must be in ENGLISH.`;

    const systemPrompt = lang === 'en' ? systemPromptEN : systemPromptFR;
    const userMsg = lang === 'en'
      ? 'Generate a complete and detailed retroplanning for this wedding.'
      : 'Génère un rétroplanning complet et détaillé pour ce mariage.';


    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMsg }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Limite de requêtes atteinte. Veuillez réessayer plus tard.');
      }
      if (response.status === 402) {
        throw new Error('Crédits insuffisants. Veuillez ajouter des crédits à votre workspace.');
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const retroplanning = JSON.parse(jsonMatch[0]);
    
    console.log('✅ Rétroplanning généré avec succès');

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: retroplanning 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
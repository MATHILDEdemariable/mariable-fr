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
    const { weddingDate } = await req.json();
    
    if (!weddingDate) {
      throw new Error('Wedding date is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const currentDate = new Date().toISOString().split('T')[0];
    
    console.log('🎯 Génération rétroplanning pour:', { weddingDate, currentDate });

    const systemPrompt = `Tu es un expert en organisation de mariages. Tu dois créer un rétroplanning détaillé, dynamique et actionnable pour un mariage.

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

Structure JSON attendue:
{
  "timeline": [
    {
      "period": "12-9 mois avant",
      "monthsBefore": 12,
      "tasks": ["Définir le budget", "Choisir la date", "Liste des invités"],
      "priority": "high"
    }
  ],
  "categories": [
    {
      "name": "Budget & Administration",
      "color": "#10b981",
      "tasks": ["Établir le budget global", "Ouvrir un compte dédié"],
      "completed": false,
      "dueMonthsBefore": 12
    }
  ],
  "milestones": [
    {
      "title": "Réservation lieu",
      "monthsBefore": 12,
      "description": "Réserver le lieu de réception"
    }
  ]
}

Crée un rétroplanning COMPLET avec au moins 8 périodes, 10 catégories et 15 étapes clés.`;

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
          { role: 'user', content: 'Génère un rétroplanning complet et détaillé pour ce mariage.' }
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
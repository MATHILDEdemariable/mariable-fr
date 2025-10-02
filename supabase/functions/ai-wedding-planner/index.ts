
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scenario, weddingDate, guestCount, ceremonyTime } = await req.json();

    console.log('🎯 Processing wedding scenario:', { scenario, weddingDate, guestCount, ceremonyTime });

    const systemPrompt = `Tu es un wedding planner expert avec 15 ans d'expérience en logistique événementielle. 

Ton rôle est d'analyser le scénario de mariage fourni et de créer un planning détaillé et personnalisé pour le jour J et éventuellement J-1.

INSTRUCTIONS IMPORTANTES :
- Analyse le scénario utilisateur pour comprendre ses priorités et contraintes
- Propose un planning cohérent avec des horaires réalistes
- Inclus les préparatifs J-1 si nécessaire (décoration, livraisons, etc.)
- Assigne chaque tâche à un rôle approprié (Mariés, Témoins, Wedding Planner, Prestataires, etc.)
- Respecte les catégories : Arrivée, Préparation, Cérémonie, Cocktail, Réception, Animation, Photos/Vidéos, Logistique, Autre
- Donne des durées réalistes en minutes
- Priorise selon l'importance : high, medium, low

FORMAT DE RÉPONSE ATTENDU (JSON uniquement) :
{
  "tasks": [
    {
      "title": "Titre de la tâche",
      "description": "Description détaillée",
      "start_time": "HH:MM",
      "duration": 60,
      "category": "Préparation",
      "priority": "high",
      "assigned_role": "Mariés",
      "day": "J" ou "J-1",
      "notes": "Conseils personnalisés"
    }
  ],
  "summary": "Résumé du planning avec conseils généraux"
}

RÔLES DISPONIBLES : Mariés, Témoin(s), Famille proche, Wedding Planner, Photographe, Vidéaste, DJ/Musiciens, Traiteur, Fleuriste, Coiffeur/Maquilleur, Célébrant, Responsable lieu, Sécurité, Transport, Autre

CATÉGORIES : Arrivée, Préparation, Cérémonie, Cocktail, Réception, Animation, Photos/Vidéos, Logistique, Autre`;

    const userPrompt = `Scénario de mariage à analyser :
"${scenario}"

Informations complémentaires :
- Date du mariage : ${weddingDate || 'Non spécifiée'}
- Nombre d'invités : ${guestCount || 'Non spécifié'}
- Heure de cérémonie : ${ceremonyTime || 'Non spécifiée'}

Crée un planning personnalisé basé sur ce scénario. Sois créatif mais pragmatique !`;

    console.log('🤖 Calling Lovable AI Gateway with wedding planner prompt');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('❌ Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte, veuillez réessayer dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('❌ Payment required');
        return new Response(
          JSON.stringify({ error: 'Crédits épuisés, veuillez recharger votre compte Lovable AI.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error('❌ Lovable AI Gateway error:', response.status, response.statusText);
      throw new Error(`Lovable AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Lovable AI response received');

    const aiResponse = data.choices[0].message.content;
    
    // Parse JSON response from AI
    let planningData;
    try {
      planningData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError);
      // Fallback: try to extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planningData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    console.log('🎉 Generated planning with', planningData.tasks?.length || 0, 'tasks');

    return new Response(JSON.stringify(planningData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in ai-wedding-planner function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de la génération du planning', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

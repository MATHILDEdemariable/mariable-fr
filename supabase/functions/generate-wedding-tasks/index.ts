
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { coordinationId, existingTasks = [] } = await req.json();
    
    console.log('Generating wedding tasks for coordination:', coordinationId);
    console.log('Existing tasks to avoid:', existingTasks);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const existingTasksText = existingTasks.length > 0 
      ? `Évite de proposer des tâches similaires à celles déjà existantes : ${existingTasks.join(', ')}.`
      : '';

    const prompt = `Tu es un expert en organisation de mariages. Génère 6 tâches spécifiques et pratiques pour le planning du jour J d'un mariage.

${existingTasksText}

Pour chaque tâche, fournis :
- Un titre court et précis
- Une description détaillée de 20-30 mots
- Une durée réaliste en minutes
- Une catégorie parmi : ceremonie, reception, photos, musique, fleurs, transport, preparation, coordination, general
- Une priorité : low, medium, high

Varie les catégories et les priorités. Concentre-toi sur des tâches concrètes et actionnables.

Réponds uniquement avec un JSON valide de ce format :
{
  "suggestions": [
    {
      "title": "Titre de la tâche",
      "description": "Description détaillée",
      "duration": 30,
      "category": "ceremonie",
      "priority": "high"
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un expert en organisation de mariages qui génère des suggestions de tâches pratiques et réalistes pour le jour J.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    try {
      const parsedResponse = JSON.parse(aiResponse);
      
      // Validation de la structure
      if (!parsedResponse.suggestions || !Array.isArray(parsedResponse.suggestions)) {
        throw new Error('Invalid AI response structure');
      }

      // Validation de chaque suggestion
      const validSuggestions = parsedResponse.suggestions.filter((suggestion: any) => {
        return suggestion.title && 
               suggestion.description && 
               typeof suggestion.duration === 'number' &&
               suggestion.category &&
               suggestion.priority;
      });

      console.log(`Generated ${validSuggestions.length} valid suggestions`);

      return new Response(JSON.stringify({ 
        suggestions: validSuggestions.slice(0, 6) // Limiter à 6 suggestions max
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw AI response:', aiResponse);
      
      // Fallback avec des suggestions statiques
      const fallbackSuggestions = [
        {
          title: "Répétition générale",
          description: "Répétition complète de la cérémonie avec tous les participants",
          duration: 60,
          category: "ceremonie",
          priority: "high"
        },
        {
          title: "Installation des décorations florales",
          description: "Mise en place des compositions florales sur les tables et l'autel",
          duration: 90,
          category: "fleurs",
          priority: "medium"
        },
        {
          title: "Test du système sonore",
          description: "Vérification complète du matériel audio et micro sans-fil",
          duration: 30,
          category: "musique",
          priority: "high"
        }
      ];
      
      return new Response(JSON.stringify({ suggestions: fallbackSuggestions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-wedding-tasks function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      suggestions: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

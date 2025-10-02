import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { text, userId } = await req.json();

    if (!text || !userId) {
      return new Response(
        JSON.stringify({ error: 'Text and userId are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call Lovable AI Gateway
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: 'Lovable API key not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const prompt = `En tant qu'expert wedding planner avec 15 ans d'expérience dans l'organisation de mariages de luxe, génère une to-do list structurée et catégorisée avec des icônes visuelles pour ce projet de mariage.

Texte du client: "${text}"

Catégories disponibles avec icônes:
📋 Administratif - Papiers, assurances, autorisations
💒 Cérémonie - Église, officiant, décoration cérémonie  
🎉 Réception - Lieu, décoration, organisation
👗 Tenue - Robe, costume, accessoires
📸 Photos & Vidéo - Photographe, vidéaste, planning
🍰 Traiteur - Menu, dégustation, service
🎵 Animation - DJ, musiciens, playlist
🚗 Transport - Voiture, navettes invités
👨‍👩‍👧‍👦 Invités - Liste, faire-part, hébergement
💐 Fleurs & Déco - Bouquet, centres de table, déco
💍 Alliances - Choix, gravure, essayage
🏨 Lune de Miel - Réservation, passeports

Réponds UNIQUEMENT avec un JSON valide dans ce format:
{
  "title": "Planning personnalisé de [Prénom]",
  "tasks": [
    {
      "id": "task-1", 
      "label": "Titre précis de la tâche",
      "description": "Description détaillée avec conseils d'expert",
      "priority": "high|medium|low",
      "category": "Nom de la catégorie",
      "icon": "emoji de la catégorie"
    }
  ]
}

Règles strictes:
- Maximum 12 tâches essentielles 
- Priorité HIGH: urgent et bloquant (3-4 tâches max)
- Priorité MEDIUM: important mais flexible timing (5-6 tâches)
- Priorité LOW: nice-to-have, peut attendre (2-3 tâches)
- Tâches concrètes et actionnables avec échéances implicites
- Descriptions avec conseils de pro et timing recommandé
- Une seule catégorie par tâche
- JSON valide uniquement, pas de formatage markdown`;

    console.log('🚀 Calling Lovable AI Gateway...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Tu es un expert en organisation de mariage. Tu génères des checklists pratiques et structurées.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
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

    const aiData = await response.json();
    console.log('✅ Lovable AI response received');

    const generatedContent = aiData.choices[0].message.content;
    
    // Parse the JSON response from AI
    let parsedTasks;
    try {
      parsedTasks = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }

    // Save to database
    const { data: checklist, error: dbError } = await supabase
      .from('planning_avant_jour_j')
      .insert({
        user_id: userId,
        title: parsedTasks.title || 'Ma checklist personnalisée',
        original_text: text,
        tasks: parsedTasks.tasks || [],
        completed_tasks: [],
        category: 'AI Générée',
        icon: '🤖'
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error('Failed to save checklist');
    }

    console.log('✅ Checklist saved successfully');

    return new Response(
      JSON.stringify({ checklist }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in generate-checklist-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
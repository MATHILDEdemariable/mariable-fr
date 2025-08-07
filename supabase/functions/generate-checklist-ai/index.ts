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

    // Call OpenAI API
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const prompt = `Analyse ce texte d'un futur marié et génère une checklist de tâches structurée pour préparer son mariage. Le texte: "${text}"

Réponds UNIQUEMENT avec un JSON valide dans ce format:
{
  "title": "Titre de la checklist",
  "tasks": [
    {
      "id": "task-1",
      "label": "Titre de la tâche",
      "description": "Description optionnelle",
      "priority": "high|medium|low"
    }
  ]
}

Règles:
- Maximum 15 tâches
- Priorités: high pour l'urgent, medium pour l'important, low pour le nice-to-have
- Tâches concrètes et actionnables
- Pas de formatage markdown
- JSON valide uniquement`;

    console.log('🚀 Calling OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un expert en organisation de mariage. Tu génères des checklists pratiques et structurées.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      console.error('❌ OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    console.log('✅ OpenAI response received');

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
        completed_tasks: []
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
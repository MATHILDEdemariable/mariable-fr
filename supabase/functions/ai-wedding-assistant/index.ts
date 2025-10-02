import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      userMessage, 
      conversationHistory = [], 
      userId = null, 
      sessionId,
      shouldGeneratePlan = false
    } = await req.json();

    console.log('🤖 AI Wedding Assistant called:', { 
      userId, 
      sessionId, 
      messageLength: userMessage?.length,
      shouldGeneratePlan
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const today = new Date().toISOString().split('T')[0];
    
    // Vérifier quota
    const { data: usageData } = await supabaseClient
      .from('ai_usage_tracking')
      .select('*')
      .eq(userId ? 'user_id' : 'session_id', userId || sessionId)
      .eq('last_prompt_date', today)
      .maybeSingle();

    let promptsUsedToday = usageData?.prompts_used_today || 0;
    
    let maxPrompts = 1; // Anonyme
    
    if (userId) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('subscription_type')
        .eq('id', userId)
        .maybeSingle();
      
      if (profile?.subscription_type === 'premium') {
        maxPrompts = 999;
      } else {
        maxPrompts = 3;
      }
    }

    if (promptsUsedToday >= maxPrompts) {
      return new Response(
        JSON.stringify({
          error: 'LIMIT_REACHED',
          message: userId 
            ? 'Vous avez atteint votre limite quotidienne. Passez à Premium pour un accès illimité.'
            : 'Créez un compte gratuit pour continuer (3 prompts/jour gratuits)',
          requiresAuth: !userId,
          requiresPremium: userId && maxPrompts === 3
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429
        }
      );
    }

    // Prompt système
    const systemPrompt = `Tu es un wedding planner expert français avec 15 ans d'expérience. Tu aides les couples à organiser leur mariage de A à Z.

TES CONNAISSANCES :

BUDGET ET RÉPARTITION :
- Budget moyen France : 12 000 - 15 000€
- Lieu : 30-40% du budget
- Traiteur : 25-35% du budget (35-150€/pers selon standing)
- Photographe : 10-15% (800-7000€)
- Fleurs/déco : 8-12% (500-8000€)
- Animation DJ : 5-10% (400-3500€)
- Marge imprévus : 10% TOUJOURS

CALENDRIER TYPE :
- 12-18 mois avant : Réserver lieu + traiteur
- 9-12 mois : Photographe, DJ, démarches mairie
- 6-9 mois : Robe, costumes, fleuriste
- 3-6 mois : Faire-part, menu, essayages
- 1-3 mois : Décoration, plan de table
- Dernière semaine : Installation, briefing

TARIFS MOYENS PAR RÉGION :
- Paris : +20-30% vs moyenne
- Provence : +15-25% (haute saison)
- Autres régions : budget moyen

TON APPROCHE :
1. Poser des questions pour comprendre : date, région, invités, budget, style
2. Donner des conseils concrets et réalistes
3. Adapter selon région et budget
4. Être chaleureux et encourageant

Si tu as les infos (région + budget + catégorie), tu peux suggérer de consulter la sélection de prestataires Mariable.`;

    // Appel IA
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        temperature: 0.8,
        max_tokens: 1500
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Limite de requêtes IA atteinte. Réessayez dans quelques instants.');
      }
      throw new Error('Erreur lors de la génération de la réponse IA');
    }

    const aiData = await aiResponse.json();
    const assistantReply = aiData.choices?.[0]?.message?.content || 
      'Désolé, je n\'ai pas pu générer une réponse. Pouvez-vous reformuler votre question ?';

    // Générer le plan si demandé
    let onePager = null;
    let vendors = [];
    
    if (shouldGeneratePlan) {
      // Générer suggestions de prestataires
      const { data: vendorsData } = await supabaseClient
        .from('prestataires_rows')
        .select('*')
        .eq('visible', true)
        .limit(6);
      
      vendors = vendorsData || [];
      
      onePager = {
        timeline: [
          {
            period: '12-18 mois avant',
            tasks: ['Définir le budget', 'Réserver le lieu', 'Liste des invités']
          },
          {
            period: '6-9 mois avant',
            tasks: ['Traiteur', 'Photographe', 'DJ/Animation', 'Fleuriste']
          },
          {
            period: '3-6 mois avant',
            tasks: ['Faire-part', 'Menu définitif', 'Essayages tenues']
          },
          {
            period: '1 mois avant',
            tasks: ['Plan de table', 'Coordination finale', 'Installation déco']
          }
        ],
        budgetBreakdown: {
          'Lieu': 35,
          'Traiteur': 30,
          'Photographe': 12,
          'Fleurs': 10,
          'DJ': 8,
          'Divers': 5
        }
      };
    }

    // Sauvegarder conversation
    const updatedMessages = [
      ...conversationHistory,
      { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
      { role: 'assistant', content: assistantReply, timestamp: new Date().toISOString() }
    ];

    await supabaseClient
      .from('ai_wedding_conversations')
      .upsert({
        user_id: userId,
        session_id: sessionId,
        messages: updatedMessages,
        updated_at: new Date().toISOString()
      });

    // Incrémenter usage
    if (usageData) {
      await supabaseClient
        .from('ai_usage_tracking')
        .update({
          prompts_used_today: promptsUsedToday + 1,
          total_prompts: (usageData.total_prompts || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', usageData.id);
    } else {
      await supabaseClient
        .from('ai_usage_tracking')
        .insert({
          user_id: userId,
          session_id: sessionId,
          prompts_used_today: 1,
          total_prompts: 1,
          last_prompt_date: today
        });
    }

    return new Response(
      JSON.stringify({
        reply: assistantReply,
        onePager,
        vendors,
        usageInfo: {
          promptsUsedToday: promptsUsedToday + 1,
          maxPrompts: maxPrompts,
          remaining: maxPrompts - (promptsUsedToday + 1),
          requiresAuth: !userId && (promptsUsedToday + 1) >= maxPrompts,
          requiresPremium: userId && maxPrompts === 3 && (promptsUsedToday + 1) >= 3
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Error in AI Wedding Assistant:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Une erreur est survenue',
        reply: 'Je rencontre une difficulté technique. Pouvez-vous réessayer dans quelques instants ?'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
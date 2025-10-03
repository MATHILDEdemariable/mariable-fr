import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, sessionId, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

    // Récupérer l'historique de conversation
    let conversationHistory = [];
    if (conversationId) {
      const { data: conversation } = await supabase
        .from('vibe_wedding_conversations')
        .select('messages')
        .eq('id', conversationId)
        .single();
      
      if (conversation) {
        conversationHistory = conversation.messages || [];
      }
    }

    // Construire les messages pour l'IA
    const systemPrompt = `Tu es un expert en organisation de mariage. 
Quand l'utilisateur décrit son projet de mariage, extrais les informations clés : nombre d'invités, budget, localisation, date souhaitée, style/thème.

Réponds TOUJOURS en JSON structuré avec ce format exact :
{
  "summary": "Message chaleureux personnalisé résumant le projet",
  "weddingData": {
    "guests": nombre_invites_ou_null,
    "budget": montant_budget_euros_ou_null,
    "location": "ville_ou_region_ou_null",
    "date": "YYYY-MM-DD_ou_null",
    "style": "description_style_ou_null"
  },
  "budgetBreakdown": [
    {"category": "Lieu de réception", "percentage": 35, "amount": montant_calcule},
    {"category": "Traiteur", "percentage": 25, "amount": montant_calcule},
    {"category": "Décoration", "percentage": 15, "amount": montant_calcule},
    {"category": "Photographie", "percentage": 10, "amount": montant_calcule},
    {"category": "Musique", "percentage": 8, "amount": montant_calcule},
    {"category": "Divers", "percentage": 7, "amount": montant_calcule}
  ],
  "timeline": [
    {"task": "Définir la date et le lieu", "timeframe": "12-18 mois avant", "priority": "high", "category": "Organisation"},
    {"task": "Réserver les prestataires principaux", "timeframe": "10-12 mois avant", "priority": "high", "category": "Prestataires"},
    {"task": "Choisir les tenues", "timeframe": "8-10 mois avant", "priority": "medium", "category": "Préparation"},
    {"task": "Envoyer les faire-part", "timeframe": "6-8 mois avant", "priority": "medium", "category": "Communication"},
    {"task": "Finaliser la décoration", "timeframe": "3-4 mois avant", "priority": "medium", "category": "Décoration"},
    {"task": "Confirmer les détails avec prestataires", "timeframe": "1 mois avant", "priority": "high", "category": "Organisation"},
    {"task": "Essayages finaux", "timeframe": "2 semaines avant", "priority": "high", "category": "Préparation"},
    {"task": "Répétition générale", "timeframe": "1 semaine avant", "priority": "high", "category": "Logistique"}
  ]
}

Si l'utilisateur pose une question simple ou demande un ajustement, réponds en JSON avec seulement :
{
  "conversational": true,
  "message": "Ta réponse conversationnelle"
}

Calcule les montants du budget en fonction du budget total fourni. Si aucun budget n'est donné, utilise 25000 comme base.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('🚀 Calling Lovable AI Gateway...');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Crédit insuffisant. Veuillez contacter le support.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;
    
    console.log('✅ AI Response received');

    // Parser la réponse JSON
    let parsedResponse;
    try {
      // Nettoyer la réponse avant parsing (retirer les backticks markdown)
      let cleanedResponse = assistantMessage.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\n?/, '')
          .replace(/\n?```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse
          .replace(/^```\n?/, '')
          .replace(/\n?```$/, '');
      }
      
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('❌ Failed to parse AI response as JSON:', assistantMessage);
      parsedResponse = {
        conversational: true,
        message: assistantMessage
      };
    }

    // Mettre à jour ou créer la conversation
    const newMessages = [
      ...conversationHistory,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: assistantMessage, timestamp: new Date().toISOString() }
    ];

    let finalConversationId = conversationId;

    if (conversationId) {
      await supabase
        .from('vibe_wedding_conversations')
        .update({ 
          messages: newMessages,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    } else {
      const { data: newConv, error: convError } = await supabase
        .from('vibe_wedding_conversations')
        .insert({
          user_id: userId || null,
          session_id: sessionId,
          messages: newMessages,
          wedding_data: parsedResponse.weddingData || null
        })
        .select()
        .single();

      if (convError) {
        console.error('❌ Error creating conversation:', convError);
      } else {
        finalConversationId = newConv.id;
      }
    }

    // Si on a des données de mariage avec localisation, chercher des prestataires
    let vendors = [];
    if (parsedResponse.weddingData?.location && !parsedResponse.conversational) {
      const { data: vendorsData } = await supabase
        .from('prestataires_rows')
        .select('id, nom, categorie, ville, prix_min, prix_max, description, note_moyenne')
        .ilike('ville', `%${parsedResponse.weddingData.location}%`)
        .limit(6);
      
      if (vendorsData) {
        vendors = vendorsData;
      }
    }

    return new Response(
      JSON.stringify({
        response: parsedResponse,
        conversationId: finalConversationId,
        vendors
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in vibe-wedding-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

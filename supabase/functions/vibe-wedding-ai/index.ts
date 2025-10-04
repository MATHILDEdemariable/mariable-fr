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
    const { message, conversationId, sessionId, userId, currentProject } = await req.json();
    console.log('📨 Received request:', { conversationId, sessionId, userId, messageLength: message?.length, hasCurrentProject: !!currentProject });
    
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
        .from('ai_wedding_conversations')
        .select('messages')
        .eq('id', conversationId)
        .single();
      
      if (conversation) {
        conversationHistory = conversation.messages || [];
      }
    }

    // Construire les messages pour l'IA
    const systemPrompt = `Tu es un expert en organisation de mariage basé en France. Tu aides les futurs mariés à planifier leur mariage.

Tu as TROIS modes de réponse :

1. MODE INITIAL - Quand l'utilisateur décrit son projet pour la première fois :
{
  "conversational": false,
  "mode": "initial",
  "summary": "Message chaleureux personnalisé résumant le projet",
  "weddingData": {
    "guests": nombre_invités,
    "budget": budget_euros,
    "location": "ville, région",
    "date": "YYYY-MM-DD" ou null si non précisée,
    "style": "style du mariage"
  },
  "budgetBreakdown": [
    { "category": "Réception", "percentage": 40, "amount": montant, "description": "Détails" }
  ],
  "timeline": [
    { "task": "Tâche", "timeframe": "J-12 à J-9 mois", "priority": "high", "category": "Structurer l'univers du mariage + sécuriser les prestataires principaux", "description": "Détails" }
  ]
}

2. MODE UPDATE - Quand l'utilisateur demande un ajustement :
{
  "conversational": false,
  "mode": "update",
  "message": "Confirmation chaleureuse du changement",
  "updatedFields": {
    "weddingData": { "date": "2025-06-15" },
    "timeline": [ /* SEULEMENT si date change */ ]
  }
}

3. MODE CONVERSATIONNEL - Questions sans impact sur le projet :
{
  "conversational": true,
  "message": "Ta réponse conversationnelle"
}

RÈGLES POUR LE RETROPLANNING (IMPORTANT) :
- UN MARIAGE S'ORGANISE MAXIMUM 12 MOIS EN AVANCE
- Si date non fournie → DEMANDER : "Quelle est la date prévue de votre mariage ?"
- Le timeline doit suivre ces catégories et actions PRÉCISES :

**J-12 à J-9 mois : Structurer l'univers du mariage + sécuriser les prestataires principaux**
Actions : Finaliser liste invités, Définir ambiance/style, Réserver Photographe/Vidéaste/Traiteur/DJ, Commencer repérage tenues, Créer Save the Date, Utiliser outils Mariable.fr

**J-9 à J-6 mois : Avancer dans les choix artistiques et pratiques**
Actions : Réserver Fleuriste/Décorateur/Officiant, Envoyer faire-part, Lancer papeterie (menus, plans de table), Rechercher prestataires beauté, Démarrer démarches administratives mariage civil, Confirmer tenues mariés

**J-6 à J-3 mois : Décoration, logistique, derniers prestataires**
Actions : Commander wedding cake, Réserver transports et hébergements, Visite technique lieu, Finaliser dossier mariage civil, Préparer éléments déco personnalisés

**J-2 à J-1 mois : Ajustements finaux et coordination**
Actions : Reconfirmer tous prestataires, Rappel infos pratiques invités, Finaliser plan de table, Préparer livrets cérémonie, Essais coiffure/maquillage, Pause bien-être (EVJF/EVG)

**Le mois du mariage : Le Grand Mois !**
Actions : Récupérer tenues/accessoires/alliances, Préparer sac mariés & trousse secours, Derniers soins beauté, Briefer témoins, PROFITER du jour J ! 🥂

RÈGLES :
- Si date > 12 mois → timeline commence 12 mois avant
- Si date < 12 mois → adapter aux mois restants
- Utiliser EXACTEMENT les catégories ci-dessus dans le timeline
- Être chaleureux et encourageant

Tu dois TOUJOURS répondre en JSON :`;

    // Add current project context to system prompt if exists
    let enhancedSystemPrompt = systemPrompt;
    if (currentProject) {
      enhancedSystemPrompt += `\n\nPROJET ACTUEL DE L'UTILISATEUR :\n${JSON.stringify(currentProject, null, 2)}\n\nSi l'utilisateur demande une modification de ce projet, utilise le MODE UPDATE.`;
    }

    const messages = [
      { role: 'system', content: enhancedSystemPrompt },
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
        .from('ai_wedding_conversations')
        .update({ 
          messages: newMessages,
          wedding_context: !parsedResponse.conversational ? {
            summary: parsedResponse.summary,
            weddingData: parsedResponse.weddingData,
            budgetBreakdown: parsedResponse.budgetBreakdown,
            timeline: parsedResponse.timeline
          } : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    } else {
      const { data: newConv, error: convError } = await supabase
        .from('ai_wedding_conversations')
        .insert({
          user_id: userId || null,
          session_id: sessionId,
          messages: newMessages,
          wedding_data: parsedResponse.weddingData || null,
          wedding_context: !parsedResponse.conversational ? {
            summary: parsedResponse.summary,
            weddingData: parsedResponse.weddingData,
            budgetBreakdown: parsedResponse.budgetBreakdown,
            timeline: parsedResponse.timeline
          } : null
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

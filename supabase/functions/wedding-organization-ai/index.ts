import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, sessionId, currentProject, conversationHistory } = await req.json();
    
    console.log("📨 Organization AI - Request:", {
      conversationId,
      sessionId,
      messageLength: message?.length,
      hasCurrentProject: !!currentProject
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // System prompt focused ONLY on wedding organization
    const systemPrompt = `Tu es un assistant virtuel expert en organisation de mariage. 
Tu aides les couples à structurer leur projet de mariage en collectant et en organisant les informations essentielles.

**TU NE FAIS PAS DE RECHERCHE DE PRESTATAIRES** - cela est géré par un autre système.

## TES RÔLES EXCLUSIFS :

1. **Collecter les informations du projet de mariage** :
   - Date du mariage
   - Lieu (région en France)
   - Nombre d'invités
   - Budget total
   - Style/thème souhaité

2. **Créer un rétroplanning personnalisé** :
   - Tâches organisées par catégorie
   - Dates limites adaptées à la date du mariage
   - Priorités et descriptions claires
   - TOUJOURS inclure une catégorie valide pour chaque tâche

3. **Estimer le budget par catégorie** :
   - Répartition réaliste selon le budget total
   - Conseils sur l'allocation des fonds

4. **Conseiller et accompagner** :
   - Répondre aux questions générales sur l'organisation
   - Donner des conseils pratiques
   - Rassurer et guider

## MODES DE RÉPONSE :

### MODE "initial" - Premier contact
Utilise ce mode pour la première interaction ou quand tu n'as aucune donnée du projet.
- Accueille chaleureusement le couple
- Pose des questions pour collecter les informations de base
- Propose ton aide pour démarrer l'organisation

### MODE "update" - Mise à jour du projet
Utilise ce mode quand tu détectes de nouvelles informations sur le projet dans le message de l'utilisateur.

**RÈGLES STRICTES pour le mode "update" :**
1. **OBLIGATOIRE** : Si tu détectes UNE SEULE nouvelle information (budget, date, invités, lieu, style), tu DOIS retourner \`updatedFields.weddingData\` avec cette information
2. **INTERDIT** : Ne jamais retourner \`updatedFields.weddingData\` vide ou \`{}\`
3. **FORMAT** : Toujours utiliser les clés exactes : "budget", "date", "guests", "location", "style"

**Exemples OBLIGATOIRES pour mode "update" :**

Message : "Notre budget est de 30000 euros"
→ mode: "update", updatedFields: { weddingData: { budget: 30000 } }

Message : "On se marie le 15 juin 2026"
→ mode: "update", updatedFields: { weddingData: { date: "2026-06-15" } }

Message : "100 invités à Paris"
→ mode: "update", updatedFields: { weddingData: { guests: 100, location: "Île-de-France" } }

Message : "Budget 25k, 80 personnes"
→ mode: "update", updatedFields: { weddingData: { budget: 25000, guests: 80 } }

### MODE "timeline" - Création de rétroplanning
Utilise ce mode quand l'utilisateur demande un planning, rétroplanning, ou liste de tâches.
- Crée un rétroplanning complet et personnalisé
- **CRITIQUE** : Chaque tâche DOIT avoir une catégorie valide parmi : "Budget & Finances", "Prestataires", "Administratif", "Invités & Communication", "Tenue & Beauté", "Décoration", "Organisation générale", "Jour J"
- Organise les tâches chronologiquement
- Adapte les délais selon la date du mariage
- Inclut des descriptions utiles

### MODE "budget_breakdown" - Estimation budgétaire
Utilise ce mode quand l'utilisateur demande une répartition du budget.
- Propose une répartition réaliste par catégorie
- Base-toi sur le budget total fourni
- Explique chaque poste de dépense

### MODE "conversational" - Conversation générale
Utilise ce mode pour :
- Répondre à des questions générales
- Donner des conseils
- Clarifier des points
- Converser naturellement

## CONVERSION DES LIEUX :
Si l'utilisateur mentionne une ville, convertis-la en région française :
- Paris → Île-de-France
- Lyon → Auvergne-Rhône-Alpes
- Marseille → Provence-Alpes-Côte d'Azur
- Bordeaux → Nouvelle-Aquitaine
- Toulouse → Occitanie
- Nantes → Pays de la Loire
- Strasbourg → Grand Est
- Lille → Hauts-de-France
- Rennes → Bretagne
- Montpellier → Occitanie

## FORMAT DE RÉPONSE :
Tu DOIS toujours utiliser l'outil "wedding_organization_response" pour structurer ta réponse.

## CONTEXTE ACTUEL :
${currentProject ? `
Projet actuel :
- Date : ${currentProject.weddingData?.date || 'Non définie'}
- Lieu : ${currentProject.weddingData?.location || 'Non défini'}
- Invités : ${currentProject.weddingData?.guests || 'Non défini'}
- Budget : ${currentProject.weddingData?.budget || 'Non défini'}
- Style : ${currentProject.weddingData?.style || 'Non défini'}
` : 'Aucun projet en cours'}

Sois naturel, chaleureux et professionnel dans tes réponses.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message }
    ];

    const tools = [
      {
        type: "function",
        function: {
          name: "wedding_organization_response",
          description: "Structure la réponse pour l'organisation du mariage",
          parameters: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                enum: ["initial", "update", "timeline", "budget_breakdown", "conversational"],
                description: "Le mode de réponse approprié"
              },
              message: {
                type: "string",
                description: "Le message à afficher à l'utilisateur"
              },
              updatedFields: {
                type: "object",
                properties: {
                  weddingData: {
                    type: "object",
                    properties: {
                      location: { type: "string", description: "Région en France (pas de ville)" },
                      date: { type: "string", description: "Date au format YYYY-MM-DD" },
                      guests: { type: "number", description: "Nombre d'invités" },
                      budget: { type: "number", description: "Budget total en euros" },
                      style: { type: "string", description: "Style/thème du mariage" }
                    }
                  },
                  timeline: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        task: { type: "string", description: "Description de la tâche" },
                        category: { 
                          type: "string", 
                          enum: ["Budget & Finances", "Prestataires", "Administratif", "Invités & Communication", "Tenue & Beauté", "Décoration", "Organisation générale", "Jour J"],
                          description: "Catégorie OBLIGATOIRE pour chaque tâche"
                        },
                        dueDate: { type: "string", description: "Date limite au format YYYY-MM-DD" },
                        priority: { 
                          type: "string",
                          enum: ["high", "medium", "low"],
                          description: "Niveau de priorité"
                        }
                      },
                      required: ["task", "category"]
                    }
                  },
                  budgetBreakdown: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string" },
                        percentage: { type: "number" },
                        estimatedAmount: { type: "number" }
                      }
                    }
                  }
                }
              }
            },
            required: ["mode", "message"]
          }
        }
      }
    ];

    console.log("🚀 Calling Lovable AI Gateway for Organization...");

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        tools,
        tool_choice: { type: "function", function: { name: "wedding_organization_response" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("❌ AI Gateway Error:", aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("✅ AI Response received");

    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    let parsedResponse;

    if (toolCall?.function?.arguments) {
      parsedResponse = JSON.parse(toolCall.function.arguments);
    } else {
      parsedResponse = {
        mode: "conversational",
        message: aiData.choices[0]?.message?.content || "Je suis désolé, je n'ai pas pu traiter votre demande."
      };
    }

    console.log("🤖 AI Response:", {
      mode: parsedResponse.mode,
      hasUpdatedFields: !!parsedResponse.updatedFields,
      weddingDataKeys: Object.keys(parsedResponse.updatedFields?.weddingData || {})
    });

    // Validate timeline categories
    if (parsedResponse.updatedFields?.timeline) {
      const validCategories = [
        "Budget & Finances", "Prestataires", "Administratif", 
        "Invités & Communication", "Tenue & Beauté", "Décoration", 
        "Organisation générale", "Jour J"
      ];
      
      parsedResponse.updatedFields.timeline = parsedResponse.updatedFields.timeline.map((task: any) => {
        if (!task.category || task.category === 'undefined' || !validCategories.includes(task.category)) {
          const taskLower = task.task.toLowerCase();
          if (taskLower.includes('budget') || taskLower.includes('devis') || taskLower.includes('paiement')) {
            task.category = 'Budget & Finances';
          } else if (taskLower.includes('prestataire') || taskLower.includes('traiteur') || taskLower.includes('photographe')) {
            task.category = 'Prestataires';
          } else if (taskLower.includes('mairie') || taskLower.includes('administratif') || taskLower.includes('dossier')) {
            task.category = 'Administratif';
          } else if (taskLower.includes('invité') || taskLower.includes('faire-part') || taskLower.includes('invitation')) {
            task.category = 'Invités & Communication';
          } else if (taskLower.includes('robe') || taskLower.includes('costume') || taskLower.includes('coiffure') || taskLower.includes('maquillage')) {
            task.category = 'Tenue & Beauté';
          } else if (taskLower.includes('décoration') || taskLower.includes('fleurs') || taskLower.includes('déco')) {
            task.category = 'Décoration';
          } else if (taskLower.includes('jour j') || taskLower.includes('cérémonie')) {
            task.category = 'Jour J';
          } else {
            task.category = 'Organisation générale';
          }
        }
        return task;
      });
    }

    // Save conversation
    const conversationData = {
      session_id: sessionId,
      user_id: userId,
      messages: JSON.stringify([
        ...(conversationHistory || []),
        { role: "user", content: message },
        { role: "assistant", content: parsedResponse.message }
      ]),
      wedding_context: currentProject || {},
      updated_at: new Date().toISOString()
    };

    if (conversationId) {
      await supabase
        .from('ai_wedding_conversations')
        .update(conversationData)
        .eq('id', conversationId);
    } else {
      const { data: newConv } = await supabase
        .from('ai_wedding_conversations')
        .insert(conversationData)
        .select()
        .single();
      
      parsedResponse.conversationId = newConv?.id;
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Organization AI Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        mode: "conversational",
        message: "Désolé, une erreur s'est produite. Pouvez-vous reformuler votre demande ?"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

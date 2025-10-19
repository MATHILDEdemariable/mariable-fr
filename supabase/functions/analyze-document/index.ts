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
    const { documentId, fileUrl, documentType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY non configurée');
    }

    const prompts: Record<string, string> = {
      'devis': `Analyse ce devis de mariage et fournis:
1. Résumé général (2-3 phrases)
2. Montant total TTC
3. Principales prestations incluses
4. Points d'attention ou clauses importantes
5. Date de validité du devis

Format ta réponse en JSON avec les clés: summary, total_amount, services, notes, validity_date`,
      
      'contrat': `Analyse ce contrat de mariage et fournis:
1. Résumé des obligations principales
2. Conditions de paiement
3. Conditions d'annulation
4. Dates importantes
5. Points d'attention juridiques

Format ta réponse en JSON avec les clés: summary, payment_terms, cancellation, dates, legal_notes`,
      
      'facture': `Analyse cette facture et fournis:
1. Résumé
2. Montant total
3. Date d'émission
4. Date d'échéance
5. Statut de paiement apparent

Format ta réponse en JSON avec les clés: summary, amount, issue_date, due_date, payment_status`,
      
      'autre': `Analyse ce document de mariage et fournis un résumé structuré des informations principales en JSON.`
    };

    const prompt = prompts[documentType] || prompts['autre'];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un assistant spécialisé dans l\'analyse de documents de mariage. Réponds uniquement en JSON valide.' 
          },
          { 
            role: 'user', 
            content: `${prompt}\n\nAnalyse ce document: ${fileUrl}` 
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Erreur API Lovable AI');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      parsedResponse = { summary: aiResponse };
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    await fetch(`${supabaseUrl}/rest/v1/wedding_documents?id=eq.${documentId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ai_summary: parsedResponse.summary || 'Analyse non disponible',
        ai_key_points: parsedResponse,
        is_analyzed: true
      })
    });

    return new Response(JSON.stringify({ success: true, analysis: parsedResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur analyse document:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

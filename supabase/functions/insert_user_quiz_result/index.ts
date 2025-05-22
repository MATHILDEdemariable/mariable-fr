
// Insert a new quiz result
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Extract the parameters from the request
    const { 
      p_user_id, 
      p_email, 
      p_score, 
      p_status, 
      p_level, 
      p_objectives, 
      p_categories 
    } = await req.json();

    // Check if either user_id or email is provided
    if (!p_user_id && !p_email) {
      return new Response(
        JSON.stringify({ error: 'Either user_id or email is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Insert the quiz result
    const { data, error } = await supabaseClient
      .from('user_quiz_results')
      .insert({
        user_id: p_user_id,
        email: p_email,
        score: p_score,
        status: p_status,
        level: p_level,
        objectives: p_objectives,
        categories: p_categories
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})

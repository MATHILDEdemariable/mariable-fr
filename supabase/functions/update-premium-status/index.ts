import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const user = userData.user;

    // Mettre à jour le profil utilisateur pour le rendre premium
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        subscription_type: 'premium',
        subscription_expires_at: null // Premium à vie pour l'instant
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`✅ User ${user.id} upgraded to premium successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Statut premium activé avec succès" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("❌ Error updating premium status:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erreur lors de la mise à jour du statut premium" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
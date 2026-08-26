
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🔄 Update premium status function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupérer le session ID depuis le body
    let sessionId;
    
    if (req.method === 'POST') {
      const body = await req.json();
      sessionId = body.session_id || body.sessionId;
      console.log('📋 Body received:', JSON.stringify(body, null, 2));
    }
    
    console.log('📋 Session ID:', sessionId);
    
    if (!sessionId) {
      console.error('❌ Session ID manquant');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Session ID manquant' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('❌ STRIPE_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Configuration Stripe manquante' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    console.log('🔍 Verifying Stripe session...');
    
    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer']
    });
    
    console.log('💳 Session status:', session.payment_status);
    console.log('💳 Session mode:', session.mode);
    console.log('👤 Customer email:', session.customer_details?.email);
    
    if (session.payment_status !== 'paid') {
      console.error('❌ Paiement non confirmé, statut:', session.payment_status);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Paiement non confirmé' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get customer email from session
    const customerEmail = session.customer_details?.email;
    if (!customerEmail) {
      console.error('❌ Email du customer non trouvé');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email du customer non trouvé' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log('🔍 Looking for user with email:', customerEmail);

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Priorité : identifiant utilisateur transmis dans les métadonnées du checkout
    let user = null;
    const metadataUserId = (session.metadata as Record<string, string> | null)?.userId || session.client_reference_id;
    if (metadataUserId) {
      const { data: userById, error: userByIdError } = await supabaseService.auth.admin.getUserById(metadataUserId);
      if (userByIdError) {
        console.warn('⚠️ getUserById failed, fallback email:', userByIdError.message);
      } else if (userById?.user) {
        user = userById.user;
        console.log('✅ User resolved from metadata:', user.id);
      }
    }

    // Fallback : recherche par email avec pagination
    let page = 1;
    const perPage = 1000; // Maximum per page
    
    while (!user) {
      console.log(`🔍 Searching users page ${page} for email:`, customerEmail);
      
      const { data: userData, error: userError } = await supabaseService.auth.admin.listUsers({
        page: page,
        perPage: perPage
      });
      
      if (userError) {
        console.error('❌ Error fetching users:', userError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Erreur lors de la recherche de l\'utilisateur' 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      user = userData.users.find(u => u.email === customerEmail);
      
      // Si on a trouvé l'utilisateur ou qu'il n'y a plus de pages
      if (user || userData.users.length < perPage) {
        break;
      }
      
      page++;
    }
    
    if (!user) {
      console.error('❌ User not found for email:', customerEmail);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Utilisateur non trouvé' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    console.log('✅ User found:', user.id);

    // Update user profile to premium
    const { data: updatedProfile, error: updateError } = await supabaseService
      .from('profiles')
      .update({
        subscription_type: 'premium',
        subscription_expires_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating profile:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erreur lors de la mise à jour du profil' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    console.log('✅ Premium status updated successfully for user:', user.id);
    console.log('✅ Updated profile:', updatedProfile);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Statut premium mis à jour avec succès',
        user_id: user.id,
        profile: updatedProfile
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error updating premium status:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

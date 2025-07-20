
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
    // Get session ID from query params or request body
    const url = new URL(req.url);
    let sessionId = url.searchParams.get('session_id');
    
    if (!sessionId && req.method === 'POST') {
      const body = await req.json();
      sessionId = body.session_id;
    }
    
    console.log('📋 Session ID:', sessionId);
    
    if (!sessionId) {
      throw new Error('Session ID manquant');
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('❌ STRIPE_SECRET_KEY not configured');
      throw new Error('Configuration Stripe manquante');
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
    console.log('👤 Customer email:', session.customer_details?.email);
    
    if (session.payment_status !== 'paid') {
      throw new Error('Paiement non confirmé');
    }

    // Get customer email from session
    const customerEmail = session.customer_details?.email;
    if (!customerEmail) {
      throw new Error('Email du customer non trouvé');
    }

    console.log('🔍 Looking for user with email:', customerEmail);

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Find user by email in auth.users table
    const { data: users, error: usersError } = await supabaseService.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      throw new Error('Erreur lors de la recherche de l\'utilisateur');
    }

    const user = users.users.find(u => u.email === customerEmail);
    if (!user) {
      console.error('❌ User not found for email:', customerEmail);
      throw new Error('Utilisateur non trouvé');
    }

    console.log('✅ User found:', user.id);

    // Update user profile to premium
    const { data: updatedProfile, error: updateError } = await supabaseService
      .from('profiles')
      .update({
        subscription_type: 'premium',
        subscription_expires_at: null
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating profile:', updateError);
      throw updateError;
    }

    console.log('✅ Premium status updated successfully for user:', user.id);

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

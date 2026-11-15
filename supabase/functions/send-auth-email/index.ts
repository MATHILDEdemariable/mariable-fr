import React from 'npm:react@18.3.1';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { PasswordResetEmail } from './_templates/password-reset.tsx';

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const hookSecret = Deno.env.get('SEND_AUTH_EMAIL_HOOK_SECRET') as string;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    console.log('🔄 Processing auth email webhook...');
    
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    // Missing hook configuration must never allow unsigned auth emails.
    if (!hookSecret || !resendApiKey) {
      return new Response('Service unavailable', { status: 503, headers: corsHeaders });
    }
    // Verify webhook signature before reading or using any event data.
    if (hookSecret) {
      const wh = new Webhook(hookSecret);
      try {
        wh.verify(payload, headers);
      } catch (error) {
        console.error('❌ Webhook verification failed:', error);
        return new Response('Unauthorized', { 
          status: 401,
          headers: corsHeaders 
        });
      }
    }

    const data = JSON.parse(payload);

    const {
      user,
      email_data: { 
        token, 
        token_hash, 
        redirect_to, 
        email_action_type,
        site_url 
      },
    } = data;

    // Only handle password reset emails
    if (email_action_type !== 'recovery') {
      console.log(`⏭️ Skipping email type: ${email_action_type}`);
      return new Response(JSON.stringify({ message: 'Email type not handled' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🎨 Rendering password reset email template...');
    
    const html = await renderAsync(
      React.createElement(PasswordResetEmail, {
        supabase_url: site_url || Deno.env.get('SUPABASE_URL') || '',
        token,
        token_hash,
        redirect_to: redirect_to || 'https://mariable.fr/auth',
        email_action_type,
        user_email: user.email,
      })
    );

    console.log('📤 Sending password reset email...');
    
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: 'Mariable <noreply@mariable.fr>',
      to: [user.email],
      subject: 'Réinitialisation de votre mot de passe - Mariable',
      html,
    });

    if (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }

    console.log('Password reset email sent successfully');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in send-auth-email function:', error);
    
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
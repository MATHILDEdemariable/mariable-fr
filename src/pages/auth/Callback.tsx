import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

const Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const { toast } = useToast();

  // Send welcome email to new couples
  const sendWelcomeEmail = async (email: string, firstName: string) => {
    try {
      console.log('📧 Sending welcome email to:', email);
      await supabase.functions.invoke('send-welcome-couple-email', {
        body: { email, firstName }
      });
      console.log('✅ Welcome email sent');
    } catch (err) {
      console.error('❌ Error sending welcome email:', err);
      // Don't throw - welcome email is not critical
    }
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse hash fragment params (Supabase often uses hash for auth data)
        const hashParams = window.location.hash 
          ? new URLSearchParams(window.location.hash.substring(1)) 
          : new URLSearchParams();

        // Check for error parameters in query params OR hash fragment
        let errorParam = searchParams.get('error') || hashParams.get('error');
        let errorDescription = searchParams.get('error_description') || hashParams.get('error_description');
        let errorCode = searchParams.get('error_code') || hashParams.get('error_code');
        
        // Get type from query OR hash (critical for recovery flow)
        const type = searchParams.get('type') || hashParams.get('type');
        
        console.log('[auth/callback] Processing auth callback:', { 
          type, 
          hasError: !!errorParam, 
          errorCode,
          hasHash: !!window.location.hash 
        });

        if (errorParam) {
          setLoading(false);
          if (errorCode === 'otp_expired' || errorDescription?.includes('expired')) {
            setError('expired');
          } else if (errorParam === 'access_denied') {
            setError('access_denied');
          } else {
            setError('unknown');
          }
          return;
        }

        // Get tokens from query params OR hash fragment
        const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
        const code = searchParams.get('code') || hashParams.get('code');
        
        console.log('[auth/callback] Tokens found:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          hasCode: !!code 
        });

        // Handle password recovery flow
        if (type === 'recovery') {
          if (accessToken && refreshToken) {
            // Set the session first
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (sessionError) {
              console.error('Error setting session for recovery:', sessionError);
              setError('auth_error');
              setLoading(false);
              return;
            }

            // Redirect to reset password page
            navigate('/auth/reset-password', { replace: true });
            return;
          }
        }

        // Handle PKCE flow with code parameter
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            setError('auth_error');
            setLoading(false);
            return;
          }
          
          // Check if this was a recovery flow
          if (type === 'recovery') {
            navigate('/auth/reset-password', { replace: true });
            return;
          }
          
          // Get user info and send welcome email for new signups
          const { data: { user } } = await supabase.auth.getUser();
          if (user && type === 'signup') {
            const firstName = user.user_metadata?.first_name || '';
            await sendWelcomeEmail(user.email || '', firstName);
          }
          
          navigate('/dashboard', { replace: true });
          return;
        }

        // Handle direct token flow (email confirmation, etc.)
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('Error setting session:', sessionError);
            setError('auth_error');
            setLoading(false);
            return;
          }

          // Get user info and send welcome email for new signups (email confirmation)
          const { data: { user } } = await supabase.auth.getUser();
          if (user && type === 'signup') {
            const firstName = user.user_metadata?.first_name || '';
            await sendWelcomeEmail(user.email || '', firstName);
          }

          navigate('/dashboard', { replace: true });
          return;
        }

        // Fallback: try to refresh existing session
        const { error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('Error refreshing session:', refreshError);
          setError('auth_error');
          setLoading(false);
          return;
        }

        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('unknown');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  const handleResendEmail = async () => {
    const email = localStorage.getItem('pending_verification_email');
    if (email) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (!error) {
          toast({
            title: "Email envoyé",
            description: "Vérifiez votre boîte mail pour confirmer votre compte.",
          });
          setError(null);
          setLoading(true);
        }
      } catch (err) {
        console.error('Error resending email:', err);
      }
    } else {
      navigate('/register');
    }
  };

  const handleResendResetPassword = async () => {
    if (!resetEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email.",
        variant: "destructive",
      });
      return;
    }

    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email envoyé",
          description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
        });
        setShowResetForm(false);
      }
    } catch (err) {
      console.error('Error sending reset email:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSendingReset(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-editorial-beige flex items-center justify-center p-4">
        <SEO
          title="Erreur d'authentification | Mariable"
          description="Une erreur s'est produite lors de l'authentification."
        />
        
        <Card className="w-full max-w-md border-editorial-border">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-serif text-center text-editorial-noir">
              {error === 'expired' ? 'Lien expiré' : 
               error === 'access_denied' ? 'Accès refusé' : 
               'Erreur d\'authentification'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {error === 'expired' && (
              <>
                <p className="text-editorial-gray">
                  Le lien a expiré. Vous pouvez demander un nouveau lien ci-dessous.
                </p>
                
                {showResetForm ? (
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Votre adresse email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="border-editorial-border rounded-none"
                    />
                    <Button 
                      onClick={handleResendResetPassword}
                      disabled={sendingReset}
                      className="w-full bg-editorial-olive hover:bg-editorial-noir text-white rounded-none"
                    >
                      {sendingReset ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      Envoyer un nouveau lien
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setShowResetForm(true)}
                    className="w-full bg-editorial-olive hover:bg-editorial-noir text-white rounded-none"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Demander un nouveau lien
                  </Button>
                )}
              </>
            )}
            
            {error === 'access_denied' && (
              <p className="text-editorial-gray">
                L'accès a été refusé. Veuillez réessayer ou contacter le support si le problème persiste.
              </p>
            )}
            
            {(error === 'auth_error' || error === 'unknown') && (
              <p className="text-editorial-gray">
                Une erreur inattendue s'est produite. Veuillez réessayer plus tard.
              </p>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white rounded-none"
            >
              Retour à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-editorial-beige flex items-center justify-center">
      <SEO
        title="Connexion en cours | Mariable"
        description="Finalisation de votre authentification sur Mariable."
      />
      
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-editorial-olive mx-auto mb-4" />
        <h1 className="text-2xl font-serif mb-2 text-editorial-noir">Connexion en cours...</h1>
        <p className="text-editorial-gray">Veuillez patienter pendant que nous finalisons votre authentification.</p>
      </div>
    </div>
  );
};

export default Callback;

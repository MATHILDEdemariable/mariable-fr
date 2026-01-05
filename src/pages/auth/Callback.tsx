import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';

const Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error parameters first
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const errorCode = searchParams.get('error_code');
        const type = searchParams.get('type');

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
        let accessToken = searchParams.get('access_token');
        let refreshToken = searchParams.get('refresh_token');
        const code = searchParams.get('code');

        // Check hash fragment for tokens (Supabase sometimes puts them there)
        if (!accessToken && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
        }

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
                  Le lien de confirmation a expiré. Cliquez ci-dessous pour recevoir un nouveau lien.
                </p>
                <Button 
                  onClick={handleResendEmail}
                  className="w-full bg-editorial-olive hover:bg-editorial-noir text-white rounded-none"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Renvoyer l'email de confirmation
                </Button>
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

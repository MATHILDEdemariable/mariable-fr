
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
    // Vérifier d'abord s'il y a des paramètres d'erreur dans l'URL
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

    // Gérer spécifiquement la réinitialisation de mot de passe
    if (type === 'recovery') {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        // Rediriger vers la page de réinitialisation avec les tokens
        const resetUrl = new URL('/auth/reset-password', window.location.origin);
        resetUrl.searchParams.set('access_token', accessToken);
        resetUrl.searchParams.set('refresh_token', refreshToken);
        window.location.href = resetUrl.toString();
        return;
      }
    }

    // Gérer le retour après confirmation d'email
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error('Erreur lors du callback d\'authentification:', error);
          setError('auth_error');
          setLoading(false);
        } else {
          // Vérifier si l'utilisateur est connecté
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
        }
      } catch (err) {
        console.error('Erreur générale lors du callback:', err);
        setError('unknown');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  const handleResendEmail = async () => {
    // Récupérer l'email stocké localement ou demander à l'utilisateur de le saisir
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
        console.error('Erreur lors du renvoi de l\'email:', err);
      }
    } else {
      navigate('/register');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-wedding-cream/10 flex items-center justify-center p-4">
        <SEO
          title="Erreur d'authentification | Mariable"
          description="Une erreur s'est produite lors de l'authentification."
        />
        
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-serif text-center">
              {error === 'expired' ? 'Lien expiré' : 
               error === 'access_denied' ? 'Accès refusé' : 
               'Erreur d\'authentification'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {error === 'expired' && (
              <>
                <p className="text-muted-foreground">
                  Le lien de confirmation a expiré. Cliquez ci-dessous pour recevoir un nouveau lien.
                </p>
                <Button 
                  onClick={handleResendEmail}
                  className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Renvoyer l'email de confirmation
                </Button>
              </>
            )}
            
            {error === 'access_denied' && (
              <p className="text-muted-foreground">
                L'accès a été refusé. Veuillez réessayer ou contacter le support si le problème persiste.
              </p>
            )}
            
            {(error === 'auth_error' || error === 'unknown') && (
              <p className="text-muted-foreground">
                Une erreur inattendue s'est produite. Veuillez réessayer plus tard.
              </p>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Retour à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-cream/10 flex items-center justify-center">
      <SEO
        title="Connexion en cours | Mariable"
        description="Finalisation de votre authentification sur Mariable."
      />
      
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-wedding-olive mx-auto mb-4" />
        <h1 className="text-2xl font-serif mb-2">Connexion en cours...</h1>
        <p className="text-muted-foreground">Veuillez patienter pendant que nous finalisons votre authentification.</p>
      </div>
    </div>
  );
};

export default Callback;

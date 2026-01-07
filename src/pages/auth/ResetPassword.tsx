import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, AlertCircle, Mail } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);
  const [errorType, setErrorType] = useState<'expired' | 'invalid' | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [sendingReset, setSendingReset] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Parse URL params from both query string and hash
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = window.location.hash 
          ? new URLSearchParams(window.location.hash.substring(1)) 
          : new URLSearchParams();

        // Check for errors first
        const errorParam = searchParams.get('error') || hashParams.get('error');
        const errorCode = searchParams.get('error_code') || hashParams.get('error_code');
        
        console.log('[reset-password] Init:', { 
          hasError: !!errorParam, 
          errorCode,
          hasHash: !!window.location.hash,
          hasSearch: !!window.location.search
        });

        if (errorParam || errorCode === 'otp_expired') {
          setErrorType('expired');
          setHasValidSession(false);
          setInitialLoading(false);
          return;
        }

        // Get tokens from query or hash
        const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
        const code = searchParams.get('code') || hashParams.get('code');

        console.log('[reset-password] Tokens:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          hasCode: !!code 
        });

        // Try to establish session from tokens
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('[reset-password] Session error:', sessionError.message);
            setErrorType('invalid');
            setHasValidSession(false);
          } else {
            setHasValidSession(true);
            // Clean URL
            window.history.replaceState({}, '', '/auth/reset-password');
          }
          setInitialLoading(false);
          return;
        }

        // Try PKCE code exchange
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('[reset-password] Code exchange error:', exchangeError.message);
            setErrorType('expired');
            setHasValidSession(false);
          } else {
            setHasValidSession(true);
            // Clean URL
            window.history.replaceState({}, '', '/auth/reset-password');
          }
          setInitialLoading(false);
          return;
        }

        // Fallback: check existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setHasValidSession(true);
        } else {
          setErrorType('invalid');
          setHasValidSession(false);
        }
        setInitialLoading(false);
      } catch (err) {
        console.error('[reset-password] Unexpected error:', err);
        setErrorType('invalid');
        setHasValidSession(false);
        setInitialLoading(false);
      }
    };

    initializeSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('[reset-password] Update error:', error);
      
      // Traduire les messages d'erreur courants en français
      let errorMessage = "Une erreur est survenue lors de la mise à jour du mot de passe.";
      if (error.message?.includes("different from the old password")) {
        errorMessage = "Le nouveau mot de passe doit être différent de l'ancien.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetEmail = async () => {
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
      }
    } catch (err) {
      console.error('[reset-password] Resend error:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSendingReset(false);
    }
  };

  // Show loading state while initializing
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-editorial-beige">
        <Loader2 className="h-8 w-8 animate-spin text-editorial-olive" />
      </div>
    );
  }

  // Show error state if no valid session
  if (hasValidSession === false) {
    return (
      <>
        <Helmet>
          <title>Lien invalide - Mariable</title>
          <meta name="description" content="Le lien de réinitialisation a expiré ou est invalide" />
        </Helmet>
        
        <div className="min-h-screen flex items-center justify-center bg-editorial-beige px-4">
          <Card className="w-full max-w-md border-editorial-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-serif text-editorial-noir">
                {errorType === 'expired' ? 'Lien expiré' : 'Lien invalide'}
              </CardTitle>
              <CardDescription className="text-editorial-gray">
                {errorType === 'expired' 
                  ? 'Ce lien a expiré. Demandez un nouveau lien ci-dessous.'
                  : 'Ce lien de réinitialisation n\'est plus valide. Veuillez en demander un nouveau.'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="border-editorial-border rounded-none"
                />
                <Button 
                  onClick={handleResendResetEmail}
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
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Nouveau mot de passe - Mariable</title>
        <meta name="description" content="Définissez votre nouveau mot de passe pour votre compte Mariable" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-editorial-beige px-4">
        <Card className="w-full max-w-md border-editorial-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-editorial-noir">Nouveau mot de passe</CardTitle>
            <CardDescription className="text-editorial-gray">
              Choisissez un nouveau mot de passe sécurisé pour votre compte
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-editorial-noir">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre nouveau mot de passe"
                    required
                    minLength={6}
                    className="pr-10 border-editorial-border rounded-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-editorial-gray" />
                    ) : (
                      <Eye className="h-4 w-4 text-editorial-gray" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-editorial-noir">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                    required
                    minLength={6}
                    className="pr-10 border-editorial-border rounded-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-editorial-gray" />
                    ) : (
                      <Eye className="h-4 w-4 text-editorial-gray" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-editorial-olive hover:bg-editorial-noir text-white rounded-none" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour en cours...
                  </>
                ) : (
                  'Mettre à jour le mot de passe'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button 
                variant="link" 
                onClick={() => navigate('/login')}
                className="text-sm text-editorial-olive hover:text-editorial-noir"
              >
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResetPassword;
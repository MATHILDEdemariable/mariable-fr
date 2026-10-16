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
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();
  // Traduction inline FR/EN de la page
  const tr = (frText: string, enText: string) => (i18n.language?.startsWith('en') ? enText : frText);

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
        title: tr("Erreur", "Error"),
        description: tr("Les mots de passe ne correspondent pas.", "Passwords do not match."),
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: tr("Erreur", "Error"),
        description: tr("Le mot de passe doit contenir au moins 6 caractères.", "Password must be at least 6 characters."),
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
        title: tr("Mot de passe mis à jour", "Password updated"),
        description: tr("Votre mot de passe a été mis à jour avec succès.", "Your password has been updated successfully."),
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('[reset-password] Update error:', error);
      
      // Traduire les messages d'erreur courants en français
      let errorMessage = tr("Une erreur est survenue lors de la mise à jour du mot de passe.", "An error occurred while updating your password.");
      if (error.message?.includes("different from the old password")) {
        errorMessage = tr("Le nouveau mot de passe doit être différent de l'ancien.", "The new password must be different from the old one.");
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: tr("Erreur", "Error"),
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
        title: tr("Email requis", "Email required"),
        description: tr("Veuillez saisir votre adresse email.", "Please enter your email address."),
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
          title: tr("Erreur", "Error"),
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: tr("Email envoyé", "Email sent"),
          description: tr("Vérifiez votre boîte mail pour réinitialiser votre mot de passe.", "Check your inbox to reset your password."),
        });
      }
    } catch (err) {
      console.error('[reset-password] Resend error:', err);
      toast({
        title: tr("Erreur", "Error"),
        description: tr("Une erreur est survenue. Veuillez réessayer.", "Something went wrong. Please try again."),
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
          <title>{tr("Lien invalide - Mariable", "Invalid link - Mariable")}</title>
          <meta name="description" content={tr("Le lien de réinitialisation a expiré ou est invalide", "The reset link has expired or is invalid")} />
        </Helmet>
        
        <div className="min-h-screen flex items-center justify-center bg-editorial-beige px-4">
          <Card className="w-full max-w-md border-editorial-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-serif text-editorial-noir">
                {errorType === 'expired' ? tr('Lien expiré', 'Link expired') : tr('Lien invalide', 'Invalid link')}
              </CardTitle>
              <CardDescription className="text-editorial-gray">
                {errorType === 'expired' 
                  ? tr('Ce lien a expiré. Demandez un nouveau lien ci-dessous.', 'This link has expired. Request a new one below.')
                  : tr('Ce lien de réinitialisation n\'est plus valide. Veuillez en demander un nouveau.', 'This reset link is no longer valid. Please request a new one.')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder={tr("Votre adresse email", "Your email address")}
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
                  {tr("Envoyer un nouveau lien", "Send a new link")}
                </Button>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white rounded-none"
              >
                {tr("Retour à la connexion", "Back to sign in")}
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
        <title>{tr("Nouveau mot de passe - Mariable", "New password - Mariable")}</title>
        <meta name="description" content={tr("Définissez votre nouveau mot de passe pour votre compte Mariable", "Set a new password for your Mariable account")} />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-editorial-beige px-4">
        <Card className="w-full max-w-md border-editorial-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-editorial-noir">{tr("Nouveau mot de passe", "New password")}</CardTitle>
            <CardDescription className="text-editorial-gray">
              {tr("Choisissez un nouveau mot de passe sécurisé pour votre compte", "Choose a new secure password for your account")}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-editorial-noir">{tr("Nouveau mot de passe", "New password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tr("Entrez votre nouveau mot de passe", "Enter your new password")}
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
                <Label htmlFor="confirmPassword" className="text-editorial-noir">{tr("Confirmer le mot de passe", "Confirm password")}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={tr("Confirmez votre nouveau mot de passe", "Confirm your new password")}
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
                    {tr("Mise à jour en cours...", "Updating...")}
                  </>
                ) : (
                  tr('Mettre à jour le mot de passe', 'Update password')
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button 
                variant="link" 
                onClick={() => navigate('/login')}
                className="text-sm text-editorial-olive hover:text-editorial-noir"
              >
                {tr("Retour à la connexion", "Back to sign in")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResetPassword;
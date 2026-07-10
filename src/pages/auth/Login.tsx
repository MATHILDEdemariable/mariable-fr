
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PremiumHeader from '@/components/home/PremiumHeader';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Support ?next=/some/path (used by OAuth MCP consent flow) — must be a
  // same-origin relative path.
  const nextParam = new URLSearchParams(location.search).get('next');
  const safeNext = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
    ? nextParam
    : null;
  const redirectPath = safeNext || location.state?.redirectAfterLogin || '/professionnelsmariable';


  useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: t('login.errors.genericError'),
        description: t('login.errors.missingFields'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: t('login.errors.loginFailed'),
        description: error.message || t('login.errors.invalidCredentials'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail) {
      toast({
        title: t('login.errors.genericError'),
        description: t('login.errors.missingEmail'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsResetLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
      toast({
        title: t('login.toasts.emailSentTitle'),
        description: t('login.toasts.emailSentDescription'),
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: t('login.errors.genericError'),
        description: error.message || t('login.errors.resetFailed'),
        variant: "destructive",
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wedding-cream/10">
      <SEO title={t('login.seoTitle')} description={t('login.seoDescription')} />
      <PremiumHeader />

      <main className="container max-w-md mx-auto px-4 py-12 page-content">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif text-center">
              {showResetForm ? t('login.resetTitle') : t('login.title')}
            </CardTitle>
            <CardDescription className="text-center">
              {showResetForm ? t('login.resetSubtitle') : t('login.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showResetForm ? (
              <>
                {resetSent && (
                  <Alert className="border-wedding-olive bg-wedding-olive/10">
                    <Mail className="h-4 w-4" />
                    <AlertDescription>{t('login.resetSentAlert')}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">{t('login.emailLabel')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="resetEmail"
                        type="email"
                        placeholder={t('login.emailPlaceholder')}
                        className="pl-10"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        disabled={isResetLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
                    disabled={isResetLoading}
                  >
                    {isResetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('login.sendResetLink')}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowResetForm(false)}
                  >
                    {t('login.backToLogin')}
                  </Button>
                </form>
              </>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('login.emailLabel')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('login.emailPlaceholder')}
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('login.passwordPlaceholder')}
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowResetForm(true)}
                    className="text-sm text-wedding-olive hover:underline"
                  >
                    {t('login.forgotPassword')}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('login.submit')}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="text-center text-sm">
              {t('login.noAccount')}{" "}
              <Link to="/register" className="text-wedding-olive hover:underline font-medium">
                {t('login.signUp')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Login;

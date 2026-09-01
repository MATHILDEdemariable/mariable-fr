
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mail, Lock, User, Smartphone, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PremiumHeader from '@/components/home/PremiumHeader';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trackUserRegistration, trackMetaRegistration } from '@/utils/analytics';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [registrationPurpose, setRegistrationPurpose] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Support ?redirect=paiement (ou tout chemin relatif) pour ramener l'utilisateur
  // vers le tunnel de paiement après inscription / confirmation d'email.
  const redirectParam = new URLSearchParams(location.search).get('redirect');
  const redirectPath = redirectParam
    ? (redirectParam.startsWith('/') && !redirectParam.startsWith('//')
        ? redirectParam
        : `/${redirectParam}`)
    : null;

  useEffect(() => {
    if (user) {
      navigate(redirectPath || '/dashboard');
    }
  }, [user, navigate, redirectPath]);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName || !referralSource || !registrationPurpose) {
      toast({
        title: t('register.errors.genericError'),
        description: t('register.errors.missingFields'),
        variant: "destructive",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: t('register.errors.genericError'),
        description: t('register.errors.missingTerms'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const origin = window.location.origin;
      const redirectTo = `${origin}${redirectPath || '/'}`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            referral_source: referralSource,
            registration_purpose: registrationPurpose,
          },
          emailRedirectTo: redirectTo,
        },
      });

      if (error) throw error;

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          title: t('register.errors.genericError'),
          description: t('register.errors.emailExists'),
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem('pending_verification_email', email);

      // Lead "je veux découvrir les prestataires" issu de /budget-mariage
      try {
        const budgetLead = sessionStorage.getItem('mariable_budget_lead');
        if (budgetLead) {
          sessionStorage.removeItem('mariable_budget_lead');
          await supabase.from('contact_requests').insert({
            type: 'prestataire',
            email,
            phone: phone || null,
            message: `Demande de prestataires adaptés au budget (source : /budget-mariage)\n${budgetLead}`,
          });
          supabase.functions
            .invoke('notify-partenariat-contact', {
              body: {
                email,
                phone: phone || null,
                subject: 'Lead budget mariage',
                message: `Nouvelle inscription depuis /budget-mariage souhaitant recevoir des prestataires adaptés à son budget.\n${budgetLead}`,
              },
            })
            .catch((notifyError) => console.error('❌ notify budget lead failed:', notifyError));
        }
      } catch (leadError) {
        console.error('❌ Budget lead capture failed:', leadError);
      }

      trackMetaRegistration();
      trackUserRegistration('email');

      setShowEmailAlert(true);

      setTimeout(() => {
        navigate(redirectPath ? `/auth/email-confirmation?redirect=${encodeURIComponent(redirectPath)}` : '/auth/email-confirmation');
      }, 3000);

    } catch (error: any) {
      console.error('🚨 Registration error:', error);

      let errorMessage = t('register.errors.generic');
      if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
        errorMessage = t('register.errors.alreadyRegistered');
      } else if (error.message && !error.message?.includes('Database error') && !error.message?.includes('database')) {
        errorMessage = error.message;
      }

      toast({
        title: t('register.errors.registrationFailed'),
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sideFeatures = (t('register.features', { returnObjects: true }) as { title: string; description: string }[]) || [];

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <SEO title={t('register.seoTitle')} description={t('register.seoDescription')} />
      <PremiumHeader />

      <main className="container max-w-6xl mx-auto pb-12 px-4 page-content">
        {showEmailAlert && (
          <Alert className="mb-6 border-wedding-olive bg-wedding-olive/10">
            <Mail className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>{t('register.emailAlert')}</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Colonne gauche : descriptif */}
          <Card className="shadow-lg">
            <CardHeader className="space-y-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-wedding-olive/10 text-wedding-olive px-4 py-1.5 text-xs font-medium tracking-wide">
                ✨ 100% gratuit — Sans carte bancaire
              </div>
              <CardTitle className="text-2xl md:text-3xl font-serif uppercase tracking-wide">
                {t('register.sideTitle')}
              </CardTitle>
              <CardDescription className="text-base text-foreground/80">
                {t('register.sideSubtitle')}
              </CardDescription>
              <div className="flex items-start gap-2 p-3 bg-wedding-olive/5 rounded-lg border border-wedding-olive/15 text-sm text-muted-foreground">
                <Smartphone className="h-4 w-4 mt-0.5 flex-shrink-0 text-wedding-olive" />
                <p>{t('register.sideIntro')}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4">
                {Array.isArray(sideFeatures) && sideFeatures.filter((feature) => (feature.title || '').trim() || (feature.description || '').trim()).map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-wedding-olive mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-wedding-olive/5 border border-wedding-olive/15 rounded-lg">
                <p className="text-sm font-semibold text-wedding-olive mb-1">{t('register.includedTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('register.includedText')}</p>
              </div>

              <div className="p-4 border border-border rounded-lg bg-background/60">
                <p className="text-sm font-medium text-foreground mb-1">{t('register.limitsTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('register.limitsText')}</p>
                <Link to="/paiement" className="inline-block mt-2 text-sm text-wedding-olive hover:underline font-medium">
                  {t('register.limitsCta')}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Colonne droite : formulaire */}
          <Card className="w-full shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-serif text-center">{t('register.title')}</CardTitle>
            <CardDescription className="text-center">{t('register.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('register.firstName')} *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      className="pl-10"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('register.lastName')} *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      className="pl-10"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('register.email')} *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('register.emailPlaceholder')}
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('register.phone')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t('register.phonePlaceholder')}
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t('register.phoneHint')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralSource">{t('register.referralSource')} *</Label>
                <Select value={referralSource} onValueChange={setReferralSource} disabled={isLoading}>
                  <SelectTrigger id="referralSource">
                    <SelectValue placeholder={t('register.selectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Pinterest">Pinterest</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Bouche à oreille">{t('register.referralOptions.wordOfMouth')}</SelectItem>
                    <SelectItem value="Autre">{t('register.referralOptions.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationPurpose">{t('register.registrationPurpose')} *</Label>
                <Select value={registrationPurpose} onValueChange={setRegistrationPurpose} disabled={isLoading}>
                  <SelectTrigger id="registrationPurpose">
                    <SelectValue placeholder={t('register.selectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guide_prestataires">{t('register.purposeOptions.guide_prestataires')}</SelectItem>
                    <SelectItem value="outils_en_ligne">{t('register.purposeOptions.outils_en_ligne')}</SelectItem>
                    <SelectItem value="les_deux">{t('register.purposeOptions.les_deux')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('register.password')} *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t('register.passwordHint')}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('register.acceptTerms')}{" "}
                  <Link to="/cgv-couples" className="text-wedding-olive hover:underline" target="_blank">
                    {t('register.termsLink')}
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('register.submit')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <div className="text-center text-sm">
              {t('register.alreadyAccount')}{" "}
              <Link to={redirectPath ? `/login?next=${encodeURIComponent(redirectPath)}` : '/login'} className="text-wedding-olive hover:underline font-medium">
                {t('register.signIn')}
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground border-t pt-3 w-full">
              Envie d'aller plus loin ?{" "}
              <Link to="/paiement" className="text-wedding-olive hover:underline">
                Découvrir Premium — 29€ à vie
              </Link>
            </div>
          </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Register;

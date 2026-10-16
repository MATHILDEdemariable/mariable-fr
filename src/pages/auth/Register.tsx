
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CGVCouplesContent from '@/components/legal/CGVCouplesContent';
import CGVProContent from '@/components/legal/CGVProContent';
import { Loader2, Mail, Lock, User, Smartphone, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PremiumHeader from '@/components/home/PremiumHeader';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trackUserRegistration, trackMetaRegistration } from '@/utils/analytics';
import { useAuth } from '@/contexts/AuthContext';
import registerHeroPhoto from '@/assets/editorial/mariee-bouquet-mer.png.asset.json';

const Register = () => {
  const { t, i18n } = useTranslation('auth');
  const [preferredLanguage, setPreferredLanguage] = useState<'fr' | 'en'>(
    i18n.language?.startsWith('en') ? 'en' : 'fr'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [registrationPurpose, setRegistrationPurpose] = useState('');
  const requestedAccountType = new URLSearchParams(window.location.search).get('type');
  const [accountType, setAccountType] = useState<'b2c' | 'b2b'>(
    requestedAccountType === 'pro' ? 'b2b' : 'b2c'
  );
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isPro = accountType === 'b2b';

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
            account_type: accountType,
            preferred_language: preferredLanguage,
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
          {/* Colonne gauche : photo éditoriale */}
          <figure className="relative order-2 lg:order-1 overflow-hidden min-h-[360px] lg:min-h-[720px] lg:sticky lg:top-32">
            <img
              src={registerHeroPhoto.url}
              alt={preferredLanguage === 'en' ? 'Joyful bride raising her bouquet by the sea' : 'Mariée rayonnante levant son bouquet face à la mer'}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-editorial-noir/80 via-editorial-noir/20 to-transparent" aria-hidden="true" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-editorial-beige">
              <p className="text-xs uppercase tracking-[0.25em] opacity-80">✨ {preferredLanguage === 'en' ? 'Free · No credit card' : 'Gratuit · Sans carte bancaire'}</p>
              <p className="mt-3 font-serif text-3xl md:text-4xl leading-tight">
                {isPro
                  ? (preferredLanguage === 'en' ? 'Every wedding you run, beautifully calm.' : 'Chaque mariage que vous orchestrez, en toute sérénité.')
                  : (preferredLanguage === 'en' ? 'Your wedding day, fully lived.' : 'Votre Jour J, vécu pleinement.')}
              </p>
              <p className="mt-3 text-sm md:text-base opacity-90 max-w-md">
                {preferredLanguage === 'en'
                  ? 'Plan without stress, coordinate every minute, enjoy your loved ones.'
                  : 'Organisez sans stress, coordonnez chaque minute, profitez de vos proches.'}
              </p>
            </figcaption>
          </figure>

          {/* Colonne droite : formulaire */}
          <Card className="w-full shadow-lg order-1 lg:order-2">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-serif text-center">{t('register.title')}</CardTitle>
            <CardDescription className="text-center">{t('register.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('accountType.label')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: 'b2c' as const, label: t('accountType.couple'), hint: t('accountType.coupleHint') },
                    { value: 'b2b' as const, label: t('accountType.pro'), hint: t('accountType.proHint') },
                  ]).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAccountType(option.value)}
                      disabled={isLoading}
                      className={`text-left border p-3 transition-colors ${
                        accountType === option.value
                          ? 'border-wedding-olive bg-wedding-olive/5'
                          : 'border-border hover:border-wedding-olive/50'
                      }`}
                    >
                      <span className="block text-sm font-medium">{option.label}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{option.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

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

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="isPro"
                  checked={isPro}
                  disabled={isLoading}
                  onCheckedChange={(checked) => setAccountType(checked === true ? 'b2b' : 'b2c')}
                />
                <label htmlFor="isPro" className="text-sm leading-snug">
                  {t('register.isProCheckbox')}
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">{t('register.preferredLanguage')} *</Label>
                <Select
                  value={preferredLanguage}
                  onValueChange={(value) => setPreferredLanguage(value === 'en' ? 'en' : 'fr')}
                  disabled={isLoading}
                >
                  <SelectTrigger id="preferredLanguage">
                    <SelectValue placeholder={t('register.selectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">{t('register.languageFr')}</SelectItem>
                    <SelectItem value="en">{t('register.languageEn')}</SelectItem>
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
                  <button
                    type="button"
                    onClick={() => setTermsOpen(true)}
                    className="text-wedding-olive hover:underline"
                  >
                    {t('register.termsLink')}
                  </button>
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
            {!isPro && (
              <div className="text-center text-xs text-muted-foreground border-t pt-3 w-full">
                Envie d'aller plus loin ?{" "}
                <Link to="/paiement" className="text-wedding-olive hover:underline">
                  Découvrir Premium — 29€ à vie
                </Link>
              </div>
            )}
          </CardFooter>
          </Card>
        </div>
      </main>

      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{t('register.termsModalTitle')}</DialogTitle>
          </DialogHeader>
          <div className="text-sm">
            {isPro ? <CGVProContent /> : <CGVCouplesContent />}
          </div>
          <Button type="button" variant="outline" onClick={() => setTermsOpen(false)}>
            {t('register.termsModalClose')}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;

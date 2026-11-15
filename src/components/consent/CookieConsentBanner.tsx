import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { needsAnswer, onConsentChange, readChoice, saveChoices, type Purpose } from '@/lib/consent';

export const OPEN_COOKIE_SETTINGS_EVENT = 'open-cookie-settings';
const CONSENT_PURPOSES: Purpose[] = ['analytics', 'advertising'];

const COOKIE_TEXTS = {
  fr: {
    title: 'Vos choix de cookies',
    body: "Nous comptons les visites sans cookies. Si vous acceptez, nous mesurons aussi les clics et la navigation sur le site, ainsi que l'efficacité de nos publicités.",
    privacy: 'Politique de confidentialité',
    acceptAll: 'Tout accepter',
    rejectAll: 'Tout refuser',
    settings: 'Paramètres des cookies',
    save: 'Enregistrer mes choix',
    necessary: 'Nécessaires',
    necessaryDetail: 'Connexion et fonctionnement du site. Toujours actifs.',
    analytics: "Mesure d'audience",
    analyticsDetail: 'Clics et navigation, fournis par Lovable, Google et Hotjar.',
    advertising: 'Publicité',
    advertisingDetail: 'Mesure des inscriptions issues de nos publicités, fournie par Meta et Google.',
    gpc: 'Le signal de confidentialité de votre navigateur (Global Privacy Control) s’applique : ces mesures restent désactivées.',
  },
  en: {
    title: 'Your cookie choices',
    body: 'We count visits without cookies. If you accept, we also measure clicks and browsing on the site, and how well our ads perform.',
    privacy: 'Privacy policy',
    acceptAll: 'Accept all',
    rejectAll: 'Reject all',
    settings: 'Cookie settings',
    save: 'Save my choices',
    necessary: 'Necessary',
    necessaryDetail: 'Sign-in and site operation. Always on.',
    analytics: 'Audience measurement',
    analyticsDetail: 'Clicks and browsing, provided by Lovable, Google and Hotjar.',
    advertising: 'Advertising',
    advertisingDetail: 'Measuring sign-ups from our ads, provided by Meta and Google.',
    gpc: "Your browser's privacy signal (Global Privacy Control) applies: these measurements stay off.",
  },
};

const hasGlobalPrivacyControl = () =>
  typeof navigator !== 'undefined' &&
  (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

const CookieConsentBanner = () => {
  const { i18n } = useTranslation();
  const texts = i18n.language?.startsWith('en') ? COOKIE_TEXTS.en : COOKIE_TEXTS.fr;
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsView, setIsSettingsView] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);
  const [advertisingChoice, setAdvertisingChoice] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isGpcActive = hasGlobalPrivacyControl();

  const syncSwitches = () => {
    setAnalyticsChoice(readChoice('analytics') === 'granted');
    setAdvertisingChoice(readChoice('advertising') === 'granted');
  };

  useEffect(() => {
    needsAnswer(CONSENT_PURPOSES)
      .then((isAnswerNeeded) => { if (isAnswerNeeded) setIsOpen(true); })
      .catch((error) => console.error('❌ needsAnswer failed:', error));
    const openSettings = () => { syncSwitches(); setIsSettingsView(true); setIsOpen(true); };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    const unsubscribe = onConsentChange(syncSwitches);
    return () => { window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings); unsubscribe(); };
  }, []);

  useEffect(() => { if (isOpen) panelRef.current?.focus(); }, [isOpen, isSettingsView]);

  if (!isOpen) return null;

  const saveAll = (choice: 'granted' | 'denied') => {
    saveChoices({ analytics: choice, advertising: choice });
    setIsOpen(false);
    setIsSettingsView(false);
  };

  const saveSettings = () => {
    saveChoices({
      analytics: analyticsChoice ? 'granted' : 'denied',
      advertising: advertisingChoice ? 'granted' : 'denied',
    });
    setIsOpen(false);
    setIsSettingsView(false);
  };

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="region"
      aria-label={texts.title}
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl border border-border bg-background p-5 text-foreground shadow-lg outline-none md:inset-x-auto md:right-6 md:bottom-6"
    >
      <h2 className="font-serif text-lg">{texts.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {texts.body}{' '}
        <Link to="/politique-confidentialite" className="underline underline-offset-2">{texts.privacy}</Link>
      </p>

      {isSettingsView && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          {isGpcActive && <p className="text-sm text-muted-foreground">{texts.gpc}</p>}
          <div>
            <p className="text-sm font-medium">{texts.necessary}</p>
            <p className="text-xs text-muted-foreground">{texts.necessaryDetail}</p>
          </div>
          <div className="flex items-start justify-between gap-4">
            <label htmlFor="cookie-analytics" className="cursor-pointer">
              <span className="block text-sm font-medium">{texts.analytics}</span>
              <span className="block text-xs text-muted-foreground">{texts.analyticsDetail}</span>
            </label>
            <Switch id="cookie-analytics" checked={!isGpcActive && analyticsChoice} disabled={isGpcActive} onCheckedChange={setAnalyticsChoice} />
          </div>
          <div className="flex items-start justify-between gap-4">
            <label htmlFor="cookie-advertising" className="cursor-pointer">
              <span className="block text-sm font-medium">{texts.advertising}</span>
              <span className="block text-xs text-muted-foreground">{texts.advertisingDetail}</span>
            </label>
            <Switch id="cookie-advertising" checked={!isGpcActive && advertisingChoice} disabled={isGpcActive} onCheckedChange={setAdvertisingChoice} />
          </div>
          <Button className="min-h-[44px] w-full rounded-none" onClick={saveSettings}>{texts.save}</Button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button className="min-h-[44px] rounded-none" onClick={() => saveAll('granted')}>{texts.acceptAll}</Button>
        <Button className="min-h-[44px] rounded-none" onClick={() => saveAll('denied')}>{texts.rejectAll}</Button>
      </div>
      {!isSettingsView && (
        <button
          type="button"
          className="mt-3 min-h-[44px] w-full text-sm underline underline-offset-2"
          onClick={() => { syncSwitches(); setIsSettingsView(true); }}
        >
          {texts.settings}
        </button>
      )}
    </div>
  );
};

export default CookieConsentBanner;

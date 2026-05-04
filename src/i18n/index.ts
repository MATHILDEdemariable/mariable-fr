import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frCommon from './locales/fr/common.json';
import frHome from './locales/fr/home.json';
import frPricing from './locales/fr/pricing.json';
import frProfessionals from './locales/fr/professionals.json';
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enPricing from './locales/en/pricing.json';
import enProfessionals from './locales/en/professionals.json';

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const resources = {
  fr: {
    common: frCommon,
    home: frHome,
    pricing: frPricing,
    professionals: frProfessionals,
  },
  en: {
    common: enCommon,
    home: enHome,
    pricing: enPricing,
    professionals: enProfessionals,
  },
};

// Sanitize any stale value in localStorage (e.g. 'fr-FR', empty, unsupported code).
// Without this, the detector may return a region-tagged code that doesn't match
// our supported lng list, causing some namespaces/components to fall back silently.
if (typeof window !== 'undefined') {
  try {
    const stored = window.localStorage.getItem('mariable_lang');
    if (stored) {
      const normalized = stored.toLowerCase().split('-')[0];
      if (!SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
        window.localStorage.removeItem('mariable_lang');
      } else if (normalized !== stored) {
        window.localStorage.setItem('mariable_lang', normalized);
      }
    }
  } catch {
    // ignore (private mode, etc.)
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    // Normalize 'fr-FR' / 'en-US' from the browser to 'fr' / 'en' so they match resources.
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    defaultNS: 'common',
    ns: ['common', 'home', 'pricing', 'professionals'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mariable_lang',
    },
    react: {
      useSuspense: false,
      // Ensure components re-render on language change AND when a namespace finishes loading.
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
  });

// Sync <html lang="">
const syncHtmlLang = (lng: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng.startsWith('en') ? 'en' : 'fr';
  }
};
syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;

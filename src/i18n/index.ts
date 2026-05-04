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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
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

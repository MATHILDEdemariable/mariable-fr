import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frCommon from './locales/fr/common.json';
import frHome from './locales/fr/home.json';
import frHomeV2 from './locales/fr/homeV2.json';
import frPricing from './locales/fr/pricing.json';
import frProfessionals from './locales/fr/professionals.json';
import frPartenariat from './locales/fr/partenariat.json';
import frBlog from './locales/fr/blog.json';
import frAuth from './locales/fr/auth.json';
import frDashboard from './locales/fr/dashboard.json';
import frBudget from './locales/fr/budget.json';
import frChecklist from './locales/fr/checklist.json';
import frSeating from './locales/fr/seating.json';
import frCeremonie from './locales/fr/ceremonie.json';
import frWeddingDay from './locales/fr/weddingDay.json';
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enHomeV2 from './locales/en/homeV2.json';
import enPricing from './locales/en/pricing.json';
import enProfessionals from './locales/en/professionals.json';
import enPartenariat from './locales/en/partenariat.json';
import enBlog from './locales/en/blog.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enBudget from './locales/en/budget.json';
import enChecklist from './locales/en/checklist.json';
import enSeating from './locales/en/seating.json';
import enCeremonie from './locales/en/ceremonie.json';
import enWeddingDay from './locales/en/weddingDay.json';

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const resources = {
  fr: {
    common: frCommon,
    home: frHome,
    homeV2: frHomeV2,
    pricing: frPricing,
    professionals: frProfessionals,
    partenariat: frPartenariat,
    blog: frBlog,
    auth: frAuth,
    dashboard: frDashboard,
    budget: frBudget,
    checklist: frChecklist,
    seating: frSeating,
    ceremonie: frCeremonie,
    weddingDay: frWeddingDay,
  },
  en: {
    common: enCommon,
    home: enHome,
    homeV2: enHomeV2,
    pricing: enPricing,
    professionals: enProfessionals,
    partenariat: enPartenariat,
    blog: enBlog,
    auth: enAuth,
    dashboard: enDashboard,
    budget: enBudget,
    checklist: enChecklist,
    seating: enSeating,
    ceremonie: enCeremonie,
    weddingDay: enWeddingDay,
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
    ns: ['common', 'home', 'homeV2', 'pricing', 'professionals', 'partenariat', 'blog', 'auth', 'dashboard', 'budget', 'checklist', 'seating', 'ceremonie', 'weddingDay'],
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

// Force normalization after init (e.g. 'fr-FR' → 'fr') so the store is consistent.
if (i18n.language && i18n.language.includes('-')) {
  i18n.changeLanguage(i18n.language.split('-')[0]);
}

// Sync <html lang="">
const syncHtmlLang = (lng: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng.startsWith('en') ? 'en' : 'fr';
  }
};
syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Compact FR/EN language toggle.
 * - variant 'light' = white text (used over dark/video backgrounds, e.g. homepage hero header)
 * - variant 'dark'  = noir text (used on white headers)
 */
const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'dark', className }) => {
  const { i18n, t } = useTranslation('common');
  const current = i18n.language?.startsWith('en') ? 'en' : 'fr';

  const setLang = (lng: 'fr' | 'en') => {
    if (lng === current) return;
    try {
      window.localStorage.setItem('mariable_lang', lng);
    } catch {}
    document.documentElement.lang = lng;
    i18n.changeLanguage(lng);
  };

  const baseText =
    variant === 'light'
      ? 'text-white/70 hover:text-white'
      : 'text-editorial-noir/60 hover:text-editorial-noir';
  const activeText =
    variant === 'light' ? 'text-white font-semibold' : 'text-editorial-noir font-semibold';
  const separator = variant === 'light' ? 'text-white/40' : 'text-editorial-noir/30';

  return (
    <div
      className={cn(
        'flex items-center gap-1 text-[11px] tracking-[0.15em] uppercase font-sans',
        className
      )}
      role="group"
      aria-label={t('language.label')}
    >
      <button
        type="button"
        onClick={() => setLang('fr')}
        aria-label={t('language.switchTo', { lang: 'Français' })}
        aria-pressed={current === 'fr'}
        className={cn('transition-colors px-1', current === 'fr' ? activeText : baseText)}
      >
        {t('language.fr')}
      </button>
      <span className={separator} aria-hidden="true">|</span>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-label={t('language.switchTo', { lang: 'English' })}
        aria-pressed={current === 'en'}
        className={cn('transition-colors px-1', current === 'en' ? activeText : baseText)}
      >
        {t('language.en')}
      </button>
    </div>
  );
};

export default LanguageToggle;

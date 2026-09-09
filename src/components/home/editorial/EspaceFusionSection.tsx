import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Calendar, Wallet, Users, LayoutGrid, ClipboardList, Wine, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Fusion 2-en-1 pour /refontejuillet :
 * - Aperçu de l'espace (dashboard mockup)
 * - Grille 6 fonctionnalités (le service en détail resserré)
 * - Bande bonus vert sauge (Carnet d'adresses)
 * - CTAs « Créer un compte gratuit » + « J'ai déjà un compte »
 */

import dashboardBudget from '@/assets/dashboard-budget.jpg.asset.json';
import dashboardSeating from '@/assets/dashboard-plan-de-table.jpg.asset.json';
import dashboardPlanning from '@/assets/dashboard-planning.jpg.asset.json';

const SCREENS = [
  { url: dashboardBudget.url, label: 'Budget', alt: 'Espace Mariable : suivi du budget mariage par catégorie' },
  { url: dashboardSeating.url, label: 'Plan de table', alt: 'Espace Mariable : plan de table interactif avec les invités' },
  { url: dashboardPlanning.url, label: 'Planning Jour-J', alt: 'Espace Mariable : déroulé du Jour-J avec l’équipe assignée' },
];

export default function EspaceFusionSection() {
  const { t } = useTranslation('refonteJuillet');
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % SCREENS.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [paused]);

  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      setActive((prev) => (prev + (delta < 0 ? 1 : SCREENS.length - 1)) % SCREENS.length);
    }
    touchStartX.current = null;
  }, []);

  const features = [
    { key: 'planning', Icon: Calendar },
    { key: 'budget', Icon: Wallet },
    { key: 'guests', Icon: Users },
    { key: 'seating', Icon: LayoutGrid },
    { key: 'jourJ', Icon: ClipboardList },
    { key: 'drinks', Icon: Wine },
    { key: 'album', Icon: Sparkles },
  ] as const;


  return (
    <section id="ton-espace-mariable" className="bg-[#F8F5EF] py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <header className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-editorial-noir/60 mb-3">
            {t('espace.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir leading-tight mb-4">
            {t('espace.title')}
          </h2>
          <p className="text-editorial-noir/60 text-base md:text-lg leading-relaxed italic whitespace-pre-line">
            {t('espace.subtitle')}
          </p>
        </header>

        {/* Carrousel des 3 écrans */}
        <div
          className="max-w-5xl mx-auto mb-14 md:mb-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full aspect-[16/10] bg-editorial-beige/40 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
            {SCREENS.map((screen, index) => (
              <img
                key={screen.url}
                src={screen.url}
                alt={screen.alt}
                loading="lazy"
                width={1600}
                height={1000}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                  index === active ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
                }`}
              />
            ))}
            <span className="absolute left-4 bottom-4 bg-white/90 text-editorial-noir text-[11px] tracking-[0.25em] uppercase px-3 py-1">
              {SCREENS[active].label}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mt-5">
            {SCREENS.map((screen, index) => (
              <button
                key={screen.url}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Voir ${screen.label}`}
                aria-current={index === active}
                className={`h-2 rounded-none transition-all duration-300 ${
                  index === active ? 'w-8 bg-wedding-olive' : 'w-2 bg-editorial-noir/25 hover:bg-editorial-noir/40'
                }`}
              />
            ))}
          </div>
        </div>



        {/* Grille 3×2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8 max-w-5xl mx-auto mb-14 md:mb-16">
          {features.map(({ key, Icon }) => (
            <div key={key} className="flex gap-4">
              <Icon className="w-5 h-5 text-wedding-olive flex-shrink-0 mt-1" strokeWidth={1.4} />
              <div>
                <h3 className="font-serif text-lg text-editorial-noir leading-tight mb-1">
                  {t(`espace.features.${key}.title`)}
                </h3>
                <p className="text-sm text-editorial-noir/70 leading-snug">
                  {t(`espace.features.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bande bonus vert sauge */}
        <div className="bg-wedding-olive text-white px-6 md:px-10 py-6 md:py-8 max-w-5xl mx-auto mb-12 md:mb-14 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
          <span className="text-[11px] tracking-[0.3em] uppercase bg-white/15 px-3 py-1">
            {t('espace.bonus.label')}
          </span>
          <p className="font-serif text-lg md:text-xl leading-snug">
            {t('espace.bonus.text')}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register-gratuit"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-editorial-noir border border-editorial-noir hover:bg-editorial-noir hover:text-white px-8 py-4 rounded-none transition-colors uppercase tracking-widest text-xs"
          >
            {t('espace.ctaPrimary')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="text-xs uppercase tracking-widest text-editorial-noir underline underline-offset-4 hover:opacity-70"
          >
            {t('espace.ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}

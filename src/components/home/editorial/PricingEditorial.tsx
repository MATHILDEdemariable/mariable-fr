import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PricingEditorial: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  const freeFeatures = t('pricing.free.features', { returnObjects: true }) as string[];
  const premiumFeatures = t('pricing.premium.features', { returnObjects: true }) as string[];

  return (
    <section className="bg-[#F8F5EF] py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <header className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-editorial-noir/60 mb-3">
            {t('pricing.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir leading-tight">
            {t('pricing.title')}
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* FREE */}
          <div className="border border-editorial-noir/15 bg-white p-8 md:p-10 flex flex-col">
            <p className="text-[11px] tracking-[0.3em] uppercase text-editorial-noir/60 mb-3">
              {t('pricing.free.name')}
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif text-4xl md:text-5xl text-editorial-noir">
                {t('pricing.free.price')}
              </span>
              <span className="text-sm text-editorial-noir/60">/ {t('pricing.free.period')}</span>
            </div>
            <p className="text-sm text-editorial-noir/70 mb-6">{t('pricing.free.tagline')}</p>

            <ul className="space-y-3 mb-6 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-editorial-noir">
                  <Check className="w-4 h-4 text-wedding-olive flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-editorial-noir/55 italic mb-6">{t('pricing.free.limits')}</p>

            <Link
              to="/register-gratuit"
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-editorial-noir border border-editorial-noir hover:bg-editorial-noir hover:text-white px-8 py-4 text-xs uppercase tracking-widest rounded-none transition-colors"
            >
              {t('pricing.free.cta')}
            </Link>
          </div>

          {/* PREMIUM */}
          <div className="relative bg-wedding-olive text-white p-8 md:p-10 flex flex-col">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-wedding-olive text-[10px] tracking-[0.3em] uppercase px-3 py-1">
              {t('pricing.premium.badge')}
            </span>
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/80 mb-3">
              {t('pricing.premium.name')}
            </p>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-serif text-4xl md:text-5xl">{t('pricing.premium.price')}</span>
              <span className="text-lg text-white/60 line-through">
                {t('pricing.premium.priceStrike')}
              </span>
              <span className="text-sm text-white/70">· {t('pricing.premium.period')}</span>
            </div>
            <p className="text-sm text-white/80 mb-6">{t('pricing.premium.tagline')}</p>

            <ul className="space-y-3 mb-8 flex-1">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex gap-3 text-sm">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/register?premium=1"
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-wedding-olive hover:bg-white/90 px-6 py-4 text-xs uppercase tracking-widest font-medium transition-colors"
            >
              {t('pricing.premium.cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-center text-xs md:text-sm text-editorial-noir/60 italic mt-10">
          {t('pricing.benchmark')}
        </p>
      </div>
    </section>
  );
};

export default PricingEditorial;

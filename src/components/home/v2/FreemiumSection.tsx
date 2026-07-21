import { Link } from 'react-router-dom';
import { Check, Lock, ArrowRight, BookOpen } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

interface FreemiumSectionProps {
  hideEshopCard?: boolean;
  bgClassName?: string;
}

export default function FreemiumSection({ hideEshopCard = false, bgClassName = 'bg-editorial-cream' }: FreemiumSectionProps = {}) {
  const { t } = useTranslation('homeV2');
  const freeFeatures = t('freemium.free.features', { returnObjects: true }) as string[];
  const freeLimits = t('freemium.free.limits', { returnObjects: true }) as string[];
  const premiumFeatures = t('freemium.premium.features', { returnObjects: true }) as string[];

  return (
    <section className={`${bgClassName} py-24 md:py-32`}>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
              {t('freemium.eyebrow')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-editorial-noir leading-tight">
              {t('freemium.titleLine1')}
              <br />
              <span className="italic">{t('freemium.titleLine2')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Free */}
            <div className="bg-white border border-editorial-noir/10 p-8 md:p-10 flex flex-col">
              <div className="mb-8">
                <p className="uppercase tracking-[0.2em] text-xs text-editorial-gray mb-3">
                  {t('freemium.free.label')}
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif text-5xl text-editorial-noir">{t('freemium.free.price')}</span>
                  <span className="text-editorial-gray text-sm">{t('freemium.free.priceUnit')}</span>
                </div>
                <p className="text-sm text-editorial-noir/70">
                  {t('freemium.free.desc')}
                </p>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                {freeFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-editorial-olive mt-1 flex-shrink-0" />
                    <span className="text-sm text-editorial-noir">{f}</span>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-editorial-noir/10">
                  <p className="text-xs text-editorial-noir/50 uppercase tracking-wide font-semibold mb-3">
                    {t('freemium.free.limitsLabel')}
                  </p>
                  {freeLimits.map((l) => (
                    <div key={l} className="flex items-start gap-3 mb-2">
                      <Lock className="w-3.5 h-3.5 text-editorial-noir/40 mt-1 flex-shrink-0" />
                      <span className="text-sm text-editorial-noir/60">{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 w-full border border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white px-6 py-3.5 rounded-none font-medium transition-colors"
              >
                {t('freemium.free.cta')}
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-wedding-olive text-white p-8 md:p-10 flex flex-col relative">
              <div className="absolute -top-3 left-8">
                <span className="bg-white text-wedding-olive px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium">
                  {t('freemium.premium.badge')}
                </span>
              </div>

              <div className="mb-8">
                <p className="uppercase tracking-[0.2em] text-xs text-editorial-cream/70 mb-3">
                  {t('freemium.premium.label')}
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-serif text-5xl">{t('freemium.premium.price')}</span>
                  <span className="text-editorial-cream/50 line-through text-lg">{t('freemium.premium.oldPrice')}</span>
                  <span className="text-editorial-cream/70 text-sm">{t('freemium.premium.priceUnit')}</span>
                </div>
                <p className="text-sm text-editorial-cream/75">
                  {t('freemium.premium.desc')}
                </p>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {premiumFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-editorial-olive-light mt-1 flex-shrink-0" />
                    <span className="text-sm text-white">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/paiement"
                className="inline-flex items-center justify-center gap-2 w-full bg-white hover:bg-white/90 text-wedding-olive px-6 py-3.5 rounded-none font-medium transition-colors"
              >
                {t('freemium.premium.cta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Carte e-shop guides à l'unité */}
          <div className="mt-8 bg-editorial-beige border border-editorial-noir/10 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="bg-white border border-editorial-noir/10 p-3 flex-shrink-0">
                <BookOpen className="w-6 h-6 text-editorial-olive" />
              </div>
              <div>
                <p className="uppercase tracking-[0.2em] text-xs text-editorial-olive mb-2">
                  {t('freemium.eshop.eyebrow')}
                </p>
                <h3 className="font-serif text-2xl text-editorial-noir mb-1">
                  {t('freemium.eshop.title')}
                </h3>
                <p className="text-sm text-editorial-noir/70">
                  <Trans i18nKey="freemium.eshop.desc" ns="homeV2" components={{ strong: <strong /> }} />
                  <span className="block text-xs italic mt-1 text-editorial-noir/55">
                    {t('freemium.eshop.subnote')}
                  </span>
                </p>
              </div>
            </div>
            <Link
              to="/guides"
              className="inline-flex items-center justify-center gap-2 border border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white px-6 py-3 rounded-none font-medium transition-colors whitespace-nowrap"
            >
              {t('freemium.eshop.cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-center text-xs text-editorial-noir/50 mt-10 italic">
            {t('freemium.footnote')}
          </p>
        </div>
      </div>
    </section>
  );
}

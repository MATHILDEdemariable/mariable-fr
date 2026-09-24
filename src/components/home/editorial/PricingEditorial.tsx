import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PricingEditorial: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  const plans = t('pricing.plans', { returnObjects: true }) as Array<{
    name: string;
    price: string;
    frequency: string;
    description: string;
    features: string[];
    cta: string;
    href: string;
  }>;

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <header className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-editorial-noir/60 mb-3">
            {t('pricing.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir leading-tight">
            {t('pricing.title')}
          </h2>
        </header>

        <div className="mx-auto grid max-w-6xl gap-px bg-editorial-noir md:grid-cols-3">
          {plans.map((plan, index) => (
            <article key={plan.name} className={index === 1 ? 'flex flex-col bg-editorial-noir p-7 text-primary-foreground md:p-9' : 'flex flex-col bg-editorial-beige p-7 text-editorial-noir md:p-9'}>
              <h3 className="font-serif text-2xl">{plan.name}</h3>
              <div className="mt-5 flex min-h-16 items-baseline gap-2">
                <span className="font-serif text-4xl">{plan.price}</span>
                <span className={index === 1 ? 'text-xs text-primary-foreground/60' : 'text-xs text-editorial-noir/55'}>{plan.frequency}</span>
              </div>
              <p className={index === 1 ? 'mt-4 text-sm leading-relaxed text-primary-foreground/70' : 'mt-4 text-sm leading-relaxed text-editorial-noir/65'}>{plan.description}</p>
              <ul className="my-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-editorial-olive-light" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to={plan.href} className={index === 1 ? 'inline-flex min-h-12 items-center justify-center gap-2 border border-primary-foreground bg-primary-foreground px-5 text-center text-xs uppercase tracking-widest text-editorial-noir transition-colors hover:bg-transparent hover:text-primary-foreground' : 'inline-flex min-h-12 items-center justify-center gap-2 border border-editorial-noir px-5 text-center text-xs uppercase tracking-widest transition-colors hover:bg-editorial-noir hover:text-primary-foreground'}>
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingEditorial;

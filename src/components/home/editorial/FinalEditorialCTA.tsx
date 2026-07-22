import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FinalEditorialCTA: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  return (
    <section className="bg-wedding-olive py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1.1]">
            {t('finalCta.title')} <em className="italic">{t('finalCta.titleEm')}</em>
          </h2>
          <p className="mt-6 text-white/85 text-base md:text-lg">
            {t('finalCta.subtitle')}
          </p>
          <Link
            to="/register-gratuit"
            className="mt-10 inline-flex items-center gap-3 bg-white text-editorial-noir px-10 py-5 hover:bg-white/90 transition-colors"
          >
            <span className="font-sans">{t('finalCta.cta')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalEditorialCTA;

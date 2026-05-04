import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PremiumFinalCTASection = () => {
  const { t } = useTranslation('home');
  return (
    <section className="py-24 bg-editorial-olive relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-normal leading-tight">
            {t('finalCta.titleLine1')}
            <br />
            <em>{t('finalCta.titleLine2')}</em>
          </h2>

          <p className="text-xl text-white/80 font-light leading-relaxed">
            {t('finalCta.subtitle')}
          </p>
        </header>
        <div className="text-center max-w-3xl mx-auto">
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-white text-editorial-olive hover:bg-editorial-beige px-12 py-6 text-base font-medium rounded-none shadow-none"
            >
              {t('finalCta.cta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/70 text-sm mt-12">
            <span>{t('finalCta.trust1')}</span>
            <span className="hidden sm:block">•</span>
            <span>{t('finalCta.trust2')}</span>
            <span className="hidden sm:block">•</span>
            <span>{t('finalCta.trust3')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumFinalCTASection;

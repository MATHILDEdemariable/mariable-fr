import { Link } from 'react-router-dom';
import { ArrowRight, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FinalCTASection() {
  const { t } = useTranslation('homeV2');
  return (
    <section className="relative bg-editorial-cream py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(99,116,90,0.20), transparent)',
        }}
      />
      <div className="relative container mx-auto px-6 text-center">
        <h2 className="font-serif text-5xl md:text-7xl text-editorial-noir leading-[1.05] mb-6">
          {t('finalCta.titleLine1')}
          <br />
          <span className="text-editorial-olive italic">{t('finalCta.titleLine2')}</span>
        </h2>
        <p className="text-editorial-gray text-lg mb-10">
          {t('finalCta.subtitle')}
        </p>
        <Link
          to="/paiement"
          className="inline-flex items-center justify-center gap-2 bg-editorial-noir hover:bg-editorial-olive text-editorial-cream px-10 py-5 rounded-none font-medium text-base transition-colors"
        >
          {t('finalCta.cta')}
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-xs text-editorial-noir/50 mt-8 italic">
          {t('finalCta.footnote')}
        </p>

        <a
          href="https://www.instagram.com/mariable.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-8 text-editorial-noir/70 hover:text-editorial-olive transition-colors text-sm"
        >
          <Instagram className="w-4 h-4" />
          {t('finalCta.instagram')}
        </a>
      </div>
    </section>
  );
}

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import HeroEditorial from '@/components/home/editorial/HeroEditorial';
import EditorialCarousels from '@/components/home/editorial/EditorialCarousels';
import EditorialEShop from '@/components/home/editorial/EditorialEShop';
import PricingEditorial from '@/components/home/editorial/PricingEditorial';
import BlogCarouselEditorial from '@/components/home/editorial/BlogCarouselEditorial';
import TestimonialsEditorial from '@/components/home/editorial/TestimonialsEditorial';
import FinalEditorialCTA from '@/components/home/editorial/FinalEditorialCTA';
import Footer from '@/components/Footer';
import { SelectionLockProvider } from '@/components/home/editorial/SelectionLockModal';
import { AudiencePaths, JourJProductFocus, PreparationTools } from '@/components/home/editorial/JourJHomeSections';
import HomeJourJFAQ, { HomeFaqItem } from '@/components/home/editorial/HomeJourJFAQ';

const RefonteJuillet: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  const faqItems = t('faq.items', { returnObjects: true }) as HomeFaqItem[];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faqItem) => ({
      '@type': 'Question',
      name: faqItem.q,
      acceptedAnswer: { '@type': 'Answer', text: faqItem.a },
    })),
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SelectionLockProvider>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        canonical="/"
        keywords={t('seo.keywords')}
      >
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </SEO>

      <div className="min-h-screen bg-editorial-beige text-editorial-noir">
        <EditorialHeader transparent />
        <main>
          {/* 1. Hero */}
          <HeroEditorial />

          <JourJProductFocus />
          <AudiencePaths />
          <PreparationTools />
          <PricingEditorial />
          <EditorialEShop />
          <EditorialCarousels />
          <TestimonialsEditorial />
          <BlogCarouselEditorial />
          <HomeJourJFAQ />
          <FinalEditorialCTA />
        </main>

        <Footer />
      </div>
    </SelectionLockProvider>
  );
};

export default RefonteJuillet;

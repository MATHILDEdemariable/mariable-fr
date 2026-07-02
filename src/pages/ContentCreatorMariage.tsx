import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, CheckCircle2, Star, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/LanguageToggle';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Section = { heading: string; body: string; bullets?: string[] };
type Pack = { name: string; price: string; description: string; features: string[] };
type Testimonial = { name: string; location: string; text: string };
type FaqItem = { q: string; a: string };

const ContentCreatorMariage: React.FC = () => {
  const { t, i18n } = useTranslation('contentCreator');
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr';

  const sections = t('sections', { returnObjects: true }) as Section[];
  const packs = t('packs.items', { returnObjects: true }) as Pack[];
  const testimonials = t('testimonials.items', { returnObjects: true }) as Testimonial[];
  const faqs = t('faq.items', { returnObjects: true }) as FaqItem[];

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t('hero.title'),
    description: t('seo.description'),
    author: { '@type': 'Organization', name: 'Mariable' },
    inLanguage: lang,
    mainEntityOfPage: 'https://www.mariable.fr/content-creator-mariage',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
        <link rel="canonical" href="https://www.mariable.fr/content-creator-mariage" />
        <meta property="og:title" content={t('hero.title')} />
        <meta property="og:description" content={t('seo.description')} />
        <meta property="og:url" content="https://www.mariable.fr/content-creator-mariage" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      {/* Editorial header */}
      <header className="border-b border-editorial-noir/10 bg-white sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-editorial-noir hover:text-premium-sage transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-sans">{t('backHome')}</span>
          </Link>
          <LanguageToggle variant="dark" />
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-premium-sage mb-4 font-sans">
              {t('meta.category')} · {t('meta.readTime')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-editorial-noir leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-editorial-noir/70 leading-relaxed mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex items-center gap-4 text-sm text-editorial-noir/60 font-sans border-t border-editorial-noir/10 pt-4">
              <span>{t('meta.author')}</span>
              <span aria-hidden>·</span>
              <span>{t('meta.date')}</span>
            </div>
          </div>
        </section>

        {/* Intro + editorial sections */}
        <article className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-editorial-noir prose-p:text-editorial-noir/80 prose-p:leading-relaxed prose-li:text-editorial-noir/80 prose-strong:text-editorial-noir">
              <p className="lead text-xl">{t('intro.p1')}</p>
              <p>{t('intro.p2')}</p>

              {sections.map((s, i) => (
                <section key={i} className="mt-12">
                  <h2>{s.heading}</h2>
                  <p>{s.body}</p>
                  {s.bullets && (
                    <ul>
                      {s.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* Packs (inside article flow) */}
            <div id="packs-section" className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packs.map((pack, index) => {
                  const popular = index === 1;
                  return (
                    <div
                      key={pack.name}
                      className={`relative p-6 bg-white border ${popular ? 'border-premium-sage border-2' : 'border-editorial-noir/10'}`}
                    >
                      {popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-premium-sage text-white px-4 py-1 text-xs uppercase tracking-widest font-sans">
                          {t('packs.popular')}
                        </div>
                      )}
                      <h3 className="text-xl font-serif text-editorial-noir mb-1">{pack.name}</h3>
                      <div className="text-3xl font-serif text-premium-sage mb-2">{pack.price}</div>
                      <p className="text-sm text-editorial-noir/60 mb-4">{pack.description}</p>
                      <ul className="space-y-2 mb-6">
                        {pack.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-editorial-noir/80">
                            <CheckCircle2 className="w-4 h-4 text-premium-sage flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => scrollTo('contact-section')}
                        className={`w-full rounded-none ${
                          popular
                            ? 'bg-editorial-noir text-white hover:bg-editorial-noir/90'
                            : 'bg-white border border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white'
                        }`}
                      >
                        {t('packs.cta')}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-20">
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-8">
                {t('testimonials.heading')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((tst, i) => (
                  <blockquote key={i} className="p-6 bg-editorial-beige/40 border-l-2 border-premium-sage">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, k) => (
                        <Star key={k} className="w-4 h-4 fill-wedding-gold text-wedding-gold" />
                      ))}
                    </div>
                    <p className="text-editorial-noir/80 italic text-sm leading-relaxed mb-4">
                      "{tst.text}"
                    </p>
                    <footer className="text-xs font-sans text-editorial-noir/60">
                      <span className="font-medium text-editorial-noir">{tst.name}</span> · {tst.location}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-20">
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-6">
                {t('faq.heading')}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-b border-editorial-noir/10">
                    <AccordionTrigger className="text-left text-editorial-noir hover:text-premium-sage font-medium">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-editorial-noir/70 leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </article>

        {/* Final CTA */}
        <section id="contact-section" className="py-20 px-4 bg-editorial-noir text-white">
          <div className="container mx-auto max-w-3xl text-center">
            <Sparkles className="w-8 h-8 text-premium-sage mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif mb-4">{t('cta.heading')}</h2>
            <p className="text-lg text-white/80 mb-8">{t('cta.body')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-premium-sage hover:bg-premium-sage/90 text-white rounded-none px-8"
              >
                <Link to="/contact">
                  {t('cta.primary')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 rounded-none px-8"
              >
                <Link to="/contact">
                  <Calendar className="mr-2 w-4 h-4" />
                  {t('cta.secondary')}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContentCreatorMariage;

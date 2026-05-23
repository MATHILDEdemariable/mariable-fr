import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ComparisonRow { name: string; free: string; premium: string; }
interface FaqItem { question: string; answer: string; }

const Prix = () => {
  const { t } = useTranslation('pricing');
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePremiumClick = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=premium');
      return;
    }
    try {
      setCheckoutLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      if (error || !data?.url) {
        toast({ title: t('errors.title'), description: t('errors.checkout'), variant: "destructive" });
        return;
      }
      window.location.href = data.url;
    } catch {
      toast({ title: t('errors.title'), description: t('errors.generic'), variant: "destructive" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const comparisonRows = t('comparison.rows', { returnObjects: true }) as ComparisonRow[];
  const faqData = t('faq.items', { returnObjects: true }) as FaqItem[];

  const faqSchemas = [{
    type: 'FAQ' as const,
    data: { questions: faqData }
  }];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO 
        title={t('seo.title')}
        description={t('seo.description')}
        canonical="/prix"
        keywords="tarif mariage, prix wedding planner en ligne, outil organisation mariage gratuit, planificateur mariage prix, Mariable premium"
        schemas={faqSchemas}
      />
      
      <PremiumHeader />
      
      <main className="flex-grow page-content">
        {/* Hero */}
        <section className="py-16 md:py-20 bg-editorial-olive animate-fade-in">
          <div className="container mx-auto px-4">
            <header className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                {t('hero.subtitle')}
              </p>
            </header>
          </div>
        </section>

        {/* Comparatif */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {isMobile ? (
                <div className="space-y-6">
                  {/* Free */}
                  <Card className="border border-editorial-noir/10 rounded-none">
                    <CardHeader className="bg-editorial-olive/10 rounded-none">
                      <CardTitle className="text-center font-serif text-editorial-noir">{t('plans.free.name')}</CardTitle>
                      <div className="text-3xl font-bold text-editorial-noir text-center">{t('plans.free.price')}</div>
                      <p className="text-sm text-editorial-noir/60 text-center">{t('plans.free.tagline')}</p>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir font-medium">{t('plans.free.allFeatures')}</span>
                        </div>
                        <hr className="border-editorial-noir/10" />
                        <p className="text-xs text-editorial-noir/50 uppercase tracking-wide font-semibold">{t('plans.free.limitsLabel')}</p>
                        {[1,2,3,4].map((n) => (
                          <div key={n} className="flex items-start gap-2">
                            <Lock className="w-4 h-4 text-editorial-noir/40 mt-1 flex-shrink-0" />
                            <span className="text-sm text-editorial-noir/70">{t(`plans.free.limit${n}`)}</span>
                          </div>
                        ))}
                      </div>
                      <Button asChild className="w-full mt-6 bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none">
                        <Link to="/register">{t('plans.free.cta')}</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Premium */}
                  <Card className="border-2 border-editorial-noir rounded-none relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-editorial-noir text-white px-4 py-1 text-xs font-bold tracking-wide line-through">
                        {t('plans.premium.badge')}
                      </span>
                    </div>
                    <CardHeader className="bg-editorial-noir text-white pt-6 rounded-none">
                      <CardTitle className="text-center font-serif">{t('plans.premium.name')}</CardTitle>
                      <div className="text-3xl font-bold text-white text-center">{t('plans.premium.price')}</div>
                      <p className="text-sm text-white/80 text-center">{t('plans.premium.tagline')}</p>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir font-medium">{t('plans.premium.all')}</span>
                        </div>
                        <hr className="border-editorial-noir/10" />
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir">{t('plans.premium.feature1')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <div>
                            <span className="text-sm text-editorial-noir">{t('plans.premium.feature2')}</span>
                            <p className="text-xs text-editorial-noir/50 mt-1">{t('plans.premium.feature2Detail')}</p>
                          </div>
                        </div>
                        {[3,4,5,6].map((n) => (
                          <div key={n} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                            <span className="text-sm text-editorial-noir">{t(`plans.premium.feature${n}`)}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-editorial-noir/70 italic mt-4 pt-3 border-t border-editorial-noir/10">
                        {t('plans.premium.vsWeddingPlanner')}
                      </p>
                      <Button 
                        onClick={handlePremiumClick}
                        disabled={checkoutLoading}
                        className="w-full mt-6 bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none"
                      >
                        {checkoutLoading ? t('plans.premium.ctaLoading') : t('plans.premium.cta')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div></div>
                    <Card className="text-center p-6 border border-editorial-noir/10 rounded-none">
                      <CardHeader className="p-0">
                        <CardTitle className="text-xl font-serif mb-2 text-editorial-noir">{t('plans.free.name')}</CardTitle>
                        <div className="text-3xl font-bold text-editorial-noir mb-2">{t('plans.free.price')}</div>
                        <p className="text-sm text-editorial-noir/60">{t('plans.free.tagline')}</p>
                      </CardHeader>
                    </Card>
                    <Card className="text-center p-6 bg-editorial-noir border-2 border-editorial-noir rounded-none relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-white text-editorial-noir px-4 py-1 text-xs font-bold tracking-wide line-through">
                          {t('plans.premium.badge')}
                        </span>
                      </div>
                      <CardHeader className="p-0">
                        <CardTitle className="text-xl font-serif text-white mb-2">{t('plans.premium.name')}</CardTitle>
                        <div className="text-3xl font-bold text-white mb-2">{t('plans.premium.price')}</div>
                        <p className="text-sm text-white/80">{t('plans.premium.tagline')}</p>
                      </CardHeader>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    {comparisonRows.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-4">
                        <div className="flex items-center p-4 bg-white border border-editorial-noir/10 rounded-none">
                          <span className="font-medium text-editorial-noir text-sm">{row.name}</span>
                        </div>
                        <div className="flex items-center justify-center p-4 bg-white border border-editorial-noir/10 rounded-none">
                          {row.free === "✓" ? (
                            <Check className="w-6 h-6 text-editorial-noir" />
                          ) : (
                            <span className="text-sm text-editorial-noir/50">{row.free}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-center p-4 bg-editorial-olive/10 border-2 border-editorial-noir/10 rounded-none">
                          {row.premium === "✓" ? (
                            <Check className="w-6 h-6 text-editorial-noir" />
                          ) : (
                            <span className="text-sm text-editorial-noir font-medium">{row.premium}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div></div>
                    <Button asChild className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none">
                      <Link to="/register">{t('plans.free.cta')}</Link>
                    </Button>
                    <Button 
                      onClick={handlePremiumClick}
                      disabled={checkoutLoading}
                      className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none"
                    >
                      {checkoutLoading ? t('plans.premium.ctaLoading') : t('plans.premium.cta')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <header className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
                {t('faq.title')}
              </h2>
            </header>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border-editorial-noir/10">
                  <AccordionTrigger className="text-left font-medium text-editorial-noir hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-editorial-noir/70">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-20 bg-editorial-olive">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-4">
              {t('finalCta.title')}
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              {t('finalCta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-editorial-noir hover:bg-white/90 rounded-none">
                <Link to="/register">{t('finalCta.free')}</Link>
              </Button>
              <Button 
                onClick={handlePremiumClick}
                disabled={checkoutLoading}
                size="lg" 
                className="border border-white text-white bg-transparent hover:bg-white hover:text-editorial-noir rounded-none"
              >
                {checkoutLoading ? t('plans.premium.ctaLoading') : t('finalCta.premium')}
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Prix;

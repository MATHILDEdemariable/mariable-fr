import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, X, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Prix = () => {
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
        toast({ title: "Erreur", description: "Impossible de créer la session de paiement.", variant: "destructive" });
        return;
      }
      window.location.href = data.url;
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const comparisonRows = [
    { name: "Toutes les fonctionnalités (checklist, RSVP, plan de table, coordination jour-J…)", gratuit: "✓", premium: "✓" },
    { name: "Exports PDF/CSV des modules", gratuit: "Non inclus", premium: "Illimités" },
    { name: "Guides mariage & checklists PDF (10 guides)", gratuit: "Non inclus", premium: "+ 10 guides inclus" },
    { name: "Utilisation IA (checklist, rétroplanning, moodboard)", gratuit: "1 génération par outil", premium: "Illimitée" },
    { name: "Gestion budget (lignes par catégorie)", gratuit: "3 lignes max", premium: "Illimitée" },
    { name: "Stockage documents", gratuit: "2 documents", premium: "Illimité" },
    { name: "Support prioritaire", gratuit: "Non inclus", premium: "Inclus" },
  ];

  const faqData = [
    {
      question: "Mariable est-il vraiment gratuit ?",
      answer: "Oui, toutes les fonctionnalités sont accessibles gratuitement : checklist, budget, RSVP, plan de table, coordination jour-J, guide prestataires. Seuls les exports PDF, les guides, l'IA illimitée et le budget illimité nécessitent le Premium."
    },
    {
      question: "Que contient le compte Premium à 29 € ?",
      answer: "Le Premium est un achat unique à 29 € qui lève toutes les limitations : exports PDF/CSV illimités, IA illimitée, gestion budget sans limite de lignes, guides mariage PDF, stockage documents illimité et support prioritaire."
    },
    {
      question: "Est-ce un abonnement ou un paiement unique ?",
      answer: "C'est un paiement unique de 29 €. Pas d'abonnement, pas de renouvellement automatique. Vous payez une seule fois et gardez l'accès à vie."
    },
    {
      question: "Puis-je utiliser l'app avec ma famille ?",
      answer: "Oui, l'application est faite pour être collaborative. Chacun peut accéder au planning et aux informations importantes grâce au partage en temps réel."
    },
    {
      question: "Puis-je passer au Premium plus tard ?",
      answer: "Oui, vous pouvez passer au Premium à tout moment. Votre compte gratuit est conservé et toutes vos données sont préservées lors de l'upgrade."
    },
  ];

  const faqSchemas = faqData.map(item => ({
    type: 'FAQ' as const,
    data: { question: item.question, answer: item.answer }
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO 
        title="Tarifs Mariable – Gratuit ou Premium 29 €"
        description="Mariable est gratuit. Le compte Premium coûte 29 € (achat unique, accès à vie). Checklist IA, budget, coordination jour-J, plan de table et exports illimités."
        canonical="/prix"
        keywords="tarif mariage, prix wedding planner en ligne, outil organisation mariage gratuit, planificateur mariage prix, Mariable premium"
        schemas={faqSchemas}
      />
      
      <PremiumHeader />
      
      <main className="flex-grow page-content">
        {/* Section 1 - Hero */}
        <section className="py-16 md:py-20 bg-editorial-beige animate-fade-in">
          <div className="container mx-auto px-4">
            <header className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-editorial-noir mb-6">
                Nos tarifs
              </h1>
              <p className="text-lg text-editorial-noir/70 max-w-3xl mx-auto">
                Toutes les fonctionnalités sont gratuites. Le Premium lève les dernières limites — 29 €, une seule fois, accès à vie.
              </p>
            </header>
          </div>
        </section>

        {/* Section 2 - Comparatif simplifié */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {isMobile ? (
                <div className="space-y-6">
                  {/* Card Gratuit */}
                  <Card className="border border-editorial-noir/10 rounded-none">
                    <CardHeader className="bg-editorial-beige rounded-none">
                      <CardTitle className="text-center font-serif text-editorial-noir">Gratuit</CardTitle>
                      <div className="text-3xl font-bold text-editorial-noir text-center">0 €</div>
                      <p className="text-sm text-editorial-noir/60 text-center">Pour bien démarrer</p>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir font-medium">Toutes les fonctionnalités incluses</span>
                        </div>
                        <hr className="border-editorial-noir/10" />
                        <p className="text-xs text-editorial-noir/50 uppercase tracking-wide font-semibold">Limitations</p>
                        <div className="flex items-start gap-2">
                          <Lock className="w-4 h-4 text-editorial-noir/40 mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir/70">Exports PDF : non inclus</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Lock className="w-4 h-4 text-editorial-noir/40 mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir/70">Guides mariage PDF : non inclus</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Lock className="w-4 h-4 text-editorial-noir/40 mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir/70">IA : 1 génération par outil</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Lock className="w-4 h-4 text-editorial-noir/40 mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir/70">Budget : 3 lignes par catégorie</span>
                        </div>
                      </div>
                      <Button asChild className="w-full mt-6 bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none">
                        <Link to="/register">S'inscrire gratuitement</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Card Premium */}
                  <Card className="border-2 border-editorial-noir rounded-none relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-editorial-noir text-white px-4 py-1 text-xs font-bold tracking-wide">
                        ⭐ RECOMMANDÉ
                      </span>
                    </div>
                    <CardHeader className="bg-editorial-noir text-white pt-6 rounded-none">
                      <CardTitle className="text-center font-serif">Premium</CardTitle>
                      <div className="text-3xl font-bold text-white text-center">29 €</div>
                      <p className="text-sm text-white/80 text-center">Achat unique · Accès à vie</p>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir font-medium">Tout le Gratuit, sans aucune limitation</span>
                        </div>
                        <hr className="border-editorial-noir/10" />
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir">Exports PDF/CSV illimités</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <div>
                            <span className="text-sm text-editorial-noir">+ 10 guides mariage & checklists PDF</span>
                            <p className="text-xs text-editorial-noir/50 mt-1">Guide jour-J · Organisation débutant · Guide prestataires · Checklist marié(e)s & proches · Checklist mairie & cérémonie</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir">IA illimitée</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir">Budget illimité</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir">Stockage documents illimité</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                          <span className="text-sm text-editorial-noir">Support prioritaire</span>
                        </div>
                      </div>
                      <Button 
                        onClick={handlePremiumClick}
                        disabled={checkoutLoading}
                        className="w-full mt-6 bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none"
                      >
                        {checkoutLoading ? "Chargement..." : "Passer au Premium"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <>
                  {/* En-têtes desktop */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div></div>
                    <Card className="text-center p-6 border border-editorial-noir/10 rounded-none">
                      <CardHeader className="p-0">
                        <CardTitle className="text-xl font-serif mb-2 text-editorial-noir">Gratuit</CardTitle>
                        <div className="text-3xl font-bold text-editorial-noir mb-2">0 €</div>
                        <p className="text-sm text-editorial-noir/60">Pour bien démarrer</p>
                      </CardHeader>
                    </Card>
                    <Card className="text-center p-6 bg-editorial-noir border-2 border-editorial-noir rounded-none relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-white text-editorial-noir px-4 py-1 text-xs font-bold tracking-wide">
                          ⭐ RECOMMANDÉ
                        </span>
                      </div>
                      <CardHeader className="p-0">
                        <CardTitle className="text-xl font-serif text-white mb-2">Premium</CardTitle>
                        <div className="text-3xl font-bold text-white mb-2">29 €</div>
                        <p className="text-sm text-white/80">Achat unique · Accès à vie</p>
                      </CardHeader>
                    </Card>
                  </div>

                  {/* Lignes comparatives */}
                  <div className="space-y-2">
                    {comparisonRows.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-4">
                        <div className="flex items-center p-4 bg-white border border-editorial-noir/10 rounded-none">
                          <span className="font-medium text-editorial-noir text-sm">{row.name}</span>
                        </div>
                        <div className="flex items-center justify-center p-4 bg-white border border-editorial-noir/10 rounded-none">
                          {row.gratuit === "✓" ? (
                            <Check className="w-6 h-6 text-editorial-noir" />
                          ) : (
                            <span className="text-sm text-editorial-noir/50">{row.gratuit}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-center p-4 bg-editorial-beige/50 border-2 border-editorial-noir/10 rounded-none">
                          {row.premium === "✓" ? (
                            <Check className="w-6 h-6 text-editorial-noir" />
                          ) : (
                            <span className="text-sm text-editorial-noir font-medium">{row.premium}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA buttons */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div></div>
                    <Button asChild className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none">
                      <Link to="/register">S'inscrire gratuitement</Link>
                    </Button>
                    <Button 
                      onClick={handlePremiumClick}
                      disabled={checkoutLoading}
                      className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none"
                    >
                      {checkoutLoading ? "Chargement..." : "Passer au Premium"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Section 3 - FAQ */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <header className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
                Questions fréquentes sur nos tarifs
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

        {/* Section 4 - CTA final */}
        <section className="py-16 md:py-20 bg-editorial-beige">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
              Prêt(e) à organiser votre mariage en toute sérénité ?
            </h2>
            <p className="text-lg text-editorial-noir/70 mb-8 max-w-2xl mx-auto">
              Commencez gratuitement ou passez au Premium pour lever toutes les limites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none">
                <Link to="/register">Commencer gratuitement</Link>
              </Button>
              <Button 
                onClick={handlePremiumClick}
                disabled={checkoutLoading}
                size="lg" 
                className="border border-editorial-noir text-editorial-noir bg-transparent hover:bg-editorial-noir hover:text-white rounded-none"
              >
                {checkoutLoading ? "Chargement..." : "Découvrir le Premium — 29 €"}
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

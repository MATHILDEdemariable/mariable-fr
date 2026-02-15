import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, Calendar, X, Check, Brain, Settings, CheckSquare, Calculator, Home, Share2, User, FileText, Droplet, QrCode, Headphones, Mail, Table } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const Prix = () => {
  const isMobile = useIsMobile();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    { name: "Accès espace personnel", icon: User, gratuit: true, premium: true },
    { name: "Guide de prestataires", icon: Users, gratuit: true, premium: true },
    { name: "Modèle de check-list version post-it", icon: CheckSquare, gratuit: true, premium: true },
    { name: "Calculatrice budget", icon: Calculator, gratuit: true, premium: true },
    { name: "RSVP digital invités", icon: Mail, gratuit: true, premium: true },
    { name: "Modèle suivi budgétaire personnalisable", icon: FileText, gratuit: false, premium: true },
    { name: "Calculatrice boisson", icon: Droplet, gratuit: false, premium: true },
    { name: "Gestion hébergement", icon: Home, gratuit: false, premium: true },
    { name: "Nos guides PDF", icon: FileText, gratuit: false, premium: true },
    { name: "Plan de table", icon: Table, gratuit: false, premium: true },
    { name: "Génération rétroplanning & check-list IA", icon: Brain, gratuit: false, premium: true },
    { name: "Planning intelligent Jour-J", icon: Calendar, gratuit: false, premium: true },
    { name: "Assignation tâches équipe Jour-J", icon: Users, gratuit: false, premium: true },
    { name: "Partage temps réel infos Jour-J", icon: Share2, gratuit: false, premium: true },
    { name: "Stockage documents illimité", icon: FileText, gratuit: false, premium: true },
    { name: "Génération illimitée QR code", icon: QrCode, gratuit: false, premium: true },
    { name: "Exports PDF/CSV illimités", icon: FileText, gratuit: false, premium: true },
    { name: "Support prioritaire", icon: Headphones, gratuit: false, premium: true },
  ];

  const faqData = [
    {
      question: "Mariable est-il vraiment gratuit ?",
      answer: "Oui, Mariable est gratuit. Vous accédez à un espace personnel, au guide de prestataires, à la checklist post-it, à la calculatrice budget et au RSVP digital sans rien payer."
    },
    {
      question: "Que contient le compte Premium à 29 € ?",
      answer: "Le Premium est un achat unique à 29 € qui vous donne un accès à vie à tous les outils avancés : exports illimités, IA illimitée (checklist, rétroplanning, moodboard), plan de table, coordination jour-J, stockage documents illimité et support prioritaire."
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
                Mariable est gratuit. Passez au Premium pour débloquer tous les outils avancés — 29 €, une seule fois, accès à vie.
              </p>
            </header>
          </div>
        </section>

        {/* Section 2 - Comparatif Gratuit vs Premium */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {isMobile ? (
                /* VERSION MOBILE - Cards empilées */
                <div className="space-y-6">
                  {/* Card Gratuit */}
                  <Card className="border border-editorial-noir/10 rounded-none">
                    <CardHeader className="bg-editorial-beige rounded-none">
                      <CardTitle className="text-center font-serif text-editorial-noir">Gratuit</CardTitle>
                      <div className="text-3xl font-bold text-editorial-noir text-center">0 €</div>
                      <p className="text-sm text-editorial-noir/60 text-center">Pour bien démarrer</p>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {features.filter(f => f.gratuit).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                            <span className="text-sm text-editorial-noir">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                      <Button asChild className="w-full mt-6 bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none">
                        <Link to="/register">S'inscrire gratuitement</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Card Premium - Recommandé */}
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
                      <div className="space-y-2">
                        {features.filter(f => f.premium).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-editorial-noir mt-1 flex-shrink-0" />
                            <span className="text-sm text-editorial-noir">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                      <Button asChild className="w-full mt-6 bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none">
                        <Link to="/register">Passer au Premium</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                /* VERSION DESKTOP - Tableau 3 colonnes (label + 2 plans) */
                <>
                  {/* En-têtes */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="hidden md:block"></div>
                    
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

                  {/* Lignes features */}
                  <div className="space-y-2">
                    {features.map((feature, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-4">
                        <div className="flex items-center p-4 bg-white border border-editorial-noir/10 rounded-none">
                          <feature.icon className="w-5 h-5 text-editorial-noir/60 mr-3 flex-shrink-0" />
                          <span className="font-medium text-editorial-noir text-sm">{feature.name}</span>
                        </div>
                        <div className="flex items-center justify-center p-4 bg-white border border-editorial-noir/10 rounded-none">
                          {feature.gratuit ? <Check className="w-6 h-6 text-editorial-noir" /> : <X className="w-6 h-6 text-editorial-noir/20" />}
                        </div>
                        <div className="flex items-center justify-center p-4 bg-editorial-beige/50 border-2 border-editorial-noir/10 rounded-none">
                          {feature.premium ? <Check className="w-6 h-6 text-editorial-noir" /> : <X className="w-6 h-6 text-editorial-noir/20" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA buttons */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="hidden md:block"></div>
                    <Button asChild className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none">
                      <Link to="/register">S'inscrire gratuitement</Link>
                    </Button>
                    <Button asChild className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none">
                      <Link to="/register">Passer au Premium</Link>
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
              Commencez gratuitement ou passez au Premium pour débloquer tous les outils.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none">
                <Link to="/register">
                  Commencer gratuitement
                </Link>
              </Button>
              <Button asChild size="lg" className="border border-editorial-noir text-editorial-noir bg-transparent hover:bg-editorial-noir hover:text-white rounded-none">
                <Link to="/register">
                  Découvrir le Premium — 29 €
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

export default Prix;

import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import PremiumHeader from '@/components/home/PremiumHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ArrowRight, Palette, TrendingDown, TrendingUp, Target, CreditCard, BarChart3, Gift, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VirtuousCircleSection from '@/components/mariable/VirtuousCircleSection';
import LieuxPartenairesSection from '@/components/mariable/LieuxPartenairesSection';

const MariablePartenaire = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const problemesMarques = [
    "L'acquisition de nouveaux clients est de plus en plus coûteuse",
    "Taux de conversion faible sur les canaux traditionnels",
    "Impossible de tracker le ROI précisément",
    "Les couples ne font plus confiance aux pubs"
  ];

  const beneficesMarques = [
    { icon: <TrendingDown className="h-5 w-5" />, title: "CAC RÉDUIT SIGNIFICATIVEMENT", details: "Couples ultra-qualifiés (ont déjà leur lieu)" },
    { icon: <TrendingUp className="h-5 w-5" />, title: "CONVERSION MULTIPLIÉE", details: "Recommandation du lieu = confiance maximale" },
    { icon: <Target className="h-5 w-5" />, title: "VOLUME PRÉDICTIBLE", details: "Accès à notre réseau de lieux premium" },
    { icon: <CreditCard className="h-5 w-5" />, title: "PAIEMENT À LA PERFORMANCE", details: "Commission définie ensemble" },
    { icon: <BarChart3 className="h-5 w-5" />, title: "TRACKING TRANSPARENT", details: "ROI mesurable au centime près" },
    { icon: <Gift className="h-5 w-5" />, title: "FLEXIBILITÉ AVANTAGE", details: "Réduction € OU cadeau offert OU service additionnel" },
  ];

  const testimonials = [
    { name: 'Marine L.', company: 'Atelier Luna (Robes)', quote: "18 robes vendues en 6 mois. ROI 6x. Couples de qualité, très qualifiés.", stars: 5 },
    { name: 'Jean-Pierre D.', company: 'Studio Photo Premium', quote: "Fini les leads froids. Ici, les couples arrivent prêts à signer.", stars: 5 },
    { name: 'Claire M.', company: 'Bijouterie Alliance', quote: "Notre meilleur canal d'acquisition. Les recommandations font tout.", stars: 5 },
  ];

  const faqItems = [
    { question: "Ça coûte combien ?", answer: "10% du prix de vente (5% avantage couple + 5% commission Mariable). Paiement uniquement à la performance." },
    { question: "Comment ça fonctionne concrètement ?", answer: "Les couples arrivent via les lieux partenaires avec un code. Vous leur offrez un avantage (réduction ou cadeau). On trace automatiquement la conversion." },
    { question: "C'est quoi l'avantage couple ?", answer: "Vous choisissez : réduction en €, cadeau offert, ou service additionnel. La valeur doit représenter environ 5% du prix." },
    { question: "Comment je suis visible ?", answer: "Vous êtes référencé dans le Club Mariable accessible à tous les couples des lieux partenaires." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#efeee9]">
      <SEO 
        title="Mariable Partenaire - Réduisez votre CAC de 60%"
        description="Touchez des couples qualifiés pour 200€/client au lieu de 500€. Conversion x5. Paiement à la performance uniquement."
        keywords="acquisition mariés, leads mariage, partenariat mariage, CAC réduit, prestataire mariage"
      />
      
      <PremiumHeader />
      
      <main className="flex-grow">
        {/* Section 1: Hero */}
        <section className="relative py-24 md:py-36 overflow-hidden bg-premium-sage">
          <div className="absolute inset-0 bg-gradient-to-b from-premium-sage-dark/30 via-transparent to-premium-sage-dark/20" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8"
              >
                <Palette className="h-4 w-4 text-white" />
                <span className="font-medium text-white">Pour les Prestataires & Marques</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight"
              >
                Et si vous étiez recommandé par des{' '}
                <span className="text-white/90 relative">
                  lieux de réception premium ?
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6C50 2 150 2 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl text-white/80 mb-12 font-light"
              >
                Diminuer votre CAC
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button 
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="bg-white hover:bg-white/90 text-premium-sage-dark px-10 py-7 text-lg shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Palette className="mr-2 h-5 w-5" />
                  Devenir Partenaire
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Club Exclusif - Cercle Vertueux */}
        <VirtuousCircleSection />

        {/* Section 4: Le Problème */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-2 border-slate-200 hover:border-premium-sage/40 transition-all duration-500 hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Palette className="h-6 w-6 text-slate-600" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-foreground">LE PROBLÈME DES PRESTATAIRES & MARQUES</h3>
                    </div>
                    <div className="space-y-4 mb-6">
                      {problemesMarques.map((probleme, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 group"
                        >
                          <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <span className="text-muted-foreground">{probleme}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="bg-gradient-to-r from-premium-sage-very-light to-premium-sage-very-light/50 p-5 rounded-xl border border-premium-sage/30">
                      <p className="text-premium-sage-dark font-semibold">
                        💡 ET SI VOUS TOUCHIEZ DES COUPLES DÉJÀ QUALIFIÉS ET PRÊTS À RÉSERVER ?
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3: Bénéfices */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-bold text-center text-foreground mb-16"
            >
              Vos avantages en tant que Partenaire
            </motion.h2>
            
            <div className="max-w-3xl mx-auto">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {beneficesMarques.map((benefice, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-premium-sage-very-light flex items-center justify-center text-premium-sage group-hover:bg-premium-sage group-hover:text-white transition-all duration-300">
                          {benefice.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{benefice.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefice.details}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 4: Comment ça marche */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-bold text-center text-foreground mb-16"
            >
              Comment ça marche ?
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              {[
                { icon: '🎫', num: '1', title: 'INSCRIPTION', desc: 'Vous rejoignez le réseau et définissez votre avantage couple' },
                { icon: '👫', num: '2', title: 'LEADS QUALIFIÉS', desc: 'Les couples arrivent via les lieux partenaires avec un code' },
                { icon: '💰', num: '3', title: 'CONVERSION & PAIEMENT', desc: 'Vous vendez, on trace, vous payez uniquement à la performance' },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card className="text-center border-2 hover:border-premium-sage/40 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group h-full">
                    <CardContent className="p-8">
                      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-premium-sage text-white font-bold mb-4 text-lg shadow-lg">
                        {step.num}
                      </div>
                      <h3 className="font-serif font-bold text-foreground mb-2 text-lg">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Commission explanation */}
            <Card className="max-w-2xl mx-auto border-2 border-premium-sage/30 bg-gradient-to-br from-premium-sage-very-light/50 to-transparent">
              <CardContent className="p-8">
                <h4 className="font-serif font-bold text-foreground mb-6 text-center text-xl">💰 STRUCTURE DE COÛTS</h4>
                <div className="space-y-4">
                  <div className="bg-white/80 p-4 rounded-xl">
                    <p className="font-semibold text-foreground mb-3">On définit ensemble la commission, celle-ci finance :</p>
                    <ul className="ml-4 space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-premium-sage" /> Un avantage couple (réduction ou autre avantage si marge trop réduite)</li>
                      <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400" /> La commission service Mariable + lieu redistribuée équitablement</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/contact')}
                    className="border-premium-sage text-premium-sage-dark hover:bg-premium-sage-very-light"
                  >
                    En savoir plus - discutons en
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 5: Témoignages */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-bold text-center text-foreground mb-16"
            >
              Ils ont rejoint le réseau
            </motion.h2>
            
            <div className="max-w-2xl mx-auto relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2 shadow-xl">
                    <CardContent className="p-8">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonials[currentTestimonial].stars)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-lg text-foreground mb-6 italic leading-relaxed">
                        "{testimonials[currentTestimonial].quote}"
                      </p>
                      <div>
                        <p className="font-bold text-foreground font-serif">{testimonials[currentTestimonial].name}</p>
                        <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].company}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="hover:bg-premium-sage hover:text-white hover:border-premium-sage transition-all duration-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-2 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-premium-sage w-6' : 'bg-muted w-2 hover:bg-premium-sage-light'}`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="hover:bg-premium-sage hover:text-white hover:border-premium-sage transition-all duration-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-bold text-center text-foreground mb-16"
            >
              Questions fréquentes
            </motion.h2>
            
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem value={`item-${index}`} className="border-2 rounded-xl px-6 hover:border-premium-sage/40 transition-all duration-300">
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-5 font-serif">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Section 7: CTA Final */}
        <section className="py-20 md:py-28 bg-premium-sage relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-premium-sage-dark/30 via-transparent to-premium-sage-dark/20" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container mx-auto px-4 text-center relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">
              Prêt à diviser votre CAC par 2 ?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/contact')}
                className="bg-white hover:bg-white/90 text-premium-sage-dark px-10 py-7 text-lg shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
              >
                En savoir plus - discutons en
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/80">
              {['Paiement à la performance', 'ROI trackable', 'Leads qualifiés'].map((item, index) => (
                <span key={index} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Check className="h-4 w-4 text-white" /> {item}
                </span>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MariablePartenaire;

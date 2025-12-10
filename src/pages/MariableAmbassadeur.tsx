import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import PremiumHeader from '@/components/home/PremiumHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ArrowRight, Building2, TrendingUp, Clock, Shield, BarChart3, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MariableAmbassadeur = () => {
  const navigate = useNavigate();
  const [mariagesParAn, setMariagesParAn] = useState([30]);
  const [panierMoyen, setPanierMoyen] = useState([25000]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculs simulateur
  const couplesUtilisant = Math.round(mariagesParAn[0] * 0.6);
  const commissionMoyenne = Math.round(panierMoyen[0] * 0.025);
  const revenusAnnuels = couplesUtilisant * commissionMoyenne;
  const tempsInvesti = mariagesParAn[0] * 0.5;
  const tauxHoraire = Math.round(revenusAnnuels / (tempsInvesti / 60));

  const problemesLieux = [
    "Vous recommandez des fournisseurs gratuitement",
    "Vos couples vous sollicitent pour des conseils",
    "Vous ne gagnez rien sur ces recommandations",
    "Vous perdez du temps à répondre aux mêmes questions"
  ];

  const beneficesLieux = [
    { icon: <TrendingUp className="h-5 w-5" />, title: "REVENUS PASSIFS: 13 000€/an en moyenne", details: "30 mariages/an • 18 couples utilisent le réseau (60%) • Commission moyenne: 563€ par mariage" },
    { icon: <Clock className="h-5 w-5" />, title: "TEMPS INVESTI: 30 secondes par couple", details: "Donner le code VIP Pass, c'est tout" },
    { icon: <Star className="h-5 w-5" />, title: "SERVICE PREMIUM pour vos couples", details: "Ils économisent 2500€, ils vous adorent" },
    { icon: <BarChart3 className="h-5 w-5" />, title: "DASHBOARD TEMPS RÉEL", details: "Suivez vos commissions en direct" },
    { icon: <Shield className="h-5 w-5" />, title: "SANS RISQUE", details: "0€ d'investissement, commission uniquement" },
  ];

  const testimonials = [
    { name: 'Sophie Durand', company: 'Château de Beauval', quote: "6 800€ de revenus passifs en 8 mois sans rien changer à mon process. Génial !", stars: 5 },
    { name: 'Pierre Martin', company: 'Domaine des Roses', quote: "Mes couples adorent les avantages. Et moi, je gagne sans effort. Win-win.", stars: 5 },
    { name: 'Marie Lefebvre', company: 'Manoir de la Loire', quote: "Simple à mettre en place, revenus récurrents. Je recommande à tous les lieux.", stars: 5 },
  ];

  const faqItems = [
    { question: "Ça coûte combien ?", answer: "0€ pour les lieux. Vous gagnez une commission uniquement quand vos couples réservent chez nos partenaires." },
    { question: "Comment je suis payé ?", answer: "Virement automatique fin de mois sur votre compte." },
    { question: "Mes couples sont obligés d'utiliser vos partenaires ?", answer: "Non, c'est optionnel. Mais 60% le font car c'est gratuit, avec réductions, et recommandé par vous." },
    { question: "Je peux choisir les marques dans le réseau ?", answer: "Oui, vous validez les partenaires avant d'accepter leur intégration à votre réseau." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-premium-base">
      <SEO 
        title="Mariable Ambassadeur - Générez des revenus passifs avec votre lieu"
        description="Transformez vos recommandations en revenus passifs. 13 000€/an en moyenne pour 30 secondes d'effort par couple."
        keywords="revenus passifs mariage, lieu de réception partenaire, commission mariage, réseau B2B mariage"
      />
      
      <PremiumHeader />
      
      <main className="flex-grow">
        {/* Section 1: Hero */}
        <section className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent" />
          </div>
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
                className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 rounded-full px-4 py-2 mb-8"
              >
                <Building2 className="h-4 w-4" />
                <span className="font-medium">Pour les Lieux de Réception</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight"
              >
                Générez{' '}
                <span className="text-sky-400 relative">
                  13 000€/an
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6C50 2 150 2 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
                {' '}de revenus passifs
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl text-slate-300 mb-12 font-light"
              >
                Transformez vos recommandations en revenus. 30 secondes d'effort par couple.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button 
                  size="lg"
                  onClick={() => navigate('/devenir-partenaire')}
                  className="bg-sky-400 hover:bg-sky-500 text-white px-10 py-7 text-lg shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Devenir Lieu Ambassadeur
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Le Problème */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-2 border-slate-200 hover:border-sky-400/40 transition-all duration-500 hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-slate-600" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-foreground">LE PROBLÈME DES LIEUX DE RÉCEPTION</h3>
                    </div>
                    <div className="space-y-4 mb-6">
                      {problemesLieux.map((probleme, index) => (
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
                    <div className="bg-gradient-to-r from-sky-100 to-sky-50 p-5 rounded-xl border border-sky-200">
                      <p className="text-sky-700 font-semibold">
                        💡 ET SI CES RECOMMANDATIONS GÉNÉRAIENT 13 000€/AN DE REVENUS PASSIFS ?
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
              Vos avantages en tant que Lieu Ambassadeur
            </motion.h2>
            
            <div className="max-w-3xl mx-auto">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {beneficesLieux.map((benefice, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
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

        {/* Section 4: Témoignages */}
        <section className="py-20 md:py-28 bg-white">
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
                  className="hover:bg-sky-400 hover:text-white hover:border-sky-400 transition-all duration-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-2 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-sky-400 w-6' : 'bg-muted w-2 hover:bg-sky-200'}`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="hover:bg-sky-400 hover:text-white hover:border-sky-400 transition-all duration-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Simulateur */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-bold text-center text-foreground mb-16"
            >
              💰 Simulez vos revenus
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="max-w-2xl mx-auto border-2 shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-10">
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="font-medium text-foreground">Combien de mariages faites-vous par an ?</label>
                        <span className="font-bold text-sky-600 text-lg">{mariagesParAn[0]} mariages</span>
                      </div>
                      <Slider
                        value={mariagesParAn}
                        onValueChange={setMariagesParAn}
                        max={100}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>5</span>
                        <span>100</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="font-medium text-foreground">Panier moyen de vos couples ?</label>
                        <span className="font-bold text-sky-600 text-lg">{panierMoyen[0].toLocaleString()}€</span>
                      </div>
                      <Slider
                        value={panierMoyen}
                        onValueChange={setPanierMoyen}
                        max={60000}
                        min={10000}
                        step={1000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>10K€</span>
                        <span>60K€</span>
                      </div>
                    </div>
                    
                    <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white overflow-hidden relative">
                      <CardContent className="p-8 relative z-10">
                        <h4 className="font-bold mb-6 text-center text-lg">📊 VOS REVENUS ESTIMÉS</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                          <div className="bg-white/10 rounded-lg p-3 text-center">
                            <p className="text-white/70 text-xs mb-1">Couples utilisant le réseau</p>
                            <p className="font-bold text-xl">{couplesUtilisant} <span className="text-sm font-normal">(60%)</span></p>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3 text-center">
                            <p className="text-white/70 text-xs mb-1">Commission/couple</p>
                            <p className="font-bold text-xl">{commissionMoyenne}€</p>
                          </div>
                        </div>
                        <motion.div 
                          key={revenusAnnuels}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className="text-center py-6 bg-white/10 rounded-xl mb-6"
                        >
                          <p className="text-sm mb-2 text-white/80">🎉 REVENUS ANNUELS</p>
                          <motion.p 
                            key={revenusAnnuels}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            className="text-5xl font-bold"
                          >
                            {revenusAnnuels.toLocaleString()}€
                          </motion.p>
                        </motion.div>
                        <div className="text-sm text-center text-white/80 space-y-1">
                          <p>Temps investi: {Math.round(tempsInvesti)} min/an (30 sec/couple)</p>
                          <p>Taux horaire équivalent: <strong className="text-white">{tauxHoraire.toLocaleString()}€/h</strong></p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Button 
                      className="w-full bg-sky-500 hover:bg-sky-600 py-7 text-lg hover:scale-[1.02] transition-all duration-300 shadow-xl"
                      onClick={() => navigate('/devenir-partenaire')}
                    >
                      Demander un rendez-vous
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
                    <AccordionItem value={`item-${index}`} className="border-2 rounded-xl px-6 hover:border-sky-400/40 transition-all duration-300">
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
        <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container mx-auto px-4 text-center relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">
              Prêt à générer des revenus passifs ?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/devenir-partenaire')}
                className="bg-sky-400 hover:bg-sky-500 text-white px-10 py-7 text-lg shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Devenir Lieu Ambassadeur
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-slate-400">
              {['0€ d\'investissement', 'Commission uniquement', 'Dashboard temps réel'].map((item, index) => (
                <span key={index} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <Check className="h-4 w-4 text-sky-400" /> {item}
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

export default MariableAmbassadeur;

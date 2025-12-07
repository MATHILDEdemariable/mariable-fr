import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import PremiumHeader from '@/components/home/PremiumHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ArrowRight, Building2, Palette, TrendingDown, TrendingUp, Target, CreditCard, BarChart3, Gift, Clock, Shield, ChevronLeft, ChevronRight, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccueilProfessionnels = () => {
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

  const problemesMarques = [
    "Meta Ads vous coûte 400-500€ par future mariée",
    "Taux de conversion: 2-3% (98% de budget gaspillé)",
    "Impossible de tracker le ROI précisément",
    "Les couples ne font plus confiance aux pubs"
  ];

  const beneficesLieux = [
    { icon: <TrendingUp className="h-5 w-5" />, title: "REVENUS PASSIFS: 13 000€/an en moyenne", details: "30 mariages/an • 18 couples utilisent le réseau (60%) • Commission moyenne: 563€ par mariage" },
    { icon: <Clock className="h-5 w-5" />, title: "TEMPS INVESTI: 30 secondes par couple", details: "Donner le code VIP Pass, c'est tout" },
    { icon: <Star className="h-5 w-5" />, title: "SERVICE PREMIUM pour vos couples", details: "Ils économisent 2500€, ils vous adorent" },
    { icon: <BarChart3 className="h-5 w-5" />, title: "DASHBOARD TEMPS RÉEL", details: "Suivez vos commissions en direct" },
    { icon: <Shield className="h-5 w-5" />, title: "SANS RISQUE", details: "0€ d'investissement, commission uniquement" },
  ];

  const beneficesMarques = [
    { icon: <TrendingDown className="h-5 w-5" />, title: "CAC RÉDUIT DE 60%: 200€ vs 500€", details: "Couples ultra-qualifiés (ont déjà leur lieu)" },
    { icon: <TrendingUp className="h-5 w-5" />, title: "CONVERSION ×5: 10-15% vs 2-3%", details: "Recommandation du lieu = confiance maximale" },
    { icon: <Target className="h-5 w-5" />, title: "VOLUME PRÉDICTIBLE: 800 couples/an", details: "Accès à notre réseau de 50 lieux premium" },
    { icon: <CreditCard className="h-5 w-5" />, title: "PAIEMENT À LA PERFORMANCE", details: "Coût total: 10% (5% avantage + 5% commission)" },
    { icon: <BarChart3 className="h-5 w-5" />, title: "TRACKING TRANSPARENT", details: "ROI mesurable au centime près" },
    { icon: <Gift className="h-5 w-5" />, title: "FLEXIBILITÉ AVANTAGE", details: "Réduction € OU cadeau offert OU service additionnel" },
  ];

  const testimonials = [
    { name: 'Sophie Durand', company: 'Château de Beauval', type: 'lieu', quote: "6 800€ de revenus passifs en 8 mois sans rien changer à mon process. Génial !", stars: 5 },
    { name: 'Marine L.', company: 'Atelier Luna (Robes)', type: 'marque', quote: "18 robes vendues en 6 mois. ROI 6x. Couples de qualité, très qualifiés.", stars: 5 },
    { name: 'Pierre Martin', company: 'Domaine des Roses', type: 'lieu', quote: "Mes couples adorent les avantages. Et moi, je gagne sans effort. Win-win.", stars: 5 },
  ];

  const faqItems = [
    { question: "Ça coûte combien ?", answer: "0€ pour les lieux (commission uniquement). 10% pour les marques (5% avantage couple + 5% commission Mariable)." },
    { question: "Comment je suis payé ?", answer: "Virement automatique fin de mois sur votre compte." },
    { question: "Mes couples sont obligés d'utiliser vos partenaires ?", answer: "Non, c'est optionnel. Mais 60% le font car c'est gratuit, avec réductions, et recommandé par vous." },
    { question: "Je peux choisir les marques dans le réseau ?", answer: "Oui, vous validez les partenaires avant d'accepter leur intégration à votre réseau." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-premium-base">
      <SEO 
        title="Mariable pour les Professionnels - Générez des revenus passifs"
        description="Transformez vos recommandations en revenus passifs. Le réseau B2B qui connecte les lieux de mariage avec les meilleures marques du secteur."
        keywords="revenus passifs mariage, réseau B2B mariage, partenariat lieu mariage, marques mariage, commission mariage"
      />
      
      <PremiumHeader />
      
      <main className="flex-grow">
        {/* Section 1: Hero B2B */}
        <section className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-premium-sage/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight"
              >
                Transformez vos recommandations en{' '}
                <span className="text-premium-sage relative">
                  revenus passifs
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6C50 2 150 2 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl text-slate-300 mb-12 font-light"
              >
                Le réseau B2B qui connecte les lieux de mariage avec les meilleures marques du secteur
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Button 
                  size="lg"
                  onClick={() => navigate('/devenir-partenaire')}
                  className="bg-premium-sage hover:bg-premium-sage/90 text-white px-8 py-7 text-lg shadow-2xl shadow-premium-sage/20 hover:scale-105 transition-all duration-300"
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Lieu: Générer 13K€/an
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/devenir-partenaire')}
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-7 text-lg hover:scale-105 transition-all duration-300"
                >
                  <Palette className="mr-2 h-5 w-5" />
                  Marque: Diviser mon CAC par 2
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-6 text-slate-400"
              >
                {[
                  { label: '50 lieux partenaires', value: '50' },
                  { label: '1500 mariages/an', value: '1500' },
                  { label: '15 marques premium', value: '15' },
                  { label: '300K€ transactés', value: '300K€' },
                ].map((stat, index) => (
                  <motion.span 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm"
                  >
                    <Check className="h-4 w-4 text-premium-sage" /> {stat.label}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Le Problème */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Problèmes Lieux */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-2 border-slate-200 hover:border-premium-sage/40 transition-all duration-500 hover:shadow-xl h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-slate-600" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-foreground">PROPRIÉTAIRES DE LIEUX</h3>
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
                    <div className="bg-gradient-to-r from-premium-sage/10 to-premium-sage/5 p-5 rounded-xl border border-premium-sage/20">
                      <p className="text-premium-sage font-semibold">
                        💡 ET SI CES RECOMMANDATIONS GÉNÉRAIENT 13 000€/AN DE REVENUS PASSIFS ?
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Problèmes Marques */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-2 border-slate-200 hover:border-premium-sage/40 transition-all duration-500 hover:shadow-xl h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Palette className="h-6 w-6 text-slate-600" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-foreground">MARQUES & PRESTATAIRES</h3>
                    </div>
                    <div className="space-y-4 mb-6">
                      {problemesMarques.map((probleme, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: 10 }}
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
                    <div className="bg-gradient-to-r from-premium-sage/10 to-premium-sage/5 p-5 rounded-xl border border-premium-sage/20">
                      <p className="text-premium-sage font-semibold">
                        💡 ET SI VOUS TOUCHIEZ DES COUPLES DÉJÀ QUALIFIÉS POUR 200€/CLIENTE ?
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3: Comment ça marche */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-bold text-center text-foreground mb-16"
            >
              Comment fonctionne Mariable ?
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              {[
                { icon: <Building2 className="h-8 w-8 text-slate-600" />, num: '1', title: 'LIEU', desc: 'Donne code VIP Pass', time: '30 secondes' },
                { icon: <span className="text-3xl">👫</span>, num: '2', title: 'COUPLE', desc: "S'inscrit gratuitement", time: '2 minutes' },
                { icon: <Palette className="h-8 w-8 text-slate-600" />, num: '3', title: 'MARQUE', desc: 'Vend avec réduction + Tracking', time: 'Performance' },
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
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {step.icon}
                      </div>
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-premium-sage text-white font-bold mb-4 text-lg shadow-lg">
                        {step.num}
                      </div>
                      <h3 className="font-serif font-bold text-foreground mb-2 text-lg">{step.title}</h3>
                      <p className="text-muted-foreground mb-2">{step.desc}</p>
                      <p className="text-xs text-premium-sage font-medium bg-premium-sage/10 px-3 py-1 rounded-full inline-block">{step.time}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="max-w-2xl mx-auto border-2 border-premium-sage/30 bg-gradient-to-br from-premium-sage/5 to-transparent">
                <CardContent className="p-8">
                  <h4 className="font-serif font-bold text-foreground mb-6 text-center text-xl">💰 RÉPARTITION AUTOMATIQUE</h4>
                  <div className="space-y-4">
                    <div className="bg-white/80 p-4 rounded-xl">
                      <p className="font-semibold text-foreground mb-2">Commission 5% du prix:</p>
                      <ul className="ml-4 space-y-1 text-muted-foreground">
                        <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-premium-sage" /> 2.5% Lieu (revenus passifs)</li>
                        <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400" /> 2.5% Mariable (orchestration)</li>
                      </ul>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl">
                      <p className="font-semibold text-foreground">+ Avantage couple: 5% du prix</p>
                      <p className="text-sm text-muted-foreground ml-4">(en € ou en cadeau/service)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Section 4: Bénéfices avec Onglets */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="lieux" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-10 p-1 bg-slate-100 rounded-xl">
                <TabsTrigger value="lieux" className="text-base py-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300">
                  <Building2 className="mr-2 h-5 w-5" />
                  Pour les Lieux
                </TabsTrigger>
                <TabsTrigger value="marques" className="text-base py-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300">
                  <Palette className="mr-2 h-5 w-5" />
                  Pour les Marques
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="lieux" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-2">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-serif font-bold text-foreground mb-8 text-center">Pour les Lieux de Réception</h3>
                      <div className="space-y-4">
                        {beneficesLieux.map((benefice, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl hover:shadow-md transition-all duration-300 group"
                          >
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-premium-sage/10 flex items-center justify-center text-premium-sage group-hover:bg-premium-sage group-hover:text-white transition-all duration-300">
                              {benefice.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground">{benefice.title}</h4>
                              <p className="text-sm text-muted-foreground">{benefice.details}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
                        <Button className="bg-premium-sage hover:bg-premium-sage/90 py-6 px-8 hover:scale-105 transition-all duration-300">
                          Simuler mes revenus
                        </Button>
                        <Button variant="outline" className="border-2 border-premium-sage text-premium-sage hover:bg-premium-sage/10 py-6 px-8">
                          Voir une démo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="marques" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-2">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-serif font-bold text-foreground mb-8 text-center">Pour les Marques & Prestataires</h3>
                      <div className="space-y-4">
                        {beneficesMarques.map((benefice, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl hover:shadow-md transition-all duration-300 group"
                          >
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-premium-sage/10 flex items-center justify-center text-premium-sage group-hover:bg-premium-sage group-hover:text-white transition-all duration-300">
                              {benefice.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground">{benefice.title}</h4>
                              <p className="text-sm text-muted-foreground">{benefice.details}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
                        <Button className="bg-premium-sage hover:bg-premium-sage/90 py-6 px-8 hover:scale-105 transition-all duration-300">
                          Calculer mon ROI
                        </Button>
                        <Button variant="outline" className="border-2 border-premium-sage text-premium-sage hover:bg-premium-sage/10 py-6 px-8">
                          Demander une démo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
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
              Ils ont rejoint Mariable
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
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-lg text-foreground mb-6 italic leading-relaxed">
                        "{testimonials[currentTestimonial].quote}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground font-serif">{testimonials[currentTestimonial].name}</p>
                          <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].company}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${testimonials[currentTestimonial].type === 'lieu' ? 'bg-slate-100 text-slate-600' : 'bg-premium-sage/10 text-premium-sage'}`}>
                          {testimonials[currentTestimonial].type === 'lieu' ? 'Lieu' : 'Marque'}
                        </div>
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
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-premium-sage w-6' : 'bg-muted w-2 hover:bg-premium-sage/50'}`}
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

        {/* Section 6: Simulateur */}
        <section className="py-20 md:py-28 bg-white">
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
                        <span className="font-bold text-premium-sage text-lg">{mariagesParAn[0]} mariages</span>
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
                        <span className="font-bold text-premium-sage text-lg">{panierMoyen[0].toLocaleString()}€</span>
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
                    
                    <Card className="bg-gradient-to-br from-premium-sage to-premium-sage/80 text-white overflow-hidden relative">
                      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
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
                      className="w-full bg-premium-sage hover:bg-premium-sage/90 py-7 text-lg hover:scale-[1.02] transition-all duration-300 shadow-xl"
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

        {/* Section 7: FAQ */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-premium-cream/30 to-white">
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

        {/* Section 8: CTA Final */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-premium-sage/20 via-transparent to-transparent" />
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
            
            <div className="flex flex-wrap justify-center gap-6 text-slate-400 mb-12">
              {['Sans risque', 'Sans investissement', 'Test gratuit 6 mois'].map((item, index) => (
                <span key={index} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Check className="h-4 w-4 text-premium-sage" /> {item}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button 
                size="lg"
                onClick={() => navigate('/devenir-partenaire')}
                className="bg-premium-sage hover:bg-premium-sage/90 text-white px-10 py-7 text-lg shadow-2xl shadow-premium-sage/20 hover:scale-105 transition-all duration-300"
              >
                <Building2 className="mr-2 h-5 w-5" />
                Lieux: Rejoindre le réseau
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/devenir-partenaire')}
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-7 text-lg hover:scale-105 transition-all duration-300"
              >
                <Palette className="mr-2 h-5 w-5" />
                Marques: Demander une démo
              </Button>
            </div>
            
            <p className="text-slate-500 flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />
              Ou appelez-nous: 06 XX XX XX XX
            </p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AccueilProfessionnels;

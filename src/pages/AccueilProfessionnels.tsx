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
  const tempsInvesti = mariagesParAn[0] * 0.5; // 30 sec par couple en minutes
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
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Transformez vos recommandations en <span className="text-premium-sage">revenus passifs</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-10">
                Le réseau B2B qui connecte les lieux de mariage avec les meilleures marques du secteur
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button 
                  size="lg"
                  onClick={() => navigate('/devenir-partenaire')}
                  className="bg-premium-sage hover:bg-premium-sage/90 text-white px-8 py-6 text-lg"
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Lieu: Générer 13K€/an
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/devenir-partenaire')}
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  <Palette className="mr-2 h-5 w-5" />
                  Marque: Diviser mon CAC par 2
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-slate-300">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-premium-sage" /> 50 lieux partenaires
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-premium-sage" /> 1500 mariages/an
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-premium-sage" /> 15 marques premium
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-premium-sage" /> 300K€ transactés
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Le Problème */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Problèmes Lieux */}
              <Card className="border-2 border-slate-200">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="h-8 w-8 text-slate-600" />
                    <h3 className="text-xl font-bold text-foreground">PROPRIÉTAIRES DE LIEUX, RECONNAISSEZ-VOUS ?</h3>
                  </div>
                  <div className="space-y-3 mb-6">
                    {problemesLieux.map((probleme, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{probleme}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-premium-sage/10 p-4 rounded-lg">
                    <p className="text-premium-sage font-semibold">
                      💡 ET SI CES RECOMMANDATIONS GÉNÉRAIENT 13 000€/AN DE REVENUS PASSIFS ?
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Problèmes Marques */}
              <Card className="border-2 border-slate-200">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="h-8 w-8 text-slate-600" />
                    <h3 className="text-xl font-bold text-foreground">MARQUES & PRESTATAIRES, ÇA VOUS PARLE ?</h3>
                  </div>
                  <div className="space-y-3 mb-6">
                    {problemesMarques.map((probleme, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{probleme}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-premium-sage/10 p-4 rounded-lg">
                    <p className="text-premium-sage font-semibold">
                      💡 ET SI VOUS TOUCHIEZ DES COUPLES DÉJÀ QUALIFIÉS POUR 200€/CLIENTE AVEC 10% DE CONVERSION ?
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 3: Comment ça marche */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Comment fonctionne Mariable ?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <Card className="text-center border-2">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-slate-600" />
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-premium-sage text-white font-bold mb-3 text-sm">1</div>
                  <h3 className="font-bold text-foreground mb-2">LIEU</h3>
                  <p className="text-sm text-muted-foreground">Donne code VIP Pass</p>
                  <p className="text-xs text-muted-foreground mt-1">30 secondes</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👫</span>
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-premium-sage text-white font-bold mb-3 text-sm">2</div>
                  <h3 className="font-bold text-foreground mb-2">COUPLE</h3>
                  <p className="text-sm text-muted-foreground">S'inscrit gratuitement</p>
                  <p className="text-xs text-muted-foreground mt-1">2 minutes</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Palette className="h-8 w-8 text-slate-600" />
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-premium-sage text-white font-bold mb-3 text-sm">3</div>
                  <h3 className="font-bold text-foreground mb-2">MARQUE</h3>
                  <p className="text-sm text-muted-foreground">Vend avec réduction + Tracking</p>
                  <p className="text-xs text-muted-foreground mt-1">Performance</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="max-w-2xl mx-auto border-2 border-premium-sage/30 bg-premium-sage/5">
              <CardContent className="p-6">
                <h4 className="font-bold text-foreground mb-4 text-center">💰 RÉPARTITION AUTOMATIQUE</h4>
                <div className="space-y-3">
                  <p className="text-muted-foreground"><strong>Commission 5% du prix:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>├─ 2.5% Lieu (revenus passifs)</li>
                    <li>└─ 2.5% Mariable (orchestration)</li>
                  </ul>
                  <p className="text-muted-foreground mt-4"><strong>+ Avantage couple: 5% du prix</strong></p>
                  <p className="text-sm text-muted-foreground ml-4">(en € ou en cadeau/service)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4: Bénéfices avec Onglets */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="lieux" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="lieux" className="text-base py-3">
                  <Building2 className="mr-2 h-4 w-4" />
                  Pour les Lieux
                </TabsTrigger>
                <TabsTrigger value="marques" className="text-base py-3">
                  <Palette className="mr-2 h-4 w-4" />
                  Pour les Marques
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="lieux">
                <Card className="border-2">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Pour les Lieux de Réception</h3>
                    <div className="space-y-4">
                      {beneficesLieux.map((benefice, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-premium-sage/10 flex items-center justify-center text-premium-sage">
                            {benefice.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{benefice.title}</h4>
                            <p className="text-sm text-muted-foreground">{benefice.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                      <Button className="bg-premium-sage hover:bg-premium-sage/90">
                        Simuler mes revenus
                      </Button>
                      <Button variant="outline" className="border-premium-sage text-premium-sage hover:bg-premium-sage/10">
                        Voir une démo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="marques">
                <Card className="border-2">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Pour les Marques & Prestataires</h3>
                    <div className="space-y-4">
                      {beneficesMarques.map((benefice, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-premium-sage/10 flex items-center justify-center text-premium-sage">
                            {benefice.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{benefice.title}</h4>
                            <p className="text-sm text-muted-foreground">{benefice.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                      <Button className="bg-premium-sage hover:bg-premium-sage/90">
                        Calculer mon ROI
                      </Button>
                      <Button variant="outline" className="border-premium-sage text-premium-sage hover:bg-premium-sage/10">
                        Demander une démo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Section 5: Témoignages */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Ils ont rejoint Mariable
            </h2>
            
            <div className="max-w-2xl mx-auto relative">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].stars)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground mb-6 italic">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground">{testimonials[currentTestimonial].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].company}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${testimonials[currentTestimonial].type === 'lieu' ? 'bg-slate-100 text-slate-600' : 'bg-premium-sage/10 text-premium-sage'}`}>
                      {testimonials[currentTestimonial].type === 'lieu' ? 'Lieu' : 'Marque'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-2 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentTestimonial ? 'bg-premium-sage w-4' : 'bg-muted'}`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Simulateur */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              💰 Simulez vos revenus
            </h2>
            
            <Card className="max-w-2xl mx-auto border-2">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-medium text-foreground">Combien de mariages faites-vous par an ?</label>
                      <span className="font-bold text-premium-sage">{mariagesParAn[0]} mariages</span>
                    </div>
                    <Slider
                      value={mariagesParAn}
                      onValueChange={setMariagesParAn}
                      max={100}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5</span>
                      <span>100</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-medium text-foreground">Panier moyen de vos couples ?</label>
                      <span className="font-bold text-premium-sage">{panierMoyen[0].toLocaleString()}€</span>
                    </div>
                    <Slider
                      value={panierMoyen}
                      onValueChange={setPanierMoyen}
                      max={60000}
                      min={10000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>10K€</span>
                      <span>60K€</span>
                    </div>
                  </div>
                  
                  <Card className="bg-gradient-to-r from-premium-sage to-premium-sage/80 text-white">
                    <CardContent className="p-6">
                      <h4 className="font-bold mb-4">📊 VOS REVENUS ESTIMÉS</h4>
                      <div className="space-y-2 text-sm mb-4">
                        <p>Couples utilisant le réseau: <strong>{couplesUtilisant} (60%)</strong></p>
                        <p>Commission moyenne/couple: <strong>{commissionMoyenne}€</strong></p>
                      </div>
                      <div className="text-center py-4 bg-white/10 rounded-lg mb-4">
                        <p className="text-sm mb-1">🎉 REVENUS ANNUELS</p>
                        <p className="text-4xl font-bold">{revenusAnnuels.toLocaleString()}€</p>
                      </div>
                      <div className="text-sm text-center text-white/80">
                        <p>Temps investi: {Math.round(tempsInvesti)} min/an (30 sec/couple)</p>
                        <p>Taux horaire équivalent: <strong>{tauxHoraire.toLocaleString()}€/h</strong></p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Button 
                    className="w-full bg-premium-sage hover:bg-premium-sage/90 py-6"
                    onClick={() => navigate('/devenir-partenaire')}
                  >
                    Demander un rendez-vous
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 7: FAQ */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Questions fréquentes
            </h2>
            
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Section 8: CTA Final */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à générer des revenus passifs ?
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4 text-slate-300 mb-10">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-premium-sage" /> Sans risque
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-premium-sage" /> Sans investissement
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-premium-sage" /> Test gratuit 6 mois
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg"
                onClick={() => navigate('/devenir-partenaire')}
                className="bg-premium-sage hover:bg-premium-sage/90 text-white px-8 py-6 text-lg"
              >
                <Building2 className="mr-2 h-5 w-5" />
                Lieux: Rejoindre le réseau
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/devenir-partenaire')}
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                <Palette className="mr-2 h-5 w-5" />
                Marques: Demander une démo
              </Button>
            </div>
            
            <p className="text-slate-400 flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />
              Ou appelez-nous: 06 XX XX XX XX
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AccueilProfessionnels;

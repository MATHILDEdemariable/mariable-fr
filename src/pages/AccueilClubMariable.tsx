import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import PremiumHeader from '@/components/home/PremiumHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Star, ArrowRight, Gift, Users, Clock, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AccueilClubMariable = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const privileges = [
    { icon: '👗', title: 'Robes & Tenues', benefit: "Jusqu'à -150€ + accessoires offerts", savings: '200€' },
    { icon: '💍', title: 'Alliances & Bijoux', benefit: "Jusqu'à -105€ + gravure offerte", savings: '150€' },
    { icon: '📸', title: 'Photo & Vidéo', benefit: 'Album offert ou heures supplémentaires', savings: '250-400€' },
    { icon: '🍽️', title: 'Traiteurs', benefit: 'Vaisselle & nappes offertes', savings: '600€' },
    { icon: '💐', title: 'Fleurs & Déco', benefit: "Jusqu'à -75€ + bouquets demoiselles offerts", savings: '150€' },
    { icon: '🎵', title: 'DJ & Animation', benefit: '1h supplémentaire ou éclairage premium', savings: '100-150€' },
    { icon: '📝', title: 'Papeterie & Faire-part', benefit: 'Menu tables offert ou livre d\'or', savings: '50-80€' },
  ];

  const steps = [
    { number: '1', icon: '🎫', title: 'RÉSERVEZ', description: 'Votre lieu vous donne un code VIP Pass' },
    { number: '2', icon: '📝', title: 'REJOIGNEZ LE CLUB', description: 'Inscrivez-vous gratuitement (2 minutes)' },
    { number: '3', icon: '🎁', title: 'PROFITEZ DES AVANTAGES', description: 'Accédez à 50+ pros premium avec avantages exclusifs' },
  ];

  const whyClub = [
    { icon: <Check className="h-6 w-6" />, title: 'Recommandés par votre lieu', description: 'Pas un annuaire générique. Ces pros sont validés par le lieu où vous vous mariez et nous. Double vérification.' },
    { icon: <Gift className="h-6 w-6" />, title: 'Économies réelles', description: '-5 à -20% sur chaque prestation OU cadeaux/services offerts (valeur 2x supérieure). Budget mariage allégé.' },
    { icon: <Shield className="h-6 w-6" />, title: '100% Gratuit', description: 'Aucun frais, aucun abonnement. Offert par votre lieu de réception.' },
    { icon: <Clock className="h-6 w-6" />, title: 'Simple & Rapide', description: 'Bénéficiez de nos outils en ligne et arrêtez les heures de recherche Google. Gagnez du temps et de la sérénité.' },
  ];

  const testimonials = [
    { name: 'Sophie & Marc', date: 'Mariés le 15 juin 2025', quote: "On a économisé 2 400€ sans effort. Notre robe, le photographe, le DJ... tout était recommandé par notre château. Zéro stress, que des bonnes surprises !", savings: '2 400€' },
    { name: 'Julie & Thomas', date: 'Mariés le 22 septembre 2024', quote: "Le Club Mariable nous a fait gagner un temps fou. Les prestataires sont tous excellents et les réductions vraiment intéressantes.", savings: '1 800€' },
    { name: 'Emma & Lucas', date: 'Mariés le 8 avril 2025', quote: "Grâce aux avantages du club, on a pu s'offrir un photographe haut de gamme dans notre budget. Merci !", savings: '2 100€' },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const faqItems = [
    { question: "Mon lieu n'est pas partenaire, comment faire ?", answer: "Parlez-en à votre lieu ! S'ils rejoignent Mariable, vous aurez accès à ces avantages rapidement !" },
    { question: "Je suis obligé d'utiliser ces pros ?", answer: "Non, c'est totalement optionnel. Mais ils sont recommandés par votre lieu et vous font économiser." },
    { question: "Comment je récupère mes réductions ?", answer: "Via VOTRE COMPTE mariable.fr vous accédez au code promotionnel des partenaires." },
    { question: "Les réductions sont-elles cumulables ?", answer: "Oui ! Vous pouvez cumuler les avantages de tous les partenaires du Club pour maximiser vos économies." },
  ];

  const marqueeCategories = '50+ Partenaires Premium • Robes • Costumes • Alliances • Photo • Vidéo • Traiteurs • Fleuristes • DJ • Déco • Papeterie • ';

  return (
    <div className="min-h-screen flex flex-col bg-premium-base">
      <SEO 
        title="Rejoignez le Club Mariable - Privilèges exclusifs pour votre mariage"
        description="Accédez aux meilleurs prestataires au meilleur prix. Économisez 1 500€ à 3 000€ sur votre mariage grâce aux avantages exclusifs du Club Mariable."
        keywords="club mariage, réductions mariage, avantages prestataires, économies mariage, VIP mariage"
      />
      
      <PremiumHeader />
      
      <main className="flex-grow">
        {/* Section 1: Hero avec vidéo */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            >
              <source 
                src="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4" 
                type="video/mp4" 
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
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
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20"
              >
                <Sparkles className="h-5 w-5 text-premium-cream" />
                <span className="text-premium-cream font-medium">Club Privé Exclusif</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6"
              >
                Rejoignez le <span className="text-premium-cream">Club Mariable</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl md:text-2xl text-white/90 mb-10 font-light"
              >
                Un club privé exclusif pour bénéficier de privilèges uniques
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col gap-4 max-w-md mx-auto mb-12"
              >
                {['Accès aux meilleurs pros au meilleur prix', 'Accès à des outils en ligne pour planifier votre mariage facilement', 'Accès aux plus belles marques avec avantages'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-left bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                    <Check className="h-5 w-5 text-premium-cream flex-shrink-0" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="bg-premium-cream text-slate-900 hover:bg-white px-10 py-7 text-lg font-semibold shadow-2xl hover:shadow-premium-cream/20 transition-all duration-300 hover:scale-105"
                >
                  Créer mon compte gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-3 bg-white/60 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </section>

        {/* Bandeau défilant - Marquee */}
        <section className="py-4 bg-premium-sage/10 overflow-hidden border-y border-premium-sage/20">
          <div className="flex animate-marquee">
            <div className="flex items-center gap-4 whitespace-nowrap">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-lg font-medium text-premium-sage px-4">
                  {marqueeCategories}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 whitespace-nowrap">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-lg font-medium text-premium-sage px-4">
                  {marqueeCategories}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Comment ça marche */}
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
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative group"
                >
                  <Card className="text-center p-6 h-full border-2 border-transparent hover:border-premium-sage/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-b from-white to-premium-cream/20">
                    <CardContent className="pt-6">
                      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-premium-sage text-white font-bold mb-4 text-lg shadow-lg">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 font-serif">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-premium-sage animate-pulse" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Vos Privilèges */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Vos Privilèges Mariable
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Des avantages exclusifs négociés pour vous auprès de nos partenaires premium
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto mb-12">
              {privileges.map((privilege, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-500 border-2 hover:border-premium-sage/40 group hover:-translate-y-1 h-full">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-4 group-hover:scale-110 group-hover:animate-float transition-transform duration-300">{privilege.icon}</div>
                      <h3 className="font-bold text-foreground mb-2 font-serif">{privilege.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{privilege.benefit}</p>
                      <div className="flex items-center gap-2 text-premium-sage font-semibold bg-premium-sage/10 px-3 py-2 rounded-full w-fit">
                        <Gift className="h-4 w-4" />
                        <span>Économie: {privilege.savings}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto"
            >
              <Card className="bg-gradient-to-r from-premium-sage to-premium-sage/80 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
                <CardContent className="p-8 text-center relative z-10">
                  <div className="text-4xl mb-3 animate-float">💎</div>
                  <h3 className="text-2xl font-serif font-bold mb-2">TOTAL ÉCONOMIES</h3>
                  <p className="text-4xl font-bold">1 500€ à 3 000€</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Section 4: Pourquoi le Club */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-bold text-center text-foreground mb-16"
            >
              Pourquoi le Club Mariable ?
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {whyClub.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 hover:border-premium-sage/40 transition-all duration-500 hover:shadow-xl group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-premium-sage/10 flex items-center justify-center text-premium-sage group-hover:bg-premium-sage group-hover:text-white transition-all duration-300">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-2 font-serif text-lg">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
              Ils font partie du Club
            </motion.h2>
            
            <div className="max-w-2xl mx-auto relative">
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
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-lg text-foreground mb-6 italic leading-relaxed">
                      "{testimonials[currentTestimonial].quote}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground font-serif">{testimonials[currentTestimonial].name}</p>
                        <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].date}</p>
                      </div>
                      <div className="bg-premium-sage/10 px-4 py-2 rounded-full">
                        <span className="text-premium-sage font-bold">{testimonials[currentTestimonial].savings} économisés</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
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

        {/* Section 6: FAQ */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-bold text-center text-foreground mb-16"
            >
              Vos Questions
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
        <section className="py-20 md:py-28 bg-gradient-to-r from-premium-sage to-premium-sage/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container mx-auto px-4 text-center relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">
              Prêt à profiter de privilèges exclusifs ?
            </h2>
            
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white text-premium-sage hover:bg-premium-cream px-10 py-7 text-lg font-semibold shadow-2xl animate-pulse-glow hover:scale-105 transition-all duration-300 mb-10"
            >
              Créer un compte
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="flex flex-wrap justify-center gap-8 text-white/90">
              <span className="flex items-center gap-2 text-lg">
                <Check className="h-5 w-5" /> Gratuit
              </span>
              <span className="flex items-center gap-2 text-lg">
                <Check className="h-5 w-5" /> 2 minutes
              </span>
              <span className="flex items-center gap-2 text-lg">
                <Check className="h-5 w-5" /> Sans engagement
              </span>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AccueilClubMariable;

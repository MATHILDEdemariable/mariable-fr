import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import PremiumHeader from '@/components/home/PremiumHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Star, ArrowRight, Gift, Users, Clock, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const categories = ['Robes', 'Costumes', 'Alliances', 'Photo', 'Vidéo', 'Traiteurs', 'Fleuristes', 'DJ', 'Déco', 'Papeterie'];

  return (
    <div className="min-h-screen flex flex-col bg-premium-base">
      <SEO 
        title="Rejoignez le Club Mariable - Privilèges exclusifs pour votre mariage"
        description="Accédez aux meilleurs prestataires au meilleur prix. Économisez 1 500€ à 3 000€ sur votre mariage grâce aux avantages exclusifs du Club Mariable."
        keywords="club mariage, réductions mariage, avantages prestataires, économies mariage, VIP mariage"
      />
      
      <PremiumHeader />
      
      <main className="flex-grow">
        {/* Section 1: Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-premium-sage/10 via-premium-base to-premium-cream/30">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-premium-sage/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-5 w-5 text-premium-sage" />
                <span className="text-premium-sage font-medium">Club Privé Exclusif</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Rejoignez le <span className="text-premium-sage">Club Mariable</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Un club privé exclusif pour bénéficier de privilèges uniques
              </p>
              
              <div className="flex flex-col gap-4 max-w-md mx-auto mb-10">
                <div className="flex items-center gap-3 text-left">
                  <Check className="h-5 w-5 text-premium-sage flex-shrink-0" />
                  <span className="text-foreground">Accès aux meilleurs pros au meilleur prix</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Check className="h-5 w-5 text-premium-sage flex-shrink-0" />
                  <span className="text-foreground">Accès à des outils en ligne pour planifier votre mariage facilement</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Check className="h-5 w-5 text-premium-sage flex-shrink-0" />
                  <span className="text-foreground">Accès aux plus belles marques avec avantages</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-premium-sage hover:bg-premium-sage/90 text-white px-8 py-6 text-lg"
              >
                Créer mon compte gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Section 2: Comment ça marche */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Comment ça marche ?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="text-center p-6 h-full border-2 hover:border-premium-sage/50 transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="text-5xl mb-4">{step.icon}</div>
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-premium-sage text-white font-bold mb-4">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-premium-sage" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Vos Privilèges */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              Vos Privilèges Mariable
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Des avantages exclusifs négociés pour vous auprès de nos partenaires premium
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto mb-10">
              {privileges.map((privilege, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-premium-sage/30">
                  <CardContent className="p-5">
                    <div className="text-3xl mb-3">{privilege.icon}</div>
                    <h3 className="font-bold text-foreground mb-2">{privilege.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{privilege.benefit}</p>
                    <div className="flex items-center gap-2 text-premium-sage font-semibold">
                      <Gift className="h-4 w-4" />
                      <span>Économie: {privilege.savings}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="max-w-md mx-auto">
              <Card className="bg-gradient-to-r from-premium-sage to-premium-sage/80 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">💎</div>
                  <h3 className="text-2xl font-bold mb-2">TOTAL ÉCONOMIES</h3>
                  <p className="text-3xl font-bold">1 500€ à 3 000€</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 4: Pourquoi le Club */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Pourquoi le Club Mariable ?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {whyClub.map((item, index) => (
                <Card key={index} className="border-2 hover:border-premium-sage/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-premium-sage/10 flex items-center justify-center text-premium-sage">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Témoignages */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Ils font partie du Club
            </h2>
            
            <div className="max-w-2xl mx-auto relative">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground mb-6 italic">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground">{testimonials[currentTestimonial].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].date}</p>
                    </div>
                    <div className="bg-premium-sage/10 px-4 py-2 rounded-full">
                      <span className="text-premium-sage font-bold">{testimonials[currentTestimonial].savings} économisés</span>
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

        {/* Section 6: Partenaires */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              50+ Partenaires Premium
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-3xl mx-auto">
              {categories.map((category, index) => (
                <span key={index} className="px-4 py-2 bg-premium-cream/50 rounded-full text-muted-foreground">
                  {category}
                </span>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/selection')}
              className="border-premium-sage text-premium-sage hover:bg-premium-sage/10"
            >
              Voir tous les partenaires
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Section 7: FAQ */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-premium-cream/30 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Vos Questions
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
        <section className="py-16 md:py-24 bg-gradient-to-r from-premium-sage to-premium-sage/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à profiter de privilèges exclusifs ?
            </h2>
            
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white text-premium-sage hover:bg-white/90 px-8 py-6 text-lg mb-8"
            >
              Créer un compte
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="flex flex-wrap justify-center gap-6 text-white/90">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" /> Gratuit
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" /> 2 minutes
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" /> Sans engagement
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AccueilClubMariable;

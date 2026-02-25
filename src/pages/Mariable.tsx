import React, { useEffect } from "react";
// Force rebuild - resolve stale HMR cache
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Heart, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import ChatbotButton from "@/components/ChatbotButton";
import SEO from "@/components/SEO";
import PremiumToolsCoordinationSection from "@/components/home/PremiumToolsCoordinationSection";
import VenuesSection from "@/components/home/VenuesSection";
import BlogSection from "@/components/home/BlogSection";
import CartIcon from "@/components/cart/CartIcon";
const VIDEO_URL = "https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4";

// Hero Section - Single CTA
const HeroSection = () => <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
    {/* Video Background */}
    <div className="absolute inset-0 z-0">
      <video autoPlay muted loop playsInline className="w-full h-full object-cover">
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
    </div>

    <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 text-center">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} className="max-w-4xl mx-auto">



        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-white mb-4 md:mb-6 leading-tight px-2 lg:text-6xl">
          Tout pour organiser un mariage parfait
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 md:mb-10 font-sans px-4">
          Les meilleurs outils d'organisation & prestataires mariage au même endroit
        </p>

        {/* Single CTA - Navigate to register - Style flag like Club badge */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.7,
        duration: 0.5
      }} className="flex justify-center px-4">
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" className="backdrop-blur-sm border border-white/30 px-6 md:px-10 py-5 md:py-6 text-base md:text-lg transition-all w-full sm:w-auto rounded-none bg-editorial-beige text-primary">
              Créer mon compte gratuit
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>;

// Testimonials Section - kept from original
const TestimonialsSection = () => {
  const testimonials = [{
    quote: "Les outils de planification sont incroyables ! Le budget tracker et la checklist nous ont permis de tout organiser sans stress.",
    author: "Sophie & Marc",
    location: "Mariage en Provence"
  }, {
    quote: "On a trouvé notre lieu sur le guide et l'appli du jour-J change la donne. On a pu tout anticiper sans rien oublier et partager les infos à nos témoins. Chacun pouvait gérer facilement sur son smartphone, hyper pratique, on recommande !",
    author: "Julie & Thomas",
    location: "Mariage à Paris"
  }, {
    quote: "Le service WhatsApp est super pratique ! On a eu des réponses rapides et des conseils personnalisés pour notre mariage.",
    author: "Emma & Lucas",
    location: "Mariage en Bretagne"
  }];
  return <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.header initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-8 md:mb-12">
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir mb-4">
            Ils ont organisé leur mariage avec Mariable
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1,
          duration: 0.5
        }} className="bg-white p-5 md:p-6 border border-editorial-noir/10">
              <Quote className="w-6 h-6 md:w-8 md:h-8 text-editorial-beige mb-3 md:mb-4" />
              <p className="text-sm md:text-base text-editorial-noir mb-4 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />)}
                </div>
              </div>
              <p className="font-semibold text-editorial-noir mt-2 text-sm md:text-base">
                {testimonial.author}
              </p>
              <p className="text-xs md:text-sm text-editorial-noir/60">{testimonial.location}</p>
            </motion.div>)}
        </div>
      </div>
    </section>;
};

// FAQ Section
const FAQSection = () => {
  const faqItems = [{
    question: "Comment organiser mon mariage étape par étape ?",
    answer: "Mariable vous accompagne à chaque étape : 1) Créez votre compte gratuit, 2) Utilisez notre checklist intelligente pour planifier les grandes étapes, 3) Parcourez nos prestataires ou demandez une sélection personnalisée, 4) Gérez votre budget avec notre calculateur, 5) Coordonnez le jour J avec notre outil de planning. Tous nos outils sont accessibles gratuitement."
  }, {
    question: "Comment calculer le budget de mon mariage ?",
    answer: "Notre calculateur de budget vous aide à estimer et répartir votre enveloppe. Il prend en compte le nombre d'invités, la région, la saison et vos prestataires. Vous obtenez une estimation réaliste par poste (lieu, traiteur, photo, DJ, etc.) et pouvez suivre vos dépenses en temps réel. L'outil est 100% gratuit."
  }, {
    question: "Mariable est-il vraiment gratuit ?",
    answer: "Oui, de nombreuses fonctionnalités sont 100% gratuites : tableau de bord, checklist, calculateur de budget, gestion des invités, plan de table, et coordination jour J. La recherche de prestataires est également gratuite. Mariable propose également des fonctionnalités premium à découvrir pour aller plus loin dans l'organisation de votre mariage."
  }, {
    question: "Que comprend le Premium et quel est le prix ?",
    answer: "Le compte Premium Mariable est disponible à 29€ (paiement unique, accès à vie). Il comprend : export illimité de vos PDF personnalisés, accès complet aux checklists et guides, utilisation IA sans limite, stockage illimité de documents, et plus de 3 lignes par catégorie de budget."
  }];
  return <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.header initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-8 md:mb-16 px-2">
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir">
            Questions fréquentes sur l'organisation de mariage
          </h2>
        </motion.header>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
            {faqItems.map((item, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 10
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }}>
                <AccordionItem value={`item-${index}`} className="border border-editorial-noir/10 px-4 md:px-6 hover:border-editorial-beige transition-all duration-300 bg-white">
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4 md:py-5 font-serif text-sm md:text-base text-editorial-noir">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-editorial-noir/70 pb-4 md:pb-5 text-sm md:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>)}
          </Accordion>
        </div>
      </div>
    </section>;
};

// Final CTA Section
const FinalCTASection = () => <section className="py-12 md:py-20 bg-editorial-beige">
    <div className="container mx-auto px-4">
      <motion.header initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.6
    }} className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl px-2 text-editorial-noir">
          Rejoignez le club Mariable
        </h2>
      </motion.header>
      <div className="text-center max-w-3xl mx-auto">

        <div className="flex flex-col gap-3 md:gap-4 justify-center px-2">
          <Link to="/register" className="w-full sm:w-auto sm:mx-auto">
            <Button size="lg" className="bg-editorial-noir text-white hover:bg-editorial-noir/80 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg shadow-lg w-full rounded-none">
              Rejoindre le Club
              <Heart className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/mariable.ambassadeur" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-white/40 text-white px-6 md:px-8 py-4 md:py-6 text-sm md:text-lg w-full bg-primary">
                Devenir Lieu Ambassadeur   
              </Button>
            </Link>
            <Link to="/mariable.partenaire" className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="text-white/80 hover:text-white px-6 py-4 md:py-6 text-sm md:text-lg w-full bg-primary">
                Devenir Partenaire
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>;

// Main Page Component
const Mariable = () => {
  const navigate = useNavigate();

  // Détecter les erreurs d'auth ou tokens de recovery dans le hash fragment et rediriger vers /auth/callback
  useEffect(() => {
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const errorParam = hashParams.get('error');
      const errorCode = hashParams.get('error_code');
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      const code = hashParams.get('code');

      // Rediriger si erreur OU si c'est un flux de recovery/auth avec tokens
      if (errorParam || errorCode || type === 'recovery' || accessToken || code) {
        console.log('[Mariable] Redirecting auth hash to callback:', {
          type,
          hasError: !!errorParam
        });
        navigate(`/auth/callback${window.location.hash}`, {
          replace: true
        });
        return;
      }
    }
  }, [navigate]);
  return <>
      <SEO title="Organiser son mariage facilement | Mariable" description="Outils gratuits pour organiser votre mariage : checklist, budget, RSVP, coordination jour-J et sélection de prestataires vérifiés partout en France." canonical="/" keywords="organiser mariage, wedding planner digital, professionnels mariage, organisation mariage, coordination jour-j, prestataires mariage, checklist mariage, budget mariage" />

      <div className="min-h-screen bg-editorial-beige">
        <PremiumHeader />
        <CartIcon />

        <main>
          <HeroSection />
          <VenuesSection />
          <PremiumToolsCoordinationSection />
          <BlogSection />
          <TestimonialsSection />
          <FAQSection />
          <FinalCTASection />
        </main>

        <Footer />
        <ChatbotButton />
      </div>
    </>;
};
export default Mariable;
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Gift, ListChecks, ArrowRight, Sparkles, Heart, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import ChatbotButton from "@/components/ChatbotButton";
import SEO from "@/components/SEO";
import PremiumTestimonialsSection from "@/components/home/PremiumTestimonialsSection";
import PremiumToolsCoordinationSection from "@/components/home/PremiumToolsCoordinationSection";

const VIDEO_URL = "https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4";

// Hero Section - Single CTA
const HeroSection = () => (
  <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
    {/* Video Background */}
    <div className="absolute inset-0 z-0">
      <video autoPlay muted loop playsInline className="w-full h-full object-cover">
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
    </div>

    <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 md:px-4 md:py-2 mb-6 md:mb-8"
        >
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
          <span className="text-white/90 text-xs md:text-sm font-medium">Club des futurs mariés</span>
        </motion.div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-2 lg:text-6xl">
          Vivez un jour-J exceptionnel
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 md:mb-10 font-sans px-4">
          Les plus beaux lieux, les meilleurs professionnels & les bons outils d'organisation au même endroit
        </p>

        {/* Single CTA - Navigate to register */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex justify-center px-4"
        >
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-editorial-olive hover:bg-editorial-noir text-white px-6 md:px-10 py-5 md:py-6 text-base md:text-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              Créer votre mariage
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Couples Section - Enhanced with impactful cards
const CouplesSection = () => {
  const benefits = [
    {
      icon: CheckCircle,
      title: "Accès aux meilleurs professionnels vérifiés",
      description: "Des prestataires sélectionnés et recommandés par votre lieu"
    },
    {
      icon: Gift,
      title: "Prix préférentiels & privilèges club",
      description: "Des promotions et avantages exclusifs chez tous nos partenaires"
    },
    {
      icon: ListChecks,
      title: "Outils en ligne pour planifier facilement",
      description: "Gestion budget, liste invités et plan de table, coordination Jour-J... tout en un seul endroit"
    }
  ];

  return (
    <section id="couples-section" className="py-12 md:py-20 bg-editorial-beige">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-editorial-noir mb-8 md:mb-12 px-2">
            Facilitez votre organisation & bénéficiez d'avantages exclusifs
          </h2>

          {/* 3 Key Benefits with white cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -8 }}
                className="relative bg-white p-6 md:p-8 border border-editorial-noir/10 
                           hover:shadow-lg transition-all duration-500 cursor-pointer text-left"
              >
                {/* Icon */}
                <motion.div
                  className="relative z-10 w-12 h-12 md:w-14 md:h-14 bg-editorial-olive/10 
                             flex items-center justify-center mb-4 md:mb-6"
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <benefit.icon className="w-6 h-6 md:w-7 md:h-7 text-editorial-olive" />
                </motion.div>

                <h4 className="relative z-10 font-serif font-bold text-lg md:text-xl text-editorial-noir mb-2 md:mb-3">
                  {benefit.title}
                </h4>
                <p className="relative z-10 text-sm md:text-base text-editorial-noir/70">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-editorial-olive hover:bg-editorial-noir text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg w-full"
              >
                Créer un compte gratuit
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "On a économisé 2 400€ grâce au Club Mariable. Les avantages exclusifs sont vraiment intéressants.",
      author: "Sophie & Marc",
      location: "Mariage en Provence"
    },
    {
      quote: "Le Club Mariable nous a fait gagner un temps fou. Tous les prestataires sont vérifiés et fiables.",
      author: "Julie & Thomas",
      location: "Mariage à Paris"
    },
    {
      quote: "Grâce aux avantages du club, on a pu s'offrir un photographe qu'on pensait hors budget !",
      author: "Emma & Lucas",
      location: "Mariage en Bretagne"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-editorial-beige">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-editorial-noir mb-4">
            Ils ont rejoint le Club
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white p-5 md:p-6 border border-editorial-noir/10"
            >
              <Quote className="w-6 h-6 md:w-8 md:h-8 text-editorial-olive/30 mb-3 md:mb-4" />
              <p className="text-sm md:text-base text-editorial-noir mb-4 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="font-semibold text-editorial-noir mt-2 text-sm md:text-base">
                {testimonial.author}
              </p>
              <p className="text-xs md:text-sm text-editorial-noir/60">{testimonial.location}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const faqItems = [
    {
      question: "Comment organiser mon mariage étape par étape ?",
      answer: "Mariable vous accompagne à chaque étape : 1) Créez votre compte gratuit, 2) Utilisez notre checklist intelligente pour planifier les grandes étapes, 3) Parcourez nos prestataires ou demandez une sélection personnalisée, 4) Gérez votre budget avec notre calculateur, 5) Coordonnez le jour J avec notre outil de planning. Tous nos outils sont accessibles gratuitement."
    },
    {
      question: "Comment calculer le budget de mon mariage ?",
      answer: "Notre calculateur de budget vous aide à estimer et répartir votre enveloppe. Il prend en compte le nombre d'invités, la région, la saison et vos prestataires. Vous obtenez une estimation réaliste par poste (lieu, traiteur, photo, DJ, etc.) et pouvez suivre vos dépenses en temps réel. L'outil est 100% gratuit."
    },
    {
      question: "Mariable est-il vraiment gratuit ?",
      answer: "Oui, Mariable est entièrement gratuit ! Tous les outils de planification sont accessibles sans frais : tableau de bord, checklist, calculateur de budget, gestion des invités, plan de table, coordination jour J. La recherche de prestataires est également gratuite. Nous proposons optionnellement un service de sélection personnalisée premium (69€) pour ceux qui souhaitent un accompagnement plus poussé."
    },
    {
      question: "Comment je récupère mes réductions ?",
      answer: "Via VOTRE COMPTE mariable.fr vous accédez au code promotionnel des partenaires."
    },
    {
      question: "Les réductions sont-elles cumulables ?",
      answer: "Oui ! Vous pouvez cumuler les avantages de tous les partenaires du Club pour maximiser vos économies."
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-editorial-beige">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl md:text-5xl font-bold text-center text-editorial-noir mb-8 md:mb-16 px-2"
        >
          Vos Questions
        </motion.h2>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border border-editorial-noir/10 px-4 md:px-6 hover:border-editorial-olive transition-all duration-300 bg-white"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4 md:py-5 font-serif text-sm md:text-base text-editorial-noir">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-editorial-noir/70 pb-4 md:pb-5 text-sm md:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTASection = () => (
  <section className="py-12 md:py-20 bg-editorial-olive">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 px-2">
          Rejoignez le Club Mariable
        </h2>

        <div className="flex flex-col gap-3 md:gap-4 justify-center px-2">
          <Link to="/register" className="w-full sm:w-auto sm:mx-auto">
            <Button
              size="lg"
              className="bg-white text-editorial-olive hover:bg-editorial-beige px-6 md:px-8 py-5 md:py-6 text-base md:text-lg shadow-lg w-full"
            >
              Rejoindre le Club
              <Heart className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/mariable.ambassadeur" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-6 md:px-8 py-4 md:py-6 text-sm md:text-lg w-full"
              >
                Devenir Lieu Partenaire
              </Button>
            </Link>
            <Link to="/mariable.partenaire" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 px-6 py-4 md:py-6 text-sm md:text-lg w-full"
              >
                Devenir Partenaire
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// Main Page Component
const Mariable = () => {
  return (
    <>
      <SEO
        title="Mariable - Le Club Privé des Futurs Mariés | Professionnels & Prix Préférentiels"
        description="Rejoignez le Club Mariable : accès gratuit aux meilleurs professionnels et marques du mariage avec des prix préférentiels. Outils de planification, coordination Jour-J et accompagnement personnalisé."
        canonical="/"
        keywords="mariage, wedding planner digital, professionnels mariage, club mariable, organisation mariage, coordination jour-j, prestataires mariage"
      />

      <div className="min-h-screen bg-editorial-beige">
        <PremiumHeader />

        <main>
          <HeroSection />
          <CouplesSection />
          <PremiumToolsCoordinationSection />
          <PremiumTestimonialsSection />
          <FAQSection />
          <FinalCTASection />
        </main>

        <Footer />
        <ChatbotButton />
      </div>
    </>
  );
};

export default Mariable;

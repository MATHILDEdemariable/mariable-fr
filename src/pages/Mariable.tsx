import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Gift, Users, ArrowRight, ArrowDown, Sparkles, Heart, Calculator, Star, Quote, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import ChatbotButton from "@/components/ChatbotButton";
import SEO from "@/components/SEO";
const VIDEO_URL = "https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4";

// Hero Section - Single CTA
const HeroSection = () => <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Video Background */}
    <div className="absolute inset-0 z-0">
      <video autoPlay muted loop playsInline className="w-full h-full object-cover">
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
    </div>

    <div className="relative z-10 container mx-auto px-4 py-20 text-center">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} className="max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.2,
        duration: 0.5
      }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-premium-sage-light" />
          <span className="text-white/90 text-sm font-medium">Club Privé Exclusif</span>
        </motion.div>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Le Club des Futurs Mariés
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/80 mb-10 font-sans">Les meilleurs professionnels & outils d'organisation en ligne. </p>

        {/* Single CTA - Scroll to concept with smooth behavior */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.7,
        duration: 0.5
      }} className="flex justify-center">
          <Button size="lg" onClick={() => document.getElementById("couples-section")?.scrollIntoView({
          behavior: "smooth"
        })} className="bg-premium-sage hover:bg-premium-sage-dark text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
            Découvrir le concept
            <ArrowDown className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </section>;

// Couples Section - Enhanced with impactful cards
const CouplesSection = () => {
  const benefits = [{
    emoji: "✅",
    title: "Accès aux meilleurs professionnels vérifiés",
    description: "Des prestataires sélectionnés et recommandés par votre lieu"
  }, {
    emoji: "🎁",
    title: "Prix préférentiels & privilèges club",
    description: "Des promotions et avantages exclusifs chez tous nos partenaires"
  }, {
    emoji: "📋",
    title: "Outils en ligne pour planifier facilement",
    description: "Gestion budget, liste invités et plan de table, coordination Jour-J... tout en un seul endroit"
  }];
  return <section id="couples-section" className="py-20 bg-[#efeee9]">
      <div className="container mx-auto px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-12">Facilitez votre organisation & bénéficiez d'avantages exclusifs </h2>

          {/* 3 Key Benefits with white cards and black icons */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {benefits.map((benefit, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.15,
            duration: 0.5,
            ease: "easeOut"
          }} whileHover={{
            y: -8
          }} className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 
                           hover:shadow-2xl transition-all duration-500 cursor-pointer text-left">
                {/* iPhone-style floating emoji */}
                <motion.div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-white to-gray-100 
                             flex items-center justify-center mb-6 shadow-lg border border-gray-100
                             hover:shadow-xl hover:-translate-y-1 transition-all duration-300" whileHover={{
              scale: 1.05,
              y: -4
            }} transition={{
              type: "spring",
              stiffness: 400,
              damping: 15
            }}>
                  <span className="text-2xl">{benefit.emoji}</span>
                </motion.div>

                {/* Content */}
                <h4 className="relative z-10 font-serif font-bold text-xl text-foreground mb-3">{benefit.title}</h4>
                <p className="relative z-10 text-muted-foreground">{benefit.description}</p>
              </motion.div>)}
          </div>

          {/* Double CTA with smooth scroll */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" onClick={() => document.getElementById("simulateur")?.scrollIntoView({
            behavior: "smooth"
          })} className="border-premium-sage text-premium-sage hover:bg-premium-sage/10 px-8 py-6 text-lg rounded-full">
              <Calculator className="mr-2 w-5 h-5" />
              Simuler les économies
            </Button>
            <Link to="/register">
              <Button size="lg" className="bg-premium-sage hover:bg-premium-sage-dark text-white px-8 py-6 text-lg rounded-full">
                Rejoindre le Club
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>;
};

// Savings Simulator Section
const SavingsSimulatorSection = () => {
  const [budget, setBudget] = useState([25000]);
  const [providers, setProviders] = useState([4]);
  const minSavings = Math.round(budget[0] * 0.05 * providers[0] / 8);
  const maxSavings = Math.round(budget[0] * 0.15 * providers[0] / 8);
  return <section id="simulateur" className="py-20 bg-[#efeee9] scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-premium-sage/10 text-premium-sage-dark rounded-full px-4 py-1.5 mb-4">
              <Calculator className="w-4 h-4" />
              <span className="text-sm font-medium">Simulateur d'économies</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Combien pouvez-vous économiser ?
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-border">
            {/* Budget Slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium text-foreground">Budget global mariage</label>
                <span className="text-lg font-bold text-premium-sage">{budget[0].toLocaleString()}€</span>
              </div>
              <Slider value={budget} onValueChange={setBudget} min={15000} max={60000} step={1000} className="w-full" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>15 000€</span>
                <span>60 000€</span>
              </div>
            </div>

            {/* Providers Slider */}
            <div className="mb-10">
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium text-foreground">Prestataires via le Club</label>
                <span className="text-lg font-bold text-premium-sage">{providers[0]} prestataires</span>
              </div>
              <Slider value={providers} onValueChange={setProviders} min={1} max={8} step={1} className="w-full" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>1</span>
                <span>8</span>
              </div>
            </div>

            {/* Results */}
            <motion.div key={`${budget[0]}-${providers[0]}`} initial={{
            scale: 0.95
          }} animate={{
            scale: 1
          }} transition={{
            duration: 0.2
          }} className="bg-premium-sage-very-light rounded-xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">🎉 Économies estimées</p>
              <p className="font-serif text-4xl md:text-5xl font-bold text-premium-sage-dark">
                {minSavings.toLocaleString()}€ - {maxSavings.toLocaleString()}€
              </p>
              <p className="text-xs text-muted-foreground mt-2">Basé sur des réductions de 5 à 15% par prestataire</p>
            </motion.div>

            <div className="mt-8 text-center">
              <Link to="/register">
                <Button size="lg" className="bg-premium-sage hover:bg-premium-sage-dark text-white px-8 py-6 text-lg rounded-full">
                  Rejoindre le Club gratuitement
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [{
    quote: "On a économisé 2 400€ grâce au Club Mariable. Les avantages exclusifs sont vraiment intéressants.",
    author: "Sophie & Marc",
    location: "Mariage en Provence"
  }, {
    quote: "Le Club Mariable nous a fait gagner un temps fou. Tous les prestataires sont vérifiés et fiables.",
    author: "Julie & Thomas",
    location: "Mariage à Paris"
  }, {
    quote: "Grâce aux avantages du club, on a pu s'offrir un photographe qu'on pensait hors budget !",
    author: "Emma & Lucas",
    location: "Mariage en Bretagne"
  }];
  return <section className="py-20 bg-[#efeee9]">
      <div className="container mx-auto px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Ils ont rejoint le Club</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
        }} className="bg-white rounded-2xl p-6 border border-border shadow-lg">
              <Quote className="w-8 h-8 text-premium-sage/30 mb-4" />
              <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
              </div>
              <p className="font-semibold text-foreground mt-2">{testimonial.author}</p>
              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
            </motion.div>)}
        </div>
      </div>
    </section>;
};

// FAQ Section
const FAQSection = () => {
  const faqItems = [{
    question: "Mon lieu n'est pas partenaire, comment faire ?",
    answer: "Parlez-en à votre lieu ! S'ils rejoignent Mariable, vous aurez accès à ces avantages rapidement !"
  }, {
    question: "Je suis obligé d'utiliser ces pros ?",
    answer: "Non, c'est totalement optionnel. Mais ils sont recommandés par votre lieu et vous font économiser."
  }, {
    question: "Comment je récupère mes réductions ?",
    answer: "Via VOTRE COMPTE mariable.fr vous accédez au code promotionnel des partenaires."
  }, {
    question: "Les réductions sont-elles cumulables ?",
    answer: "Oui ! Vous pouvez cumuler les avantages de tous les partenaires du Club pour maximiser vos économies."
  }];
  return <section className="py-20 bg-[#efeee9]">
      <div className="container mx-auto px-4">
        <motion.h2 initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="font-serif text-3xl md:text-5xl font-bold text-center text-foreground mb-16">
          Vos Questions
        </motion.h2>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
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
                <AccordionItem value={`item-${index}`} className="border-2 rounded-xl px-6 hover:border-premium-sage/40 hover:shadow-lg transition-all duration-300">
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-5 font-serif">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">{item.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>)}
          </Accordion>
        </div>
      </div>
    </section>;
};

// Final CTA Section
const FinalCTASection = () => <section className="py-20 bg-gradient-to-br from-premium-sage via-premium-sage-dark to-premium-sage">
    <div className="container mx-auto px-4">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.6
    }} className="text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-8">Rejoignez le Club Mariable</h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" className="bg-white text-premium-sage-dark hover:bg-white/90 px-8 py-6 text-lg rounded-full shadow-lg">
              Rejoindre le Club
              <Heart className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/mariable.ambassadeur">
            <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full">
              Devenir Lieu Partenaire
            </Button>
          </Link>
          <Link to="/mariable.partenaire">
            <Button size="lg" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 px-6 py-6 text-lg rounded-full">
              Devenir Partenaire
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>;

// Main Page Component
const Mariable = () => {
  return <>
      <SEO title="Mariable - Le Club Privé des Futurs Mariés | Professionnels & Prix Préférentiels" description="Rejoignez le Club Mariable : accès gratuit aux meilleurs professionnels et marques du mariage avec des prix préférentiels. Outils de planification, coordination Jour-J et accompagnement personnalisé." canonical="/" keywords="mariage, wedding planner digital, professionnels mariage, club mariable, organisation mariage, coordination jour-j, prestataires mariage" />

      <div className="min-h-screen bg-[#efeee9]">
        <PremiumHeader />

        <main>
          <HeroSection />
          <CouplesSection />
          <SavingsSimulatorSection />
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
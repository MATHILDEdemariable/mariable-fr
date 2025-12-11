import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Gift, 
  Users, 
  Building2, 
  Palette, 
  ArrowRight,
  ArrowDown,
  Sparkles,
  Heart,
  Calculator,
  Star,
  Quote,
  ListChecks,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';

const VIDEO_URL = "https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4";

// Hero Section - Single CTA
const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Video Background */}
    <div className="absolute inset-0 z-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
    </div>

    <div className="relative z-10 container mx-auto px-4 py-20 text-center">
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
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
        >
          <Sparkles className="w-4 h-4 text-premium-sage-light" />
          <span className="text-white/90 text-sm font-medium">Club Privé Exclusif</span>
        </motion.div>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Le Club Privé des Futurs Mariés
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/80 mb-4 font-sans">
          Les meilleurs professionnels & marques. Les meilleurs prix. Gratuitement.
        </p>

        {/* Gift Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-premium-sage/20 backdrop-blur-sm border border-premium-sage/30 rounded-full px-5 py-2.5 mb-10"
        >
          <Gift className="w-5 h-5 text-premium-sage-light" />
          <span className="text-white font-medium">Accès offert par votre lieu de réception</span>
        </motion.div>

        {/* Single CTA - Scroll to concept with smooth behavior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex justify-center"
        >
          <Button 
            size="lg" 
            onClick={() => document.getElementById('cercle-vertueux')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-premium-sage hover:bg-premium-sage-dark text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Découvrir le concept
            <ArrowDown className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Virtuous Circle Section with integrated How it Works
const VirtuousCircleSection = () => {
  const nodes = [
    { id: 'couples', label: 'Couples', icon: Heart, color: 'bg-pink-500', position: 'top' },
    { id: 'lieux', label: 'Lieux', icon: Building2, color: 'bg-sky-400', position: 'right' },
    { id: 'mariable', label: 'Mariable', icon: Sparkles, color: 'bg-premium-sage', position: 'bottom' },
    { id: 'partenaires', label: 'Partenaires', icon: Palette, color: 'bg-amber-300', position: 'left' },
  ];

  const steps = [
    {
      icon: Gift,
      title: "Le lieu envoie son lien Club",
      description: "Chaque lieu partenaire dispose d'un lien unique à partager avec ses couples"
    },
    {
      icon: Users,
      title: "Les mariés découvrent le Club",
      description: "Accès aux prestataires & marques partenaires avec avantages exclusifs"
    },
    {
      icon: Calculator,
      title: "Commission partagée",
      description: "Lorsqu'un couple réserve, la commission est répartie entre Mariable & le lieu"
    }
  ];

  return (
    <section id="cercle-vertueux" className="py-20 bg-premium-warm scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Un Club exclusif où chaque membre bénéficie
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tout le monde gagne : avantages, visibilité, revenu passif
          </p>
        </motion.div>

        {/* Two columns layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column: Circular Diagram (reduced size) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-sm mx-auto aspect-square"
          >
            {/* SVG Circle with animated arrows */}
            <svg className="w-full h-full" viewBox="0 0 400 400">
              {/* Circular path */}
              <circle
                cx="200"
                cy="200"
                r="140"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
              
              {/* Animated arrows */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "200px 200px" }}
              >
                {[0, 90, 180, 270].map((angle, i) => (
                  <g key={i} transform={`rotate(${angle} 200 200)`}>
                    <path
                      d="M200 60 L210 75 L200 70 L190 75 Z"
                      fill="hsl(var(--premium-sage))"
                      className="text-premium-sage"
                    />
                  </g>
                ))}
              </motion.g>
            </svg>

            {/* Nodes */}
            {nodes.map((node, index) => {
              const positions = {
                top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
                right: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
                bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
                left: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',
              };

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className={`absolute ${positions[node.position as keyof typeof positions]}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${node.color} flex items-center justify-center shadow-lg`}>
                      <node.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-foreground bg-background px-2 py-0.5 rounded-full shadow-sm">
                      {node.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Column: 3 steps vertically */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
              Comment ça marche ?
            </h3>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-premium-sage-very-light flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-premium-sage" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-premium-sage text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Couples Section - Simplified to 3 key points
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
      description: "Des réductions exclusives de 5 à 20% chez tous nos partenaires"
    },
    {
      icon: ListChecks,
      title: "Outils en ligne pour planifier facilement",
      description: "Gestion checklist, budget, coordination Jour-J... tout en un seul endroit"
    }
  ];

  return (
    <section id="couples-section" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-premium-sage-very-light text-premium-sage-dark rounded-full px-4 py-1.5 mb-6">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Accès 100% gratuit</span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-3">
            Pour les Couples
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Facilitez votre organisation & économisez
          </p>

          {/* 3 Key Benefits with enhanced animations */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-xl p-6 shadow-sm border border-border text-left cursor-pointer transition-all"
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-premium-sage-very-light flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <benefit.icon className="w-6 h-6 text-premium-sage" />
                </motion.div>
                <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Gift Badge with pulse animation */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-premium-sage/10 backdrop-blur-sm border border-premium-sage/20 rounded-xl px-5 py-3 mb-8"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Gift className="w-5 h-5 text-premium-sage" />
            <span className="text-premium-sage-dark font-medium">Offert par votre lieu de réception</span>
          </motion.div>

          {/* Double CTA with smooth scroll */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => document.getElementById('simulateur')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-premium-sage text-premium-sage hover:bg-premium-sage/10 px-8 py-6 text-lg rounded-full"
            >
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
    </section>
  );
};

// Combined Lieux & Partenaires Section - Uniform cards with new colors
const LieuxPartenairesSection = () => {
  const lieuxBenefits = [
    "Mini-site personnalisé du lieu",
    "Vos prestataires habituels mis en avant en priorité",
    "Service premium immédiat pour vos couples",
    "Revenu passif partagé (commissions générées)",
    "Zéro travail, zéro risque, zéro gestion"
  ];

  const partenairesBenefits = [
    "Référencement dans le Club Mariable",
    "Leads pré-qualifiés via les lieux",
    "Commission uniquement en cas de vente → 0 risque",
    "Visibilité ciblée et premium",
    "Possibilité d'offrir un avantage exclusif aux mariés"
  ];

  return (
    <section id="pros-section" className="py-20 bg-premium-cream/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-2">
            Pour les Professionnels
          </h2>
          <p className="text-lg text-muted-foreground">
            Lieux de réception, Prestataires & Marques : développez votre activité
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Lieux Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-background rounded-2xl p-8 shadow-lg border border-border"
          >
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 rounded-full px-3 py-1 mb-4">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Lieux</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
              Offrez plus, gagnez sans effort
            </h3>

            <Accordion type="single" collapsible className="mb-6">
              <AccordionItem value="avantages" className="border-none">
                <AccordionTrigger className="text-premium-sage-dark hover:no-underline py-2">
                  Voir les avantages
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {lieuxBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-premium-sage mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link to="/mariable.ambassadeur">
              <Button className="w-full bg-premium-sage hover:bg-premium-sage-dark text-white rounded-full">
                Devenir Lieu ambassadeur
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Partenaires Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-background rounded-2xl p-8 shadow-lg border border-border"
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-3 py-1 mb-4">
              <Palette className="w-4 h-4" />
              <span className="text-sm font-medium">Prestataires ou marques</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
              Plus de clients, sans prospection
            </h3>

            <Accordion type="single" collapsible className="mb-6">
              <AccordionItem value="avantages" className="border-none">
                <AccordionTrigger className="text-premium-sage-dark hover:no-underline py-2">
                  Voir les avantages
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {partenairesBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-premium-sage mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link to="/mariable.partenaire">
              <Button className="w-full bg-premium-sage hover:bg-premium-sage-dark text-white rounded-full">
                Devenir Partenaire
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Savings Simulator Section
const SavingsSimulatorSection = () => {
  const [budget, setBudget] = useState([25000]);
  const [providers, setProviders] = useState([4]);

  const minSavings = Math.round(budget[0] * 0.05 * providers[0] / 8);
  const maxSavings = Math.round(budget[0] * 0.15 * providers[0] / 8);

  return (
    <section id="simulateur" className="py-20 bg-gradient-to-br from-premium-sage-very-light via-background to-premium-sage-very-light/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-premium-sage/10 text-premium-sage-dark rounded-full px-4 py-1.5 mb-4">
              <Calculator className="w-4 h-4" />
              <span className="text-sm font-medium">Simulateur d'économies</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Combien pouvez-vous économiser ?
            </h2>
          </div>

          <div className="bg-background rounded-2xl p-8 shadow-xl border border-border">
            {/* Budget Slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium text-foreground">Budget global mariage</label>
                <span className="text-lg font-bold text-premium-sage">{budget[0].toLocaleString()}€</span>
              </div>
              <Slider
                value={budget}
                onValueChange={setBudget}
                min={15000}
                max={60000}
                step={1000}
                className="w-full"
              />
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
              <Slider
                value={providers}
                onValueChange={setProviders}
                min={1}
                max={8}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>1</span>
                <span>8</span>
              </div>
            </div>

            {/* Results */}
            <motion.div
              key={`${budget[0]}-${providers[0]}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-premium-sage-very-light rounded-xl p-6 text-center"
            >
              <p className="text-sm text-muted-foreground mb-2">🎉 Économies estimées</p>
              <p className="font-serif text-4xl md:text-5xl font-bold text-premium-sage-dark">
                {minSavings.toLocaleString()}€ - {maxSavings.toLocaleString()}€
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Basé sur des réductions de 5 à 15% par prestataire
              </p>
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ils ont rejoint le Club
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-premium-sage-very-light/30 rounded-2xl p-6 border border-border"
            >
              <Quote className="w-8 h-8 text-premium-sage/30 mb-4" />
              <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="font-semibold text-foreground mt-2">{testimonial.author}</p>
              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
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
    { question: "Mon lieu n'est pas partenaire, comment faire ?", answer: "Parlez-en à votre lieu ! S'ils rejoignent Mariable, vous aurez accès à ces avantages rapidement !" },
    { question: "Je suis obligé d'utiliser ces pros ?", answer: "Non, c'est totalement optionnel. Mais ils sont recommandés par votre lieu et vous font économiser." },
    { question: "Comment je récupère mes réductions ?", answer: "Via VOTRE COMPTE mariable.fr vous accédez au code promotionnel des partenaires." },
    { question: "Les réductions sont-elles cumulables ?", answer: "Oui ! Vous pouvez cumuler les avantages de tous les partenaires du Club pour maximiser vos économies." },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl md:text-5xl font-bold text-center text-foreground mb-16"
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
                <AccordionItem value={`item-${index}`} className="border-2 rounded-xl px-6 hover:border-premium-sage/40 hover:shadow-lg transition-all duration-300">
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
  );
};

// Final CTA Section
const FinalCTASection = () => (
  <section className="py-20 bg-gradient-to-br from-premium-sage via-premium-sage-dark to-premium-sage">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-8">
          Rejoignez le Club Mariable
        </h2>

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
      
      <div className="min-h-screen">
        <PremiumHeader />
        
        <main>
          <HeroSection />
          <VirtuousCircleSection />
          <CouplesSection />
          <LieuxPartenairesSection />
          <SavingsSimulatorSection />
          <TestimonialsSection />
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

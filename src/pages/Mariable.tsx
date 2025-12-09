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
  Sparkles,
  Heart,
  Calculator,
  Star,
  Quote
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
import SEO from '@/components/SEO';
import CouplesCarousel from '@/components/club-mariable/CouplesCarousel';

const VIDEO_URL = "https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4";

// Hero Section
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

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/register">
            <Button size="lg" className="bg-premium-sage hover:bg-premium-sage-dark text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              Rejoindre le Club
            </Button>
          </Link>
          <Link to="/accueilprofessionnels">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm">
              Devenir Lieu Partenaire
            </Button>
          </Link>
          <Link to="/accueilprofessionnels">
            <Button size="lg" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 px-6 py-6 text-lg rounded-full">
              Devenir Prestataire / Marque
            </Button>
          </Link>
        </motion.div>

        {/* Couples Carousel */}
        <CouplesCarousel />
      </motion.div>
    </div>
  </section>
);

// Virtuous Circle Section
const VirtuousCircleSection = () => {
  const nodes = [
    { id: 'couples', label: 'Couples', icon: Heart, color: 'bg-pink-500', position: 'top' },
    { id: 'lieux', label: 'Lieux', icon: Building2, color: 'bg-amber-500', position: 'right' },
    { id: 'mariable', label: 'Mariable', icon: Sparkles, color: 'bg-premium-sage', position: 'bottom' },
    { id: 'partenaires', label: 'Partenaires', icon: Palette, color: 'bg-purple-500', position: 'left' },
  ];

  return (
    <section className="py-20 bg-premium-warm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Un Club exclusif où chaque membre bénéficie
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tout le monde gagne : avantages, visibilité, revenu passif
          </p>
        </motion.div>

        {/* Circular Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-lg mx-auto aspect-square"
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
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${node.color} flex items-center justify-center shadow-lg`}>
                    <node.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-foreground bg-background px-3 py-1 rounded-full shadow-sm">
                    {node.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

// Couples Section
const CouplesSection = () => {
  const benefits = [
    "Accès aux meilleurs professionnels vérifiés",
    "Prix préférentiels & avantages exclusifs",
    "Outils gratuits : checklist, budget, coordination Jour-J",
    "Recommandations sur-mesure",
    "Aucun engagement"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-premium-sage-very-light text-premium-sage-dark rounded-full px-4 py-1.5 mb-6">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Accès 100% gratuit</span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">
            Facilitez votre organisation & économisez
          </h2>

          <div className="grid gap-4 text-left max-w-md mx-auto mb-8">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-premium-sage flex-shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* Gift Badge */}
          <div className="inline-flex items-center gap-2 bg-premium-sage/10 backdrop-blur-sm border border-premium-sage/20 rounded-xl px-5 py-3 mb-8">
            <Gift className="w-5 h-5 text-premium-sage" />
            <span className="text-premium-sage-dark font-medium">Offert par votre lieu de réception</span>
          </div>

          <div>
            <Link to="/register">
              <Button size="lg" className="bg-premium-sage hover:bg-premium-sage-dark text-white px-8 py-6 text-lg rounded-full">
                Rejoindre gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Combined Lieux & Partenaires Section
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

  const pourquoiCaMarche = [
    "Les couples veulent une sélection fiable",
    "Vous influencez leur choix intelligemment via votre sélection prioritaire",
    "Le club renforce votre image haut-de-gamme"
  ];

  return (
    <section className="py-20 bg-premium-sage-very-light/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Rejoignez le Club
          </h2>
          <p className="text-muted-foreground text-lg">
            Que vous soyez un lieu de réception ou un prestataire
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
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-3 py-1 mb-4">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Revenus passifs</span>
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

            {/* Pourquoi ça marche */}
            <div className="bg-premium-sage-very-light/50 rounded-xl p-4 mb-6">
              <p className="font-medium text-sm text-premium-sage-dark mb-2">Pourquoi ça marche :</p>
              <ul className="space-y-1.5">
                {pourquoiCaMarche.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-premium-sage">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/accueilprofessionnels">
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
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-3 py-1 mb-4">
              <Palette className="w-4 h-4" />
              <span className="text-sm font-medium">Acquisition qualifiée</span>
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

            <Link to="/accueilprofessionnels">
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

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      icon: Gift,
      title: "Le lieu envoie son lien Club",
      description: "Chaque lieu partenaire dispose d'un lien unique à partager avec ses couples"
    },
    {
      number: "2",
      icon: Users,
      title: "Les mariés découvrent le Club",
      description: "Accès aux prestataires & marques partenaires avec avantages exclusifs"
    },
    {
      number: "3",
      icon: Calculator,
      title: "Commission partagée",
      description: "Lorsqu'un couple réserve, la commission est répartie entre Mariable & le lieu"
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
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple, en 3 étapes
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="flex-1 text-center max-w-xs"
              >
                <div className="relative inline-flex mb-4">
                  <div className="w-20 h-20 rounded-full bg-premium-sage-very-light flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-premium-sage" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-premium-sage text-white font-bold flex items-center justify-center text-sm">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                  className="hidden md:block"
                >
                  <ArrowRight className="w-8 h-8 text-premium-sage/50" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
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
    <section className="py-20 bg-gradient-to-br from-premium-sage-very-light via-background to-premium-sage-very-light/30">
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
          <Link to="/accueilprofessionnels">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full">
              Devenir Lieu Partenaire
            </Button>
          </Link>
          <Link to="/accueilprofessionnels">
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
        title="Club Mariable - Le Club Privé des Futurs Mariés"
        description="Rejoignez le Club Mariable : accès gratuit aux meilleurs professionnels et marques du mariage avec des prix préférentiels. Offert par votre lieu de réception."
        canonical="/mariable"
      />
      
      <div className="min-h-screen">
        <PremiumHeader />
        
        <main>
          <HeroSection />
          <VirtuousCircleSection />
          <CouplesSection />
          <LieuxPartenairesSection />
          <HowItWorksSection />
          <SavingsSimulatorSection />
          <TestimonialsSection />
          <FinalCTASection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Mariable;

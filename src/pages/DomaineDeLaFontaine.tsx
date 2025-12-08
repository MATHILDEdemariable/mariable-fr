import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, Camera, Utensils, Flower2, Music, Heart, Gem, Check, ArrowRight, Gift, Sparkles, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const heroImage = "/lovable-uploads/69c7a322-7720-44d8-b344-e5d5b91363db.png";

const partners = [{
  icon: Camera,
  title: "Photo & Vidéo",
  benefit: "-10% ou album offert",
  contacts: [
    { name: "Studio Lumière", tel: "06 12 34 56 78", email: "contact@studiolumiere.fr" },
    { name: "Créa'Film", tel: "06 98 76 54 32", email: "info@creafilm.fr" }
  ]
}, {
  icon: Utensils,
  title: "Traiteur",
  benefit: "Vaisselle premium offerte",
  contacts: [
    { name: "Maison Gourmet", tel: "06 11 22 33 44", email: "contact@maisongourmet.fr" },
    { name: "L'Art des Saveurs", tel: "06 55 66 77 88", email: "info@artsaveurs.fr" }
  ]
}, {
  icon: Flower2,
  title: "Fleuriste",
  benefit: "-15% + bouquet offert",
  contacts: [
    { name: "Fleurs d'Exception", tel: "06 22 33 44 55", email: "contact@fleursexception.fr" },
    { name: "Atelier Végétal", tel: "06 66 77 88 99", email: "info@ateliervegetal.fr" }
  ]
}, {
  icon: Music,
  title: "DJ & Animation",
  benefit: "1h supplémentaire offerte",
  contacts: [
    { name: "DJ Max Events", tel: "06 33 44 55 66", email: "contact@djmaxevents.fr" },
    { name: "Sono Pro 31", tel: "06 77 88 99 00", email: "info@sonopro31.fr" }
  ]
}, {
  icon: Heart,
  title: "Robes & Costumes",
  benefit: "Jusqu'à -150€",
  contacts: [
    { name: "Atelier Mariée", tel: "06 44 55 66 77", email: "contact@ateliermariee.fr" },
    { name: "Gentleman Style", tel: "06 88 99 00 11", email: "info@gentlemanstyle.fr" }
  ]
}, {
  icon: Gem,
  title: "Alliances & Bijoux",
  benefit: "Gravure offerte",
  contacts: [
    { name: "Joaillerie du Sud", tel: "06 55 66 77 88", email: "contact@joailleriedusud.fr" },
    { name: "L'Écrin Précieux", tel: "06 99 00 11 22", email: "info@ecrinprecieux.fr" }
  ]
}];

const steps = [{
  number: "1",
  title: "Demandez votre code",
  description: "Remplissez le formulaire ci-dessous"
}, {
  number: "2",
  title: "Mentionnez-le au paiement",
  description: "Chez le partenaire de votre choix"
}, {
  number: "3",
  title: "Profitez des réductions",
  description: "Réduction immédiate ou cadeau"
}];

const bonusTools = ['Checklist IA', 'Budget', 'Invités', 'Planning Jour J', 'Plan de table', 'Calculatrice boisson'];

const PartnerCard = ({ partner, index }: { partner: typeof partners[0]; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="bg-card rounded-xl border border-border overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Header - Catégorie + Avantage */}
      <div className="p-5">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <partner.icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">{partner.title}</h3>
        
        <div className="flex items-center gap-1.5 text-primary font-medium text-sm mb-4">
          <Gift className="h-4 w-4" />
          <span>{partner.benefit}</span>
        </div>

        {/* Toggle contacts */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
          <span>{isOpen ? 'Masquer les contacts' : 'Voir les partenaires'}</span>
        </button>
      </div>

      {/* Collapsible contacts section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-border space-y-3">
              {partner.contacts.map((contact) => (
                <div key={contact.name} className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-sm text-foreground mb-2">{contact.name}</p>
                  <div className="space-y-1">
                    <a 
                      href={`tel:${contact.tel.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      {contact.tel}
                    </a>
                    <a 
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DomaineDeLaFontaine = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    weddingDate: ''
  });
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error("Veuillez accepter d'être contacté(e)");
      return;
    }
    if (!formData.email || !formData.whatsapp || !formData.firstName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('carnet_adresses_requests').insert({
        email: formData.email,
        whatsapp: formData.whatsapp,
        date_mariage: formData.weddingDate || null,
        consent_contact: consent,
        source_lieu: 'domaine_fontaine',
        commentaires: `${formData.firstName} ${formData.lastName}`
      });
      if (error) throw error;
      toast.success("🎉 Demande envoyée ! Vous recevrez votre code sous 24h par WhatsApp.");
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        whatsapp: '',
        weddingDate: ''
      });
      setConsent(false);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Avantages exclusifs - Domaine de la Fontaine | Mariable" 
        description="Bénéficiez de réductions exclusives de 5% à 20% chez nos partenaires pour votre mariage au Domaine de la Fontaine." 
      />

      {/* SECTION 1 - HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${heroImage}")` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        {/* Floating decorative elements */}
        <motion.div 
          className="absolute top-24 left-8 text-4xl"
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
        <motion.div 
          className="absolute top-32 right-12 text-3xl"
          animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          💒
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-16 text-2xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          ★
        </motion.div>
        <motion.div 
          className="absolute bottom-32 right-20 text-3xl"
          animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        >
          💍
        </motion.div>
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-6 border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            🏰 Partenaire Club Mariable
          </motion.span>
          
          <motion.h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Votre mariage au<br />
            <span className="text-premium-sage">Domaine de la Fontaine</span>
          </motion.h1>
          
          <motion.h2 
            className="text-xl md:text-2xl text-white/90 mb-10 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Bénéficiez d'avantages exclusifs auprès de nos partenaires
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              size="lg" 
              onClick={() => scrollToSection('avantages')} 
              className="text-white group shadow-lg shadow-primary/30 px-8 py-6 text-lg rounded-full bg-primary hover:bg-primary/90"
            >
              Découvrir les avantages
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown className="ml-2 h-5 w-5" />
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-white/60" />
        </motion.div>
      </section>

      {/* SECTION 2 - PARTENAIRES & AVANTAGES */}
      <section id="avantages" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Nos partenaires exclusifs
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Des réductions négociées de <span className="text-primary font-semibold">5% à 20%</span> avec nos partenaires premium
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {partners.map((partner, index) => (
              <PartnerCard key={partner.title} partner={partner} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - COMMENT ÇA MARCHE */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h2 
            className="font-serif text-3xl md:text-4xl text-center text-foreground mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Comment ça marche ?
          </motion.h2>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <motion.div 
                  className="flex-1 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary/30"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.1 }}
                  >
                    <ArrowRight className="hidden md:block h-6 w-6 text-primary/40 flex-shrink-0" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - FORMULAIRE */}
      <section id="formulaire" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Animated gradient border - harmonized sage green */}
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-3xl opacity-50 blur-sm"
              animate={{
                background: [
                  "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6), hsl(var(--primary)))",
                  "linear-gradient(180deg, hsl(var(--primary)), hsl(var(--primary) / 0.6), hsl(var(--primary)))",
                  "linear-gradient(270deg, hsl(var(--primary)), hsl(var(--primary) / 0.6), hsl(var(--primary)))",
                  "linear-gradient(360deg, hsl(var(--primary)), hsl(var(--primary) / 0.6), hsl(var(--primary)))"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className="relative bg-card rounded-2xl p-6 md:p-8 border border-border shadow-xl">
              <div className="text-center mb-6">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-3"
                >
                  🎁
                </motion.div>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
                  Obtenez votre code exclusif
                </h2>
                <p className="text-sm text-muted-foreground">
                  Gratuit et sans engagement • Réponse sous 24h par WhatsApp
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName} 
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      required 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName} 
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-1" 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required 
                    className="mt-1" 
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <Input 
                    id="whatsapp" 
                    type="tel" 
                    placeholder="+33 6 XX XX XX XX" 
                    value={formData.whatsapp} 
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    required 
                    className="mt-1" 
                  />
                </div>

                <div>
                  <Label htmlFor="weddingDate">Date de mariage</Label>
                  <Input 
                    id="weddingDate" 
                    type="date" 
                    value={formData.weddingDate} 
                    onChange={e => setFormData({ ...formData, weddingDate: e.target.value })}
                    className="mt-1" 
                  />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Checkbox 
                    id="consent" 
                    checked={consent} 
                    onCheckedChange={checked => setConsent(checked as boolean)} 
                  />
                  <Label htmlFor="consent" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                    J'accepte d'être contacté(e) par WhatsApp pour recevoir mon code exclusif
                  </Label>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg rounded-xl shadow-lg shadow-primary/30 relative overflow-hidden group" 
                    size="lg" 
                    disabled={isSubmitting}
                  >
                    {/* Shimmer effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <span className="relative">
                      {isSubmitting ? 'Envoi en cours...' : 'Recevoir mon code exclusif 🎁'}
                    </span>
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 - BONUS OUTILS */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-muted/10 to-background">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span 
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              🎁 Bonus offert
            </motion.span>
            
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Outils de planification offerts
            </h2>
            
            <p className="text-muted-foreground mb-8">
              Tout ce dont vous avez besoin pour organiser votre mariage sereinement
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {bonusTools.map((tool, index) => (
                <motion.span 
                  key={tool}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-background border border-border text-sm shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.08, y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                >
                  <Check className="h-4 w-4 text-primary" />
                  {tool}
                </motion.span>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300"
              >
                <a href="/register">
                  Créer mon compte gratuit sur Mariable
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default DomaineDeLaFontaine;

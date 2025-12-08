import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, Camera, Utensils, Flower2, Music, Heart, Gem, Check, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
// Image placeholder - à remplacer par l'image réelle du domaine
const heroImage = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80";

const partners = [
  { icon: Camera, title: "Photo & Vidéo", benefit: "-10% ou album offert", color: "bg-rose-100 text-rose-600" },
  { icon: Utensils, title: "Traiteur", benefit: "Vaisselle offerte", color: "bg-amber-100 text-amber-600" },
  { icon: Flower2, title: "Fleuriste", benefit: "-15% + bouquet offert", color: "bg-emerald-100 text-emerald-600" },
  { icon: Music, title: "DJ & Animation", benefit: "1h supplémentaire offerte", color: "bg-violet-100 text-violet-600" },
  { icon: Heart, title: "Robes & Costumes", benefit: "Jusqu'à -150€", color: "bg-pink-100 text-pink-600" },
  { icon: Gem, title: "Alliances", benefit: "Gravure offerte", color: "bg-sky-100 text-sky-600" },
];

const steps = [
  { number: "1", title: "Demandez votre code", description: "Remplissez le formulaire ci-dessous" },
  { number: "2", title: "Mentionnez-le au paiement", description: "Chez le partenaire de votre choix" },
  { number: "3", title: "Profitez des réductions", description: "Réduction immédiate ou cadeau" },
];

const DomaineDeLaFontaine = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    weddingDate: '',
  });
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
        commentaires: `Prénom: ${formData.firstName}, Nom: ${formData.lastName} | Source: Domaine de la Fontaine`,
      });

      if (error) throw error;

      toast.success("Demande envoyée ! Vous recevrez votre code sous 24h par WhatsApp.");
      setFormData({ firstName: '', lastName: '', email: '', whatsapp: '', weddingDate: '' });
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
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            🏰 Partenaire Club Mariable
          </motion.span>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
            Votre mariage au<br />Domaine de la Fontaine
          </h1>
          
          <h2 className="text-xl md:text-2xl text-white/90 mb-8 font-light">
            Bénéficiez d'avantages exclusifs auprès de nos partenaires
          </h2>
          
          <Button
            size="lg"
            onClick={() => scrollToSection('avantages')}
            className="bg-white text-foreground hover:bg-white/90 group"
          >
            Découvrir les avantages
            <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-white/60" />
        </motion.div>
      </section>

      {/* SECTION 2 - PARTENAIRES & AVANTAGES */}
      <section id="avantages" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Nos partenaires exclusifs
            </h2>
            <p className="text-muted-foreground text-lg">
              Des réductions négociées de 5% à 20% avec nos partenaires premium
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.title}
                className="bg-card rounded-xl p-5 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-full ${partner.color} flex items-center justify-center mb-4`}>
                  <partner.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{partner.title}</h3>
                <p className="text-sm text-primary font-medium">{partner.benefit}</p>
              </motion.div>
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
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground/50 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - FORMULAIRE */}
      <section id="formulaire" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div
            className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6">
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
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                />
                <Label htmlFor="consent" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                  J'accepte d'être contacté(e) par WhatsApp pour recevoir mon code exclusif
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Recevoir mon code exclusif 🎁'}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 - BONUS OUTILS */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              🎁 Bonus offert
            </span>
            
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Outils de planification offerts
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Checklist IA, budget interactif, gestion invités, coordination Jour J
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Checklist IA', 'Budget', 'Invités', 'Planning Jour J'].map((tool) => (
                <span 
                  key={tool}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-sm"
                >
                  <Check className="h-3.5 w-3.5 text-primary" />
                  {tool}
                </span>
              ))}
            </div>

            <Button asChild variant="outline" size="lg">
              <a href="/register">
                Créer mon compte gratuit sur Mariable
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default DomaineDeLaFontaine;

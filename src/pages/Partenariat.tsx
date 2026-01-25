import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Handshake, 
  Users, 
  FileText, 
  CheckCircle2,
  Sparkles,
  Heart,
  Target,
  Mail,
  Phone,
  MessageSquare,
  Instagram,
  Newspaper,
  Wrench,
  Network,
  PenTool,
  Eye,
  Link,
  TrendingUp,
  Camera,
  Megaphone,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const partnershipSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z.string().email("Email invalide").max(255, "L'email ne peut pas dépasser 255 caractères"),
  company_name: z.string().max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères").optional(),
  phone: z.string().max(20, "Le téléphone ne peut pas dépasser 20 caractères").optional(),
  message: z.string().max(1000, "Le message ne peut pas dépasser 1000 caractères").optional()
});

const Partenariat = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = partnershipSchema.parse(formData);
      
      setIsSubmitting(true);

      const { error } = await supabase
        .from('partnership_requests')
        .insert([{
          name: validated.name,
          email: validated.email,
          company_name: validated.company_name || null,
          phone: validated.phone || null,
          message: validated.message || null
        }]);

      if (error) throw error;

      toast.success('Demande envoyée avec succès!', {
        description: 'Nous reviendrons vers vous rapidement.'
      });

      setFormData({
        name: '',
        email: '',
        company_name: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error('Erreur de validation', {
          description: error.errors[0].message
        });
      } else {
        console.error('Error submitting partnership request:', error);
        toast.error('Une erreur est survenue', {
          description: 'Veuillez réessayer plus tard.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Devenir partenaire Mariable | Plateforme éditoriale pour professionnels du mariage</title>
        <meta 
          name="description" 
          content="Rejoignez Mariable : fiches éditorialisées, visibilité intégrée, guide d'accueil digitalisé et mises en avant sur nos réseaux. Adhésion partenaire 120€/an." 
        />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden bg-editorial-beige py-20 md:py-28 px-4"
        >
          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-5 py-2"
              >
                <Handshake className="w-4 h-4 text-premium-sage" />
                <span className="text-sm font-medium text-editorial-noir">Programme Partenariat</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-editorial-noir leading-tight">
                Mariable, une plateforme éditoriale au service des professionnels du mariage
              </h1>
              
              <p className="text-lg md:text-xl text-editorial-noir/70 max-w-3xl mx-auto">
                Média, outils d'organisation et écosystème pour des rencontres couples-prestataires plus alignées
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={scrollToForm}
                  className="bg-premium-sage hover:bg-premium-sage-dark text-white px-8 py-6 text-lg"
                >
                  Découvrir l'offre partenaire
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section: Qui est Mariable - 3 piliers */}
        <section className="py-16 md:py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
                Qui est Mariable ?
              </h2>
              <p className="text-editorial-noir/70 text-lg">
                Une plateforme à triple vocation
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Newspaper,
                  title: "Un média",
                  description: "Contenu éditorial de qualité, Instagram +4 500 abonnés, +1 million de vues cumulées"
                },
                {
                  icon: Wrench,
                  title: "Des outils pour les mariés",
                  description: "Budget, invités, planning, todo-list : tout pour organiser son mariage sereinement"
                },
                {
                  icon: Network,
                  title: "Un écosystème",
                  description: "Mise en relation qualitative entre couples et prestataires, au-delà de l'annuaire"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-editorial-beige p-8 text-center"
                >
                  <div className="w-14 h-14 bg-white flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-7 h-7 text-premium-sage" />
                  </div>
                  <h3 className="text-xl font-serif text-editorial-noir mb-3">{item.title}</h3>
                  <p className="text-editorial-noir/70">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-lg text-editorial-noir/80 italic max-w-2xl mx-auto">
                Notre ambition : créer des expériences mariages réussies grâce à des rencontres plus justes, plus alignées et plus qualitatives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section: Fiches éditorialisées */}
        <section className="py-16 md:py-20 px-4 bg-editorial-beige/50">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 text-premium-sage">
                  <PenTool className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">Contenu sur-mesure</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir">
                  Des fiches professionnelles éditorialisées
                </h2>
                <p className="text-editorial-noir/70 text-lg">
                  Sur Mariable, les fiches prestataires ne sont pas remplies automatiquement ni standardisées. 
                  Elles sont rédigées par notre équipe.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  "Mise en valeur de votre univers unique",
                  "Explication claire de votre positionnement",
                  "Prestations et tarifs affichés (ou fourchettes)",
                  "Projection facilitée pour les couples"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-4">
                    <CheckCircle2 className="w-5 h-5 text-premium-sage mt-0.5 flex-shrink-0" />
                    <span className="text-editorial-noir">{item}</span>
                  </div>
                ))}
                <div className="bg-premium-sage/10 p-4 border-l-4 border-premium-sage">
                  <p className="text-premium-sage-dark font-medium">
                    👉 Objectif : moins de demandes, mais mieux ciblées.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section: Visibilité intégrée */}
        <section className="py-16 md:py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 md:order-1 space-y-4"
              >
                {[
                  { icon: Heart, text: "S'inspirer avec du contenu éditorial" },
                  { icon: Target, text: "Organiser leur mariage pas à pas" },
                  { icon: Wrench, text: "Utiliser des outils pratiques" },
                  { icon: FileText, text: "Structurer leurs choix" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-editorial-beige/50">
                    <item.icon className="w-5 h-5 text-premium-sage flex-shrink-0" />
                    <span className="text-editorial-noir">{item.text}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 md:order-2 space-y-6"
              >
                <div className="inline-flex items-center gap-2 text-premium-sage">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">Parcours d'organisation</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir">
                  Une visibilité intégrée dans un parcours réel
                </h2>
                <p className="text-editorial-noir/70 text-lg">
                  Les couples utilisent Mariable pour organiser leur mariage. Votre présence s'inscrit donc dans un parcours concret, et non dans une simple logique d'annuaire.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section: Guide d'accueil digitalisé */}
        <section className="py-16 md:py-20 px-4 bg-editorial-beige">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 text-premium-sage mb-4">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Inclus dans l'adhésion</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
                Un guide d'accueil digitalisé pour vos mariés
              </h2>
              <p className="text-editorial-noir/70 text-lg max-w-2xl mx-auto">
                En tant que partenaire Mariable, vous bénéficiez d'un guide d'accueil digitalisé à votre nom.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, text: "Recommandez vos prestataires partenaires" },
                { icon: FileText, text: "Évitez les PDF et mails peu lisibles" },
                { icon: Sparkles, text: "Offrez une expérience fluide et élégante" },
                { icon: Link, text: "Un lien simple à envoyer après signature" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 text-center"
                >
                  <div className="w-12 h-12 bg-premium-sage/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-premium-sage" />
                  </div>
                  <p className="text-editorial-noir text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Instagram et contenu */}
        <section className="py-16 md:py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 text-premium-sage">
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">Média social</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir">
                  Instagram et contenu au cœur de la découverte
                </h2>
                <p className="text-editorial-noir/70 text-lg">
                  Mariable est aussi un média social en croissance avec une ligne éditoriale qualitative.
                </p>

                <div className="grid grid-cols-3 gap-4 py-4">
                  {[
                    { value: "+4 500", label: "futurs mariés" },
                    { value: "+1M", label: "vues cumulées" },
                    { value: "100%", label: "ligne éditoriale" }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-2xl font-serif text-premium-sage">{stat.value}</p>
                      <p className="text-sm text-editorial-noir/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="font-serif text-xl text-editorial-noir">Les partenaires bénéficient :</h3>
                {[
                  "Mises en avant sur nos réseaux",
                  "Visibilité cohérente avec votre image",
                  "Présence durable, non éphémère"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-editorial-beige p-4">
                    <CheckCircle2 className="w-5 h-5 text-premium-sage mt-0.5 flex-shrink-0" />
                    <span className="text-editorial-noir">{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section: Alternative aux articles sponsorisés */}
        <section className="py-16 px-4 bg-editorial-beige/50">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-12"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                    Une alternative accessible aux articles sponsorisés
                  </h2>
                  <p className="text-editorial-noir/70">
                    Les articles sponsorisés sur des blogs mariage coûtent souvent entre 400 et 600 € pour une publication ponctuelle.
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="font-medium text-editorial-noir">Mariable propose une approche différente :</p>
                  {[
                    "Plus durable dans le temps",
                    "Plus accessible financièrement",
                    "Intégrée à des outils concrets"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-premium-sage flex-shrink-0" />
                      <span className="text-editorial-noir/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section: Les offres Mariable */}
        <section className="py-16 md:py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
                Les offres Mariable
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Offre Adhésion partenaire */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-editorial-beige p-8 relative"
              >
                <div className="absolute top-4 right-4">
                  <Sparkles className="w-6 h-6 text-premium-sage" />
                </div>

                <h3 className="text-2xl font-serif text-editorial-noir mb-2">
                  Adhésion partenaire
                </h3>
                
                <div className="mb-6">
                  <p className="text-4xl font-serif text-premium-sage">120 €</p>
                  <p className="text-editorial-noir/60">par an</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Fiche éditorialisée rédigée par Mariable",
                    "Maintenance incluse",
                    "Badge partenaire",
                    "Mise en avant newsletter mariés (+1 000 personnes)",
                    "Mises en avant réseaux sociaux (stories & posts, jusqu'à 10/an)",
                    "Guide d'accueil digitalisé personnalisé"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-premium-sage mt-0.5 flex-shrink-0" />
                      <span className="text-editorial-noir/80 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={scrollToForm}
                  className="w-full bg-premium-sage hover:bg-premium-sage-dark text-white"
                >
                  Rejoindre Mariable
                </Button>
              </motion.div>

              {/* Offres premium */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-editorial-noir/10 p-8"
              >
                <div className="inline-block bg-editorial-noir text-white text-xs px-3 py-1 mb-4">
                  Sur demande
                </div>

                <h3 className="text-2xl font-serif text-editorial-noir mb-6">
                  Offres premium
                </h3>

                <ul className="space-y-4 mb-8">
                  {[
                    { icon: Camera, text: "Création de contenu avancée (photo / vidéo / interview)" },
                    { icon: BookOpen, text: "Personnalisation avancée du guide digitalisé" },
                    { icon: Megaphone, text: "Accompagnement communication digitale / community manager" }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-4 bg-editorial-beige/30">
                      <item.icon className="w-5 h-5 text-premium-sage mt-0.5 flex-shrink-0" />
                      <span className="text-editorial-noir/80">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={scrollToForm}
                  variant="outline"
                  className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white"
                >
                  Demander un devis
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section: En résumé */}
        <section className="py-16 px-4 bg-editorial-beige">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir">
                En résumé
              </h2>
              <p className="text-lg text-editorial-noir/80">
                Mariable s'adresse aux professionnels qui souhaitent :
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "Une image plus forte",
                  "Des leads qualifiés",
                  "Une présence qualitative"
                ].map((item, idx) => (
                  <span key={idx} className="bg-white px-4 py-2 text-editorial-noir">
                    {item}
                  </span>
                ))}
              </div>
              <div className="pt-6 space-y-2">
                <p className="text-editorial-noir/70">
                  👉 Ce n'est pas une plateforme de volume.
                </p>
                <p className="text-xl font-serif text-premium-sage">
                  C'est une plateforme d'expérience.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Formulaire de contact */}
        <section id="contact-form" className="py-20 px-4 bg-premium-sage">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                Prêt à rejoindre Mariable ?
              </h2>
              <p className="text-white/90">
                Laissez-nous vos coordonnées et nous vous recontacterons rapidement
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-white p-8 space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-editorial-noir font-medium">
                  Nom complet <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-editorial-noir/40 w-5 h-5" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 border-editorial-noir/20 focus:border-premium-sage"
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-editorial-noir font-medium">
                  Email professionnel <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-editorial-noir/40 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 border-editorial-noir/20 focus:border-premium-sage"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-editorial-noir font-medium">
                  Nom de l'entreprise
                </Label>
                <Input
                  id="company"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  className="border-editorial-noir/20 focus:border-premium-sage"
                  placeholder="Votre entreprise"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-editorial-noir font-medium">
                  Téléphone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-editorial-noir/40 w-5 h-5" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10 border-editorial-noir/20 focus:border-premium-sage"
                    placeholder="06 XX XX XX XX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-editorial-noir font-medium">
                  Message (optionnel)
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-editorial-noir/40 w-5 h-5" />
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="pl-10 min-h-[120px] border-editorial-noir/20 focus:border-premium-sage"
                    placeholder="Parlez-nous de votre activité, vos attentes..."
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-premium-sage hover:bg-premium-sage-dark text-white py-6 text-lg"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Rejoindre Mariable'}
              </Button>
            </motion.form>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Partenariat;

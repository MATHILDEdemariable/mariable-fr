import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Handshake, 
  Users, 
  FileText, 
  CheckCircle2,
  Sparkles,
  Heart,
  Target,
  Instagram,
  Newspaper,
  Wrench,
  Network,
  PenTool,
  Eye,
  Link as LinkIcon,
  Camera,
  Megaphone,
  BookOpen,
  Search,
  DollarSign,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfessionalRegistrationForm from '@/components/forms/ProfessionalRegistrationForm';

const Partenariat = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const scrollToForm = () => {
    document.getElementById('formulaire-inscription')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToOffers = () => {
    document.getElementById('offres')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <>
      <Helmet>
        <title>Rejoignez le Club Mariable | Plateforme éditoriale pour professionnels du mariage</title>
        <meta 
          name="description" 
          content="Rejoignez le Club Mariable : fiches éditorialisées, visibilité intégrée, guide d'accueil digitalisé et mises en avant sur nos réseaux. Adhésion partenaire 120€/an." 
        />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-white">
        {/* Hero Section - Rejoignez le Club Mariable */}
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
                <span className="text-sm font-medium text-editorial-noir">Club Mariable</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-editorial-noir leading-tight">
                Rejoignez le Club Mariable
              </h1>
              
              <p className="text-lg md:text-xl text-editorial-noir/70 max-w-3xl mx-auto">
                Une plateforme à triple vocation
              </p>

              {/* 3 piliers en mini-cartes horizontales */}
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6">
                {[
                  { icon: Newspaper, label: "Média" },
                  { icon: Wrench, label: "Outils pour les mariés" },
                  { icon: Network, label: "Écosystème" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center justify-center gap-2"
                  >
                    <item.icon className="w-4 h-4 text-premium-sage" />
                    <span className="text-sm font-medium text-editorial-noir">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-4"
              >
                <Button 
                  onClick={scrollToOffers}
                  className="bg-editorial-noir hover:bg-editorial-noir/90 text-white px-8 py-6 text-lg"
                >
                  Découvrir nos offres
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section: Le Constat - Parcours des mariés */}
        <section className="py-16 md:py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
                Le constat
              </h2>
              <p className="text-editorial-noir/70 text-lg max-w-2xl mx-auto">
                Le parcours d'organisation des futurs mariés
              </p>
            </motion.div>

            {/* 4 étapes du parcours */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { 
                  icon: Instagram, 
                  step: "1",
                  title: "Inspiration via Instagram", 
                  description: "Les mariés recherchent des inspirations via les réseaux sociaux" 
                },
                { 
                  icon: Search, 
                  step: "2",
                  title: "Informations complètes", 
                  description: "Besoin d'informations détaillées (prix inclus) sur les services" 
                },
                { 
                  icon: Wrench, 
                  step: "3",
                  title: "Outils pour simplifier", 
                  description: "Des outils pour simplifier les démarches d'organisation" 
                },
                { 
                  icon: MessageCircle, 
                  step: "4",
                  title: "Feeling via rencontre", 
                  description: "Le feeling lors de la rencontre avec le prestataire" 
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-editorial-beige p-6 text-center relative"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-editorial-noir text-white text-xs flex items-center justify-center font-medium">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-white flex items-center justify-center mx-auto mb-4 mt-2">
                    <item.icon className="w-6 h-6 text-premium-sage" />
                  </div>
                  <h3 className="text-sm font-medium text-editorial-noir mb-2">{item.title}</h3>
                  <p className="text-xs text-editorial-noir/60">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Conclusion + Ambition */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center space-y-6"
            >
              <div className="bg-editorial-noir text-white py-4 px-6 inline-block">
                <p className="text-lg font-medium">
                  Un parcours d'organisation complet grâce à Mariable
                </p>
              </div>
              <p className="text-lg text-editorial-noir/80 italic max-w-2xl mx-auto">
                Notre ambition : créer des expériences mariages réussies grâce à des rencontres plus justes, plus alignées et plus qualitatives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section: Les offres Mariable */}
        <section id="offres" className="py-16 md:py-20 px-4 bg-editorial-beige">
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
                className="bg-white p-8 relative"
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
                  className="w-full bg-editorial-noir hover:bg-editorial-noir/90 text-white"
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

                <Link to="/contact">
                  <Button 
                    variant="outline"
                    className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white"
                  >
                    Devis sur mesure
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section: Éléments inclus - Accordions */}
        <section className="py-16 md:py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
                Ce qui est inclus
              </h2>
              <p className="text-editorial-noir/70">
                Cliquez pour en savoir plus
              </p>
            </motion.div>

            <div className="space-y-4">
              {/* Accordion: Contenu sur-mesure */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-editorial-noir/10"
              >
                <button
                  onClick={() => toggleAccordion('contenu')}
                  className="w-full flex items-center justify-between p-6 bg-editorial-beige hover:bg-editorial-beige/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <PenTool className="w-5 h-5 text-premium-sage" />
                    <span className="font-serif text-lg text-editorial-noir">Contenu sur-mesure : fiches éditorialisées</span>
                  </div>
                  {openAccordion === 'contenu' ? (
                    <ChevronUp className="w-5 h-5 text-editorial-noir" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-editorial-noir" />
                  )}
                </button>
                {openAccordion === 'contenu' && (
                  <div className="p-6 bg-white space-y-4">
                    <p className="text-editorial-noir/70">
                      Sur Mariable, les fiches prestataires ne sont pas remplies automatiquement ni standardisées. 
                      Elles sont rédigées par notre équipe.
                    </p>
                    <div className="space-y-3">
                      {[
                        "Mise en valeur de votre univers unique",
                        "Explication claire de votre positionnement",
                        "Prestations et tarifs affichés (ou fourchettes)",
                        "Projection facilitée pour les couples"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-premium-sage mt-0.5 flex-shrink-0" />
                          <span className="text-editorial-noir">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-premium-sage/10 p-4 border-l-4 border-premium-sage mt-4">
                      <p className="text-premium-sage-dark font-medium">
                        👉 Objectif : moins de demandes, mais mieux ciblées.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Accordion: Guide d'accueil digitalisé */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="border border-editorial-noir/10"
              >
                <button
                  onClick={() => toggleAccordion('guide')}
                  className="w-full flex items-center justify-between p-6 bg-editorial-beige hover:bg-editorial-beige/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-premium-sage" />
                    <span className="font-serif text-lg text-editorial-noir">Guide d'accueil digitalisé</span>
                  </div>
                  {openAccordion === 'guide' ? (
                    <ChevronUp className="w-5 h-5 text-editorial-noir" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-editorial-noir" />
                  )}
                </button>
                {openAccordion === 'guide' && (
                  <div className="p-6 bg-white space-y-4">
                    <p className="text-editorial-noir/70">
                      En tant que partenaire Mariable, vous bénéficiez d'un guide d'accueil digitalisé à votre nom.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: Users, text: "Recommandez vos prestataires partenaires" },
                        { icon: FileText, text: "Évitez les PDF et mails peu lisibles" },
                        { icon: Sparkles, text: "Offrez une expérience fluide et élégante" },
                        { icon: LinkIcon, text: "Un lien simple à envoyer après signature" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-editorial-beige/50">
                          <item.icon className="w-5 h-5 text-premium-sage mt-0.5 flex-shrink-0" />
                          <span className="text-editorial-noir text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Accordion: Visibilité Instagram et newsletters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="border border-editorial-noir/10"
              >
                <button
                  onClick={() => toggleAccordion('visibilite')}
                  className="w-full flex items-center justify-between p-6 bg-editorial-beige hover:bg-editorial-beige/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-premium-sage" />
                    <span className="font-serif text-lg text-editorial-noir">Visibilité Instagram et newsletters</span>
                  </div>
                  {openAccordion === 'visibilite' ? (
                    <ChevronUp className="w-5 h-5 text-editorial-noir" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-editorial-noir" />
                  )}
                </button>
                {openAccordion === 'visibilite' && (
                  <div className="p-6 bg-white space-y-4">
                    <p className="text-editorial-noir/70">
                      Mariable est aussi un média social en croissance avec une ligne éditoriale qualitative.
                    </p>
                    <div className="grid grid-cols-3 gap-4 py-4">
                      {[
                        { value: "+4 500", label: "futurs mariés" },
                        { value: "+1M", label: "vues cumulées" },
                        { value: "10/an", label: "mises en avant" }
                      ].map((stat, idx) => (
                        <div key={idx} className="text-center p-4 bg-editorial-beige/50">
                          <p className="text-2xl font-serif text-premium-sage">{stat.value}</p>
                          <p className="text-xs text-editorial-noir/60">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {[
                        "Mises en avant sur nos réseaux (stories et posts)",
                        "Visibilité cohérente avec votre image",
                        "Présence durable, non éphémère"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-premium-sage mt-0.5 flex-shrink-0" />
                          <span className="text-editorial-noir">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                  Une alternative accessible aux articles sponsorisés et aux autres plateformes / annuaires
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-editorial-noir/60">
                    <DollarSign className="w-5 h-5" />
                    <span>Articles sponsorisés blogs</span>
                  </div>
                  <p className="text-3xl font-serif text-editorial-noir">400 - 600 €</p>
                  <p className="text-editorial-noir/60 text-sm">pour une publication ponctuelle</p>
                </div>
                <div className="space-y-3">
                  <p className="font-medium text-editorial-noir mb-4">Mariable propose une approche différente :</p>
                  {[
                    "Plus durable dans le temps",
                    "Plus accessible financièrement",
                    "Intégrée à des outils concrets",
                    "Pas de logique d'annuaire / volume"
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

        {/* Section: En résumé */}
        <section className="py-16 px-4 bg-white">
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
                  <span key={idx} className="bg-editorial-beige px-4 py-2 text-editorial-noir">
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-8"
              >
                <Button 
                  onClick={scrollToForm}
                  className="bg-editorial-noir hover:bg-editorial-noir/90 text-white px-8 py-6 text-lg"
                >
                  Rejoindre Mariable
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Section: Formulaire d'inscription professionnel */}
        <section id="formulaire-inscription" className="py-20 px-4 bg-premium-sage">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                Rejoindre le Club Mariable
              </h2>
              <p className="text-white/90">
                Remplissez le formulaire ci-dessous pour nous rejoindre
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8"
            >
              <ProfessionalRegistrationForm />
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Partenariat;

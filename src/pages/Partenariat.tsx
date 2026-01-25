import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Instagram,
  Search,
  Wrench,
  Heart,
  Sparkles,
  CheckCircle,
  Palette,
  BookOpen,
  Share2,
  ChevronDown,
  ChevronUp,
  Users,
  Award,
  Target,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ProfessionalRegistrationForm from "@/components/forms/ProfessionalRegistrationForm";

const Partenariat = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const scrollToForm = () => {
    document.getElementById("formulaire-inscription")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToOffers = () => {
    document.getElementById("offres")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const constatSteps = [
    {
      icon: Instagram,
      title: "Inspiration",
      description: "Les mariés recherchent des inspirations via Instagram et les réseaux sociaux",
    },
    {
      icon: Search,
      title: "Informations",
      description: "Ils ont besoin d'informations complètes (prix inclus) sur les services",
    },
    {
      icon: Wrench,
      title: "Outils",
      description: "Des outils pour simplifier les démarches et l'organisation",
    },
    {
      icon: Heart,
      title: "Feeling",
      description: "Et du feeling via une rencontre avec les prestataires",
    },
  ];

  const whyJoinReasons = [
    {
      icon: Target,
      title: "Visibilité ciblée",
      description: "Touchez des futurs mariés activement à la recherche de prestataires de qualité.",
    },
    {
      icon: Award,
      title: "Label d'excellence",
      description: "Différenciez-vous avec le label Mariable, gage de qualité et de confiance.",
    },
    {
      icon: Palette,
      title: "Fiches éditorialisées",
      description: "Contenu rédigé par notre équipe, pas automatisé ni standardisé.",
    },
    {
      icon: BookOpen,
      title: "Guide d'accueil digitalisé",
      description: "Outil inclus pour recommander vos partenaires à vos couples.",
    },
  ];

  const accordionContent = [
    {
      id: "contenu",
      icon: Palette,
      title: "Contenu sur-mesure",
      content: [
        "Fiches éditorialisées rédigées par l'équipe Mariable",
        "Mise en valeur de votre univers, positionnement et tarifs",
        "Pas de contenu automatique ou standardisé",
        "Objectif : moins de demandes, mais mieux ciblées",
      ],
    },
    {
      id: "guide",
      icon: BookOpen,
      title: "Guide d'accueil digitalisé",
      content: [
        "Recommandez facilement vos partenaires de confiance",
        "Évitez les PDF peu lisibles et peu pratiques",
        "Expérience fluide et élégante pour vos couples",
        "Un simple lien à envoyer après signature",
      ],
    },
    {
      id: "visibilite",
      icon: Share2,
      title: "Visibilité Instagram et newsletters",
      content: [
        "+4 500 futurs mariés dans notre communauté",
        "+1M vues cumulées sur nos contenus",
        "Mises en avant stories et posts (jusqu'à 10/an)",
        "Présence durable et non éphémère",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Rejoignez le Club Mariable | Partenariat Professionnels du Mariage</title>
        <meta
          name="description"
          content="Rejoignez le Club Mariable, la référence des professionnels premium du mariage. Bénéficiez d'une visibilité ciblée et de leads qualifiés."
        />
      </Helmet>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section - White background */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="py-20 px-4 bg-white"
        >
          <div className="container mx-auto max-w-4xl text-center">
            <span className="inline-block px-4 py-1 bg-editorial-beige text-editorial-noir text-sm mb-6">
              Club Mariable
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-editorial-noir mb-6">
              Rejoignez le Club Mariable
            </h1>
            <p className="text-xl md:text-2xl text-editorial-noir/70 mb-8">
              La référence des professionnels premium
            </p>
            <Button
              onClick={scrollToOffers}
              className="bg-editorial-noir text-white hover:bg-editorial-noir/90"
            >
              Découvrir nos offres
            </Button>
          </div>
        </motion.section>

        {/* Section Pourquoi rejoindre Mariable */}
        <section className="py-16 px-4 bg-white border-t border-editorial-beige">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-serif text-editorial-noir text-center mb-10"
            >
              Pourquoi rejoindre Mariable ?
            </motion.h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {whyJoinReasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-5 bg-editorial-beige/50"
                >
                  <reason.icon className="h-5 w-5 text-premium-sage shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-editorial-noir mb-1">{reason.title}</h4>
                    <p className="text-sm text-editorial-noir/70">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Le Constat */}
        <section className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                Le Constat
              </h2>
              <p className="text-editorial-noir/70 max-w-2xl mx-auto">
                Le parcours d'organisation d'un mariage est complexe et multifacettes
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {constatSteps.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-editorial-beige/40 p-6 text-center relative"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-premium-sage text-white flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 mt-2">
                    <item.icon className="w-6 h-6 text-premium-sage" />
                  </div>
                  <h3 className="font-medium text-editorial-noir mb-2">{item.title}</h3>
                  <p className="text-sm text-editorial-noir/70">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-lg font-medium text-editorial-noir mb-4">
                = Un parcours d'organisation complet grâce à Mariable
              </p>
              <p className="text-editorial-noir/70 italic max-w-2xl mx-auto">
                "Notre ambition : créer des expériences mariages réussies grâce à des rencontres 
                plus justes, plus alignées et plus qualitatives."
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section Les Offres */}
        <section id="offres" className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                Les offres Mariable
              </h2>
              <p className="text-editorial-noir/70">
                Deux formules adaptées à vos besoins
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Adhésion partenaire */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-editorial-beige p-8 relative"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-premium-sage" />
                  <span className="text-sm font-medium text-premium-sage">Adhésion partenaire</span>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-serif text-editorial-noir">120€</span>
                  <span className="text-editorial-noir/70">/an</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Fiche éditorialisée sur-mesure",
                    "Guide d'accueil digitalisé inclus",
                    "Visibilité Instagram et newsletters",
                    "Badge partenaire Mariable",
                    "Accès aux couples qualifiés",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-premium-sage shrink-0 mt-0.5" />
                      <span className="text-editorial-noir/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={scrollToForm}
                  className="w-full bg-editorial-noir text-white hover:bg-editorial-noir/90"
                >
                  Rejoindre Mariable
                </Button>
              </motion.div>

              {/* Offres Premium */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-editorial-beige p-8 relative"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-premium-sage" />
                  <span className="text-sm font-medium text-premium-sage">Offres premium</span>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-serif text-editorial-noir">Sur demande</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Tout de l'adhésion partenaire",
                    "Articles sponsorisés sur le blog",
                    "Mise en avant prioritaire",
                    "Campagnes réseaux sociaux dédiées",
                    "Partenariats sur-mesure",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-premium-sage shrink-0 mt-0.5" />
                      <span className="text-editorial-noir/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white"
                >
                  <Link to="/contact">Devis sur mesure</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Éléments inclus - Accordions */}
        <section className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-serif text-editorial-noir text-center mb-10"
            >
              Éléments inclus
            </motion.h2>

            <div className="space-y-3">
              {accordionContent.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white"
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-editorial-beige/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-premium-sage" />
                      <span className="font-medium text-editorial-noir">{item.title}</span>
                    </div>
                    {openAccordion === item.id ? (
                      <ChevronUp className="w-5 h-5 text-editorial-noir/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-editorial-noir/50" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openAccordion === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <ul className="space-y-2 ml-8">
                            {item.content.map((line, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-premium-sage shrink-0 mt-0.5" />
                                <span className="text-editorial-noir/70">{line}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Alternative accessible */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                Une alternative accessible aux articles sponsorisés
              </h2>
              <p className="text-editorial-noir/70">
                Et aux autres plateformes / annuaires
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-editorial-noir/10"
              >
                <h3 className="font-medium text-editorial-noir mb-3">Articles sponsorisés blogs</h3>
                <p className="text-editorial-noir/70 text-sm mb-4">
                  400€ - 600€ pour une publication ponctuelle avec une visibilité limitée dans le temps.
                </p>
                <span className="text-xs text-editorial-noir/50">Impact éphémère</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-premium-sage/10 border border-premium-sage/20"
              >
                <h3 className="font-medium text-editorial-noir mb-3">Mariable propose</h3>
                <ul className="space-y-2 text-sm text-editorial-noir/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-premium-sage" />
                    Plus durable : présence annuelle
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-premium-sage" />
                    Plus accessible : 120€/an
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-premium-sage" />
                    Intégrée à des outils concrets
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section En résumé */}
        <section className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-8">
                En résumé
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: Users, text: "Image plus forte" },
                  { icon: Target, text: "Leads qualifiés" },
                  { icon: Award, text: "Présence qualitative" },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-center gap-3 p-4 bg-white"
                  >
                    <item.icon className="w-5 h-5 text-premium-sage" />
                    <span className="text-editorial-noir font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-editorial-noir/70 italic text-lg">
                "Ce n'est pas une plateforme de volume. C'est une plateforme d'expérience."
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section Formulaire */}
        <section id="formulaire-inscription" className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-editorial-beige p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
                  Rejoindre le Club Mariable
                </h2>
                <p className="text-editorial-noir/70">
                  Remplissez le formulaire ci-dessous pour nous rejoindre
                </p>
              </motion.div>
              <div className="bg-white p-6 md:p-8">
                <ProfessionalRegistrationForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Partenariat;

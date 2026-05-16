import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Film,
  MessageSquare,
  Sparkles,
  Globe,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ContactProModal from "@/components/partenariat/ContactProModal";

const Partenariat = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState<string | undefined>(undefined);

  const openContact = (subject?: string) => {
    setContactSubject(subject);
    setContactOpen(true);
  };

  const scrollToExpertises = () =>
    document.getElementById("expertises")?.scrollIntoView({ behavior: "smooth" });

  const toggleAccordion = (id: string) =>
    setOpenAccordion(openAccordion === id ? null : id);

  const expertises = [
    {
      icon: Film,
      title: "Stratégie réseaux sociaux & création de contenu",
      description:
        "Croissance organique sur Instagram et TikTok : stratégie éditoriale, refonte de feed et création de contenu authentique tourné en iPhone 17 pour attirer vos futurs clients.",
      points: [
        "Audit & stratégie d'acquisition organique (Instagram, TikTok)",
        "Refonte de feed Instagram et direction artistique éditoriale",
        "Création de contenu Reels & photos (iPhone 17)",
        "Interviews équipe & mise en avant humaine en format court",
        "Branding, charte graphique et ligne éditoriale",
      ],
    },
    {
      icon: MessageSquare,
      title: "Community management & acquisition payante",
      description:
        "Gestion de votre présence sociale et de vos campagnes payantes Meta Ads & TikTok Ads pour générer des leads qualifiés mois après mois.",
      points: [
        "Calendrier éditorial mensuel, publication & stories",
        "Réponses DM et commentaires (community management)",
        "Campagnes Meta Ads (Facebook & Instagram) & TikTok Ads",
        "Stratégie d'acquisition clients & tunnel de conversion",
        "Reporting mensuel : portée, leads, coût d'acquisition",
      ],
    },
    {
      icon: Globe,
      title: "Développement digital & outils de conversion",
      description:
        "Sites web, guides digitaux et outils sur-mesure pour transformer votre trafic en clients : du premier clic à la signature.",
      points: [
        "Sites web vitrine ou réservation, optimisés SEO",
        "Guides digitaux (welcome guide, brochures interactives)",
        "Formulaires, espaces clients et outils sur-mesure",
        "CRM, newsletter et séquences mail automatisées",
        "Autres projets de développement web sur demande",
      ],
    },
  ];

  const faqItems = [
    {
      question: "Quels professionnels de l'événementiel accompagnez-vous ?",
      answer:
        "J'accompagne tous les professionnels de l'événementiel mariage : lieux de réception (domaines, châteaux, mas, manoirs), traiteurs, photographes, vidéastes, fleuristes, DJ, wedding planners et marques qui souhaitent professionnaliser leur image, leur acquisition clients et leur communication digitale.",
    },
    {
      question: "Croissance organique ou publicité payante : que choisir ?",
      answer:
        "Les deux sont complémentaires. L'organique (Instagram, TikTok, SEO) construit votre marque et votre crédibilité sur le long terme. Le paid (Meta Ads, TikTok Ads) génère des leads qualifiés rapidement et permet de tester des angles. Je construis une stratégie d'acquisition mixte selon votre maturité digitale, votre budget et vos objectifs de remplissage.",
    },
    {
      question: "Combien coûte une agence marketing digital spécialisée événementiel ?",
      answer:
        "Mes prestations démarrent à partir de 400€ et sont ensuite sur devis, car chaque professionnel de l'événementiel a des besoins spécifiques (volume de contenu, fréquence de publication, budget Meta Ads / TikTok Ads, projet web). Je construis un accompagnement à la carte ou un forfait mensuel selon votre stratégie d'acquisition.",
    },
    {
      question: "Comment gagner en visibilité quand on est un pro de l'événementiel ?",
      answer:
        "Trois leviers complémentaires : un contenu visuel cohérent et désirable (Reels, photos), une présence régulière sur les réseaux pilotée par un community manager spécialisé événementiel, et des campagnes payantes ciblées sur vos futurs clients. La mise en avant éditoriale Mariable, incluse dans chaque formule, amplifie le tout auprès d'une audience ultra-qualifiée.",
    },
    {
      question: "Pourquoi confier ses Meta Ads et TikTok Ads à une agence spécialisée ?",
      answer:
        "Le marché de l'événementiel a ses propres codes : saisonnalité forte, intention d'achat élevée, parcours décisionnel à plusieurs mois, audiences look-alike sur les couples engagés ou les organisateurs d'événements. Une agence généraliste brûle souvent du budget faute de connaître ces spécificités. J'optimise vos campagnes pour générer des leads qualifiés au coût le plus juste.",
    },
    {
      question: "Pouvez-vous créer le site web de mon activité ?",
      answer:
        "Oui. Je conçois des sites vitrine et des sites de réservation sur-mesure pour pros de l'événementiel : design éditorial, optimisation SEO, formulaires de contact, galeries photos, intégration calendrier de disponibilités. Je prends aussi en charge la refonte de sites existants.",
    },
    {
      question: "Qu'est-ce qu'un guide digital ?",
      answer:
        "Un guide digital remplace les classiques PDF envoyés par mail : welcome guide pour les clients qui ont signé, brochure interactive pour valoriser votre offre commerciale, livret pratique pour vos invités. Plus engageant, mis à jour en temps réel et consultable depuis n'importe quel mobile.",
    },
    {
      question: "La mise en avant Mariable est-elle incluse dans vos prestations ?",
      answer:
        "Oui : la mise en avant éditoriale Mariable est systématiquement incluse dans toutes mes formules. Elle vous fait bénéficier d'une publication éditoriale dédiée et d'une visibilité auprès de ma communauté de futurs mariés.",
    },
    {
      question: "Travaillez-vous partout en France ?",
      answer:
        "Oui, j'accompagne des professionnels de l'événementiel partout en France métropolitaine. Les tournages et shootings se font sur site, les volets community management, acquisition payante et développement digital sont pilotés à distance avec des points réguliers.",
    },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mariable — Agence marketing digital événementiel",
    serviceType: "Digital marketing agency for event professionals",
    provider: {
      "@type": "Organization",
      name: "Mariable",
      url: "https://www.mariable.fr",
    },
    areaServed: "FR",
    description:
      "Agence marketing digital spécialisée pour les professionnels de l'événementiel : croissance organique sur réseaux sociaux, acquisition payante Meta Ads & TikTok Ads, création de contenu, community management, sites web et stratégie d'acquisition clients.",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Agence marketing digital — Professionnels de l'événementiel | Mariable</title>
        <meta
          name="description"
          content="Agence marketing digital pour pros de l'événementiel : croissance organique réseaux sociaux, Meta Ads, TikTok Ads, contenu, community management et sites web. Sur devis."
        />
        <link rel="canonical" href="https://www.mariable.fr/partenariat" />
        <script type="application/ld+json">{JSON.stringify(serviceJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <PremiumHeader />
      <main className="min-h-screen">
        <div className="px-4 pt-20">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="py-20 px-4 bg-white"
        >
          <div className="container mx-auto max-w-4xl text-center">
            <span className="inline-block px-4 py-1 bg-premium-sage/10 text-premium-sage text-sm mb-6 uppercase tracking-widest">
              Agence marketing digital · Professionnels de l'événementiel
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-editorial-noir mb-6">
              L'agence marketing digital des professionnels de l'événementiel
            </h1>
            <p className="text-lg md:text-xl text-editorial-noir/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              Lieux de réception, traiteurs, photographes, fleuristes, wedding planners, DJ :
              croissance organique sur réseaux sociaux, acquisition payante (Meta Ads & TikTok Ads)
              et stratégie d'acquisition clients pour attirer ceux qui vous ressemblent.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={scrollToExpertises}
                className="bg-editorial-noir text-white hover:bg-editorial-noir/90"
              >
                Voir les offres
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Expertises */}
        <section id="expertises" className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                Les services proposés
              </h2>
              <p className="text-editorial-noir/70 max-w-2xl mx-auto">
                Trois leviers pour construire votre marque, votre acquisition clients et votre
                présence digitale, à la carte ou en accompagnement complet.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertises.map((p, index) => (
                <motion.article
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-white border-t-4 border-premium-sage flex flex-col"
                >
                  <p.icon className="w-8 h-8 text-premium-sage mb-4" />
                  <h3 className="text-xl font-serif text-editorial-noir mb-3">{p.title}</h3>
                  <p className="text-sm text-editorial-noir/70 mb-5">{p.description}</p>
                  <ul className="space-y-2 mb-6 flex-grow">
                    {p.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-premium-sage shrink-0 mt-0.5" />
                        <span className="text-editorial-noir/80">{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs uppercase tracking-widest text-editorial-noir/50 mb-3">
                    Tarif
                  </p>
                  <p className="text-2xl font-serif text-editorial-noir mb-5">Sur devis</p>
                  <Button
                    onClick={() => openContact(p.title)}
                    variant="outline"
                    className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white"
                  >
                    Contact
                  </Button>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-premium-sage/10 border-l-4 border-premium-sage p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4"
            >
              <Sparkles className="w-8 h-8 text-premium-sage shrink-0" />
              <div>
                <h3 className="text-lg md:text-xl font-serif text-editorial-noir mb-1">
                  Mise en avant Mariable incluse dans chaque formule
                </h3>
                <p className="text-sm text-editorial-noir/70">
                  Publication éditoriale dédiée, curation auprès de notre communauté et diffusion
                  dans la newsletter +1000 futurs mariés — incluse systématiquement dans toutes mes
                  prestations.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-serif text-editorial-noir text-center mb-10"
            >
              Questions fréquentes
            </motion.h2>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <motion.div
                  key={`faq-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border-b border-editorial-noir/10"
                >
                  <button
                    onClick={() => toggleAccordion(`faq-${index}`)}
                    className="w-full flex items-center justify-between py-4 text-left hover:bg-editorial-beige/10 transition-colors px-2"
                  >
                    <span className="font-medium text-editorial-noir pr-4">{item.question}</span>
                    {openAccordion === `faq-${index}` ? (
                      <ChevronUp className="w-5 h-5 text-editorial-noir/50 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-editorial-noir/50 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openAccordion === `faq-${index}` && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-editorial-noir/70 px-2 pb-4">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
                Parlons de votre projet
              </h2>
              <p className="text-editorial-noir/70 mb-8">
                Devis, partenariat, simple question — on échange directement et je reviens vers
                vous sous 48h.
              </p>
              <Button
                onClick={() => openContact()}
                className="bg-editorial-noir text-white hover:bg-editorial-noir/90 text-lg px-8 py-6 rounded-none"
              >
                Contact
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      <ContactProModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        defaultSubject={contactSubject}
      />
    </>
  );
};

export default Partenariat;

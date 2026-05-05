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
  Mail,
  ArrowLeft,
} from "lucide-react";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const CONTACT_EMAIL = "mathilde@mariable.fr";

const Partenariat = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const scrollToExpertises = () =>
    document.getElementById("expertises")?.scrollIntoView({ behavior: "smooth" });

  const toggleAccordion = (id: string) =>
    setOpenAccordion(openAccordion === id ? null : id);

  const expertises = [
    {
      icon: Film,
      title: "Stratégie Réseaux sociaux & Création de contenu",
      description:
        "Stratégie selon vos objectifs, refonte de feed Instagram et création de contenu spécial réseaux sociaux tourné en iPhone 17 — authentique, éditorial et performant.",
      points: [
        "Conseil en stratégie réseaux sociaux selon objectif",
        "Refonte de feed Instagram",
        "Création de contenu spécial réseaux sociaux (iPhone 17) : Reels & photos authentiques",
        "Interview équipe & mise en avant humaine des responsables — format vidéo court et impactant",
        "Direction artistique éditoriale, branding & charte graphique",
      ],
    },
    {
      icon: MessageSquare,
      title: "Community management",
      description:
        "Gestion partielle ou complète de votre Instagram et de vos campagnes Meta Ads selon vos besoins, pour une présence régulière et performante.",
      points: [
        "Calendrier éditorial mensuel",
        "Publication & stories",
        "Réponses DM et commentaires",
        "Gestion des publicités Meta Ads (Facebook & Instagram)",
      ],
    },
    {
      icon: Globe,
      title: "Développement digital",
      description:
        "Sites web, guides digitaux et outils en ligne sur-mesure pour valoriser votre offre et fluidifier la relation client.",
      points: [
        "Création de site web vitrine ou réservation",
        "Guides digitaux (welcome guide, brochures interactives)",
        "Outils en ligne sur-mesure (formulaires, espaces clients)",
        "Autres projets de développement web sur demande",
      ],
    },
  ];

  const faqItems = [
    {
      question: "Quels professionnels du mariage accompagnez-vous ?",
      answer:
        "J'accompagne principalement les lieux de réception (domaines, châteaux, mas, manoirs) et les traiteurs mariage qui souhaitent professionnaliser leur image et leur communication digitale. Je travaille aussi ponctuellement avec photographes, fleuristes et wedding planners qui partagent une exigence éditoriale forte.",
    },
    {
      question: "Combien coûte une agence de communication spécialisée mariage ?",
      answer:
        "Mes prestations démarrent à partir de 400€ et sont ensuite sur devis, car chaque lieu de réception et chaque traiteur a des besoins spécifiques (volume de contenu, fréquence de publication, budget Meta Ads, projet web). Je construis un accompagnement à la carte ou un forfait mensuel selon votre maturité digitale et vos objectifs commerciaux.",
    },
    {
      question: "Comment gagner en visibilité quand on est un lieu de réception ou un traiteur mariage ?",
      answer:
        "La visibilité passe par trois leviers complémentaires : un contenu visuel cohérent et désirable (reels, photos), une présence régulière sur Instagram avec un community manager spécialisé mariage, et des campagnes Meta Ads ciblées sur les futurs mariés de votre région. La mise en avant éditoriale Mariable, incluse dans chaque formule, amplifie le tout auprès d'une audience ultra-qualifiée.",
    },
    {
      question: "Pourquoi confier ses publicités Meta Ads à une agence spécialisée mariage ?",
      answer:
        "Le marché du mariage a ses propres codes de ciblage : saisonnalité, intention d'achat, parcours décisionnel à plusieurs mois, audiences look-alike sur les couples engagés. Une agence généraliste brûle souvent du budget faute de connaître ces spécificités. J'optimise vos Meta Ads (Facebook & Instagram) pour générer des leads qualifiés au coût le plus juste.",
    },
    {
      question: "Pouvez-vous créer le site web de mon domaine de mariage ?",
      answer:
        "Oui. Je conçois des sites web vitrine et des sites de réservation sur-mesure pour lieux de réception et traiteurs mariage : design éditorial, optimisation SEO, formulaires de contact, galeries photos, intégration calendrier de disponibilités. Je prends aussi en charge la refonte de sites existants.",
    },
    {
      question: "Qu'est-ce qu'un guide digital pour un lieu de réception ou un traiteur ?",
      answer:
        "Un guide digital remplace les classiques PDF envoyés par mail : welcome guide pour les couples qui ont signé, brochure interactive pour valoriser votre offre commerciale, livret pratique pour les invités. Plus engageant, mis à jour en temps réel et consultable depuis n'importe quel mobile.",
    },
    {
      question: "La mise en avant Mariable est-elle incluse dans vos prestations ?",
      answer:
        "Oui : la mise en avant éditoriale Mariable est systématiquement incluse dans toutes mes formules (Création de contenu, Community management, Développement digital). Elle vous fait bénéficier d'une publication éditoriale dédiée et d'une visibilité auprès de ma communauté de futurs mariés.",
    },
    {
      question: "Travaillez-vous partout en France ?",
      answer:
        "Oui, j'accompagne des lieux de réception et des traiteurs partout en France métropolitaine. Les tournages et shootings se font sur site, les volets community management, Meta Ads et développement digital sont pilotés à distance avec des points réguliers.",
    },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mariable — Agence de communication mariage",
    serviceType: "Communication agency for wedding professionals",
    provider: {
      "@type": "Organization",
      name: "Mariable",
      url: "https://www.mariable.fr",
    },
    areaServed: "FR",
    description:
      "Agence de communication spécialisée mariage pour lieux de réception et traiteurs en France : création de contenu, community management Instagram, campagnes Meta Ads, sites web, guides digitaux et mise en avant éditoriale Mariable.",
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
        <title>Agence de communication mariage — Lieux de réception & traiteurs | Mariable</title>
        <meta
          name="description"
          content="Agence de communication spécialisée mariage pour lieux de réception et traiteurs : création de contenu, community management, Meta Ads, sites web et guides digitaux. Sur devis."
        />
        <link rel="canonical" href="https://www.mariable.fr/partenariat" />
        <script type="application/ld+json">{JSON.stringify(serviceJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <PremiumHeader />
      <main className="min-h-screen">
        {/* Bouton retour accueil sous le sticky header */}
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
              Agence de communication · Lieux de réception & traiteurs
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-editorial-noir mb-6">
              L'agence de communication des professionnels du mariage
            </h1>
            <p className="text-lg md:text-xl text-editorial-noir/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              Lieux de réception et traiteurs : nous créons votre image, votre présence digitale
              et vos outils en ligne pour attirer les couples qui vous ressemblent.
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
                Trois leviers pour construire votre image et votre présence digitale, à la
                carte ou en accompagnement complet.
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
                    asChild
                    variant="outline"
                    className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white"
                  >
                    <a href={`mailto:${CONTACT_EMAIL}?subject=Demande de devis — ${p.title}`}>
                      Demander un devis
                    </a>
                  </Button>
                </motion.article>
              ))}
            </div>

            {/* Bandeau Mise en avant Mariable incluse */}
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
                Pour toute demande — devis, partenariat, question — écrivez-moi directement.
                Je reviens vers vous sous 48h.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-editorial-noir text-white hover:bg-editorial-noir/90 transition-colors text-lg"
              >
                <Mail className="w-5 h-5" />
                {CONTACT_EMAIL}
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Partenariat;

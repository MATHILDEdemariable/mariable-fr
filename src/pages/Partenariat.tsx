import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Instagram,
  Camera,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Film,
  Palette,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Star,
  Eye,
  Heart,
  Clock,
} from "lucide-react";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ProfessionalRegistrationForm from "@/components/forms/ProfessionalRegistrationForm";

const Partenariat = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const scrollToForm = () =>
    document.getElementById("formulaire-inscription")?.scrollIntoView({ behavior: "smooth" });
  const scrollToOffers = () =>
    document.getElementById("offres")?.scrollIntoView({ behavior: "smooth" });

  const toggleAccordion = (id: string) =>
    setOpenAccordion(openAccordion === id ? null : id);

  const constatPoints = [
    {
      icon: Instagram,
      title: "Instagram = la nouvelle vitrine",
      description: "Les futurs mariés cherchent leur lieu et leur traiteur sur Instagram avant tout.",
    },
    {
      icon: Clock,
      title: "Pas le temps de produire",
      description: "Les prestataires mariage n'ont ni le temps ni les outils pour créer du contenu régulier.",
    },
    {
      icon: Eye,
      title: "Être listé ne suffit plus",
      description: "Les annuaires et le SEO classique ne convertissent plus. Il faut être désirable.",
    },
    {
      icon: Heart,
      title: "L'image fait la décision",
      description: "Les couples ne choisissent pas un prestataire. Ils tombent amoureux d'une esthétique.",
    },
  ];

  const piliers = [
    {
      icon: Film,
      title: "Création de contenu",
      keyword: "reels mariage prestataires",
      description: "Reels, photos, direction artistique et mise en scène de votre lieu ou de votre cuisine.",
      points: ["Reels formats Instagram & TikTok", "Photos retouchées", "Direction artistique éditoriale", "Mise en scène & shooting sur site"],
    },
    {
      icon: MessageSquare,
      title: "Community management",
      keyword: "community management lieu de réception",
      description: "Gestion complète de votre Instagram pour une présence régulière et professionnelle.",
      points: ["Calendrier éditorial mensuel", "Publication & stories", "Réponses DM et commentaires", "Feed cohérent et soigné"],
    },
    {
      icon: Sparkles,
      title: "Mise en avant Mariable",
      keyword: "agence social media mariage",
      description: "Publication éditoriale et curation dans l'univers Mariable pour un effet vitrine.",
      points: ["Publication éditoriale dédiée", "Curation auprès de notre communauté", "Newsletter +1000 futurs mariés", "Crédibilité & désirabilité"],
    },
  ];

  const packs = [
    {
      id: "essentiel",
      name: "Essentiel",
      price: "290€",
      period: "/mois",
      tagline: "Pour démarrer une présence pro sur Instagram",
      target: "Traiteurs & petits lieux",
      featured: false,
      features: [
        "4 posts Instagram par mois",
        "2 stories par semaine",
        "Définition de votre ligne éditoriale",
        "Calendrier éditorial mensuel",
        "Reporting mensuel",
      ],
      cta: "Démarrer",
      ctaAction: "form" as const,
    },
    {
      id: "signature",
      name: "Signature",
      price: "490€",
      period: "/mois",
      tagline: "La présence Instagram qui transforme votre lieu en référence",
      target: "Le pack pivot — le plus choisi",
      featured: true,
      features: [
        "4 reels mariage / mois (montage + storytelling)",
        "8 posts feed (photos retouchées + copywriting)",
        "Stories illimitées",
        "Community management complet (DM, commentaires)",
        "1 mise en avant Mariable / mois (post + story)",
        "Calendrier éditorial & reporting mensuel",
      ],
      cta: "Choisir Signature",
      ctaAction: "form" as const,
    },
    {
      id: "studio",
      name: "Studio",
      price: "Sur devis",
      period: "",
      tagline: "Refonte complète de votre image de marque social",
      target: "Lieux établis & domaines de prestige",
      featured: false,
      features: [
        "Shooting trimestriel sur site",
        "Direction artistique sur-mesure",
        "Refonte complète du feed Instagram",
        "Campagnes saisonnières (mariées, ouverture, événements)",
        "Création / refonte site web (option)",
        "Accompagnement stratégique mensuel",
      ],
      cta: "Demander un devis",
      ctaAction: "contact" as const,
    },
  ];

  const accordionContent = [
    {
      id: "reels",
      icon: Film,
      title: "Comment se passe la production des reels ?",
      content: [
        "Brief créatif partagé en début de mois",
        "Tournage sur site OU à partir de vos rushs / photos",
        "Montage, sous-titrage, musique tendance Instagram",
        "Validation avant publication",
        "Publication aux meilleurs créneaux d'engagement",
      ],
    },
    {
      id: "cm",
      icon: MessageSquare,
      title: "Que comprend exactement le community management ?",
      content: [
        "Réponse aux messages directs sous 24h ouvrées",
        "Modération et réponse aux commentaires",
        "Stories spontanées (events, coulisses, météo)",
        "Veille tendances & hashtags mariage",
        "Suivi des collaborations entre prestataires",
      ],
    },
    {
      id: "mariable",
      icon: Sparkles,
      title: "Comment fonctionne la mise en avant Mariable ?",
      content: [
        "Publication éditoriale dédiée sur notre Instagram (+4500 abonnés)",
        "Présence dans la newsletter futurs mariés",
        "Article éditorial sur le blog Mariable (SEO)",
        "Recommandation auprès de notre communauté de couples",
      ],
    },
  ];

  const faqItems = [
    {
      question: "Pourquoi un studio social media spécialisé mariage ?",
      answer: "Parce que la création de contenu pour un mariage demande une vraie compréhension de l'univers, du timing saisonnier et de l'émotion. Un community manager généraliste ne capte pas ces codes.",
    },
    {
      question: "Quel engagement de durée ?",
      answer: "3 mois minimum sur les packs Essentiel et Signature pour des résultats réels (l'algorithme Instagram demande de la régularité). Le pack Studio est sur devis selon le projet.",
    },
    {
      question: "Qui produit les contenus ?",
      answer: "Notre équipe dédiée mariage : photographe, vidéaste, monteuse, copywriter et community manager. Tournage sur votre site ou à partir de vos rushs existants.",
    },
    {
      question: "Quels résultats attendre ?",
      answer: "Une augmentation de la qualité des leads (couples mieux ciblés), une croissance de votre audience Instagram et une image de marque cohérente. Pas de promesse de volume — nous travaillons la désirabilité.",
    },
    {
      question: "Et si je ne veux que la mise en avant Mariable ?",
      answer: "Elle est désormais incluse dans les packs studio. Nous ne vendons plus de référencement seul : sans contenu de qualité, l'effet vitrine ne fonctionne pas.",
    },
    {
      question: "Quelles sont les conditions pour devenir client ?",
      answer: "SIRET actif, assurance professionnelle (RC Pro), avis Google positifs (min 4/5), et un univers compatible avec la ligne éditoriale Mariable.",
    },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Mariable Studio — Social media spécialisé mariage",
    "serviceType": "Social media management for wedding venues and caterers",
    "provider": {
      "@type": "Organization",
      "name": "Mariable",
      "url": "https://www.mariable.fr",
    },
    "areaServed": "FR",
    "description": "Studio social media spécialisé mariage : création de reels, community management Instagram et mise en avant éditoriale pour lieux de réception et traiteurs.",
    "offers": [
      { "@type": "Offer", "name": "Pack Essentiel", "price": "290", "priceCurrency": "EUR" },
      { "@type": "Offer", "name": "Pack Signature", "price": "490", "priceCurrency": "EUR" },
      { "@type": "Offer", "name": "Pack Studio", "price": "0", "priceCurrency": "EUR", "description": "Sur devis" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Studio social media mariage — Création contenu Instagram lieux & traiteurs | Mariable</title>
        <meta
          name="description"
          content="Agence social media spécialisée mariage. Création de reels, community management Instagram et mise en avant éditoriale pour lieux de réception et traiteurs."
        />
        <link rel="canonical" href="https://www.mariable.fr/partenariat" />
        <script type="application/ld+json">{JSON.stringify(serviceJsonLd)}</script>
      </Helmet>
      <PremiumHeader />
      <main className="min-h-screen">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="py-20 px-4 bg-white"
        >
          <div className="container mx-auto max-w-4xl text-center">
            <span className="inline-block px-4 py-1 bg-premium-sage/10 text-premium-sage text-sm mb-6">
              Mariable Studio
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-editorial-noir mb-6">
              Studio social media spécialisé mariage
            </h1>
            <p className="text-xl md:text-2xl text-editorial-noir/70 mb-4 max-w-3xl mx-auto">
              Devenez le lieu (ou le traiteur) que les futurs mariés veulent absolument sur Instagram.
            </p>
            <p className="text-base text-editorial-noir/60 mb-8 max-w-2xl mx-auto">
              Création de contenu, community management et mise en avant éditoriale — pour <strong>lieux de réception</strong> et <strong>traiteurs mariage</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={scrollToOffers}
                className="bg-editorial-noir text-white hover:bg-editorial-noir/90"
              >
                Voir les offres
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white"
              >
                <Link to="/contact">Demander un devis</Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Constat */}
        <section className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                Le constat marché
              </h2>
              <p className="text-editorial-noir/70 max-w-2xl mx-auto">
                Pourquoi les lieux et traiteurs mariage doivent investir Instagram (et bien le faire)
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {constatPoints.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 text-center relative"
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

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center text-lg font-serif italic text-editorial-noir max-w-2xl mx-auto"
            >
              « Les prestataires mariage ne veulent pas être listés. Ils veulent être choisis. »
            </motion.p>
          </div>
        </section>

        {/* 3 piliers */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                Nos 3 expertises studio
              </h2>
              <p className="text-editorial-noir/70 max-w-2xl mx-auto">
                Création contenu Instagram traiteur mariage, community management lieu de réception, mise en avant éditoriale Mariable.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {piliers.map((p, index) => (
                <motion.article
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-editorial-beige/40 border-t-4 border-premium-sage"
                >
                  <p.icon className="w-8 h-8 text-premium-sage mb-4" />
                  <h3 className="text-xl font-serif text-editorial-noir mb-3">{p.title}</h3>
                  <p className="text-sm text-editorial-noir/70 mb-5">{p.description}</p>
                  <ul className="space-y-2">
                    {p.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-premium-sage shrink-0 mt-0.5" />
                        <span className="text-editorial-noir/80">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="offres" className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                Nos packs Studio
              </h2>
              <p className="text-editorial-noir/70 max-w-2xl mx-auto">
                Trois formules transparentes pour devenir désirables sur Instagram. Engagement 3 mois minimum.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {packs.map((pack, index) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 flex flex-col ${
                    pack.featured
                      ? "bg-white border-2 border-premium-sage shadow-xl md:scale-105 md:-my-2"
                      : "bg-white border border-editorial-noir/10"
                  }`}
                >
                  {pack.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-premium-sage text-white text-xs font-medium tracking-wide flex items-center gap-1">
                      <Star className="w-3 h-3" /> LE PLUS CHOISI
                    </span>
                  )}
                  <h3 className="text-2xl font-serif text-editorial-noir mb-1">{pack.name}</h3>
                  <p className="text-xs text-premium-sage uppercase tracking-wide mb-4">{pack.target}</p>
                  <div className="mb-3">
                    <span className="text-4xl font-serif text-editorial-noir">{pack.price}</span>
                    <span className="text-editorial-noir/70">{pack.period}</span>
                  </div>
                  <p className="text-sm text-editorial-noir/70 mb-6 italic">{pack.tagline}</p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {pack.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-premium-sage shrink-0 mt-0.5" />
                        <span className="text-editorial-noir/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {pack.ctaAction === "form" ? (
                    <Button
                      onClick={scrollToForm}
                      className={
                        pack.featured
                          ? "w-full bg-premium-sage text-white hover:bg-premium-sage/90"
                          : "w-full bg-editorial-noir text-white hover:bg-editorial-noir/90"
                      }
                    >
                      {pack.cta}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white"
                    >
                      <Link to="/contact">{pack.cta}</Link>
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>

            <p className="text-center text-sm text-editorial-noir/60 mt-8">
              Setup offert — Engagement 3 mois minimum sur les packs Essentiel & Signature
            </p>
          </div>
        </section>

        {/* Focus pack Signature */}
        <section className="py-20 px-4 bg-premium-sage text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <span className="inline-block px-4 py-1 bg-white/15 text-white text-xs uppercase tracking-wide mb-6">
              Focus Pack Signature
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              La présence Instagram qui transforme votre lieu en référence
            </h2>
            <p className="text-white/80 mb-10 max-w-2xl mx-auto">
              Le pack pivot pour les lieux et traiteurs qui veulent une vraie présence pro, sans avoir à y penser. Tout est géré, mensuellement, par notre équipe spécialisée mariage.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left">
              {[
                { icon: Film, label: "4 reels mariage / mois" },
                { icon: Camera, label: "8 posts feed retouchés" },
                { icon: Instagram, label: "Stories illimitées" },
                { icon: MessageSquare, label: "Community management complet" },
                { icon: Sparkles, label: "1 mise en avant Mariable / mois" },
                { icon: TrendingUp, label: "Reporting mensuel" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-4 bg-white/10">
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={scrollToForm}
                className="bg-white text-editorial-noir hover:bg-white/90"
              >
                Choisir Signature — 490€/mois
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-editorial-noir"
              >
                <Link to="/contact">Poser une question</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Accordions FAQ technique */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-serif text-editorial-noir text-center mb-10"
            >
              Comment on travaille
            </motion.h2>

            <div className="space-y-3">
              {accordionContent.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-editorial-beige/40"
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-editorial-beige/60 transition-colors"
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
                            {item.content.map((line, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
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

        {/* En résumé */}
        <section className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-serif text-editorial-noir mb-8"
            >
              Ce que vous gagnez
            </motion.h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Palette, text: "Image plus forte" },
                { icon: TrendingUp, text: "Présence constante" },
                { icon: Heart, text: "Désirabilité" },
              ].map((item) => (
                <div key={item.text} className="flex items-center justify-center gap-3 p-5 bg-white">
                  <item.icon className="w-5 h-5 text-premium-sage" />
                  <span className="text-editorial-noir font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            <p className="text-editorial-noir/70 italic text-lg max-w-2xl mx-auto">
              Vous ne vendez plus une prestation. Vous vendez une émotion, capturée et diffusée par notre studio.
            </p>
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

        {/* Formulaire */}
        <section id="formulaire-inscription" className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-white p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir mb-4">
                  Démarrer avec Mariable Studio
                </h2>
                <p className="text-editorial-noir/70">
                  Parlez-nous de votre lieu ou de votre activité. Nous revenons vers vous sous 48h avec une proposition personnalisée.
                </p>
              </motion.div>
              <ProfessionalRegistrationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Partenariat;

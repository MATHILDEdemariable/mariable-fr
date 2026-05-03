import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Film,
  MessageSquare,
  Sparkles,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Mail,
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
      title: "Création de contenu",
      description:
        "Reels, photos, direction artistique et mise en scène de votre lieu, de votre cuisine ou de votre savoir-faire.",
      points: [
        "Reels formats Instagram & TikTok",
        "Photos retouchées",
        "Direction artistique éditoriale",
        "Mise en scène & shooting sur site",
      ],
    },
    {
      icon: MessageSquare,
      title: "Community management",
      description:
        "Gestion complète de votre Instagram pour une présence régulière et professionnelle.",
      points: [
        "Calendrier éditorial mensuel",
        "Publication & stories",
        "Réponses DM et commentaires",
        "Feed cohérent et soigné",
      ],
    },
    {
      icon: Sparkles,
      title: "Mise en avant Mariable",
      description:
        "Publication éditoriale et curation dans l'univers Mariable pour un effet vitrine auprès des couples.",
      points: [
        "Publication éditoriale dédiée",
        "Curation auprès de notre communauté",
        "Newsletter +1000 futurs mariés",
        "Crédibilité & désirabilité",
      ],
    },
  ];

  const faqItems = [
    {
      question: "Pourquoi une agence spécialisée mariage ?",
      answer:
        "La création de contenu pour un mariage demande une vraie compréhension de l'univers, du timing saisonnier et de l'émotion. Une agence généraliste ne capte pas ces codes.",
    },
    {
      question: "Qui produit les contenus ?",
      answer:
        "Notre équipe dédiée mariage : photographe, vidéaste, monteuse, copywriter et community manager. Tournage sur votre site ou à partir de vos rushs existants.",
    },
    {
      question: "Quels résultats attendre ?",
      answer:
        "Une augmentation de la qualité des leads (couples mieux ciblés), une croissance de votre audience Instagram et une image de marque cohérente. Nous travaillons la désirabilité.",
    },
    {
      question: "Quelles sont les conditions pour devenir client ?",
      answer:
        "SIRET actif, assurance professionnelle (RC Pro), avis Google positifs (min 4/5), et un univers compatible avec la ligne éditoriale Mariable.",
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
      "Agence de communication spécialisée mariage : création de contenu, community management Instagram et mise en avant éditoriale pour lieux de réception, traiteurs et photographes.",
  };

  return (
    <>
      <Helmet>
        <title>Agence de communication mariage — Lieux, traiteurs, photographes | Mariable</title>
        <meta
          name="description"
          content="L'agence de communication des professionnels du mariage. Création de contenu, community management Instagram et mise en avant éditoriale. Sur devis."
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
            <span className="inline-block px-4 py-1 bg-premium-sage/10 text-premium-sage text-sm mb-6 uppercase tracking-widest">
              Agence de communication · Événementiel mariage
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-editorial-noir mb-6">
              L'agence de communication des professionnels du mariage
            </h1>
            <p className="text-lg md:text-xl text-editorial-noir/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              Lieux de réception, traiteurs, photographes : nous créons votre image et votre
              présence digitale pour attirer les couples qui vous ressemblent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={scrollToExpertises}
                className="bg-editorial-noir text-white hover:bg-editorial-noir/90"
              >
                Voir nos expertises
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white"
              >
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Nous contacter
                </a>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* 3 expertises */}
        <section id="expertises" className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                Nos 3 expertises
              </h2>
              <p className="text-editorial-noir/70 max-w-2xl mx-auto">
                Trois leviers pour construire votre image et votre présence digitale, à la
                carte ou en accompagnement complet.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
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
                Pour toute demande — devis, partenariat, question — écrivez-nous directement.
                Nous revenons vers vous sous 48h.
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

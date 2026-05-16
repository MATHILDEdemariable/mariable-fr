import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

const ICONS = [Film, MessageSquare, Globe];

type ServiceItem = { title: string; description: string; points: string[] };
type FaqItem = { question: string; answer: string };

const Partenariat = () => {
  const { t } = useTranslation("partenariat");
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

  const services = t("services.items", { returnObjects: true }) as ServiceItem[];
  const faqItems = t("faq.items", { returnObjects: true }) as FaqItem[];

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
    description: t("seo.description"),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{t("seo.title")}</title>
        <meta name="description" content={t("seo.description")} />
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
              {t("backHome")}
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
              {t("hero.eyebrow")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-editorial-noir mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-editorial-noir/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex justify-center">
              <Button
                onClick={scrollToExpertises}
                className="bg-editorial-noir text-white hover:bg-editorial-noir/90"
              >
                {t("hero.cta")}
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
                {t("services.sectionTitle")}
              </h2>
              <p className="text-editorial-noir/70 max-w-2xl mx-auto">
                {t("services.sectionSubtitle")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((p, index) => {
                const Icon = ICONS[index] ?? Sparkles;
                return (
                  <motion.article
                    key={p.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 bg-white border-t-4 border-premium-sage flex flex-col"
                  >
                    <Icon className="w-8 h-8 text-premium-sage mb-4" />
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
                      {t("services.pricingLabel")}
                    </p>
                    <p className="text-2xl font-serif text-editorial-noir mb-5">
                      {t("services.pricingValue")}
                    </p>
                    <Button
                      onClick={() => openContact(p.title)}
                      variant="outline"
                      className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white"
                    >
                      {t("services.contactCta")}
                    </Button>
                  </motion.article>
                );
              })}
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
                  {t("services.banner.title")}
                </h3>
                <p className="text-sm text-editorial-noir/70">{t("services.banner.body")}</p>
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
              {t("faq.title")}
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
                {t("contact.title")}
              </h2>
              <p className="text-editorial-noir/70 mb-8">{t("contact.body")}</p>
              <Button
                onClick={() => openContact()}
                className="bg-editorial-noir text-white hover:bg-editorial-noir/90 text-lg px-8 py-6 rounded-none"
              >
                {t("contact.cta")}
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

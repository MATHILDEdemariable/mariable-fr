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
  Mail,
} from "lucide-react";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ContactProModal from "@/components/partenariat/ContactProModal";

const ICONS = [Film, MessageSquare, Globe];

type ServiceItem = { title: string; description: string; points: string[] };
type FaqItem = { question: string; answer: string };
type ProFeature = { title: string; body: string };
type PriceLine = { label: string; price: string };

const Partenariat = () => {
  const { t } = useTranslation("partenariat");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState<string | undefined>(undefined);

  const openContact = (subject?: string) => {
    setContactSubject(subject);
    setContactOpen(true);
  };

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const toggleAccordion = (id: string) =>
    setOpenAccordion(openAccordion === id ? null : id);

  const services = t("services.items", { returnObjects: true }) as ServiceItem[];
  const faqItems = t("faq.items", { returnObjects: true }) as FaqItem[];
  const proFeatures = t("pro.features", { returnObjects: true }) as ProFeature[];
  const centralPoints = t("central.points", { returnObjects: true }) as string[];
  const eligibleItems = t("conditions.one.items", { returnObjects: true }) as string[];
  const priceExample = t("conditions.two.example", { returnObjects: true }) as PriceLine[];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mariable Studio — Agence marketing digital événementiel",
    serviceType: "Digital marketing agency for event professionals",
    provider: {
      "@type": "Organization",
      name: "Mariable",
      url: "https://www.mariable.fr",
    },
    areaServed: "FR",
    description: t("seo.description"),
  };

  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: "Mariable Pro",
    description: t("pro.intro"),
    price: "149",
    priceCurrency: "EUR",
    url: "https://www.mariable.fr/partenariat",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "Mariable",
      url: "https://www.mariable.fr",
    },
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
        <script type="application/ld+json">{JSON.stringify(offerJsonLd)}</script>
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

        {/* Hero — deux offres */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="py-16 md:py-20 px-4 bg-white"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-editorial-olive/10 text-editorial-olive text-sm mb-6 uppercase tracking-widest">
                {t("hero.eyebrow")}
              </span>
              <h1 className="text-3xl md:text-5xl font-serif text-editorial-noir mb-6">
                {t("hero.tagline")}
              </h1>
              <p className="text-base md:text-lg text-editorial-noir/70 max-w-3xl mx-auto leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              {/* Mariable Pro */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col p-8 bg-editorial-olive/5 border-2 border-editorial-olive"
              >
                <span className="text-xs uppercase tracking-widest text-editorial-olive mb-3">
                  {t("hero.proCard.label")}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-3">
                  {t("hero.proCard.title")}
                </h2>
                <p className="text-sm text-editorial-noir/70 mb-6 flex-grow">
                  {t("hero.proCard.subtitle")}
                </p>
                <span className="inline-block self-start text-xs bg-editorial-olive text-white px-3 py-1 mb-3">
                  {t("hero.proCard.badge")}
                </span>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-editorial-noir/40 line-through text-lg">
                    {t("hero.proCard.priceOld")}
                  </span>
                  <span className="text-3xl md:text-4xl font-serif text-editorial-noir">
                    {t("hero.proCard.price")}
                  </span>
                </div>
                <p className="text-sm text-editorial-noir/60 mb-6">
                  {t("hero.proCard.priceNote")}
                </p>
                <Button
                  onClick={() => scrollToSection("mariable-pro")}
                  className="w-full bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none"
                >
                  {t("hero.proCard.cta")}
                </Button>
              </motion.article>

              {/* Mariable Studio */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col p-8 bg-white border border-editorial-noir/15"
              >
                <span className="text-xs uppercase tracking-widest text-editorial-noir/50 mb-3">
                  {t("hero.studioCard.label")}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-3">
                  {t("hero.studioCard.title")}
                </h2>
                <p className="text-sm text-editorial-noir/70 mb-6 flex-grow">
                  {t("hero.studioCard.subtitle")}
                </p>
                <p className="text-xs uppercase tracking-widest text-editorial-noir/50 mb-1">
                  {t("services.pricingLabel")}
                </p>
                <p className="text-3xl md:text-4xl font-serif text-editorial-noir mb-6">
                  {t("hero.studioCard.price")}
                </p>
                <Button
                  onClick={() => scrollToSection("mariable-studio")}
                  variant="outline"
                  className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white rounded-none"
                >
                  {t("hero.studioCard.cta")}
                </Button>
              </motion.article>
            </div>
          </div>
        </motion.section>

        {/* Message central */}
        <section className="py-16 px-4 bg-editorial-olive/10 border-y border-editorial-olive/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container mx-auto max-w-4xl text-center"
          >
            <h2 className="text-2xl md:text-4xl font-serif text-editorial-noir mb-4">
              {t("central.title")}
            </h2>
            <p className="text-editorial-noir/70 max-w-2xl mx-auto mb-8">
              {t("central.body")}
            </p>
            <p className="text-xs uppercase tracking-widest text-editorial-olive mb-5">
              {t("central.resultLabel")}
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 text-left max-w-3xl mx-auto">
              {centralPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 bg-white p-4">
                  <CheckCircle className="w-5 h-5 text-editorial-olive shrink-0 mt-0.5" />
                  <span className="text-sm text-editorial-noir/80">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* Mariable Pro — détail de l'offre */}
        <section id="mariable-pro" className="py-20 px-4 bg-white scroll-mt-24">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-4">
                {t("pro.sectionTitle")}
              </h2>
              <p className="text-editorial-noir/70 max-w-3xl mx-auto">{t("pro.intro")}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5 mb-10">
              {proFeatures.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-6 bg-editorial-beige/20 border-l-2 border-editorial-olive"
                >
                  <CheckCircle className="w-5 h-5 text-editorial-olive shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-lg text-editorial-noir mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-editorial-noir/70">{feature.body}</p>
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-editorial-olive/5 border-2 border-editorial-olive p-8 text-center"
            >
              <span className="inline-block text-xs bg-editorial-olive text-white px-3 py-1 mb-4">
                {t("pro.priceBadge")}
              </span>
              <div className="flex items-baseline justify-center gap-3 mb-1">
                <span className="text-editorial-noir/40 line-through text-lg">
                  {t("pro.priceOld")}
                </span>
                <span className="text-4xl font-serif text-editorial-noir">{t("pro.price")}</span>
              </div>
              <p className="text-sm text-editorial-noir/60 mb-6">{t("pro.priceNote")}</p>
              <Button
                onClick={() => openContact(t("pro.contactSubject"))}
                className="bg-editorial-noir text-white hover:bg-editorial-noir/90 px-8 py-6 text-base rounded-none"
              >
                {t("pro.cta")}
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Conditions d'admission */}
        <section className="py-20 px-4 bg-editorial-beige/30">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-3">
                {t("conditions.sectionTitle")}
              </h2>
              <p className="text-editorial-noir/70">{t("conditions.sectionSubtitle")}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 border-t-4 border-editorial-olive h-full"
              >
                <span className="text-xs uppercase tracking-widest text-editorial-olive">
                  {t("conditions.one.label")}
                </span>
                <h3 className="text-xl font-serif text-editorial-noir mt-2 mb-5">
                  {t("conditions.one.title")}
                </h3>
                <ul className="space-y-2">
                  {eligibleItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-editorial-olive shrink-0 mt-0.5" />
                      <span className="text-editorial-noir/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 border-t-4 border-editorial-olive h-full"
              >
                <span className="text-xs uppercase tracking-widest text-editorial-olive">
                  {t("conditions.two.label")}
                </span>
                <h3 className="text-xl font-serif text-editorial-noir mt-2 mb-3">
                  {t("conditions.two.title")}
                </h3>
                <p className="text-sm text-editorial-noir/70 mb-4">{t("conditions.two.body")}</p>

                <div className="bg-editorial-beige/30 p-5 mb-5">
                  <p className="font-serif text-editorial-noir mb-3">
                    {t("conditions.two.exampleTitle")}
                  </p>
                  <ul className="space-y-2">
                    {priceExample.map((line) => (
                      <li
                        key={line.label}
                        className="flex items-baseline justify-between gap-4 text-sm border-b border-editorial-noir/10 pb-1.5 last:border-0"
                      >
                        <span className="text-editorial-noir/80">{line.label}</span>
                        <span className="font-medium text-editorial-noir whitespace-nowrap">
                          {line.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <Mail className="w-5 h-5 text-editorial-olive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-editorial-noir text-sm mb-1">
                      {t("conditions.two.howTitle")}
                    </p>
                    <p className="text-sm text-editorial-noir/70">{t("conditions.two.how")}</p>
                  </div>
                </div>

                <p className="text-sm text-editorial-noir/60 italic border-l-2 border-editorial-olive pl-4">
                  {t("conditions.two.note")}
                </p>
              </motion.article>
            </div>
          </div>
        </section>

        {/* Mariable Studio */}
        <section id="mariable-studio" className="py-20 px-4 bg-white scroll-mt-24">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1 bg-editorial-noir/5 text-editorial-noir/60 text-xs mb-4 uppercase tracking-widest">
                {t("services.sectionLabel")}
              </span>
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
                    className="p-8 bg-editorial-beige/20 border-t-4 border-editorial-olive flex flex-col"
                  >
                    <Icon className="w-8 h-8 text-editorial-olive mb-4" />
                    <h3 className="text-xl font-serif text-editorial-noir mb-3">{p.title}</h3>
                    <p className="text-sm text-editorial-noir/70 mb-5">{p.description}</p>
                    <ul className="space-y-2 mb-6 flex-grow">
                      {p.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-editorial-olive shrink-0 mt-0.5" />
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
                      className="w-full border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white rounded-none"
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
              className="mt-8 bg-editorial-olive/10 border-l-4 border-editorial-olive p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4"
            >
              <Sparkles className="w-8 h-8 text-editorial-olive shrink-0" />
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
        <section className="py-16 px-4 bg-editorial-beige/30">
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
                    className="w-full flex items-center justify-between py-4 text-left hover:bg-white/50 transition-colors px-2"
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
        <section className="py-20 px-4 bg-white">
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

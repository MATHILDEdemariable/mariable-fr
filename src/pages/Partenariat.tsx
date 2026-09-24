import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Film,
  Globe,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ContactProModal from "@/components/partenariat/ContactProModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import coupleProAsset from "@/assets/partenariat/couple-mariable-pro.png.asset.json";
import receptionProAsset from "@/assets/partenariat/reception-mariable-pro.png.asset.json";

const SERVICE_ICONS = [Film, MessageSquare, Globe];

type EditorialItem = { title: string; body: string };
type ServiceItem = { title: string; description: string; points: string[] };
type FaqItem = { question: string; answer: string };
type PriceLine = { label: string; price: string };
type UseCase = {
  number: string;
  title: string;
  intro?: string;
  body: string;
  items: string[];
  closing: string;
};

const Partenariat = () => {
  const { t } = useTranslation("partenariat");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState<string | undefined>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("conditions") === "1") setConditionsOpen(true);
  }, [searchParams]);

  const { data: proPosts = [] } = useQuery({
    queryKey: ["partenariat-pro-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, meta_description, background_image_url")
        .eq("status", "published")
        .eq("audience", "pro")
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) {
        console.error("❌ partenariat pro posts failed:", error.message);
        return [];
      }
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const services = t("services.items", { returnObjects: true }) as ServiceItem[];
  const faqItems = t("faq.items", { returnObjects: true }) as FaqItem[];
  const workspaceItems = t("workspace.items", { returnObjects: true }) as EditorialItem[];
  const coordinationPeople = t("coordination.people", { returnObjects: true }) as string[];
  const coordinationItems = t("coordination.centralize", { returnObjects: true }) as string[];
  const coordinationBenefits = t("coordination.benefits", { returnObjects: true }) as string[];
  const directUse = t("uses.direct", { returnObjects: true }) as UseCase;
  const giftUse = t("uses.gift", { returnObjects: true }) as UseCase;
  const proOfferItems = t("proOffer.items", { returnObjects: true }) as string[];
  const eligibleItems = t("conditions.one.items", { returnObjects: true }) as string[];
  const priceExample = t("conditions.two.example", { returnObjects: true }) as PriceLine[];

  const openContact = (subject?: string) => {
    setContactSubject(subject);
    setContactOpen(true);
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

  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: "Mariable Pro",
    price: "149",
    priceCurrency: "EUR",
    url: "https://mariable.fr/partenariat",
    availability: "https://schema.org/InStock",
  };

  return (
    <>
      <Helmet>
        <title>{t("seo.title")}</title>
        <meta name="description" content={t("seo.description")} />
        <link rel="canonical" href="https://mariable.fr/partenariat" />
        <script type="application/ld+json">{JSON.stringify(offerJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <PremiumHeader />
      <main className="min-h-screen bg-background">
        <div className="px-4 pt-20 md:px-8">
          <Button asChild variant="ghost" size="sm" className="rounded-none text-editorial-noir">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />{t("backHome")}</Link>
          </Button>
        </div>

        <section className="bg-editorial-beige px-4 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12">
          <div className="mx-auto grid max-w-7xl items-stretch lg:grid-cols-[1.05fr_.95fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-center px-2 py-12 md:px-10 lg:py-20">
              <p className="mb-5 text-xs uppercase tracking-[0.25em] text-editorial-olive">{t("hero.eyebrow")}</p>
              <h1 className="max-w-3xl font-serif text-4xl leading-tight text-editorial-noir md:text-6xl">{t("hero.tagline")}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-editorial-noir/80">{t("hero.subtitle")}</p>
              <p className="mt-4 max-w-2xl leading-relaxed text-editorial-noir/65">{t("hero.body")}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-none bg-editorial-noir px-7 py-6 text-primary-foreground hover:bg-editorial-noir/90">
                  <Link to="/register-gratuit?type=pro">{t("hero.cta")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none border-editorial-noir px-7 py-6 text-editorial-noir hover:bg-editorial-noir hover:text-primary-foreground">
                  <a href="#mariable-studio">{t("hero.studioLabel")}</a>
                </Button>
              </div>
              <div className="mt-10 border-l border-editorial-olive pl-5">
                <p className="text-xs uppercase tracking-[0.2em] text-editorial-olive">{t("hero.studioLabel")}</p>
                <h2 className="mt-2 font-serif text-xl text-editorial-noir">{t("hero.studioTitle")}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-editorial-noir/60">{t("hero.studioBody")}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="relative min-h-[420px] lg:min-h-[660px]">
              <img src={receptionProAsset.url} alt="Réception de mariage dans un jardin" width={768} height={1024} className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
          </div>
          <p className="mx-auto mt-7 max-w-7xl border-t border-editorial-noir/15 pt-5 text-center text-xs uppercase tracking-[0.16em] text-editorial-noir/60">{t("hero.audiences")}</p>
        </section>

        <section className="bg-background px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-editorial-olive">{t("workspace.eyebrow")}</p>
                <h2 className="font-serif text-3xl text-editorial-noir md:text-5xl">{t("workspace.title")}</h2>
                <p className="mt-6 text-lg leading-relaxed text-editorial-noir/75">{t("workspace.intro")}</p>
                <p className="mt-4 leading-relaxed text-editorial-noir/60">{t("workspace.body")}</p>
              </div>
              <div className="border-t border-editorial-noir/20">
                {workspaceItems.map((item, index) => (
                  <motion.article key={item.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-3 border-b border-editorial-noir/20 py-7 sm:grid-cols-[3rem_1fr_1.6fr]">
                    <span className="font-serif text-xl text-editorial-olive">0{index + 1}</span>
                    <h3 className="font-serif text-xl text-editorial-noir">{item.title}</h3>
                    <p className="leading-relaxed text-editorial-noir/65">{item.body}</p>
                  </motion.article>
                ))}
              </div>
            </div>
            <Button asChild variant="outline" className="mt-10 rounded-none border-editorial-noir px-7 py-6 text-editorial-noir hover:bg-editorial-noir hover:text-primary-foreground">
              <Link to="/register-gratuit?type=pro">{t("workspace.cta")}</Link>
            </Button>
          </div>
        </section>

        <section className="bg-editorial-olive px-4 py-20 text-primary-foreground md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-primary-foreground/70">{t("coordination.eyebrow")}</p>
                <h2 className="font-serif text-3xl md:text-5xl">{t("coordination.title")}</h2>
                <div className="mt-8 space-y-3 border-l border-primary-foreground/40 pl-6">
                  {coordinationPeople.map((person) => <p key={person} className="text-lg text-primary-foreground/90">{person}</p>)}
                </div>
                <p className="mt-8 max-w-xl leading-relaxed text-primary-foreground/80">{t("coordination.bridge")}</p>
              </div>
              <div className="bg-background p-7 text-editorial-noir md:p-10">
                <h3 className="font-serif text-3xl">{t("coordination.planningTitle")}</h3>
                <p className="mt-7 text-xs uppercase tracking-[0.2em] text-editorial-olive">{t("coordination.centralizeLabel")}</p>
                <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
                  {coordinationItems.map((item) => <li key={item} className="border-b border-editorial-noir/10 pb-2 text-sm text-editorial-noir/75">{item}</li>)}
                </ul>
                <p className="mt-7 leading-relaxed text-editorial-noir/75">{t("coordination.share")}</p>
                <ul className="mt-5 space-y-2">
                  {coordinationBenefits.map((item) => <li key={item} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-editorial-olive" />{item}</li>)}
                </ul>
                <Button asChild className="mt-8 rounded-none bg-editorial-noir text-primary-foreground hover:bg-editorial-noir/90">
                  <Link to="/pro/feuille-de-route-jour-j">{t("coordination.cta")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-editorial-beige px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-3xl">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-editorial-olive">{t("uses.eyebrow")}</p>
              <h2 className="font-serif text-3xl text-editorial-noir md:text-5xl">{t("uses.title")}</h2>
            </div>
            <div className="grid items-stretch lg:grid-cols-[1fr_.8fr_1fr]">
              {[directUse, giftUse].map((useCase, index) => (
                <article key={useCase.title} className={`${index === 1 ? "lg:col-start-3" : ""} flex flex-col border-t border-editorial-noir/30 bg-background p-7 md:p-10`}>
                  <span className="font-serif text-3xl text-editorial-olive">{useCase.number}</span>
                  <h3 className="mt-5 font-serif text-2xl text-editorial-noir">{useCase.title}</h3>
                  {useCase.intro && <p className="mt-4 font-medium text-editorial-noir">{useCase.intro}</p>}
                  <p className="mt-3 leading-relaxed text-editorial-noir/65">{useCase.body}</p>
                  <ul className="mt-6 grid grid-cols-2 gap-3">
                    {useCase.items.map((item) => <li key={item} className="text-sm text-editorial-noir/75">— {item}</li>)}
                  </ul>
                  <p className="mt-auto border-t border-editorial-noir/15 pt-7 font-serif text-lg text-editorial-noir">{useCase.closing}</p>
                </article>
              ))}
              <div className="relative min-h-[420px] lg:col-start-2 lg:row-start-1">
                <img src={coupleProAsset.url} alt="Couple de mariés dans un jardin fleuri" loading="lazy" width={768} height={1365} className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section id="mariable-pro" className="scroll-mt-24 bg-background px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-editorial-olive">{t("proOffer.eyebrow")}</p>
              <h2 className="font-serif text-3xl text-editorial-noir md:text-5xl">{t("proOffer.title")}</h2>
              <p className="mt-8 font-serif text-4xl text-editorial-noir">{t("proOffer.price")}</p>
              <p className="mt-2 text-editorial-noir/60">{t("proOffer.priceNote")}</p>
              <Button asChild className="mt-8 rounded-none bg-editorial-noir px-7 py-6 text-primary-foreground hover:bg-editorial-noir/90">
                <Link to="/register-gratuit?type=pro">{t("proOffer.cta")}</Link>
              </Button>
              <Button variant="link" onClick={() => setConditionsOpen(true)} className="mt-3 block h-auto rounded-none px-0 text-left text-sm text-editorial-olive underline underline-offset-4">
                {t("proOffer.eligibility")}
              </Button>
            </div>
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.2em] text-editorial-noir/50">{t("proOffer.includedLabel")}</p>
              <ul className="border-t border-editorial-noir/20">
                {proOfferItems.map((item) => <li key={item} className="flex items-center gap-4 border-b border-editorial-noir/20 py-5 text-lg text-editorial-noir"><CheckCircle className="h-5 w-5 shrink-0 text-editorial-olive" />{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section id="mariable-studio" className="scroll-mt-24 bg-editorial-beige px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 border-b border-editorial-noir/20 pb-12 lg:grid-cols-2">
              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-editorial-olive">{t("services.sectionLabel")}</p>
                <h2 className="font-serif text-3xl text-editorial-noir md:text-5xl">{t("services.sectionTitle")}</h2>
              </div>
              <p className="self-end text-lg leading-relaxed text-editorial-noir/65">{t("services.sectionSubtitle")}</p>
            </div>
            <div className="divide-y divide-editorial-noir/20">
              {services.map((service, index) => {
                const Icon = SERVICE_ICONS[index] ?? Sparkles;
                return (
                  <article key={service.title} className="grid gap-6 py-10 lg:grid-cols-[4rem_1fr_1.4fr_auto] lg:items-start">
                    <Icon className="h-8 w-8 text-editorial-olive" />
                    <h3 className="font-serif text-2xl text-editorial-noir">{service.title}</h3>
                    <div><p className="leading-relaxed text-editorial-noir/65">{service.description}</p><ul className="mt-5 grid gap-2 sm:grid-cols-2">{service.points.map((point) => <li key={point} className="text-sm text-editorial-noir/70">— {point}</li>)}</ul></div>
                    <div className="space-y-3"><p className="font-serif text-lg text-editorial-noir">{t("services.pricingValue")}</p><Button variant="outline" onClick={() => openContact(service.title)} className="rounded-none border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-primary-foreground">{t("services.contactCta")}</Button></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-background px-4 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-editorial-olive">{t("resources.eyebrow")}</p>
              <h2 className="font-serif text-3xl text-editorial-noir">{t("resources.title")}</h2>
            </div>
            {proPosts.length > 0 && <div className="mt-10 grid gap-8 md:grid-cols-3">{proPosts.map((post) => <Link key={post.id} to={`/conseils-professionnels/${post.slug}`} className="group"><div className="mb-4 aspect-[4/3] overflow-hidden bg-editorial-beige">{post.background_image_url && <img src={post.background_image_url} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}</div><h3 className="line-clamp-2 font-serif text-xl text-editorial-noir group-hover:text-editorial-olive">{post.title}</h3><p className="mt-2 line-clamp-2 text-sm text-editorial-noir/65">{post.meta_description}</p></Link>)}</div>}
            <div className="mt-10 text-center"><Button asChild variant="outline" className="rounded-none border-editorial-olive text-editorial-olive hover:bg-editorial-olive hover:text-primary-foreground"><Link to="/conseils-professionnels">{t("resources.cta")}</Link></Button></div>
          </div>
        </section>

        <section className="bg-editorial-beige px-4 py-20 md:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-10 text-center font-serif text-3xl text-editorial-noir">{t("faq.title")}</h2>
            {faqItems.map((item, index) => <div key={item.question} className="border-b border-editorial-noir/15"><Button variant="ghost" onClick={() => setOpenAccordion(openAccordion === `faq-${index}` ? null : `faq-${index}`)} className="h-auto w-full justify-between rounded-none px-0 py-5 text-left text-editorial-noir hover:bg-transparent"><span className="pr-4 font-medium">{item.question}</span>{openAccordion === `faq-${index}` ? <ChevronUp className="h-5 w-5 shrink-0" /> : <ChevronDown className="h-5 w-5 shrink-0" />}</Button><AnimatePresence>{openAccordion === `faq-${index}` && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="pb-5 leading-relaxed text-editorial-noir/65">{item.answer}</p></motion.div>}</AnimatePresence></div>)}
          </div>
        </section>

        <section className="bg-editorial-olive px-4 py-20 text-center text-primary-foreground md:px-8">
          <h2 className="font-serif text-3xl md:text-5xl">{t("contact.title")}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-primary-foreground/80">{t("contact.body")}</p>
          <Button onClick={() => openContact()} className="mt-8 rounded-none bg-background px-8 py-6 text-editorial-noir hover:bg-background/90">{t("contact.cta")}</Button>
        </section>
      </main>
      <Footer />

      <Dialog open={conditionsOpen} onOpenChange={setConditionsOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-none border-editorial-olive bg-editorial-beige">
          <DialogHeader><DialogTitle className="font-serif text-2xl text-editorial-noir">{t("conditions.sectionTitle")}</DialogTitle><DialogDescription className="text-editorial-noir/70">{t("conditions.sectionSubtitle")}</DialogDescription></DialogHeader>
          <div className="mt-2 space-y-6">
            <div className="border-t-4 border-editorial-olive bg-background p-6"><p className="text-xs uppercase tracking-widest text-editorial-olive">{t("conditions.one.label")}</p><h3 className="mt-2 font-serif text-lg text-editorial-noir">{t("conditions.one.title")}</h3><ul className="mt-4 space-y-2">{eligibleItems.map((item) => <li key={item} className="flex gap-2 text-sm text-editorial-noir/80"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-editorial-olive" />{item}</li>)}</ul></div>
            <div className="border-t-4 border-editorial-olive bg-background p-6"><p className="text-xs uppercase tracking-widest text-editorial-olive">{t("conditions.two.label")}</p><h3 className="mt-2 font-serif text-lg text-editorial-noir">{t("conditions.two.title")}</h3><p className="mt-3 text-sm text-editorial-noir/70">{t("conditions.two.body")}</p><div className="mt-4 bg-editorial-beige p-5"><p className="mb-3 font-serif text-editorial-noir">{t("conditions.two.exampleTitle")}</p>{priceExample.map((line) => <div key={line.label} className="flex justify-between border-b border-editorial-noir/10 py-2 text-sm"><span>{line.label}</span><span>{line.price}</span></div>)}</div><p className="mt-5 text-sm text-editorial-noir/70"><strong>{t("conditions.two.howTitle")}</strong> {t("conditions.two.how")}</p><p className="mt-4 border-l-2 border-editorial-olive pl-4 text-sm italic text-editorial-noir/60">{t("conditions.two.note")}</p></div>
          </div>
        </DialogContent>
      </Dialog>
      <ContactProModal open={contactOpen} onOpenChange={setContactOpen} defaultSubject={contactSubject} />
    </>
  );
};

export default Partenariat;

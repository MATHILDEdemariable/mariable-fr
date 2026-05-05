import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Film,
  MessageSquare,
  Globe,
  Sparkles,
  Mail,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/agence-hero.jpg";
import contentImg from "@/assets/agence-content.jpg";
import digitalImg from "@/assets/agence-digital.jpg";

const CONTACT_EMAIL = "mathilde@mariable.fr";

type Slide = {
  id: string;
  render: () => JSX.Element;
};

const Agence = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides: Slide[] = [
    {
      id: "cover",
      render: () => (
        <div className="relative w-full h-full">
          <img
            src={heroImg}
            alt="Mariable agence de communication mariage"
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-editorial-noir/55" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
            <span className="inline-block px-4 py-1 border border-white/40 text-xs md:text-sm uppercase tracking-[0.3em] mb-8">
              Présentation · Pros de l'événementiel
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight max-w-5xl">
              L'agence de communication des professionnels du mariage
            </h1>
            <p className="mt-8 max-w-2xl text-base md:text-lg text-white/80">
              Lieux de réception, traiteurs et prestataires haut de gamme — image,
              présence digitale et outils en ligne.
            </p>
            <div className="mt-12 flex items-center gap-3 text-xs uppercase tracking-widest text-white/70">
              <span>Faites défiler</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "constat",
      render: () => (
        <div className="w-full h-full bg-white flex items-center px-6 md:px-20 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <span className="text-xs uppercase tracking-[0.3em] text-premium-sage">
              01 — Le constat
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-editorial-noir mt-6 mb-16 max-w-3xl">
              Une communication sur-mesure pour un marché ultra-spécifique.
            </h2>
            <div className="grid md:grid-cols-3 gap-10 md:gap-16">
              {[
                {
                  n: "+18 mois",
                  t: "Cycle de décision",
                  d: "Les couples décident lentement. Votre présence doit être constante et désirable.",
                },
                {
                  n: "92%",
                  t: "Recherchent sur Instagram",
                  d: "Avant tout site, c'est le feed et les reels qui séduisent ou disqualifient.",
                },
                {
                  n: "Saisonnalité",
                  t: "Pic septembre → mai",
                  d: "Les Meta Ads généralistes brûlent du budget hors fenêtres d'achat.",
                },
              ].map((s) => (
                <div key={s.t} className="border-t border-editorial-noir/15 pt-6">
                  <div className="font-serif text-4xl md:text-5xl text-premium-sage mb-3">
                    {s.n}
                  </div>
                  <h3 className="font-serif text-xl text-editorial-noir mb-2">{s.t}</h3>
                  <p className="text-sm text-editorial-noir/70">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "approche",
      render: () => (
        <div className="w-full h-full bg-editorial-beige/40 grid md:grid-cols-2 items-center">
          <div className="px-6 md:px-20 py-20">
            <span className="text-xs uppercase tracking-[0.3em] text-premium-sage">
              02 — Notre approche
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-editorial-noir mt-6 mb-8">
              Éditoriale, spécialisée, mesurable.
            </h2>
            <p className="text-lg text-editorial-noir/75 leading-relaxed mb-6">
              Une agence pensée par et pour le mariage. Direction artistique soignée,
              expertise des codes du secteur, et une obsession : générer des leads
              qualifiés sans diluer votre image.
            </p>
            <ul className="space-y-3">
              {[
                "Spécialisation 100% mariage haut de gamme",
                "Direction artistique éditoriale et cohérente",
                "Performance mesurée : leads, coût d'acquisition, ROI",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-editorial-noir/80">
                  <CheckCircle className="w-5 h-5 text-premium-sage shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block h-full">
            <img
              src={heroImg}
              alt="Approche éditoriale Mariable"
              className="w-full h-full object-cover"
              loading="lazy"
              width={1920}
              height={1080}
            />
          </div>
        </div>
      ),
    },
    {
      id: "service-1",
      render: () => (
        <ServiceSlide
          number="03"
          tag="Service 01"
          icon={Film}
          image={contentImg}
          title="Stratégie réseaux sociaux & création de contenu"
          intro="Stratégie selon vos objectifs, refonte de feed Instagram et création de contenu authentique tourné en iPhone 17 — éditorial et performant."
          points={[
            "Conseil en stratégie réseaux sociaux selon objectif",
            "Refonte de feed Instagram",
            "Création de contenu (iPhone 17) : Reels & photos authentiques",
            "Interview équipe & mise en avant humaine des responsables",
            "Direction artistique, branding & charte graphique",
          ]}
        />
      ),
    },
    {
      id: "service-2",
      render: () => (
        <ServiceSlide
          number="04"
          tag="Service 02"
          icon={MessageSquare}
          image={heroImg}
          reverse
          title="Community management & Meta Ads"
          intro="Gestion partielle ou complète de votre Instagram et de vos campagnes Meta Ads selon vos besoins, pour une présence régulière et performante."
          points={[
            "Calendrier éditorial mensuel",
            "Publication & stories",
            "Réponses DM et commentaires",
            "Gestion publicités Meta Ads (Facebook & Instagram)",
            "Audiences look-alike couples engagés",
          ]}
        />
      ),
    },
    {
      id: "service-3",
      render: () => (
        <ServiceSlide
          number="05"
          tag="Service 03"
          icon={Globe}
          image={digitalImg}
          title="Développement digital"
          intro="Sites web, guides digitaux et outils en ligne sur-mesure pour valoriser votre offre et fluidifier la relation client."
          points={[
            "Site web vitrine ou réservation",
            "Guides digitaux (welcome guide, brochures interactives)",
            "Outils sur-mesure : formulaires, espaces clients",
            "Refonte de sites existants",
            "Optimisation SEO éditoriale",
          ]}
        />
      ),
    },
    {
      id: "bonus",
      render: () => (
        <div className="w-full h-full bg-editorial-noir text-white flex items-center px-6 md:px-20 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <Sparkles className="w-10 h-10 text-premium-sage mx-auto mb-8" />
            <span className="text-xs uppercase tracking-[0.3em] text-premium-sage">
              06 — Bonus inclus
            </span>
            <h2 className="font-serif text-4xl md:text-6xl mt-6 mb-8">
              Mise en avant éditoriale Mariable, incluse dans chaque formule.
            </h2>
            <p className="text-lg text-white/75 leading-relaxed mb-12 max-w-3xl mx-auto">
              Publication éditoriale dédiée, curation auprès de notre communauté et
              diffusion dans la newsletter — visibilité auprès de +1000 futurs mariés
              ultra-qualifiés.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                ["+1000", "Futurs mariés"],
                ["Éditorial", "Format dédié"],
                ["Newsletter", "Diffusion incluse"],
                ["Curation", "Communauté qualifiée"],
              ].map(([n, t]) => (
                <div key={t}>
                  <div className="font-serif text-2xl md:text-3xl text-premium-sage">
                    {n}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-white/60 mt-2">
                    {t}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      render: () => (
        <div className="w-full h-full bg-white flex items-center px-6 md:px-20 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-premium-sage">
              07 — Parlons-en
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-editorial-noir mt-6 mb-8">
              Construisons votre présence digitale.
            </h2>
            <p className="text-lg text-editorial-noir/70 mb-12">
              Devis sur-mesure sous 48h. Premier échange offert pour cadrer vos
              objectifs et votre maturité digitale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Demande de devis — Agence Mariable`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-editorial-noir text-white hover:bg-editorial-noir/90 transition-colors"
              >
                <Mail className="w-5 h-5" />
                {CONTACT_EMAIL}
              </a>
              <Link
                to="/partenariat"
                className="inline-flex items-center gap-2 px-8 py-4 border border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white transition-colors"
              >
                Voir les détails
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const total = slides.length;

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(Math.max(0, Math.min(total - 1, idx)));
    },
    [current, total]
  );

  const next = useCallback(() => goTo(Math.min(current + 1, total - 1)), [current, goTo, total]);
  const prev = useCallback(() => goTo(Math.max(current - 1, 0)), [current, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <>
      <Helmet>
        <title>Agence de communication mariage — Présentation | Mariable</title>
        <meta
          name="description"
          content="Présentation de l'agence Mariable : création de contenu, community management, Meta Ads, sites web et guides digitaux pour lieux de réception et traiteurs mariage."
        />
        <link rel="canonical" href="https://www.mariable.fr/agence" />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <main className="fixed inset-0 bg-editorial-noir overflow-hidden">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour accueil</span>
          </Link>
          <div className="font-serif text-white text-lg md:text-xl tracking-wider">
            Mariable
          </div>
          <div className="text-xs md:text-sm tracking-widest text-white/70 tabular-nums">
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </div>

        {/* Slide */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slides[current].id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-y-auto"
            >
              {slides[current].render()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side arrows (desktop) */}
        <button
          onClick={prev}
          disabled={current === 0}
          aria-label="Slide précédente"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          disabled={current === total - 1}
          aria-label="Slide suivante"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom dots + mobile nav */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
          <Button
            onClick={prev}
            disabled={current === 0}
            variant="outline"
            size="sm"
            className="md:hidden border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 flex items-center justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Aller à la slide ${i + 1}`}
                className={`h-1 transition-all ${
                  i === current ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
          <Button
            onClick={next}
            disabled={current === total - 1}
            variant="outline"
            size="sm"
            className="md:hidden border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </>
  );
};

type ServiceSlideProps = {
  number: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  reverse?: boolean;
  title: string;
  intro: string;
  points: string[];
};

const ServiceSlide = ({
  number,
  tag,
  icon: Icon,
  image,
  reverse,
  title,
  intro,
  points,
}: ServiceSlideProps) => (
  <div
    className={`w-full h-full grid md:grid-cols-2 bg-white ${
      reverse ? "md:[&>div:first-child]:order-2" : ""
    }`}
  >
    <div className="hidden md:block h-full">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
        width={1920}
        height={1080}
      />
    </div>
    <div className="px-6 md:px-16 py-20 flex flex-col justify-center bg-white">
      <div className="flex items-center gap-4 mb-8">
        <Icon className="w-8 h-8 text-premium-sage" />
        <span className="text-xs uppercase tracking-[0.3em] text-premium-sage">
          {number} — {tag}
        </span>
      </div>
      <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir mb-6 leading-tight">
        {title}
      </h2>
      <p className="text-base md:text-lg text-editorial-noir/70 mb-8 leading-relaxed">
        {intro}
      </p>
      <ul className="space-y-3 mb-10">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-sm md:text-base">
            <CheckCircle className="w-5 h-5 text-premium-sage shrink-0 mt-0.5" />
            <span className="text-editorial-noir/85">{p}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-baseline gap-4 pt-6 border-t border-editorial-noir/15">
        <span className="text-xs uppercase tracking-widest text-editorial-noir/50">
          Tarif
        </span>
        <span className="font-serif text-2xl text-editorial-noir">Sur devis</span>
      </div>
    </div>
  </div>
);

export default Agence;

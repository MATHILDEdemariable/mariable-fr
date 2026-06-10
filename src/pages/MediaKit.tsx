import { useEffect, useRef, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Instagram,
  Globe,
  MessageCircle,
  Newspaper,
  Wrench,
  Handshake,
  ArrowRight,
  Maximize,
  Minimize,
  Linkedin,
} from 'lucide-react';
import mathildePortrait from '@/assets/mathilde-portrait-v2.jpg.asset.json';

const VIDEO_URL =
  'https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4';

const TOTAL_SLIDES = 6;

// ---------- Counter helper ----------
function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

function formatNumber(n: number) {
  return n.toLocaleString('fr-FR').replace(/\u202f|\s/g, ' ');
}

// ---------- Slide wrapper ----------
function Slide({
  children,
  dark = false,
  id,
}: {
  children: React.ReactNode;
  dark?: boolean;
  id: string;
}) {
  return (
    <section
      id={id}
      className={`w-full md:w-screen md:flex-shrink-0 min-h-screen md:h-screen md:overflow-y-auto snap-start flex items-center relative ${
        dark ? 'bg-editorial-noir text-editorial-cream' : 'bg-editorial-cream text-editorial-noir'
      }`}
    >
      <div className="w-full container mx-auto px-6 py-20 md:py-16">{children}</div>
    </section>
  );
}

function GoldLabel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`uppercase tracking-[0.3em] text-xs mb-6 ${
        dark ? 'text-editorial-olive-light' : 'text-editorial-olive'
      }`}
    >
      {children}
    </p>
  );
}

// ---------- Page ----------
export default function MediaKit() {
  const [slide, setSlide] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inactivityTimer = useRef<number | null>(null);

  // Responsive detection
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Trigger stats animation when slide 3 shown
  useEffect(() => {
    if (slide === 3) setStatsVisible(true);
  }, [slide]);

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setStatsVisible(true),
      { threshold: 0.3 }
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const next = useCallback(
    () => setSlide((s) => Math.min(TOTAL_SLIDES - 1, s + 1)),
    []
  );
  const prev = useCallback(() => setSlide((s) => Math.max(0, s - 1)), []);

  // Keyboard nav (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isDesktop) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, next, prev]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await (rootRef.current ?? document.documentElement).requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Auto-hide controls in fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
      return;
    }
    const reset = () => {
      setShowControls(true);
      if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
      inactivityTimer.current = window.setTimeout(() => setShowControls(false), 2500);
    };
    reset();
    window.addEventListener('mousemove', reset);
    window.addEventListener('keydown', reset);
    return () => {
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('keydown', reset);
      if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
    };
  }, [isFullscreen]);

  // Counters
  const c1 = useCountUp(6000, statsVisible);
  const c2 = useCountUp(200000, statsVisible);
  const c3 = useCountUp(70, statsVisible);
  const c4 = useCountUp(52, statsVisible);
  const c5 = useCountUp(74, statsVisible);
  const c6 = useCountUp(1500, statsVisible);
  const c7 = useCountUp(200, statsVisible);

  return (
    <>
      <Helmet>
        <title>Kit Média & Partenaires 2026 — Mariable</title>
        <meta
          name="description"
          content="Mariable, le média du mariage moderne. Audience, chiffres clés, offres partenaires et services pour les professionnels de l'événementiel."
        />
        <link rel="canonical" href="https://mariable-fr.lovable.app/media-kit" />
        <meta property="og:title" content="Kit Média Mariable 2026" />
        <meta
          property="og:description"
          content="Le média du mariage moderne — audience, offres et services partenaires."
        />
        <meta property="og:url" content="https://mariable-fr.lovable.app/media-kit" />
        <meta property="og:type" content="website" />
      </Helmet>

      <main
        ref={rootRef}
        className={`bg-editorial-cream text-editorial-noir font-sans ${
          isFullscreen ? 'cursor-none' : ''
        }`}
        style={isFullscreen && !showControls ? { cursor: 'none' } : undefined}
      >
        {/* Slides container: horizontal on desktop, vertical scroll-snap on mobile */}
        <div className="md:overflow-hidden md:h-screen md:w-screen">
          <div
            className="flex flex-col md:flex-row md:h-screen md:transition-transform md:duration-700 md:ease-out snap-y snap-mandatory md:snap-none"
            style={isDesktop ? { transform: `translateX(-${slide * 100}vw)`, width: '600vw' } : undefined}
          >
          {/* ============ SLIDE 1 — HERO ============ */}
          <Slide id="cover" dark>
            {/* Video background — confined to this slide only */}
            <div className="absolute inset-0 overflow-hidden -z-0">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                src={VIDEO_URL}
              />
              <div className="absolute inset-0 bg-editorial-noir/70" />
            </div>
            <div className="relative z-10 text-center max-w-3xl mx-auto text-editorial-cream py-16">
              <p className="uppercase tracking-[0.4em] text-xs mb-8 text-editorial-olive-light">
                01 — Kit Média & Partenaires 2026
              </p>
              <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] mb-6">Mariable</h1>
              <p className="font-serif italic text-2xl md:text-3xl text-editorial-olive-light mb-8">
                {"\n"}
              </p>
              <p className="text-base md:text-lg text-editorial-cream/85 max-w-xl mx-auto mb-16">
                Le média du mariage moderne — de la demande aux anniversaires.
              </p>
              <div className="space-y-1 text-sm text-editorial-cream/70 tracking-wider">
                <p>{"\n"}</p>
                <p>{"\n"}</p>
                <p>par Mathilde Lambert&nbsp;</p>
              </div>
            </div>
          </Slide>

          {/* ============ SLIDE 2 — MON HISTOIRE ============ */}
          <Slide id="histoire">
            <div className="max-w-5xl mx-auto">
              <GoldLabel>02 — Fondatrice</GoldLabel>
              <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
                <div className="flex md:block justify-center">
                  <div className="relative w-56 h-56 md:w-72 md:h-72 bg-white p-2 shadow-lg">
                    <img
                      src={mathildePortrait.url}
                      alt="Mathilde Lambert, fondatrice de Mariable"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="font-serif text-5xl md:text-7xl mb-4">Mathilde</h2>
                  <p className="font-serif italic text-xl text-editorial-gray mb-4">
                    Diplômée d'école de commerce.&nbsp;+7 ans d'expérience partagée entre finance d'entreprise et entrepreneuriat.&nbsp; Jeune mariée en 2024.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/lambertmathilde/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-editorial-olive hover:underline mb-10"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <div className="space-y-6 text-base md:text-lg leading-relaxed text-editorial-noir/85 max-w-3xl">
                    <p>
                      L'histoire de Mariable commence avec mon expérience personnelle de jeune mariée —
                      où l'organisation fut compliquée et entachée d'erreurs dans le choix des
                      prestataires.
                    </p>
                    <p>
                      {"\n"}
                    </p>
                    <p className="border-l-2 border-editorial-olive pl-6 text-sm md:text-base leading-relaxed text-editorial-noir/75 text-center mx-auto max-w-2xl">
                      L'idée : transformer l'organisation des mariages en une expérience simple, élégante
                      et agréable, pour permettre aux futurs mariés de vivre pleinement le meilleur
                      événement de leur vie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* ============ SLIDE 3 — MARIABLE ============ */}
          <Slide id="mariable">
            <div className="max-w-6xl mx-auto">
              <GoldLabel>03 — Ce qu'est Mariable</GoldLabel>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6 max-w-4xl">
                Mariable : la référence moderne dans l'univers du mariage.
              </h2>
              <p className="font-serif italic text-2xl text-editorial-olive mb-10">{"\n"}</p>

              <div className="border-l-2 border-editorial-olive pl-6 mb-14 max-w-3xl space-y-3 text-editorial-noir/85">
                <p className="font-serif italic text-xl">{"\n"}</p>
                <p>
                  Mariable met en avant l'expérience du mariage à chaque
                  étape — pas juste le jour-J, mais tout ce qui l'entoure, l'anticipe et le prolonge.
                  Des fiançailles aux anniversaires de mariage, en passant par le jour J.
                </p>
                <p>{"\n"}</p>
                <p className="font-serif italic text-editorial-olive">Être Mariable: être en état de se marier.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Newspaper className="w-6 h-6" />,
                    title: 'Le Média Instagram',
                    text:
                      "Haut de gamme, élégant, moderne. Contenu éditorial autour du parcours mariage complet : mise en avant de professionnels de l'événementiel, conseils pratiques, inspiration et curation de lieux.",
                  },
                  {
                    icon: <Wrench className="w-6 h-6" />,
                    title: 'La Plateforme',
                    text:
                      "Mariable.fr — le service en ligne de wedding planning digital pour les couples. Outils d'organisation, ressources digitales, guides pratiques et wedding planner de poche.",
                  },
                  {
                    icon: <Handshake className="w-6 h-6" />,
                    title: 'Les Services Pro',
                    text:
                      "Un écosystème dédié aux professionnels du mariage : mise en relation, visibilité, création de contenu et développement digital.",
                  },
                ].map((c) => (
                  <article key={c.title} className="bg-white border-t-2 border-editorial-olive p-7">
                    <div className="text-editorial-olive mb-4">{c.icon}</div>
                    <h3 className="font-serif text-2xl mb-3">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-editorial-noir/75">{c.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </Slide>

          {/* ============ SLIDE 4 — CHIFFRES ============ */}
          <Slide id="audience">
            <div ref={statsRef} className="max-w-6xl mx-auto">
              <GoldLabel>04 — Audience</GoldLabel>
              <h2 className="font-serif text-4xl md:text-5xl mb-8">Chiffres clés.</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8 mb-12">
                <Stat value={`+${formatNumber(c1)}`} label="Abonnés Instagram" />
                <Stat value={`+${formatNumber(c2)}`} label="Vues mensuelles (pic à 1M)" />
                <Stat value={`${c3}%`} label="Femmes" />
              </div>

              <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                <div>
                  <p className="uppercase tracking-[0.2em] text-xs text-editorial-olive mb-6">
                    Répartition par âge
                  </p>
                  <div className="space-y-4">
                    {[
                      { l: '25–34 ans', v: 52 },
                      { l: '18–24 ans', v: 22 },
                      { l: '35–44 ans', v: 14 },
                      { l: '45+ ans', v: 6 },
                    ].map((r) => (
                      <div key={r.l}>
                        <div className="flex justify-between text-sm mb-1.5 text-editorial-noir/85">
                          <span>{r.l}</span>
                          <span className="font-serif text-editorial-olive">{r.v}%</span>
                        </div>
                        <div className="h-1.5 bg-editorial-noir/10 overflow-hidden">
                          <div
                            className="h-full bg-editorial-olive transition-all duration-1000 ease-out"
                            style={{ width: statsVisible ? `${r.v}%` : '0%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <p className="uppercase tracking-[0.2em] text-xs text-editorial-olive mb-6">
                      Répartition par genre
                    </p>
                    <div className="flex h-3 overflow-hidden">
                      <div
                        className="bg-editorial-olive transition-all duration-1000"
                        style={{ width: statsVisible ? '70%' : '0%' }}
                      />
                      <div
                        className="bg-editorial-noir/15 transition-all duration-1000"
                        style={{ width: statsVisible ? '30%' : '0%' }}
                      />
                    </div>
                    <div className="flex justify-between mt-3 text-sm text-editorial-noir/85">
                      <span>70% Femmes</span>
                      <span>30% Hommes</span>
                    </div>
                  </div>

                  <div className="border-t border-editorial-noir/15 pt-8">
                    <p className="font-serif text-4xl md:text-5xl text-editorial-olive">
                      +{formatNumber(c7)}
                    </p>
                    <p className="text-sm text-editorial-noir/75 mt-2">partenaires professionnels</p>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* ============ SLIDE 5 — OFFRE PROS ============ */}
          <Slide id="offre">
            <div className="max-w-6xl mx-auto">
              <GoldLabel>05 — Offre Professionnels</GoldLabel>
              <h2 className="font-serif text-4xl md:text-5xl mb-3">Ce que je propose aux pros.</h2>
              <p className="text-editorial-gray text-base mb-10">
                Des formats adaptés à chaque objectif.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    n: '01',
                    title: 'Collab Créateurs de Contenu',
                    badge: 'Avantage nature',
                    text:
                      "Mise en relation avec notre communauté de créateurs de contenus — couples, futurs ou jeunes marié.e.s. En échange d'un avantage en nature, ils produisent du contenu authentique, cross-posté sur nos réseaux.",
                    cta: 'En savoir plus',
                    href: 'mailto:contact@mariable.fr?subject=Collab%20Cr%C3%A9ateurs%20de%20contenu',
                  },
                  {
                    n: '02',
                    title: 'Mise en Avant Sélection Mariable',
                    badge: 'Avantage nature / Bon procédé',
                    text:
                      "Intégration dans notre sélection éditoriale sur Instagram et le carnet d'adresses Mariable.",
                    cta: 'En savoir plus',
                    href: 'mailto:contact@mariable.fr?subject=S%C3%A9lection%20Mariable',
                  },
                  {
                    n: '03',
                    title: 'Conseil en marketing digital & Community Management',
                    badge: 'Sur devis',
                    text:
                      "Stratégie éditoriale, création de contenus, calendrier mensuel, Gestion complète de votre présence sociale + campagnes Meta Ads. ",
                    cta: 'Demander un devis',
                    href: 'mailto:contact@mariable.fr?subject=Devis%20Strat%C3%A9gie%20r%C3%A9seaux',
                  },
                  {
                    n: '04',
                    title: 'Développement Digital & Conseil IA',
                    badge: 'Sur devis',
                    text:
                      "Sites web vitrine ou application web ·  Guides digitaux interactifs  · CRM, newsletters & séquences mail · Outils sur-mesure · Conseil en stratégie IA et implémentation d'outils adaptés à votre activité.",
                    cta: 'Demander un devis',
                    href: 'mailto:contact@mariable.fr?subject=Devis%20Community%20%26%20Ads',
                  },
                ].map((c) => (
                  <article
                    key={c.n}
                    className="bg-white border border-editorial-noir/10 p-6 md:p-7 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <span className="font-serif text-editorial-olive text-xl">{c.n}</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] bg-editorial-beige text-editorial-olive px-3 py-1.5">
                        {c.badge}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl mb-3 leading-snug">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-editorial-noir/75 mb-6 flex-1">
                      {c.text}
                    </p>
                    <a
                      href={c.href}
                      className="inline-flex items-center gap-2 text-sm font-medium text-editorial-olive hover:underline self-start"
                    >
                      {c.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </Slide>

          {/* ============ SLIDE 6 — CONTACT ============ */}
          <Slide id="contact">
            <div className="max-w-3xl mx-auto text-center">
              <GoldLabel>06 — Contact</GoldLabel>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-12 text-editorial-noir">
                Travaillons
                <br />
                <span className="italic text-editorial-olive">ensemble.</span>
              </h2>

              <div className="space-y-5 max-w-md mx-auto">
                <ContactRow
                  icon={<Mail className="w-5 h-5" />}
                  label="mathilde@mariable.fr"
                  href="mailto:mathilde@mariable.fr"
                />
                <ContactRow
                  icon={<Instagram className="w-5 h-5" />}
                  label="@mariable"
                  href="https://instagram.com/mariable"
                />
                <ContactRow
                  icon={<Globe className="w-5 h-5" />}
                  label="mariable.fr"
                  href="https://mariable.fr"
                />
                <ContactRow
                  icon={<MessageCircle className="w-5 h-5" />}
                  label="WhatsApp · 07 60 10 81 89"
                  href="https://wa.me/33760108189"
                />
              </div>

              <p className="mt-16 text-xs uppercase tracking-[0.3em] text-editorial-noir/50">
                Mariable © 2026 · Kit média
              </p>
            </div>
          </Slide>
          </div>
        </div>

        {/* ============ Desktop slide controls ============ */}
        <div
          className={`hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 items-center gap-4 bg-editorial-noir/80 backdrop-blur px-5 py-3 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={prev}
            disabled={slide === 0}
            aria-label="Précédent"
            className="text-editorial-cream disabled:opacity-30 hover:text-editorial-olive-light transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 transition-all ${
                  i === slide ? 'w-8 bg-editorial-olive-light' : 'w-2 bg-editorial-cream/40'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-editorial-cream/70 font-serif">
            {String(slide + 1).padStart(2, '0')} / {String(TOTAL_SLIDES).padStart(2, '0')}
          </span>
          <button
            onClick={next}
            disabled={slide === TOTAL_SLIDES - 1}
            aria-label="Suivant"
            className="text-editorial-cream disabled:opacity-30 hover:text-editorial-olive-light transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="w-px h-5 bg-editorial-cream/20 mx-1" />
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
            title={isFullscreen ? 'Quitter (Esc)' : 'Plein écran (F)'}
            className="text-editorial-cream hover:text-editorial-olive-light transition-colors"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile floating fullscreen + hint */}
        <div className="md:hidden fixed bottom-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            aria-label="Plein écran"
            className="bg-editorial-noir/80 text-editorial-cream px-3 py-2"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <div className="bg-editorial-noir/80 text-editorial-cream text-[10px] uppercase tracking-[0.2em] px-3 py-2">
            Scroll ↓
          </div>
        </div>
      </main>
    </>
  );
}

// ---------- Sub-components ----------
function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div>
      <p className="font-serif text-3xl md:text-5xl text-editorial-olive leading-none mb-3">
        {value}
      </p>
      <p className="text-sm text-editorial-noir/85">{label}</p>
      {sub && <p className="text-xs text-editorial-noir/55 mt-1">{sub}</p>}
    </div>
  );
}

function ContactRow({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="flex items-center justify-center gap-4 border border-editorial-noir/20 hover:border-editorial-olive hover:bg-editorial-noir/5 px-6 py-4 transition-all group"
    >
      <span className="text-editorial-olive">{icon}</span>
      <span className="text-editorial-noir group-hover:text-editorial-olive transition-colors">
        {label}
      </span>
    </a>
  );
}

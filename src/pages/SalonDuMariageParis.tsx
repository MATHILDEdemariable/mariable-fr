import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, Mail, MessageCircle, Maximize, Minimize } from 'lucide-react';
import logoSalon from '@/assets/salon/logo.png.asset.json';
import tableeImage from '@/assets/salon/tablee.webp.asset.json';
import preparatifsImage from '@/assets/salon/preparatifs.webp.asset.json';
import coupleSoireeImage from '@/assets/salon/couple-soiree.webp.asset.json';
import chandellesImage from '@/assets/salon/chandelles.webp.asset.json';
import marieeImage from '@/assets/salon/mariee.webp.asset.json';
import oliviersImage from '@/assets/salon/oliviers.webp.asset.json';

const TOTAL_SLIDES = 6;
const WHATSAPP_URL =
  'https://wa.me/33760108189?text=' +
  encodeURIComponent('Bonjour Mathilde, suite à votre proposition pour le Salon du Mariage…');
const CONTACT_EMAIL = 'mathildelambert.contact@gmail.com';

function Slide({ children, dark = false, id }: { children: React.ReactNode; dark?: boolean; id: string }) {
  return (
    <section
      id={id}
      className={`w-full md:w-screen md:flex-shrink-0 min-h-screen md:h-screen md:overflow-y-auto flex items-center relative ${
        dark ? 'bg-editorial-noir text-editorial-cream' : 'bg-[#F6F3EC] text-editorial-noir'
      }`}
    >
      <div className="w-full container mx-auto px-6 py-20 md:py-14">{children}</div>
    </section>
  );
}

function SlideNumber({ value, dark }: { value: string; dark?: boolean }) {
  return (
    <p className={`text-2xl md:text-4xl font-light tracking-wide mb-6 ${dark ? 'text-editorial-cream/80' : 'text-editorial-noir/80'}`}>
      /{value}
    </p>
  );
}

function Kicker({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`uppercase tracking-[0.3em] text-xs mb-4 ${dark ? 'text-editorial-olive-light' : 'text-editorial-olive'}`}>
      {children}
    </p>
  );
}

function PriceLine({ label, price, children }: { label: string; price: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <span className="bg-editorial-cream text-editorial-noir px-4 py-2 text-lg md:text-2xl whitespace-nowrap">{label}</span>
        <span className="flex-1 h-px bg-editorial-cream/40" />
        <span className="font-semibold tracking-wider text-lg md:text-2xl whitespace-nowrap">{price}</span>
      </div>
      <div className="mt-3 uppercase tracking-wider text-xs md:text-sm text-editorial-cream/80 leading-relaxed">{children}</div>
    </div>
  );
}

export default function SalonDuMariageParis() {
  const [slide, setSlide] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const goToNextSlide = useCallback(() => setSlide((s) => Math.min(TOTAL_SLIDES - 1, s + 1)), []);
  const goToPreviousSlide = useCallback(() => setSlide((s) => Math.max(0, s - 1)), []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await (rootRef.current ?? document.documentElement).requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isDesktop) return;
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) { e.preventDefault(); goToNextSlide(); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); goToPreviousSlide(); }
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFs);
    };
  }, [isDesktop, goToNextSlide, goToPreviousSlide, toggleFullscreen]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDesktop || touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50) goToNextSlide();
    if (delta > 50) goToPreviousSlide();
    touchStartX.current = null;
  };

  return (
    <>
      <Helmet>
        <title>Proposition Salon du Mariage Paris × Mathilde Lambert</title>
        <meta name="description" content="Proposition de collaboration Instagram pour le Salon du Mariage de Paris : vision éditoriale, organisation et tarifs." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Mathilde Lambert × Le Salon du Mariage" />
        <meta property="og:description" content="Proposition de collaboration — gestion Instagram et vision éditoriale." />
        <meta property="og:type" content="website" />
      </Helmet>

      <main ref={rootRef} className="bg-[#F6F3EC] text-editorial-noir font-sans" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="md:overflow-hidden md:h-screen md:w-screen">
          <div
            className="flex flex-col md:flex-row md:h-screen transition-transform duration-700 ease-out"
            style={isDesktop ? { transform: `translateX(-${slide * 100}vw)` } : undefined}
          >
            {/* 1 — Couverture */}
            <section className="w-full md:w-screen md:flex-shrink-0 min-h-screen md:h-screen relative flex items-center justify-center bg-editorial-noir text-editorial-cream overflow-hidden">
              <img src={tableeImage.url} alt="Dîner de mariage en plein air sous les oliviers" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-b from-editorial-noir/60 via-editorial-noir/30 to-editorial-noir/80" />
              <div className="relative text-center px-6">
                <p className="uppercase tracking-[0.4em] text-xs mb-8 text-editorial-cream/80">Proposition de collaboration</p>
                <img src={logoSalon.url} alt="Le Salon du Mariage" className="mx-auto w-72 md:w-[34rem] mix-blend-screen" />
                <p className="font-serif italic text-2xl md:text-4xl mt-8">× Mathilde Lambert</p>
                <p className="mt-6 text-sm md:text-base text-editorial-cream/80 max-w-xl mx-auto">
                  Gestion Instagram & vision éditoriale — démarrage le 15 février 2027
                </p>
              </div>
            </section>

            {/* 2 — Vision */}
            <Slide id="vision">
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div>
                  <SlideNumber value="01" />
                  <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-8">Prolonger le travail d'Élodie</h2>
                  <p className="text-base md:text-lg leading-relaxed mb-5">
                    Élodie a construit une marque autour de <strong>l'amour, de l'inspiration et de la célébration</strong>. Cette identité et cette communauté sont des acquis à préserver.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed mb-5">
                    L'ambition : positionner aussi le salon comme un <strong>média utile</strong> pour organiser son mariage et découvrir les bons prestataires.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-editorial-noir/70 border-l-2 border-editorial-olive pl-4">
                    En poste à temps plein dans le conseil Business & IA, je ne reprends pas l'intégralité de la mission d'Élodie : je m'engage sur un périmètre que je peux exécuter avec qualité.
                  </p>
                </div>
                <div className="relative">
                  <img src={preparatifsImage.url} alt="Préparatifs de la mariée entourée de ses témoins" className="w-full h-[28rem] md:h-[36rem] object-cover" loading="lazy" />
                  <div className="absolute -bottom-6 -left-4 md:-left-10 bg-editorial-noir text-editorial-cream px-6 py-5">
                    <p className="font-serif text-4xl md:text-5xl">~30 000</p>
                    <p className="uppercase tracking-[0.2em] text-xs mt-1">abonnés Instagram</p>
                  </div>
                </div>
              </div>
            </Slide>

            {/* 3 — Piliers éditoriaux */}
            <Slide id="piliers">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
                <SlideNumber value="02" />
                <div className="text-center flex-1">
                  <h2 className="font-serif italic text-4xl md:text-6xl">Direction éditoriale</h2>
                  <p className="uppercase tracking-[0.3em] text-xs md:text-sm mt-4">De l'inspiration aux décisions</p>
                </div>
                <div className="w-12 hidden md:block" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { image: coupleSoireeImage, alt: 'Couple de mariés détendus en fin de soirée', title: 'Inspiration & amour', text: "Continuer à faire rêver et entretenir l'identité de marque : ambiances, tendances, célébration." },
                  { image: chandellesImage, alt: 'Mariés à table à la lueur des bougies', title: 'Conseils & organisation', text: 'Aider à passer à l\'action : choisir un prestataire, préparer sa visite, budget, checklists.' },
                  { image: marieeImage, alt: 'Mariée en robe de dentelle dans un couloir', title: 'Prestataires & vie du salon', text: 'Faire découvrir les exposants : portraits, questions-réponses, coulisses, actualités du salon.' },
                ].map((pillar) => (
                  <article key={pillar.title} className="text-center">
                    <img src={pillar.image.url} alt={pillar.alt} className="w-full h-64 md:h-[22rem] object-cover mb-5" loading="lazy" />
                    <h3 className="uppercase tracking-[0.25em] text-sm md:text-base mb-3">{pillar.title}</h3>
                    <p className="text-sm md:text-base text-editorial-noir/75 leading-relaxed max-w-sm mx-auto">{pillar.text}</p>
                  </article>
                ))}
              </div>
            </Slide>

            {/* 4 — Organisation */}
            <Slide id="organisation">
              <div className="grid md:grid-cols-5 gap-10 items-center">
                <div className="md:col-span-3">
                  <SlideNumber value="03" />
                  <h2 className="font-serif text-4xl md:text-5xl mb-8">Proposition d'accompagnement</h2>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                    {[
                      ['Publications', '2 posts / semaine, jusqu\'à 3 les mois de salon (visuels statiques et carrousels).'],
                      ['Stories', '1 story / jour, principalement en repost de contenus existants.'],
                      ['Reels', 'Remix et réutilisation de vidéos existantes, sans tournage.'],
                      ['Création visuelle', "Banque d'images IA dédiée + reprise de la charte et des templates d'Élodie."],
                      ['Pilotage partagé', 'Espace Notion commun ; calendrier validé une fois par mois.'],
                      ['Organisation', 'À distance, échanges WhatsApp / e-mail, appels sur rendez-vous.'],
                    ].map(([title, text]) => (
                      <div key={title} className="border-t border-editorial-noir/20 pt-3">
                        <h3 className="uppercase tracking-[0.2em] text-xs mb-2 text-editorial-olive">{title}</h3>
                        <p className="text-sm md:text-base leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-8 text-xs md:text-sm text-editorial-noir/60">
                    Hors forfait : présence sur site, captation photo / vidéo, facecam, montage avancé, modération quotidienne et demandes urgentes.
                  </p>
                </div>
                <img src={oliviersImage.url} alt="Mariés marchant sous les oliviers" className="md:col-span-2 w-full h-[26rem] md:h-[38rem] object-cover" loading="lazy" />
              </div>
            </Slide>

            {/* 5 — Tarif */}
            <Slide id="tarif" dark>
              <div className="grid md:grid-cols-5 gap-10 items-center">
                <div className="md:col-span-3">
                  <SlideNumber value="04" dark />
                  <h2 className="font-serif text-5xl md:text-7xl mb-3">
                    <span className="italic">Pack</span> <span className="text-editorial-olive-light">« Love in Paris »</span>
                  </h2>
                  <p className="text-base md:text-lg mb-10 text-editorial-cream/85">Gestion mensuelle du compte Instagram — à partir du 15 février 2027</p>
                  <PriceLine label="Forfait mensuel" price="1 200 € HT / mois">
                    Pilotage éditorial + programmation · 2 à 3 posts / semaine · 1 story / jour · reels remix
                  </PriceLine>
                  <PriceLine label="Création visuelle" price="Incluse">
                    Banque d'images IA dédiée · reprise de la charte et des templates d'Élodie
                  </PriceLine>
                  <PriceLine label="Pilotage" price="Inclus">
                    Espace Notion partagé · validation mensuelle du calendrier · passation des sources d'Élodie
                  </PriceLine>
                </div>
                <div className="md:col-span-2 space-y-5">
                  <p className="uppercase tracking-[0.3em] text-xs text-editorial-olive-light">Pistes bonus — à chiffrer si intérêt</p>
                  <div className="border border-editorial-cream/30 p-6">
                    <h3 className="font-serif text-2xl mb-2">Piste 1 — Monétisation média</h3>
                    <p className="text-sm leading-relaxed text-editorial-cream/80">
                      Monétiser les posts dédiés aux exposants pour augmenter les revenus du salon : cadrage de l'offre, plan de test et recommandations.
                    </p>
                  </div>
                  <div className="border border-editorial-cream/30 p-6">
                    <h3 className="font-serif text-2xl mb-2">Piste 2 — Expérience digitale visiteurs</h3>
                    <p className="text-sm leading-relaxed text-editorial-cream/80">
                      En synergie avec Mariable : guide digital et outils d'organisation pour les couples, visibilité durable et plus de réservations pour les exposants.
                    </p>
                  </div>
                  <p className="text-xs text-editorial-cream/60">Ces pistes ne sont pas comprises dans le forfait mensuel.</p>
                </div>
              </div>
            </Slide>

            {/* 6 — Contact */}
            <section className="w-full md:w-screen md:flex-shrink-0 min-h-screen md:h-screen relative flex items-center justify-center bg-editorial-noir text-editorial-cream overflow-hidden">
              <img src={chandellesImage.url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" loading="lazy" />
              <div className="absolute inset-0 bg-editorial-noir/50" />
              <div className="relative text-center px-6 max-w-2xl">
                <Kicker dark>Prochaine étape</Kicker>
                <h2 className="font-serif text-4xl md:text-6xl mb-6">Échangeons sur cette proposition</h2>
                <p className="text-lg mb-1">Mathilde Lambert</p>
                <p className="text-sm text-editorial-cream/75 mb-10">Fondatrice de Mariable · 07 60 10 81 89</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-editorial-cream text-editorial-noir px-8 py-4 min-h-[44px] uppercase tracking-[0.2em] text-xs hover:opacity-90">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Proposition Salon du Mariage')}`} className="inline-flex items-center justify-center gap-2 border border-editorial-cream px-8 py-4 min-h-[44px] uppercase tracking-[0.2em] text-xs hover:bg-editorial-cream/10">
                    <Mail className="h-4 w-4" /> E-mail
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>

        {isDesktop && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-editorial-noir/80 text-editorial-cream px-4 py-2 backdrop-blur">
            <button onClick={goToPreviousSlide} disabled={slide === 0} aria-label="Slide précédente" className="p-1 disabled:opacity-30"><ChevronLeft className="h-5 w-5" /></button>
            <span className="text-xs tracking-widest tabular-nums">{slide + 1} / {TOTAL_SLIDES}</span>
            <button onClick={goToNextSlide} disabled={slide === TOTAL_SLIDES - 1} aria-label="Slide suivante" className="p-1 disabled:opacity-30"><ChevronRight className="h-5 w-5" /></button>
            <button onClick={toggleFullscreen} aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'} className="p-1 ml-2 border-l border-editorial-cream/30 pl-3">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>
        )}
      </main>
    </>
  );
}

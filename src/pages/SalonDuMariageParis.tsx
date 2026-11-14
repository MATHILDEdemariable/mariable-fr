import { useCallback, useEffect, useRef, useState } from 'react';
import mathildeContactImage from '@/assets/salon/mathilde_portrait_contact.png.asset.json';
import couvertureImage from '@/assets/salon/couverture_salon.png.asset.json';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, Mail, MessageCircle, Maximize, Minimize } from 'lucide-react';
import logoSalon from '@/assets/salon/logo.png.asset.json';
import tableeImage from '@/assets/salon/tablee.webp.asset.json';
import salonInstagramFeedImage from '@/assets/salon/salon-instagram-feed.png.asset.json';
import coupleSoireeImage from '@/assets/salon/couple-soiree.webp.asset.json';
import oliviersImage from '@/assets/salon/oliviers.webp.asset.json';
import marieeMetroImage from '@/assets/salon/mariee-metro.png.asset.json';

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
              <img src={couvertureImage.url} alt="Couple de mariés" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-b from-editorial-noir/60 via-editorial-noir/30 to-editorial-noir/80" />
              <div className="relative text-center px-6">
                <p className="uppercase tracking-[0.4em] text-xs mb-8 text-editorial-cream/80">Proposition de collaboration</p>
                <img src={logoSalon.url} alt="Le Salon du Mariage" className="mx-auto w-72 md:w-[34rem] mix-blend-screen" />
                <p className="font-serif italic text-2xl md:text-4xl mt-8">× Mathilde</p>
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
                    Élodie a construit une marque autour de <strong>l'amour et de l'inspiration</strong> . Cette identité et cette communauté sont des acquis à préserver.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed mb-5">
                    L'ambition 2027 : positionner aussi le salon comme un <strong>média utile</strong> pour organiser son mariage et découvrir les bons prestataires.
                  </p>
                </div>
                <div className="relative">
                  <img src={salonInstagramFeedImage.url} alt="Aperçu du fil Instagram du Salon du Mariage" className="w-full h-[28rem] md:h-[36rem] object-cover" loading="lazy" />
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
                  { image: tableeImage, alt: 'Dîner de mariage dressé en plein air', title: 'Conseils & organisation', text: 'Aider à passer à l\'action : choisir un prestataire, préparer sa visite, budget, checklists.' },
                  { image: marieeMetroImage, alt: 'Mariée sur le quai du métro Porte de Versailles devant une rame Le Salon du Mariage', title: 'Prestataires & vie du salon', text: 'Faire découvrir les exposants : portraits, questions-réponses, coulisses, actualités du salon.' },
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
                      ['Publications', '2 posts / semaine, jusqu\'à 3 les mois de salon (visuels statiques et carrousels principalement).'],
                      ['Stories', '1 story tous les 2jours, principalement en repost de contenus existants.'],
                      ['Reels', 'Remix et réutilisation de vidéos existantes, sans tournage ou montage avancé.'],
                      ['Création visuelle', "Banque d'images IA dédiée + reprise de la charte et des templates d'Élodie."],
                      ['Pilotage partagé', 'Espace Notion commun ; calendrier validé une fois par mois.'],
                      ['Organisation', 'Asynchrone : échanges WhatsApp / e-mail, appels sur rendez-vous.'],
                    ].map(([title, text]) => (
                      <div key={title} className="border-t border-editorial-noir/20 pt-3">
                        <h3 className="uppercase tracking-[0.2em] text-xs mb-2 text-editorial-olive">{title}</h3>
                        <p className="text-sm md:text-base leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-8 text-xs md:text-sm text-editorial-noir/60">
                    Hors périmètre: présence sur site, captation photo / vidéo, facecam, montage avancé, modération quotidienne et demandes urgentes.
                    <br />Début possible : 15 Février 2027.
                  </p>
                </div>
                <img src={oliviersImage.url} alt="Mariés marchant sous les oliviers" className="md:col-span-2 w-full h-[26rem] md:h-[38rem] object-cover" loading="lazy" />
              </div>
            </Slide>

            {/* 5 — Tarif */}
            <Slide id="tarif">
              <SlideNumber value="04" />
              <h2 className="font-serif text-4xl md:text-6xl mb-3">Offre tarifaire</h2>
              <p className="text-base md:text-lg mb-8 text-editorial-noir/75">Gestion mensuelle du compte Instagram — à partir du 15 février 2027</p>
              <div className="border border-editorial-noir/20 bg-white/60 p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-5">
                  {[
                    { title: 'Forfait mensuel', price: '1 200 € HT / mois', items: ['Pilotage éditorial + programmation', '2 à 3 posts / semaine', '1 story tous les 2 jours'] },
                    { title: 'Création visuelle', price: 'Incluse', items: ["Banque d'images IA dédiée", "Reprise de la charte et des templates d'Élodie"] },
                    { title: 'Pilotage', price: 'Inclus', items: ['Espace Notion partagé', 'Validation mensuelle du calendrier', "Management d'un content creator si besoin"] },
                  ].map((block) => (
                    <div key={block.title} className="border border-editorial-noir/15 bg-[#F6F3EC] p-5">
                      <h3 className="uppercase tracking-[0.2em] text-xs text-editorial-olive mb-2">{block.title}</h3>
                      <p className="font-serif text-2xl md:text-3xl mb-4">{block.price}</p>
                      <ul className="space-y-1.5 text-sm leading-relaxed">
                        {block.items.map((item) => <li key={item}>· {item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-editorial-noir/20 flex flex-wrap justify-between gap-2 items-baseline">
                  <span className="uppercase tracking-[0.2em] text-xs">Total mensuel</span>
                  <span className="font-serif text-2xl md:text-3xl">1 200 € HT / mois, tout compris</span>
                </div>
              </div>
              <div className="mt-8 grid md:grid-cols-2 gap-5">
                <div className="border border-dashed border-editorial-noir/30 p-5">
                  <p className="uppercase tracking-[0.2em] text-xs text-editorial-olive mb-2">Piste bonus 1 — à chiffrer</p>
                  <h3 className="font-serif text-xl mb-1">Monétisation média</h3>
                  <p className="text-sm text-editorial-noir/75">Monétiser les posts dédiés aux exposants : cadrage de l'offre, plan de test et recommandations.</p>
                </div>
                <div className="border border-dashed border-editorial-noir/30 p-5">
                  <p className="uppercase tracking-[0.2em] text-xs text-editorial-olive mb-2">Piste bonus 2 — à chiffrer</p>
                  <h3 className="font-serif text-xl mb-1">Expérience digitale visiteurs</h3>
                  <p className="text-sm text-editorial-noir/75">En synergie avec Mariable : guide digital et outils d'organisation pour les couples, plus de réservations pour les exposants.</p>
                </div>
              </div>
            </Slide>

            {/* 6 — Contact */}
            <section className="w-full md:w-screen md:flex-shrink-0 min-h-screen md:h-screen relative flex items-center justify-center bg-[#F6F3EC] text-editorial-noir overflow-hidden">
              <div className="relative text-center px-6 max-w-2xl">
                <Kicker>Prochaine étape</Kicker>
                <img src={mathildeContactImage.url} alt="Portrait de Mathilde Lambert" className="mx-auto w-40 h-40 md:w-48 md:h-48 object-cover object-top mb-6" loading="lazy" />
                <h2 className="font-serif text-4xl md:text-6xl mb-6">Contact</h2>
                <p className="text-lg mb-1">Mathilde Lambert</p>
                <p className="text-sm text-editorial-noir/75 mb-10">Fondatrice de Mariable · 07 60 10 81 89</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-editorial-noir text-editorial-cream px-8 py-4 min-h-[44px] uppercase tracking-[0.2em] text-xs hover:opacity-90">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Proposition Salon du Mariage')}`} className="inline-flex items-center justify-center gap-2 border border-editorial-noir px-8 py-4 min-h-[44px] uppercase tracking-[0.2em] text-xs hover:bg-editorial-noir/5">
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

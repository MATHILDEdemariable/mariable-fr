import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const VIDEO_URL =
  'https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4';

const tools = [
  'Rétroplanning intelligent',
  'Budget réel & alertes',
  'Plan de table interactif',
  'Liste invités & RSVP',
  'Coordination Jour J',
  'Assistant IA personnalisé',
];

export default function HeroV2() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_URL}
      />
      <div className="absolute inset-0 bg-editorial-noir/65" />

      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div className="text-editorial-cream">
            <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-terracotta">
              Le planner Mariable
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6">
              Et si tu oubliais
              <br />
              quelque chose&nbsp;?
            </h1>
            <p className="text-base md:text-lg leading-relaxed mb-8 text-editorial-cream/85 max-w-md">
              Un outil de wedding planning en ligne avec IA. Accessible partout,
              sans téléchargement. Pour organiser ton mariage l'esprit tranquille.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                to="/paiement"
                className="inline-flex items-center justify-center gap-2 bg-editorial-terracotta hover:bg-editorial-terracotta/90 text-white px-8 py-4 rounded-none font-medium transition-colors"
              >
                Accéder au planner — 29€
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#planner-included"
                className="inline-flex items-center justify-center px-8 py-4 border border-editorial-cream/40 text-editorial-cream hover:bg-editorial-cream/10 rounded-none font-medium transition-colors"
              >
                Voir ce qu'il y a dedans ↓
              </a>
            </div>
            <p className="text-xs text-editorial-cream/60 italic">
              Les wedding planners facturent 2&nbsp;000€. Toi, tu l'as pour 29€.
            </p>
          </div>

          {/* Right — mockup card */}
          <div className="bg-editorial-beige/95 backdrop-blur-sm p-8 md:p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-editorial-noir/15">
              <span className="text-xs uppercase tracking-widest text-editorial-noir/60">
                Ton espace Mariable
              </span>
              <span className="text-xs bg-editorial-noir text-editorial-cream px-2 py-1">
                Accès à vie
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {tools.map((tool) => (
                <li
                  key={tool}
                  className="flex items-center gap-3 text-editorial-noir text-sm"
                >
                  <Check className="w-4 h-4 text-editorial-terracotta flex-shrink-0" />
                  {tool}
                </li>
              ))}
            </ul>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-5xl text-editorial-noir">29€</span>
              <span className="text-editorial-noir/50 line-through text-lg">59€</span>
              <span className="text-xs text-editorial-noir/60 ml-auto">
                Paiement unique
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

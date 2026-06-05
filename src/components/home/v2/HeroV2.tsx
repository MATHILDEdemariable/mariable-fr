import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const VIDEO_URL =
  'https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4';

export default function HeroV2() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_URL}
      />
      <div className="absolute inset-0 bg-editorial-noir/65" />

      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 text-center">
        <div className="max-w-3xl mx-auto text-editorial-cream">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive-light">
            WEDDING PLANNING NOUVELLE GENERATION
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-8">
            Et si tu oubliais
            <br />
            quelque chose&nbsp;?
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-10 text-editorial-cream/85 max-w-2xl mx-auto">
            Découvre le 1er wedding planner de poche pour les futurs mariés qui organisent eux-mêmes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#planner-included"
              className="inline-flex items-center justify-center gap-2 bg-editorial-olive hover:bg-editorial-olive/90 text-white px-8 py-4 rounded-none font-medium transition-colors"
            >
              Découvrir Mariable
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#testimonials"
              className="inline-flex items-center justify-center px-8 py-4 border border-editorial-cream/40 text-editorial-cream hover:bg-editorial-cream/10 rounded-none font-medium transition-colors"
            >
              Voir les témoignages ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

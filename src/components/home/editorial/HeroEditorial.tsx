import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown } from 'lucide-react';

const VIDEO_URL =
  'https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4';

const HeroEditorial: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  const handleDiscover = () => document.getElementById('application-jour-j')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative h-[92svh] min-h-[620px] max-h-[940px] w-full overflow-hidden bg-editorial-noir">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/lovable-uploads/video-poster.webp"
          width={1920}
          height={1080}
          className="w-full h-full object-cover bg-editorial-noir"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-editorial-noir/55" />
      </div>


      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-16 text-center text-primary-foreground">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-primary-foreground/85">
          {t('hero.eyebrow')}
        </p>
        <h1 className="max-w-4xl font-serif text-4xl leading-[1.02] sm:text-5xl md:text-7xl lg:text-8xl">
          {t('hero.title')}
        </h1>
        <p className="mt-7 max-w-3xl font-serif text-xl leading-snug md:text-3xl">{t('hero.promise')}</p>
        <button
          type="button"
          onClick={handleDiscover}
          className="mt-10 inline-flex min-h-12 items-center justify-center gap-3 border border-primary-foreground bg-primary-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] text-editorial-noir transition-colors hover:bg-transparent hover:text-primary-foreground"
        >
          {t('hero.cta')}
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default HeroEditorial;

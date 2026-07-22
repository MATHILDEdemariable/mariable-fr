import React from 'react';
import { useTranslation } from 'react-i18next';

const VIDEO_URL =
  'https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4';

const HeroEditorial: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/60" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/85 mb-6">
          {t('hero.eyebrow')}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-white leading-[1.1] max-w-4xl">
          {t('hero.title')}
        </h1>
        <p className="mt-6 md:mt-8 text-base md:text-lg text-white/85 max-w-2xl font-sans leading-relaxed whitespace-pre-line">
          {t('hero.subtitle')}
        </p>
        <a
          href="#selection"
          className="mt-10 inline-block border border-white/70 text-white text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-white hover:text-editorial-noir transition-colors duration-200"
        >
          {t('hero.cta')}
        </a>
      </div>
    </section>
  );
};

export default HeroEditorial;

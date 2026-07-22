import React from 'react';
import { useTranslation } from 'react-i18next';

const TESTIMONIALS = [
  {
    quote:
      "On a trouvé notre lieu sur le guide et l'appli du jour-J change la donne. On a pu tout anticiper sans rien oublier et partager les infos à nos témoins. Chacun pouvait gérer facilement sur son smartphone, hyper pratique, on recommande !",
    author: 'Julie & Thomas',
    location: 'Paris',
  },
  {
    quote:
      "Merci à Mathilde pour cette plateforme si pratique : on recommande la fonctionnalité QR code pour récupérer les réponses des invités en digital (que l'on a mis dans nos faire-parts classiques) et qui nous a permis de faire le plan de table au même endroit.",
    author: 'Emma & Lucas',
    location: 'Bretagne',
  },
  {
    quote:
      'Les outils de planification sont incroyables ! Le budget tracker et la checklist nous ont permis de tout organiser sans stress.',
    author: 'Sophie & Marc',
    location: 'Provence',
  },
];

const TestimonialsEditorial: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <header className="text-center mb-12 md:mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-editorial-noir/60 mb-4">
            {t('testimonials.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir leading-tight">
            {t('testimonials.title')} <em className="italic">{t('testimonials.titleEm')}</em>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((tt, i) => (
            <article
              key={i}
              className="border-t border-editorial-noir/20 pt-8 flex flex-col"
            >
              <blockquote className="font-serif text-base md:text-lg text-editorial-noir/90 leading-relaxed italic flex-1">
                « {tt.quote} »
              </blockquote>
              <footer className="mt-6">
                <p className="font-serif text-editorial-noir text-lg">{tt.author}</p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-editorial-noir/50 mt-1">
                  {tt.location}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsEditorial;

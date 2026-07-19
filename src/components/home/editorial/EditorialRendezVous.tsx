import React from 'react';
import { Link } from 'react-router-dom';

const ITEMS = [
  {
    frequence: 'Ebooks',
    title: "Les guides pratiques Mariable",
    caption: "Checklists, planning, discours, jour-j — dès 4,90 €, ou inclus dans Premium.",
    to: '/guides',
  },
  {
    frequence: 'Conseils',
    title: 'Les vraies histoires',
    caption:
      'De vrais couples, de vraies célébrations — mariages, anniversaires, renouvellements de vœux.',
    to: '/conseilsmariage',
  },
  {
    frequence: 'FAQ',
    title: 'Le vrai budget',
    caption:
      'Les chiffres que personne ne donne : combien ça coûte vraiment, où investir, où alléger.',
    to: '/faq',
  },
];

const EditorialRendezVous: React.FC = () => {
  return (
    <section className="bg-editorial-beige py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <header className="mb-10 md:mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-editorial-noir/60">
            Conseils &amp; inspirations
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group border-t-2 border-editorial-noir pt-6 flex flex-col hover:opacity-80 transition-opacity"
            >
              <p className="text-[11px] tracking-[0.25em] uppercase text-editorial-noir/60 mb-3">
                {item.frequence}
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-editorial-noir leading-tight group-hover:italic transition-all">
                {item.title}
              </h3>
              <p className="text-editorial-noir/70 text-sm md:text-base mt-4 leading-relaxed">
                {item.caption}
              </p>
              <span className="mt-6 text-xs tracking-[0.2em] uppercase text-editorial-noir underline underline-offset-4">
                Découvrir →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorialRendezVous;

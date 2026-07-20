import React from 'react';
import { Link } from 'react-router-dom';
import { GUIDES } from '@/data/guides';

// E-Shop : layout magazine — 3 colonnes éditoriales pour les ebooks phares
const FEATURED_SLUGS = ['guide-jour-j', 'guide-debutants-mariage', 'guide-discours-mariage'];

const EditorialEShop: React.FC = () => {
  const items = FEATURED_SLUGS
    .map((slug) => GUIDES.find((g) => g.slug === slug))
    .filter(Boolean) as typeof GUIDES;

  return (
    <section className="bg-[#F8F5EF] py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <header className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-editorial-noir/60 mb-2">
              E-shop
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir leading-tight">
              Les guides &amp; ebooks Mariable
            </h2>
          </div>
          <Link
            to="/guides"
            className="text-xs tracking-[0.2em] uppercase text-editorial-noir underline underline-offset-4 hover:opacity-70"
          >
            Voir tous les guides →
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`/guides/${item.slug}`}
              className="group border-t-2 border-editorial-noir pt-6 flex flex-col hover:opacity-80 transition-opacity"
            >
              <p className="text-[11px] tracking-[0.25em] uppercase text-editorial-noir/60 mb-3">
                Ebook · {item.price.toFixed(2).replace('.', ',')} €
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-editorial-noir leading-tight group-hover:italic transition-all">
                {item.title}
              </h3>
              <p className="text-editorial-noir/70 text-sm md:text-base mt-4 leading-relaxed flex-1">
                {item.description}
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

export default EditorialEShop;

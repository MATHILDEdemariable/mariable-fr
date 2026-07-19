import React from 'react';
import { useSelectionLock } from './SelectionLockModal';

// Contenu éditorial — à mettre à jour avec les vraies photos/textes fournis par Mathilde
const FEATURED = {
  main: {
    label: "L'adresse de la semaine",
    linkLabel: 'Jeter un œil',
    title: 'Le charme brut version Provence',
    location: 'GORDES, LUBERON',
    image:
      'https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/visuels/club%20mariable.png',
  },
  side: {
    label: 'Zoom sur',
    linkLabel: 'Explorer',
    caption: 'Les terrasses cachées de Paris pour un mariage urbain.',
    image:
      'https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/visuels/club%20mariable.png',
  },
};

const EditorialFeatured: React.FC = () => {
  const { requestAccess } = useSelectionLock();

  return (
    <section id="selection" className="bg-editorial-beige py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Colonne principale 2/3 */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs tracking-[0.25em] uppercase text-editorial-noir/60">
                {FEATURED.main.label}
              </p>
              <button
                onClick={() => requestAccess()}
                className="text-xs tracking-[0.15em] uppercase text-editorial-noir/70 hover:text-editorial-noir underline underline-offset-4"
              >
                {FEATURED.main.linkLabel}
              </button>
            </div>
            <button
              onClick={() => requestAccess()}
              className="relative block w-full group overflow-hidden text-left"
              aria-label={FEATURED.main.title}
            >
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={FEATURED.main.image}
                  alt={FEATURED.main.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <span className="inline-block bg-editorial-beige text-editorial-noir text-[10px] tracking-[0.25em] uppercase px-3 py-1 mb-3">
                  {FEATURED.main.location}
                </span>
                <h3 className="font-serif text-2xl md:text-4xl text-white leading-tight">
                  {FEATURED.main.title}
                </h3>
              </div>
              <span className="absolute top-4 right-4 bg-editorial-noir/80 text-white text-[10px] tracking-[0.2em] uppercase px-3 py-1">
                Détail réservé aux membres
              </span>
            </button>
          </div>

          {/* Colonne secondaire 1/3 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs tracking-[0.25em] uppercase text-editorial-noir/60">
                {FEATURED.side.label}
              </p>
              <button
                onClick={() => requestAccess()}
                className="text-xs tracking-[0.15em] uppercase text-editorial-noir/70 hover:text-editorial-noir underline underline-offset-4"
              >
                {FEATURED.side.linkLabel}
              </button>
            </div>
            <button
              onClick={() => requestAccess()}
              className="block w-full text-left group"
            >
              <div className="aspect-[3/4] w-full overflow-hidden relative">
                <img
                  src={FEATURED.side.image}
                  alt={FEATURED.side.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 bg-editorial-noir/80 text-white text-[10px] tracking-[0.2em] uppercase px-2 py-1">
                  Membres
                </span>
              </div>
              <p className="font-serif text-lg md:text-xl text-editorial-noir mt-4 leading-snug">
                {FEATURED.side.caption}
              </p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialFeatured;

import React from 'react';

const ManifestoBand: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="border-t border-b border-editorial-noir/15 py-12 md:py-16 text-center max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-editorial-noir/60 mb-6">
            Notre engagement
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir leading-tight mb-6">
            Une sélection, <em className="italic">pas un annuaire.</em>
          </h2>
          <p className="text-editorial-noir/75 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Aucun lieu, aucun pro ne paie pour apparaître ici. Zéro sponsoring, zéro placement.
            Juste des adresses qu'on réserverait pour notre propre mariage — ou qu'on recommanderait
            à nos meilleures amies.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManifestoBand;

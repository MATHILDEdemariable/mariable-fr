import React from 'react';
import { Link } from 'react-router-dom';

const FinalEditorialCTA: React.FC = () => {
  return (
    <section className="bg-editorial-beige py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="border-t border-b border-editorial-noir/15 py-16 md:py-20 text-center">
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir leading-tight max-w-3xl mx-auto">
            Votre histoire mérite <em className="italic">d'être bien célébrée.</em>
          </h2>
          <div className="mt-8">
            <Link
              to="/register-gratuit"
              className="inline-block bg-wedding-olive text-white text-xs tracking-[0.25em] uppercase px-10 py-5 hover:bg-wedding-olive/90 transition-colors"
            >
              Créer mon compte Mariable
            </Link>
          </div>
          <p className="mt-6 text-xs tracking-[0.2em] uppercase text-editorial-noir/50">
            Gratuit · Sans engagement · En 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalEditorialCTA;

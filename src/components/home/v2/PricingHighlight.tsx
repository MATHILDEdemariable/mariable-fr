import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PricingHighlight() {
  return (
    <section className="bg-editorial-beige py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
            Le prix
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-editorial-noir mb-8">
            29€. Une fois. À vie.
          </h2>

          <div className="flex items-baseline justify-center gap-4 mb-8">
            <span className="font-serif text-6xl md:text-7xl text-editorial-noir">
              29€
            </span>
            <span className="text-editorial-noir/50 line-through text-2xl">
              59€
            </span>
          </div>

          <p className="text-editorial-gray text-sm mb-10">
            Accès immédiat · Paiement unique · Remboursé si pas satisfait·e
          </p>

          <Link
            to="/paiement"
            className="inline-flex items-center justify-center gap-2 bg-editorial-olive hover:bg-editorial-olive/90 text-white px-10 py-5 rounded-none font-medium transition-colors"
          >
            Accéder à Mariable — 29€
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="mt-12 pt-10 border-t border-editorial-noir/15">
            <p className="italic text-editorial-noir/75 text-base md:text-lg leading-relaxed">
              vs un wedding planner à partir de <strong>2 000€</strong>
              <br />
              <span className="text-editorial-olive font-medium not-italic">
                ≈ 70× moins cher — et 100% de contrôle sur ton mariage.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

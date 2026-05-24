import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="relative bg-editorial-cream py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(196,101,74,0.18), transparent)',
        }}
      />
      <div className="relative container mx-auto px-6 text-center">
        <h2 className="font-serif text-5xl md:text-7xl text-editorial-noir leading-[1.05] mb-6">
          Tu n'oublieras rien.
          <br />
          <span className="text-editorial-terracotta italic">Promis.</span>
        </h2>
        <p className="text-editorial-gray text-lg mb-10">
          Accès immédiat. 29€. Une fois.
        </p>
        <Link
          to="/paiement"
          className="inline-flex items-center justify-center gap-2 bg-editorial-noir hover:bg-editorial-terracotta text-editorial-cream px-10 py-5 rounded-none font-medium text-base transition-colors"
        >
          Accéder à mon compte Mariable
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-xs text-editorial-noir/50 mt-8 italic">
          Remboursé si pas satisfait·e · Aucune installation · Accès à vie
        </p>
      </div>
    </section>
  );
}

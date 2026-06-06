import { Link } from 'react-router-dom';
import { ArrowRight, Instagram } from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="relative bg-editorial-cream py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(99,116,90,0.20), transparent)',
        }}
      />
      <div className="relative container mx-auto px-6 text-center">
        <h2 className="font-serif text-5xl md:text-7xl text-editorial-noir leading-[1.05] mb-6">
          Et si tu oubliais
          <br />
          <span className="text-editorial-olive italic">quelque chose&nbsp;?</span>
        </h2>
        <p className="text-editorial-gray text-lg mb-10">
          Crée ton compte Mariable dès maintenant.
        </p>
        <Link
          to="/paiement"
          className="inline-flex items-center justify-center gap-2 bg-editorial-noir hover:bg-editorial-olive text-editorial-cream px-10 py-5 rounded-none font-medium text-base transition-colors"
        >
          Accéder à mon compte Mariable
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-xs text-editorial-noir/50 mt-8 italic">
          Remboursé si pas satisfait·e · Aucune installation · Accès à vie
        </p>

        <a
          href="https://www.instagram.com/mariable.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-8 text-editorial-noir/70 hover:text-editorial-olive transition-colors text-sm"
        >
          <Instagram className="w-4 h-4" />
          Suis Mariable sur Instagram →
        </a>
      </div>
    </section>
  );
}

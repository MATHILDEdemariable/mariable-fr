import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumFinalCTASection = () => {
  return (
    <section className="py-24 bg-editorial-olive relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Heading éditorial */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-normal leading-tight">
            Prêt à vivre votre
            <br />
            <em>mariage d'exception ?</em>
          </h2>

          {/* Description sobre */}
          <p className="text-xl text-white/80 mb-12 font-light leading-relaxed">
            Rejoignez des centaines de couples qui ont fait confiance à Mariable
          </p>

          {/* CTA unique blanc */}
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-white text-editorial-olive hover:bg-editorial-beige px-12 py-6 text-base font-medium rounded-none shadow-none"
            >
              Créer mon compte gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          {/* Trust indicators sobres */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/70 text-sm mt-12">
            <span>Inscription gratuite</span>
            <span className="hidden sm:block">•</span>
            <span>Outils inclus</span>
            <span className="hidden sm:block">•</span>
            <span>Support dédié</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumFinalCTASection;

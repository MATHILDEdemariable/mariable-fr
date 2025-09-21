import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumFinalCTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-premium-sage via-premium-sage-medium to-premium-sage-light relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Icon */}
          <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <Sparkles className="h-12 w-12 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Prêt à vivre votre
            <br />
            mariage d'exception ?
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-light leading-relaxed">
            Rejoignez des centaines de couples qui ont fait confiance à Mariable
            <br />
            pour organiser le plus beau jour de leur vie
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link to="/register">
              <Button
                size="lg"
                className="btn-primary bg-white text-premium-sage px-12 py-4 text-lg font-semibold shadow-xl ripple"
              >
                Créer mon compte gratuit
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            
            <Link to="/selection">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm px-12 py-4 text-lg font-semibold ripple"
              >
                Explorer les prestataires
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Inscription gratuite</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Outils inclus</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Support dédié</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumFinalCTASection;

import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import { ArrowRight, Sparkles, Calendar, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-wedding-light">
      <header className="py-6 bg-wedding-green/95 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif text-center text-wedding-white">Mariable</h1>
          <p className="text-center text-wedding-white/80 mt-2 font-light">La révolution de l'organisation de mariage</p>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-wedding-green/10 text-sm text-wedding-green mb-4">
                <Sparkles size={14} className="mr-2" />
                <span>Nouveau en 2025</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
                Organisez le mariage <span className="text-wedding-green">dont vous rêvez</span>
              </h2>
              <p className="text-muted-foreground text-lg md:pr-12">
                Mariable révolutionne l'organisation de votre mariage en vous connectant instantanément avec les meilleurs prestataires adaptés à vos envies et votre budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="gap-2 bg-wedding-green hover:bg-wedding-green/90 text-white">
                  Commencer <ArrowRight size={16} />
                </Button>
                <Button size="lg" variant="outline" className="border-wedding-green text-wedding-green hover:bg-wedding-green/10">
                  En savoir plus
                </Button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-wedding-green/20">
              <ChatInterface />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-wedding-cream">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif mb-4">Comment Mariable transforme votre expérience</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dites adieu au stress et aux heures interminables de recherche de prestataires
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-green/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-green/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-wedding-green" />
                </div>
                <h3 className="text-xl font-serif mb-2">Gain de temps</h3>
                <p className="text-muted-foreground">
                  Trouvez tous vos prestataires en quelques minutes au lieu de plusieurs semaines de recherche.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-green/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-green/20 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-wedding-green" />
                </div>
                <h3 className="text-xl font-serif mb-2">Recommandations personnalisées</h3>
                <p className="text-muted-foreground">
                  Des suggestions qui correspondent parfaitement à votre style, votre région et votre budget.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-green/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-green/20 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-wedding-green" />
                </div>
                <h3 className="text-xl font-serif mb-2">Sans stress</h3>
                <p className="text-muted-foreground">
                  Une approche intuitive et conversationnelle pour organiser chaque aspect de votre mariage.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 md:py-24 bg-wedding-green text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Prêt à révolutionner l'organisation de votre mariage ?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Posez-nous vos questions sur les prestataires, lieux, et tout ce qui concerne votre grand jour. Mariable est là pour vous guider.
            </p>
            <Button size="lg" className="bg-white hover:bg-white/90 text-wedding-green">
              Essayer Mariable maintenant
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t bg-wedding-green text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center md:text-left font-serif text-xl mb-4 md:mb-0">Mariable</p>
            <p className="text-sm text-white/70">
              © 2025 Mariable - La révolution de l'organisation de mariage
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

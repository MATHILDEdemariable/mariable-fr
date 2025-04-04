
import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import { ArrowRight, Sparkles, Calendar, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-wedding-cream to-white">
      <header className="py-6 bg-white/50 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif text-center bg-gradient-to-r from-wedding-mauve to-wedding-blush bg-clip-text text-transparent">Mariable</h1>
          <p className="text-center text-muted-foreground mt-2 font-light">La révolution de l'organisation de mariage</p>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-wedding-blush/20 text-sm text-wedding-mauve mb-4">
                <Sparkles size={14} className="mr-2" />
                <span>Nouveau en 2025</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
                Organisez le mariage <span className="bg-gradient-to-r from-wedding-mauve to-wedding-blush bg-clip-text text-transparent">dont vous rêvez</span>
              </h2>
              <p className="text-muted-foreground text-lg md:pr-12">
                Mariable révolutionne l'organisation de votre mariage en vous connectant instantanément avec les meilleurs prestataires adaptés à vos envies et votre budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="gap-2 bg-wedding-mauve hover:bg-wedding-mauve/90">
                  Commencer <ArrowRight size={16} />
                </Button>
                <Button size="lg" variant="outline" className="border-wedding-blush text-wedding-mauve hover:bg-wedding-blush/10">
                  En savoir plus
                </Button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-wedding-blush/20">
              <ChatInterface />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-wedding-cream/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif mb-4">Comment Mariable transforme votre expérience</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dites adieu au stress et aux heures interminables de recherche de prestataires
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-blush/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-blush/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-wedding-mauve" />
                </div>
                <h3 className="text-xl font-serif mb-2">Gain de temps</h3>
                <p className="text-muted-foreground">
                  Trouvez tous vos prestataires en quelques minutes au lieu de plusieurs semaines de recherche.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-blush/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-blush/20 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-wedding-mauve" />
                </div>
                <h3 className="text-xl font-serif mb-2">Recommandations personnalisées</h3>
                <p className="text-muted-foreground">
                  Des suggestions qui correspondent parfaitement à votre style, votre région et votre budget.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-blush/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-blush/20 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-wedding-mauve" />
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
        <section className="py-16 md:py-24 bg-gradient-to-r from-wedding-mauve/10 to-wedding-blush/10">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Prêt à révolutionner l'organisation de votre mariage ?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Posez-nous vos questions sur les prestataires, lieux, et tout ce qui concerne votre grand jour. Mariable est là pour vous guider.
            </p>
            <Button size="lg" className="bg-wedding-mauve hover:bg-wedding-mauve/90">
              Essayer Mariable maintenant
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center md:text-left text-wedding-mauve font-serif text-xl mb-4 md:mb-0">Mariable</p>
            <p className="text-sm text-muted-foreground">
              © 2025 Mariable - La révolution de l'organisation de mariage
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

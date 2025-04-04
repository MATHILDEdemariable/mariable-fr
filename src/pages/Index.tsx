
import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import Header from '@/components/Header';
import { ArrowRight, Sparkles, Calendar, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-wedding-cream">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-wedding-black/10 text-sm text-wedding-black mb-4">
                <Sparkles size={14} className="mr-2" />
                <span>Nouveau en 2025</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
                Organisez le mariage <span className="text-wedding-black">dont vous rêvez</span>
              </h2>
              <p className="text-muted-foreground text-lg md:pr-12">
                Mariable révolutionne l'organisation de votre mariage en vous connectant instantanément avec les meilleurs prestataires adaptés à vos envies et votre budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="gap-2 bg-wedding-black hover:bg-wedding-black/90 text-white">
                  Commencer <ArrowRight size={16} />
                </Button>
                <Button size="lg" variant="outline" className="border-wedding-black text-wedding-black hover:bg-wedding-black/10">
                  En savoir plus
                </Button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-wedding-black/20">
              <ChatInterface />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif mb-4">Comment Mariable transforme votre expérience</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dites adieu au stress et aux heures interminables de recherche de prestataires
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-wedding-cream p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-wedding-black" />
                </div>
                <h3 className="text-xl font-serif mb-2">Gain de temps</h3>
                <p className="text-muted-foreground">
                  Trouvez tous vos prestataires en quelques minutes au lieu de plusieurs semaines de recherche.
                </p>
              </div>
              
              <div className="bg-wedding-cream p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-wedding-black" />
                </div>
                <h3 className="text-xl font-serif mb-2">Recommandations personnalisées</h3>
                <p className="text-muted-foreground">
                  Des suggestions qui correspondent parfaitement à votre style, votre région et votre budget.
                </p>
              </div>
              
              <div className="bg-wedding-cream p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-wedding-black" />
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
        <section id="contact" className="py-16 md:py-24 bg-wedding-black text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Prêt à révolutionner l'organisation de votre mariage ?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Posez-nous vos questions sur les prestataires, lieux, et tout ce qui concerne votre grand jour. Mariable est là pour vous guider.
            </p>
            <Button size="lg" className="bg-white hover:bg-white/90 text-wedding-black">
              Essayer Mariable maintenant
            </Button>
          </div>
        </section>
      </main>
      
      <footer id="about" className="py-8 border-t bg-wedding-black text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/lovable-uploads/d212cd91-6c48-4581-b66d-302d10e17ad9.png" alt="Mariable Logo" className="h-10 w-auto" />
              <p className="font-serif text-xl">Mariable</p>
            </div>
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

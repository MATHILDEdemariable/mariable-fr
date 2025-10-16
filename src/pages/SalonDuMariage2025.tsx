import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Mic, Instagram, ExternalLink, Crown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SalonDuMariage2025 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Salon du Mariage 2025 - Mariable</title>
        <meta name="description" content="Retrouvez Mariable au Salon du Mariage 2025 ! Participez à notre jeu concours et découvrez notre concept unique de coordination de mariage." />
        <meta name="keywords" content="salon du mariage 2025, jeu concours mariage, mariable, coordination mariage, micro trottoir" />
        <link rel="canonical" href="https://www.mariable.fr/salon-du-mariage-2025" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
            Salon du Mariage 2025
          </h1>
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-xl text-muted-foreground mb-4">
              Découvrez <strong>Mariable</strong>, la première application de coordination jour-J
            </p>
            <p className="text-lg text-muted-foreground">
              Une solution <span className="text-primary font-semibold">unique et innovante</span> pour organiser votre mariage avec vos proches et prestataires, directement en ligne !
            </p>
          </div>
          
          {/* Instagram CTA */}
          <div className="bg-gradient-to-r from-wedding-olive/10 to-wedding-sage/10 rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Instagram className="w-5 h-5 text-primary" />
              <span className="font-semibold">Suivez-nous</span>
            </div>
            <a 
              href="https://www.instagram.com/mariable.fr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-semibold flex items-center justify-center gap-1"
            >
              @mariable.fr
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Actions Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Jeu Concours Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-wedding-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-wedding-olive" />
                  </div>
                  <h2 className="text-2xl font-serif text-foreground mb-3">
                    Jeu Concours
                  </h2>
                  <p className="text-lg font-semibold text-primary mb-2">
                    🎁 Tentez de gagner 250€ de fleurs !
                  </p>
                   <p className="text-muted-foreground mb-6">
                     Participez à notre jeu concours et gagnez 250€ de fleurs pour votre mariage
                   </p>
                </div>
                
                <Link to="/salon-du-mariage-2025/jeu-concours">
                  <Button className="w-full group-hover:scale-105 transition-transform">
                    Participer au concours
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Micro-Trottoir Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-wedding-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-wedding-sage" />
                  </div>
                  <h2 className="text-2xl font-serif text-foreground mb-3">
                    Micro-Trottoir
                  </h2>
                  <p className="text-lg font-semibold text-primary mb-2">
                    🎤 Partagez votre histoire
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Aidez-nous à faire connaître Mariable en partageant votre expérience du mariage
                  </p>
                </div>
                
                <Link to="/salon-du-mariage-2025/autorisation-micro-trottoir">
                  <Button variant="outline" className="w-full group-hover:scale-105 transition-transform">
                    Donner mon autorisation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Premium Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-serif text-foreground mb-3">
                    Passez à Premium
                  </h2>
                  <p className="text-lg font-semibold text-primary mb-2">
                    ✨ Accès aux fonctionnalités avancées
                  </p>
                  <p className="text-muted-foreground mb-2">
                    Débloquez toutes les fonctionnalités de coordination pour votre mariage
                  </p>
                  <p className="text-sm text-primary font-semibold mb-4">
                    39€ - Accès vie entière
                  </p>
                </div>
                
                <Link to="/paiement">
                  <Button variant="wedding" className="w-full group-hover:scale-105 transition-transform">
                    Découvrir Premium
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mariable Presentation */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-wedding-olive/5 to-wedding-sage/5 rounded-2xl p-8">
            <h3 className="text-2xl font-serif text-foreground mb-4">
              Pourquoi Mariable est unique ?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-foreground mb-2">🚀 Sans téléchargement</h4>
                <p className="text-sm text-muted-foreground">Application web directement accessible depuis votre navigateur</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">👥 Collaboration</h4>
                <p className="text-sm text-muted-foreground">Coordonnez avec vos proches et prestataires en temps réel</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">✨ Innovation</h4>
                <p className="text-sm text-muted-foreground">La première solution complète de coordination jour-J en France</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SalonDuMariage2025;
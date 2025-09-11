import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Instagram, ExternalLink, Heart, Users, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SalonMicroTrottoir = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Autorisation Micro-Trottoir | Salon du Mariage 2025 - Mariable</title>
        <meta name="description" content="Participez à notre micro-trottoir au Salon du Mariage 2025 et aidez-nous à faire connaître Mariable, la solution unique de coordination de mariage !" />
        <meta name="keywords" content="micro trottoir mariage, autorisation interview, salon du mariage, mariable, témoignage mariage" />
        <link rel="canonical" href="https://www.mariable.fr/salon-du-mariage-2025/autorisation-micro-trottoir" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/salon-du-mariage-2025" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Salon du Mariage 2025
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-wedding-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mic className="w-10 h-10 text-wedding-sage" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Micro-Trottoir
          </h1>
          <p className="text-2xl font-semibold text-primary mb-2">
            🎤 Partagez votre histoire de mariage
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aidez-nous à faire connaître Mariable en partageant votre expérience et vos conseils mariage lors de notre micro-trottoir au salon !
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Information Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-wedding-olive" />
                Pourquoi participer ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-wedding-olive/5 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Mariable est unique !</p>
                    <p className="text-sm text-muted-foreground">
                      Nous sommes la première application de coordination jour-J en France. 
                      Votre témoignage nous aide à faire connaître cette innovation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-wedding-sage/5 rounded-lg">
                  <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Aidez d'autres couples</p>
                    <p className="text-sm text-muted-foreground">
                      En partageant votre expérience, vous aidez d'autres futurs mariés à mieux organiser leur grand jour.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-wedding-olive/5 rounded-lg">
                  <Instagram className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Contenus réseaux sociaux</p>
                    <p className="text-sm text-muted-foreground">
                      Vos interviews nous permettent de créer du contenu authentique pour nos réseaux sociaux.
                    </p>
                    <a 
                      href="https://www.instagram.com/mariable.fr/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm mt-2"
                    >
                      Voir @mariable.fr
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-primary/5 to-wedding-olive/5 rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  <strong>Merci de nous aider à grandir !</strong><br />
                  Ensemble, révolutionnons l'organisation des mariages en France 💍
                </p>
              </div>

              <div className="text-center">
                <Link to="/dashboard">
                  <Button variant="outline">
                    Découvrir Mariable
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Airtable Form */}
          <Card>
            <CardHeader>
              <CardTitle>Autorisation de diffusion</CardTitle>
              <p className="text-sm text-muted-foreground">
                Donnez votre autorisation pour participer à notre micro-trottoir et être filmé(e) pour nos réseaux sociaux
              </p>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <iframe 
                  className="airtable-embed w-full rounded-lg" 
                  src="https://airtable.com/embed/app8PM2oH1wOtI1R4/shrOGywUnGBRflZnl" 
                  frameBorder="0" 
                  width="100%" 
                  height="533" 
                  style={{ background: 'transparent', border: '1px solid #ccc' }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About Mariable */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-wedding-olive/5 to-wedding-sage/5 rounded-2xl p-8">
            <h3 className="text-2xl font-serif text-foreground mb-4">
              Mariable : La révolution du mariage
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-wedding-olive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-wedding-olive" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Innovation</h4>
                <p className="text-sm text-muted-foreground">Première app de coordination jour-J sans téléchargement</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-wedding-sage/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-wedding-sage" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Collaboration</h4>
                <p className="text-sm text-muted-foreground">Coordonnez avec vos proches et prestataires en temps réel</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-wedding-olive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-wedding-olive" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Simplicité</h4>
                <p className="text-sm text-muted-foreground">Interface intuitive pensée pour tous les âges</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.instagram.com/mariable.fr/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Suivre sur Instagram
                </Button>
              </a>
              <Link to="/">
                <Button variant="outline">
                  Découvrir mariable.fr
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SalonMicroTrottoir;
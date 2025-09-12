import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift, Instagram, ExternalLink, CheckCircle, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SalonJeuConcours = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Jeu Concours - Gagnez 250€ de fleurs | Salon du Mariage 2025 - Mariable</title>
        <meta name="description" content="Participez à notre jeu concours et tentez de gagner 250€ de fleurs ! Suivez-nous sur Instagram, taggez vos proches et créez votre compte Mariable." />
        <meta name="keywords" content="jeu concours mariage, gagner 250€ de fleurs, salon du mariage, mariable, instagram" />
        <link rel="canonical" href="https://www.mariable.fr/salon-du-mariage-2025/jeu-concours" />
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
          <div className="w-20 h-20 bg-wedding-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-wedding-olive" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Jeu Concours
          </h1>
          <p className="text-2xl font-semibold text-primary mb-2">
            🎁 Tentez de gagner 250€ de fleurs !
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Participez à notre jeu concours exclusif du Salon du Mariage 2025 et gagnez 250€ de fleurs pour votre mariage !
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Rules Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-wedding-olive" />
                Conditions de participation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-wedding-olive/5 rounded-lg">
                  <Instagram className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Étape 1 : Suivez-nous</p>
                    <p className="text-sm text-muted-foreground">Suivez le compte Instagram @mariable.fr et le compte @labox.lesjoliesfeuillesles</p>
                    <a 
                      href="https://www.instagram.com/mariable.fr/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm mt-1"
                    >
                      Suivre @mariable.fr
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-wedding-sage/5 rounded-lg">
                  <Gift className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Étape 2 : Taggez 2 personnes</p>
                    <p className="text-sm text-muted-foreground">Taggez votre mari/femme ou vos témoins sur la publication "Salon du Mariage"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-wedding-olive/5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Étape 3 : Créez votre compte</p>
                    <p className="text-sm text-muted-foreground">Inscrivez-vous gratuitement sur mariable.fr</p>
                    <Link 
                      to="/register" 
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm mt-1"
                    >
                      Créer mon compte gratuit
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-wedding-sage/5 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Tirage au sort</p>
                    <p className="text-sm text-muted-foreground">Le tirage aura lieu le <strong>dimanche 21 septembre</strong></p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-wedding-olive/5 rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  <strong>Bonne chance à tous !</strong><br />
                  Le gagnant sera contacté directement via Instagram et email.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Airtable Form */}
          <Card>
            <CardHeader>
              <CardTitle>Formulaire de participation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Remplissez ce formulaire pour valider votre participation au jeu concours
              </p>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <iframe 
                  className="airtable-embed w-full rounded-lg" 
                  src="https://airtable.com/embed/app8PM2oH1wOtI1R4/shrY9FpInAIzxssTn" 
                  frameBorder="0" 
                  width="100%" 
                  height="533" 
                  style={{ background: 'transparent', border: '1px solid #ccc' }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mariable Promotion */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-wedding-olive/5 to-wedding-sage/5 rounded-2xl p-8">
            <h3 className="text-2xl font-serif text-foreground mb-4">
              Découvrez Mariable
            </h3>
            <p className="text-muted-foreground mb-6">
              La première application de coordination jour-J qui révolutionne l'organisation de mariage en France. 
              Sans téléchargement, directement accessible en ligne !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button>Découvrir l'application</Button>
              </Link>
              <a 
                href="https://www.instagram.com/mariable.fr/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Suivre sur Instagram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SalonJeuConcours;
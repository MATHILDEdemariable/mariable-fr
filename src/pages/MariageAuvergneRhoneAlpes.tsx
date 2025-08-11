import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Music, Heart, ArrowRight, Mountain } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageAuvergneRhoneAlpes = () => {
  const auvergneSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Auvergne-Rhône-Alpes",
    "description": "Organisez votre mariage en Auvergne-Rhône-Alpes avec les meilleurs prestataires. Châteaux, domaines, chalets d'exception sélectionnés par Mariable.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Auvergne-Rhône-Alpes",
      "containedInPlace": {
        "@type": "Country",
        "name": "France"
      }
    },
    "serviceArea": [
      {
        "@type": "City",
        "name": "Lyon"
      },
      {
        "@type": "City", 
        "name": "Annecy"
      },
      {
        "@type": "City",
        "name": "Chamonix"
      },
      {
        "@type": "City",
        "name": "Grenoble"
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Mariage Auvergne-Rhône-Alpes | Châteaux et Chalets d'Exception"
        description="Organisez votre mariage en Auvergne-Rhône-Alpes avec les meilleurs prestataires. Châteaux, domaines, chalets montagnards sélectionnés par Mariable."
        keywords="mariage auvergne rhone alpes, château mariage lyon, chalet mariage annecy, domaine mariage savoie, photographe mariage alpes"
        canonical="/mariage-auvergne-rhone-alpes"
      >
        <script type="application/ld+json">
          {JSON.stringify(auvergneSchema)}
        </script>
      </SEO>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                Mariage Auvergne-Rhône-Alpes
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Entre montagnes majestueuses et vignobles réputés, célébrez votre union 
                dans la région la plus spectaculaire de France
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-wedding-olive hover:bg-wedding-olive/90"
                >
                  <Link to="/selection?region=auvergne-rhone-alpes">
                    <Mountain className="mr-2 h-4 w-4" />
                    Voir les prestataires
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  asChild
                  className="border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10"
                >
                  <Link to="/outils-planning-mariage">
                    <Heart className="mr-2 h-4 w-4" />
                    Outils planning
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Avantages Auvergne */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-8 text-center">
                Pourquoi choisir l'Auvergne-Rhône-Alpes pour votre mariage ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-serif mb-4">Paysages à couper le souffle</h3>
                  <p className="text-muted-foreground mb-4">
                    Des sommets enneigés des Alpes aux volcans d'Auvergne, en passant par 
                    les lacs cristallins de Savoie, chaque territoire offre des panoramas uniques.
                  </p>
                  <p className="text-muted-foreground">
                    Annecy, Chamonix, le Beaujolais... autant de destinations de rêve 
                    pour un mariage inoubliable.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-4">Gastronomie d'excellence</h3>
                  <p className="text-muted-foreground mb-4">
                    Berceau de la grande cuisine française avec Lyon, la région propose 
                    une gastronomie raffinée et des vins d'exception.
                  </p>
                  <p className="text-muted-foreground">
                    Fromages de Savoie, spécialités lyonnaises et crus du Beaujolais 
                    raviront les palais les plus exigeants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types de lieux */}
        <section className="py-16 bg-wedding-cream/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Les plus beaux lieux de mariage en Auvergne-Rhône-Alpes
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Mountain className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Chalets d'exception</h3>
                  <p className="text-muted-foreground mb-4">
                    Mariez-vous dans des chalets de luxe avec vue panoramique 
                    sur les plus beaux sommets des Alpes.
                  </p>
                  <Link 
                    to="/selection/auvergne-rhone-alpes?category=lieu&categorieLieu=chalet"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Découvrir les chalets →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Châteaux historiques</h3>
                  <p className="text-muted-foreground mb-4">
                    Célébrez votre union dans des châteaux séculaires 
                    nichés au cœur des vignobles du Beaujolais.
                  </p>
                  <Link 
                    to="/selection/auvergne-rhone-alpes?category=lieu&categorieLieu=chateau"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Voir les châteaux →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Domaines viticoles</h3>
                  <p className="text-muted-foreground mb-4">
                    Optez pour l'authenticité avec des domaines traditionnels 
                    au cœur des appellations prestigieuses.
                  </p>
                  <Link 
                    to="/selection?region=auvergne-rhone-alpes&category=lieu"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Explorer les domaines →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prestataires locaux */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Nos prestataires sélectionnés en Auvergne-Rhône-Alpes
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Photographes</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spécialistes des mariages montagnards
                  </p>
                  <Link 
                    to="/selection?region=auvergne-rhone-alpes&category=photo"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les photographes
                  </Link>
                </div>
                
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Traiteurs</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cuisine gastronomique lyonnaise
                  </p>
                  <Link 
                    to="/selection?region=auvergne-rhone-alpes&category=traiteur"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Découvrir les traiteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Music className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Musiciens</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Groupes et DJ alpins
                  </p>
                  <Link 
                    to="/selection?region=auvergne-rhone-alpes&category=musique"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Écouter les groupes
                  </Link>
                </div>
                
                <div className="text-center">
                  <Heart className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Fleuristes</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Créations florales alpines
                  </p>
                  <Link 
                    to="/selection/auvergne-rhone-alpes?category=fleuriste"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les fleuristes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-wedding-olive/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif mb-6">
                Prêt à organiser votre mariage en Auvergne-Rhône-Alpes ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez notre sélection de prestataires entre montagnes et vignobles
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="bg-wedding-olive hover:bg-wedding-olive/90"
                >
                  <Link to="/selection">
                    Commencer ma recherche
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10"
                >
                  <Link to="/coordination-jour-j">
                    Coordination jour J
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default MariageAuvergneRhoneAlpes;
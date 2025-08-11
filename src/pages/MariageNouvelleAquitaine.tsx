import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Music, Heart, ArrowRight, Waves } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageNouvelleAquitaine = () => {
  const nouvelleAquitaineSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Nouvelle-Aquitaine",
    "description": "Organisez votre mariage en Nouvelle-Aquitaine avec les meilleurs prestataires. Châteaux bordelais, domaines viticoles, lieux face à l'océan sélectionnés par Mariable.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Nouvelle-Aquitaine",
      "containedInPlace": {
        "@type": "Country",
        "name": "France"
      }
    },
    "serviceArea": [
      {
        "@type": "City",
        "name": "Bordeaux"
      },
      {
        "@type": "City", 
        "name": "La Rochelle"
      },
      {
        "@type": "City",
        "name": "Biarritz"
      },
      {
        "@type": "City",
        "name": "Poitiers"
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Mariage Nouvelle-Aquitaine | Châteaux et Océan"
        description="Organisez votre mariage en Nouvelle-Aquitaine avec les meilleurs prestataires. Châteaux bordelais, domaines viticoles, lieux face à l'océan sélectionnés par Mariable."
        keywords="mariage nouvelle aquitaine, château mariage bordeaux, domaine viticole mariage, mariage biarritz, photographe mariage gironde"
        canonical="/mariage-nouvelle-aquitaine"
      >
        <script type="application/ld+json">
          {JSON.stringify(nouvelleAquitaineSchema)}
        </script>
      </SEO>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                Mariage Nouvelle-Aquitaine
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Entre vignobles prestigieux et côte atlantique, découvrez les lieux 
                et prestataires d'exception de la plus vaste région de France
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-wedding-olive hover:bg-wedding-olive/90"
                >
                  <Link to="/selection?region=nouvelle-aquitaine">
                    <Waves className="mr-2 h-4 w-4" />
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

        {/* Avantages Nouvelle-Aquitaine */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-8 text-center">
                Pourquoi choisir la Nouvelle-Aquitaine pour votre mariage ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-serif mb-4">Patrimoine viticole unique</h3>
                  <p className="text-muted-foreground mb-4">
                    Bordeaux et ses environs offrent les plus prestigieux châteaux viticoles 
                    au monde, cadre idéal pour un mariage d'exception.
                  </p>
                  <p className="text-muted-foreground">
                    Saint-Émilion, Médoc, Graves... autant d'appellations mythiques 
                    qui feront de votre mariage un moment unique.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-4">Côte atlantique magique</h3>
                  <p className="text-muted-foreground mb-4">
                    De La Rochelle à Biarritz, la côte atlantique propose des lieux 
                    face à l'océan pour des mariages les pieds dans le sable.
                  </p>
                  <p className="text-muted-foreground">
                    Plages sauvages, ports de charme et architecture basque 
                    créent une ambiance unique entre terre et mer.
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
                Les plus beaux lieux de mariage en Nouvelle-Aquitaine
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Châteaux viticoles</h3>
                  <p className="text-muted-foreground mb-4">
                    Mariez-vous dans les plus prestigieux châteaux de Bordeaux, 
                    au cœur des vignobles classés UNESCO.
                  </p>
                  <Link 
                    to="/selection?region=nouvelle-aquitaine&category=lieu"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Découvrir les châteaux →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Waves className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Lieux face à l'océan</h3>
                  <p className="text-muted-foreground mb-4">
                    Célébrez votre union face à l'Atlantique dans des lieux 
                    d'exception avec vue panoramique sur l'océan.
                  </p>
                  <Link 
                    to="/selection?region=nouvelle-aquitaine&category=lieu"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Voir les lieux océan →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Domaines authentiques</h3>
                  <p className="text-muted-foreground mb-4">
                    Optez pour l'authenticité avec des domaines ruraux 
                    typiques du Sud-Ouest et du Périgord.
                  </p>
                  <Link 
                    to="/selection?region=nouvelle-aquitaine&category=lieu"
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
                Nos prestataires sélectionnés en Nouvelle-Aquitaine
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Photographes</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spécialistes des mariages océan/vignobles
                  </p>
                  <Link 
                    to="/selection?region=nouvelle-aquitaine&category=Photographe"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les photographes
                  </Link>
                </div>
                
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Traiteurs</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spécialités du Sud-Ouest
                  </p>
                  <Link 
                    to="/selection?region=nouvelle-aquitaine&category=traiteur"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Découvrir les traiteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Music className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Musiciens</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Groupes et fanfares basques
                  </p>
                  <Link 
                    to="/selection?region=nouvelle-aquitaine&category=musique"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Écouter les groupes
                  </Link>
                </div>
                
                <div className="text-center">
                  <Heart className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Décorateurs</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Style atlantique et viticole
                  </p>
                  <Link 
                    to="/selection?region=nouvelle-aquitaine&category=decoration"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les décorateurs
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
                Prêt à organiser votre mariage en Nouvelle-Aquitaine ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez notre sélection entre vignobles bordelais et côte atlantique
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

export default MariageNouvelleAquitaine;
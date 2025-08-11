import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Music, Heart, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageParis = () => {
  const parisSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Paris & Île-de-France",
    "description": "Organisez votre mariage à Paris et en Île-de-France avec les meilleurs prestataires. Châteaux, lieux atypiques, restaurants gastronomiques sélectionnés par Mariable.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Île-de-France",
      "containedInPlace": {
        "@type": "Country",
        "name": "France"
      }
    },
    "serviceArea": [
      {
        "@type": "City",
        "name": "Paris"
      },
      {
        "@type": "City", 
        "name": "Versailles"
      },
      {
        "@type": "City",
        "name": "Fontainebleau"
      },
      {
        "@type": "City",
        "name": "Chantilly"
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Mariage Paris & Île-de-France | Lieux et Prestataires d'Exception"
        description="Organisez votre mariage à Paris et en Île-de-France avec les meilleurs prestataires. Châteaux, lieux atypiques, restaurants gastronomiques sélectionnés par Mariable."
        keywords="mariage paris, château mariage ile de france, lieu mariage versailles, photographe mariage paris, traiteur mariage paris"
        canonical="/mariage-paris"
      >
        <script type="application/ld+json">
          {JSON.stringify(parisSchema)}
        </script>
      </SEO>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                Mariage Paris & Île-de-France
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                De la capitale aux châteaux royaux, découvrez les lieux et prestataires 
                les plus prestigieux pour votre mariage en Île-de-France
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-wedding-olive hover:bg-wedding-olive/90"
                >
                  <Link to="/selection/ile-de-france">
                    <MapPin className="mr-2 h-4 w-4" />
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

        {/* Avantages Paris */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-8 text-center">
                Pourquoi se marier à Paris et en Île-de-France ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-serif mb-4">Prestige et élégance</h3>
                  <p className="text-muted-foreground mb-4">
                    Paris, ville lumière et capitale mondiale de l'élégance, offre des lieux 
                    d'exception pour célébrer votre union dans un cadre prestigieux.
                  </p>
                  <p className="text-muted-foreground">
                    Palaces historiques, jardins à la française et architecture haussmannienne 
                    créent un décor unique au monde.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-4">Patrimoine exceptionnel</h3>
                  <p className="text-muted-foreground mb-4">
                    L'Île-de-France regorge de châteaux royaux, demeures historiques 
                    et parcs somptueux à quelques kilomètres seulement de Paris.
                  </p>
                  <p className="text-muted-foreground">
                    Versailles, Fontainebleau, Chantilly... autant de noms qui évoquent 
                    le raffinement et la grandeur française.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types de lieux Paris */}
        <section className="py-16 bg-wedding-cream/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Les plus beaux lieux de mariage à Paris et en Île-de-France
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Châteaux d'Île-de-France</h3>
                  <p className="text-muted-foreground mb-4">
                    Mariez-vous dans les plus beaux châteaux de la région parisienne, 
                    témoins de l'histoire de France.
                  </p>
                  <Link 
                    to="/selection/ile-de-france?category=lieu&categorieLieu=chateau"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Découvrir les châteaux →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Lieux atypiques Paris</h3>
                  <p className="text-muted-foreground mb-4">
                    Musées, palais, jardins secrets... Paris offre des lieux 
                    uniques pour un mariage d'exception.
                  </p>
                  <Link 
                    to="/selection/ile-de-france?category=lieu&categorieLieu=atypique"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Voir les lieux atypiques →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Restaurants gastronomiques</h3>
                  <p className="text-muted-foreground mb-4">
                    Célébrez votre union dans les plus prestigieux restaurants 
                    de la capitale mondiale de la gastronomie.
                  </p>
                  <Link 
                    to="/selection/ile-de-france?category=lieu&categorieLieu=restaurant"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Explorer les restaurants →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prestataires Paris */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Nos prestataires sélectionnés à Paris et en Île-de-France
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Photographes</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spécialistes des mariages parisiens
                  </p>
                  <Link 
                    to="/selection/ile-de-france?category=photo"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les photographes
                  </Link>
                </div>
                
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Traiteurs</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Haute gastronomie française
                  </p>
                  <Link 
                    to="/selection/ile-de-france?category=traiteur"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Découvrir les traiteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Music className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Musiciens</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Orchestres et DJ prestigieux
                  </p>
                  <Link 
                    to="/selection/ile-de-france?category=musique"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Écouter les groupes
                  </Link>
                </div>
                
                <div className="text-center">
                  <Heart className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Wedding planners</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Organisateurs de mariages luxury
                  </p>
                  <Link 
                    to="/selection/ile-de-france?category=wedding-planner"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les planners
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
                Prêt à organiser votre mariage à Paris ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez notre sélection exclusive de prestataires parisiens et franciliens
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="bg-wedding-olive hover:bg-wedding-olive/90"
                >
                  <Link to="/selection/ile-de-france">
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

export default MariageParis;
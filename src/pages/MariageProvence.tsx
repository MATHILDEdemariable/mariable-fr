import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Music, Heart, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageProvence = () => {
  const provenceSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Provence",
    "description": "Organisez votre mariage en Provence avec les meilleurs prestataires. Châteaux, domaines viticoles, mas provençaux sélectionnés par Mariable.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Provence-Alpes-Côte d'Azur",
      "containedInPlace": {
        "@type": "Country",
        "name": "France"
      }
    },
    "serviceArea": [
      {
        "@type": "City",
        "name": "Aix-en-Provence"
      },
      {
        "@type": "City", 
        "name": "Marseille"
      },
      {
        "@type": "City",
        "name": "Avignon"
      },
      {
        "@type": "City",
        "name": "Nice"
      },
      {
        "@type": "City",
        "name": "Cannes"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Prestataires Mariage Provence",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Châteaux et Domaines Provence",
            "description": "Lieux de réception exceptionnels en Provence"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Photographes Mariage Provence",
            "description": "Photographes spécialisés mariage en Provence"
          }
        }
      ]
    }
  };

  return (
    <>
      <SEO 
        title="Mariage Provence | Prestataires et Lieux Exceptionnels"
        description="Organisez votre mariage en Provence avec les meilleurs prestataires. Châteaux, domaines viticoles, mas provençaux et photographes sélectionnés par Mariable."
        keywords="mariage provence, château mariage provence, domaine viticole mariage, mas provençal mariage, photographe mariage provence, traiteur provence"
        canonical="/mariage-provence"
      >
        <script type="application/ld+json">
          {JSON.stringify(provenceSchema)}
        </script>
      </SEO>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                Mariage en Provence
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Découvrez les plus beaux lieux et prestataires pour un mariage inoubliable 
                dans la région la plus romantique de France
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-wedding-olive hover:bg-wedding-olive/90"
                >
                  <Link to="/selection?region=provence-alpes-cote-d-azur">
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

        {/* Pourquoi la Provence */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-8 text-center">
                Pourquoi choisir la Provence pour votre mariage ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-serif mb-4">Un cadre enchanteur</h3>
                  <p className="text-muted-foreground mb-4">
                    Avec ses champs de lavande, ses vignobles à perte de vue et ses villages perchés, 
                    la Provence offre un décor naturellement romantique pour célébrer votre union.
                  </p>
                  <p className="text-muted-foreground">
                    Des Alpilles au Luberon, en passant par la Côte d'Azur, chaque territoire 
                    provençal possède sa propre identité et ses trésors cachés.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-4">Un art de vivre unique</h3>
                  <p className="text-muted-foreground mb-4">
                    La Provence, c'est aussi une gastronomie raffinée, des vins d'exception 
                    et un savoir-vivre méditerranéen qui séduiront vos invités.
                  </p>
                  <p className="text-muted-foreground">
                    Climate ensoleillé, accueil chaleureux et traditions authentiques 
                    font de cette région le choix parfait pour un mariage mémorable.
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
                Les plus beaux lieux de mariage en Provence
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Châteaux historiques</h3>
                  <p className="text-muted-foreground mb-4">
                    Mariez-vous dans des châteaux d'exception avec vue panoramique 
                    sur la campagne provençale.
                  </p>
                  <Link 
                    to="/selection?region=provence-alpes-cote-d-azur&category=lieu"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Découvrir les châteaux →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Domaines viticoles</h3>
                  <p className="text-muted-foreground mb-4">
                    Célébrez votre union au cœur des vignobles, entre terrasses 
                    et caves séculaires.
                  </p>
                  <Link 
                    to="/selection?region=provence-alpes-cote-d-azur&category=lieu"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Voir les domaines →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Mas provençaux</h3>
                  <p className="text-muted-foreground mb-4">
                    Optez pour l'authenticité avec des mas traditionnels 
                    nichés dans les oliviers et la garrigue.
                  </p>
                  <Link 
                    to="/selection?region=provence-alpes-cote-d-azur&category=lieu"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Explorer les mas →
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
                Nos prestataires sélectionnés en Provence
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Photographes</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spécialistes des mariages en extérieur
                  </p>
                  <Link 
                    to="/selection?region=provence-alpes-cote-d-azur&category=photo"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les photographes
                  </Link>
                </div>
                
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Traiteurs</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cuisine méditerranéenne raffinée
                  </p>
                  <Link 
                    to="/selection?region=provence-alpes-cote-d-azur&category=traiteur"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Découvrir les traiteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Music className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Musiciens</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ambiance musicale sur mesure
                  </p>
                  <Link 
                    to="/selection?region=provence-alpes-cote-d-azur&category=musique"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Écouter les groupes
                  </Link>
                </div>
                
                <div className="text-center">
                  <Heart className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Décorateurs</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Style provençal authentique
                  </p>
                  <Link 
                    to="/selection?region=provence-alpes-cote-d-azur&category=decoration"
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
                Prêt à organiser votre mariage en Provence ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Laissez-vous guider par nos outils et notre sélection de prestataires d'exception
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

export default MariageProvence;
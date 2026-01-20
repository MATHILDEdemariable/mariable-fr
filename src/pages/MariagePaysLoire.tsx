import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Heart, ArrowRight, Sparkles, Castle, Wine } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariagePaysLoire = () => {
  const paysLoireSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Pays de la Loire",
    "description": "Organisez votre mariage en Pays de la Loire avec les meilleurs prestataires. Châteaux de la Loire, domaines viticoles, manoirs historiques sélectionnés par Mariable.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Pays de la Loire",
      "containedInPlace": {
        "@type": "Country",
        "name": "France"
      }
    },
    "serviceArea": [
      { "@type": "City", "name": "Nantes" },
      { "@type": "City", "name": "Angers" },
      { "@type": "City", "name": "Le Mans" },
      { "@type": "City", "name": "La Baule" },
      { "@type": "City", "name": "Saumur" }
    ]
  };

  return (
    <>
      <SEO 
        title="Mariage Pays de la Loire | Lieux et Prestataires d'Exception"
        description="Organisez votre mariage en Pays de la Loire avec les meilleurs prestataires. Châteaux de la Loire, domaines viticoles, manoirs historiques sélectionnés par Mariable."
        keywords="mariage pays de la loire, château mariage loire, lieu mariage nantes, photographe mariage angers, traiteur mariage saumur, mariage muscadet"
        canonical="/mariage-pays-loire"
      >
        <meta name="geo.region" content="FR-PDL" />
        <meta name="geo.placename" content="Pays de la Loire, France" />
        <script type="application/ld+json">
          {JSON.stringify(paysLoireSchema)}
        </script>
      </SEO>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                Mariage en Pays de la Loire
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Au cœur du Val de Loire, découvrez les lieux et prestataires 
                les plus prestigieux pour votre mariage dans le jardin de la France
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/professionnelsmariable?region=pays-de-la-loire">
                    <MapPin className="mr-2 h-4 w-4" />
                    Voir les prestataires
                  </Link>
                </Button>
                <Button 
                  variant="outline" asChild
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

        {/* Avantages Pays de la Loire */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-8 text-center">
                Pourquoi se marier en Pays de la Loire ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-serif mb-4">Patrimoine UNESCO</h3>
                  <p className="text-muted-foreground mb-4">
                    Le Val de Loire est inscrit au patrimoine mondial de l'UNESCO, 
                    offrant des châteaux Renaissance d'une beauté incomparable.
                  </p>
                  <p className="text-muted-foreground">
                    Chambord, Chenonceau, Azay-le-Rideau... des noms qui font 
                    rêver pour un mariage féerique.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-4">Vignobles d'exception</h3>
                  <p className="text-muted-foreground mb-4">
                    Muscadet, Saumur, Anjou... la région produit des vins 
                    délicats parfaits pour accompagner votre repas de mariage.
                  </p>
                  <p className="text-muted-foreground">
                    De nombreux domaines viticoles accueillent les mariages 
                    dans des cadres bucoliques.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types de lieux Pays de la Loire */}
        <section className="py-16 bg-wedding-cream/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Les plus beaux lieux de mariage en Pays de la Loire
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Castle className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Châteaux de la Loire</h3>
                  <p className="text-muted-foreground mb-4">
                    Mariez-vous dans les plus beaux châteaux Renaissance, 
                    joyaux du patrimoine français.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=pays-de-la-loire&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Découvrir les châteaux →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Wine className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Domaines viticoles</h3>
                  <p className="text-muted-foreground mb-4">
                    Célébrez votre union au cœur des vignes, 
                    avec dégustation et vue sur les coteaux.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=pays-de-la-loire&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Voir les domaines →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Manoirs & Abbaye</h3>
                  <p className="text-muted-foreground mb-4">
                    L'élégance des manoirs ligériens et 
                    la sérénité des anciennes abbayes.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=pays-de-la-loire&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Explorer les manoirs →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prestataires Pays de la Loire */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Nos prestataires sélectionnés en Pays de la Loire
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Traiteur</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gastronomie ligérienne raffinée
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=pays-de-la-loire&category=Traiteur"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Découvrir les traiteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Camera className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Photographe</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spécialistes des châteaux de la Loire
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=pays-de-la-loire&category=Photographe"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les photographes
                  </Link>
                </div>
                
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Lieux</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Châteaux et domaines d'exception
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=pays-de-la-loire&category=Lieu de réception"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les lieux
                  </Link>
                </div>
                
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Autres</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tous nos prestataires ligériens
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=pays-de-la-loire"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir tous les prestataires
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
                Prêt à organiser votre mariage en Pays de la Loire ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez notre sélection exclusive de prestataires ligériens
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/professionnelsmariable?region=pays-de-la-loire">
                    Commencer ma recherche
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" size="lg" asChild
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

export default MariagePaysLoire;
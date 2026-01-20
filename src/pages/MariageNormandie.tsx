import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Heart, ArrowRight, Sparkles, Apple, Castle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageNormandie = () => {
  const normandieSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Normandie",
    "description": "Organisez votre mariage en Normandie avec les meilleurs prestataires. Châteaux normands, manoirs à colombages, domaines avec vue sur la mer sélectionnés par Mariable.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Normandie",
      "containedInPlace": {
        "@type": "Country",
        "name": "France"
      }
    },
    "serviceArea": [
      { "@type": "City", "name": "Rouen" },
      { "@type": "City", "name": "Caen" },
      { "@type": "City", "name": "Deauville" },
      { "@type": "City", "name": "Honfleur" },
      { "@type": "City", "name": "Le Havre" }
    ]
  };

  return (
    <>
      <SEO 
        title="Mariage Normandie | Lieux et Prestataires d'Exception"
        description="Organisez votre mariage en Normandie avec les meilleurs prestataires. Châteaux normands, manoirs à colombages, domaines avec vue sur la mer sélectionnés par Mariable."
        keywords="mariage normandie, château mariage normandie, lieu mariage deauville, photographe mariage rouen, traiteur mariage caen, mariage honfleur"
        canonical="/mariage-normandie"
      >
        <meta name="geo.region" content="FR-NOR" />
        <meta name="geo.placename" content="Normandie, France" />
        <script type="application/ld+json">
          {JSON.stringify(normandieSchema)}
        </script>
      </SEO>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                Mariage en Normandie
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Des falaises d'Étretat aux manoirs du Pays d'Auge, découvrez les lieux 
                et prestataires les plus romantiques pour votre mariage en Normandie
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/professionnelsmariable?region=normandie">
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

        {/* Avantages Normandie */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-8 text-center">
                Pourquoi se marier en Normandie ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-serif mb-4">Patrimoine exceptionnel</h3>
                  <p className="text-muted-foreground mb-4">
                    La Normandie regorge de châteaux, manoirs à colombages et 
                    abbayes séculaires pour un mariage chargé d'histoire.
                  </p>
                  <p className="text-muted-foreground">
                    Du Mont-Saint-Michel aux jardins de Monet à Giverny, 
                    la région offre des décors féeriques.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-4">Gastronomie & Terroir</h3>
                  <p className="text-muted-foreground mb-4">
                    Camembert, cidre, calvados et fruits de mer... la Normandie 
                    est un paradis pour les gourmets.
                  </p>
                  <p className="text-muted-foreground">
                    Vos invités seront enchantés par les spécialités locales 
                    préparées par nos traiteurs partenaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types de lieux Normandie */}
        <section className="py-16 bg-wedding-cream/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Les plus beaux lieux de mariage en Normandie
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Castle className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Châteaux normands</h3>
                  <p className="text-muted-foreground mb-4">
                    Mariez-vous dans les plus beaux châteaux de Normandie, 
                    entre Renaissance et style Louis XIII.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=normandie&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Découvrir les châteaux →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Manoirs à colombages</h3>
                  <p className="text-muted-foreground mb-4">
                    Le charme authentique du Pays d'Auge avec ses 
                    manoirs traditionnels et leurs jardins.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=normandie&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Voir les manoirs →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Domaines bord de mer</h3>
                  <p className="text-muted-foreground mb-4">
                    De Deauville à Honfleur, célébrez votre union 
                    face à la Manche dans des lieux d'exception.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=normandie&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Explorer les domaines →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prestataires Normandie */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Nos prestataires sélectionnés en Normandie
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Traiteur</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gastronomie normande raffinée
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=normandie&category=Traiteur"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Découvrir les traiteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Camera className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Photographe</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spécialistes des mariages normands
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=normandie&category=Photographe"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les photographes
                  </Link>
                </div>
                
                <div className="text-center">
                  <Apple className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Cidre & Calvados</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Producteurs locaux pour votre vin d'honneur
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=normandie"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les producteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Autres</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tous nos prestataires normands
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=normandie"
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
                Prêt à organiser votre mariage en Normandie ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez notre sélection exclusive de prestataires normands
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/professionnelsmariable?region=normandie">
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

export default MariageNormandie;
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Music, Heart, ArrowRight, Users, Sparkles, Anchor } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageBretagne = () => {
  const bretagneSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Bretagne",
    "description": "Organisez votre mariage en Bretagne avec les meilleurs prestataires. Manoirs bretons, domaines face à la mer, chapelles historiques sélectionnés par Mariable.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Bretagne",
      "containedInPlace": {
        "@type": "Country",
        "name": "France"
      }
    },
    "serviceArea": [
      { "@type": "City", "name": "Rennes" },
      { "@type": "City", "name": "Brest" },
      { "@type": "City", "name": "Vannes" },
      { "@type": "City", "name": "Saint-Malo" },
      { "@type": "City", "name": "Quimper" }
    ]
  };

  return (
    <>
      <SEO 
        title="Mariage Bretagne | Lieux et Prestataires d'Exception"
        description="Organisez votre mariage en Bretagne avec les meilleurs prestataires. Manoirs bretons, domaines face à la mer, chapelles historiques sélectionnés par Mariable."
        keywords="mariage bretagne, manoir mariage bretagne, lieu mariage saint-malo, photographe mariage rennes, traiteur mariage brest, mariage bord de mer bretagne"
        canonical="/mariage-bretagne"
      >
        <meta name="geo.region" content="FR-BRE" />
        <meta name="geo.placename" content="Bretagne, France" />
        <script type="application/ld+json">
          {JSON.stringify(bretagneSchema)}
        </script>
      </SEO>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                Mariage en Bretagne
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Entre terre et mer, découvrez les lieux et prestataires les plus authentiques 
                pour votre mariage au cœur de la Bretagne
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/professionnelsmariable?region=bretagne">
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

        {/* Avantages Bretagne */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-8 text-center">
                Pourquoi se marier en Bretagne ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-serif mb-4">Charme authentique</h3>
                  <p className="text-muted-foreground mb-4">
                    La Bretagne offre des paysages à couper le souffle entre falaises, 
                    côtes sauvages et forêts légendaires.
                  </p>
                  <p className="text-muted-foreground">
                    Manoirs en granit, chapelles séculaires et jardins remarquables 
                    créent un cadre romantique unique.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-4">Patrimoine maritime</h3>
                  <p className="text-muted-foreground mb-4">
                    De Saint-Malo à Vannes, la côte bretonne propose des lieux 
                    exceptionnels face à l'océan.
                  </p>
                  <p className="text-muted-foreground">
                    Phares, ports pittoresques et îles préservées pour un mariage 
                    les pieds dans l'eau.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types de lieux Bretagne */}
        <section className="py-16 bg-wedding-cream/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Les plus beaux lieux de mariage en Bretagne
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Manoirs bretons</h3>
                  <p className="text-muted-foreground mb-4">
                    Mariez-vous dans les plus beaux manoirs de granit, 
                    témoins de l'histoire bretonne.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=bretagne&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Découvrir les manoirs →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Anchor className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Domaines vue mer</h3>
                  <p className="text-muted-foreground mb-4">
                    Célébrez votre union face à l'océan Atlantique 
                    dans des propriétés d'exception.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=bretagne&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Voir les domaines →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Chapelles & Abbaye</h3>
                  <p className="text-muted-foreground mb-4">
                    Échangez vos vœux dans les chapelles et abbayes 
                    chargées d'histoire de Bretagne.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=bretagne&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Explorer les lieux sacrés →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prestataires Bretagne */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Nos prestataires sélectionnés en Bretagne
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Traiteur</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Fruits de mer et gastronomie bretonne
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=bretagne&category=Traiteur"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Découvrir les traiteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Camera className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Photographe</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spécialistes des mariages bretons
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=bretagne&category=Photographe"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les photographes
                  </Link>
                </div>
                
                <div className="text-center">
                  <Music className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Animation</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Fest-noz et musique traditionnelle
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=bretagne&category=Animation"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les animations
                  </Link>
                </div>
                
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Autres</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tous nos prestataires bretons
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=bretagne"
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
                Prêt à organiser votre mariage en Bretagne ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez notre sélection exclusive de prestataires bretons
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/professionnelsmariable?region=bretagne">
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

export default MariageBretagne;
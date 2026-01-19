import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Heart, ArrowRight, Sparkles, Castle, Crown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageCentreValLoire = () => {
  const centreSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Centre-Val de Loire",
    "description": "Organisez votre mariage en Centre-Val de Loire avec les meilleurs prestataires. Châteaux royaux, domaines historiques, jardins remarquables sélectionnés par Mariable.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Centre-Val de Loire",
      "containedInPlace": {
        "@type": "Country",
        "name": "France"
      }
    },
    "serviceArea": [
      { "@type": "City", "name": "Tours" },
      { "@type": "City", "name": "Orléans" },
      { "@type": "City", "name": "Chartres" },
      { "@type": "City", "name": "Blois" },
      { "@type": "City", "name": "Amboise" }
    ]
  };

  return (
    <>
      <SEO 
        title="Mariage Centre-Val de Loire | Lieux et Prestataires d'Exception"
        description="Organisez votre mariage en Centre-Val de Loire avec les meilleurs prestataires. Châteaux royaux, domaines historiques, jardins remarquables sélectionnés par Mariable."
        keywords="mariage centre val de loire, château mariage tours, lieu mariage orléans, photographe mariage chartres, mariage chambord, mariage chenonceau"
        canonical="/mariage-centre-val-loire"
      >
        <meta name="geo.region" content="FR-CVL" />
        <meta name="geo.placename" content="Centre-Val de Loire, France" />
        <script type="application/ld+json">
          {JSON.stringify(centreSchema)}
        </script>
      </SEO>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                Mariage en Centre-Val de Loire
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Au cœur des châteaux royaux, découvrez les lieux et prestataires 
                les plus majestueux pour votre mariage dans le berceau de la Renaissance
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/selection?region=centre-val-de-loire">
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

        {/* Avantages Centre-Val de Loire */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-8 text-center">
                Pourquoi se marier en Centre-Val de Loire ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-serif mb-4">Châteaux royaux</h3>
                  <p className="text-muted-foreground mb-4">
                    La région abrite les plus beaux châteaux de France : 
                    Chambord, Chenonceau, Amboise, Azay-le-Rideau...
                  </p>
                  <p className="text-muted-foreground">
                    Mariez-vous dans des lieux où les rois de France 
                    ont écrit l'histoire.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-4">Jardins remarquables</h3>
                  <p className="text-muted-foreground mb-4">
                    Les jardins de Villandry, Chaumont, Valmer... 
                    offrent des écrins végétaux exceptionnels.
                  </p>
                  <p className="text-muted-foreground">
                    Parfaits pour des photos de mariage 
                    dans un cadre féerique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types de lieux Centre-Val de Loire */}
        <section className="py-16 bg-wedding-cream/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Les plus beaux lieux de mariage en Centre-Val de Loire
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Crown className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Châteaux Renaissance</h3>
                  <p className="text-muted-foreground mb-4">
                    Mariez-vous dans les châteaux qui ont vu naître 
                    la Renaissance française.
                  </p>
                  <Link 
                    to="/selection?region=centre-val-de-loire&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Découvrir les châteaux →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Castle className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Domaines historiques</h3>
                  <p className="text-muted-foreground mb-4">
                    Gentilhommières et manoirs de charme 
                    au cœur de la campagne tourangelle.
                  </p>
                  <Link 
                    to="/selection/centre-val-de-loire?category=lieu"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Voir les domaines →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Lieux atypiques</h3>
                  <p className="text-muted-foreground mb-4">
                    Caves troglodytes, moulins, anciennes abbayes 
                    pour un mariage hors du commun.
                  </p>
                  <Link 
                    to="/selection/centre-val-de-loire?category=lieu"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Explorer les lieux →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prestataires Centre-Val de Loire */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Nos prestataires sélectionnés en Centre-Val de Loire
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Traiteur</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gastronomie tourangelle
                  </p>
                  <Link 
                    to="/selection?region=centre-val-de-loire&category=Traiteur"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Découvrir les traiteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Camera className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Photographe</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Experts des châteaux de la Loire
                  </p>
                  <Link 
                    to="/selection?region=centre-val-de-loire&category=Photographe"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les photographes
                  </Link>
                </div>
                
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Lieux</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Châteaux et domaines royaux
                  </p>
                  <Link 
                    to="/selection?region=centre-val-de-loire&category=Lieu de réception"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les lieux
                  </Link>
                </div>
                
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Autres</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tous nos prestataires
                  </p>
                  <Link 
                    to="/selection?region=centre-val-de-loire"
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
                Prêt à organiser votre mariage en Centre-Val de Loire ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez notre sélection exclusive de prestataires
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/selection?region=centre-val-de-loire">
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

export default MariageCentreValLoire;

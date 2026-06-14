import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Heart, ArrowRight, Sparkles, Castle, Church } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageHautsFrance = () => {
  const hautsFranceSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Hauts-de-France",
    "description": "Organisez votre mariage dans les Hauts-de-France avec les meilleurs prestataires. Châteaux picards, domaines flamands, manoirs historiques sélectionnés par Mariable.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Hauts-de-France",
      "containedInPlace": {
        "@type": "Country",
        "name": "France"
      }
    },
    "serviceArea": [
      { "@type": "City", "name": "Lille" },
      { "@type": "City", "name": "Amiens" },
      { "@type": "City", "name": "Arras" },
      { "@type": "City", "name": "Chantilly" },
      { "@type": "City", "name": "Compiègne" }
    ]
  };

  return (
    <>
      <SEO 
        title="Mariage Hauts-de-France | Lieux et Prestataires d'Exception"
        description="Organisez votre mariage dans les Hauts-de-France avec les meilleurs prestataires. Châteaux picards, domaines flamands, manoirs historiques sélectionnés par Mariable."
        keywords="mariage hauts de france, château mariage lille, lieu mariage amiens, photographe mariage arras, traiteur mariage chantilly, mariage picardie"
        canonical="/mariage-hauts-france"
      >
        <meta name="geo.region" content="FR-HDF" />
        <meta name="geo.placename" content="Hauts-de-France, France" />
        <script type="application/ld+json">
          {JSON.stringify(hautsFranceSchema)}
        </script>
      </SEO>
      
      <PremiumHeader />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                Mariage dans les Hauts-de-France
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                De Lille à Chantilly, découvrez les lieux et prestataires 
                les plus élégants pour votre mariage dans le Nord de la France
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/professionnelsmariable?region=hauts-de-france">
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

        {/* Avantages Hauts-de-France */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-8 text-center">
                Pourquoi se marier dans les Hauts-de-France ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-serif mb-4">Patrimoine historique</h3>
                  <p className="text-muted-foreground mb-4">
                    Les Hauts-de-France abritent des châteaux majestueux 
                    comme Chantilly, Pierrefonds ou Compiègne.
                  </p>
                  <p className="text-muted-foreground">
                    Des cathédrales gothiques aux beffrois flamands, 
                    l'histoire est omniprésente.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-4">Convivialité du Nord</h3>
                  <p className="text-muted-foreground mb-4">
                    L'accueil chaleureux des Ch'tis et la générosité 
                    des traditions flamandes.
                  </p>
                  <p className="text-muted-foreground">
                    Gastronomie généreuse, bières artisanales et 
                    ambiance festive garantie.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types de lieux Hauts-de-France */}
        <section className="py-16 bg-wedding-cream/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Les plus beaux lieux de mariage dans les Hauts-de-France
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Castle className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Châteaux picards</h3>
                  <p className="text-muted-foreground mb-4">
                    Mariez-vous dans les plus beaux châteaux de Picardie, 
                    entre forêts et jardins à la française.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=hauts-de-france&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Découvrir les châteaux →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Church className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Domaines flamands</h3>
                  <p className="text-muted-foreground mb-4">
                    L'architecture flamande offre un charme unique 
                    avec ses briques rouges et ses pignons à redents.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=hauts-de-france&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Voir les domaines →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Lieux insolites</h3>
                  <p className="text-muted-foreground mb-4">
                    Anciennes filatures, moulins, fermes rénovées 
                    pour un mariage authentique.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=hauts-de-france&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Explorer les lieux →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prestataires Hauts-de-France */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Nos prestataires sélectionnés dans les Hauts-de-France
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Traiteur</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gastronomie du Nord généreuse
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=hauts-de-france&category=Traiteur"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Découvrir les traiteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Camera className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Photographe</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spécialistes des mariages nordistes
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=hauts-de-france&category=Photographe"
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
                    to="/professionnelsmariable?region=hauts-de-france&category=Lieu de réception"
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
                    to="/professionnelsmariable?region=hauts-de-france"
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
                Prêt à organiser votre mariage dans les Hauts-de-France ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez notre sélection exclusive de prestataires nordistes
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/professionnelsmariable?region=hauts-de-france">
                    Commencer ma recherche
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10"
                >
                  <Link to="/register-gratuit">
                    Créer mon compte gratuit
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

export default MariageHautsFrance;
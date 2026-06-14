import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Heart, ArrowRight, Sparkles, Sun, Castle } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageOccitanie = () => {
  const occitanieSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Occitanie",
    "description": "Organisez votre mariage en Occitanie avec les meilleurs prestataires. Mas provençaux, châteaux cathares, domaines viticoles sélectionnés par Mariable.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Occitanie",
      "containedInPlace": {
        "@type": "Country",
        "name": "France"
      }
    },
    "serviceArea": [
      { "@type": "City", "name": "Toulouse" },
      { "@type": "City", "name": "Montpellier" },
      { "@type": "City", "name": "Nîmes" },
      { "@type": "City", "name": "Carcassonne" },
      { "@type": "City", "name": "Perpignan" }
    ]
  };

  return (
    <>
      <SEO 
        title="Mariage Occitanie | Lieux et Prestataires d'Exception"
        description="Organisez votre mariage en Occitanie avec les meilleurs prestataires. Mas provençaux, châteaux cathares, domaines viticoles sélectionnés par Mariable."
        keywords="mariage occitanie, château mariage toulouse, lieu mariage montpellier, photographe mariage nîmes, traiteur mariage carcassonne, mariage sud france"
        canonical="/mariage-occitanie"
      >
        <meta name="geo.region" content="FR-OCC" />
        <meta name="geo.placename" content="Occitanie, France" />
        <script type="application/ld+json">
          {JSON.stringify(occitanieSchema)}
        </script>
      </SEO>
      
      <PremiumHeader />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                Mariage en Occitanie
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Des Pyrénées à la Méditerranée, découvrez les lieux et prestataires 
                les plus ensoleillés pour votre mariage en Occitanie
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/professionnelsmariable?region=occitanie">
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

        {/* Avantages Occitanie */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-8 text-center">
                Pourquoi se marier en Occitanie ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-serif mb-4">Climat méditerranéen</h3>
                  <p className="text-muted-foreground mb-4">
                    L'Occitanie bénéficie d'un ensoleillement exceptionnel, 
                    idéal pour un mariage en plein air toute l'année.
                  </p>
                  <p className="text-muted-foreground">
                    Des mas languedociens aux plages de la Méditerranée, 
                    profitez d'un cadre baigné de lumière.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-4">Vignobles & Gastronomie</h3>
                  <p className="text-muted-foreground mb-4">
                    La région produit des vins prestigieux : Languedoc, Corbières, 
                    Minervois, parfaits pour votre vin d'honneur.
                  </p>
                  <p className="text-muted-foreground">
                    Cassoulet, foie gras et fruits de mer de l'étang de Thau 
                    raviront vos convives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types de lieux Occitanie */}
        <section className="py-16 bg-wedding-cream/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Les plus beaux lieux de mariage en Occitanie
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Castle className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Châteaux cathares</h3>
                  <p className="text-muted-foreground mb-4">
                    Mariez-vous dans les citadelles historiques du pays cathare, 
                    entre mystère et majesté.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=occitanie&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Découvrir les châteaux →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <MapPin className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Domaines viticoles</h3>
                  <p className="text-muted-foreground mb-4">
                    Célébrez votre union au cœur des vignes, 
                    dans des domaines producteurs renommés.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=occitanie&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Voir les domaines →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-wedding-olive/10">
                  <Sun className="h-8 w-8 text-wedding-olive mb-4" />
                  <h3 className="text-xl font-serif mb-3">Mas languedociens</h3>
                  <p className="text-muted-foreground mb-4">
                    L'authenticité des mas en pierre, 
                    avec oliviers et cyprès en toile de fond.
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=occitanie&category=Lieu de réception"
                    className="text-wedding-olive hover:underline font-medium"
                  >
                    Explorer les mas →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prestataires Occitanie */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif mb-12 text-center">
                Nos prestataires sélectionnés en Occitanie
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Utensils className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Traiteur</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gastronomie du Sud-Ouest
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=occitanie&category=Traiteur"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Découvrir les traiteurs
                  </Link>
                </div>
                
                <div className="text-center">
                  <Camera className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Photographe</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spécialistes lumière méditerranéenne
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=occitanie&category=Photographe"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les photographes
                  </Link>
                </div>
                
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Lieux</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Domaines et châteaux d'exception
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=occitanie&category=Lieu de réception"
                    className="text-wedding-olive hover:underline text-sm font-medium"
                  >
                    Voir les lieux
                  </Link>
                </div>
                
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                  <h3 className="font-serif mb-2">Autres</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tous nos prestataires occitans
                  </p>
                  <Link 
                    to="/professionnelsmariable?region=occitanie"
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
                Prêt à organiser votre mariage en Occitanie ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez notre sélection exclusive de prestataires occitans
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/professionnelsmariable?region=occitanie">
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

export default MariageOccitanie;
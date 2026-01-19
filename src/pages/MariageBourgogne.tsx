import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Utensils, Heart, ArrowRight, Sparkles, Wine, Castle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageBourgogne = () => {
  const bourgogneSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Bourgogne-Franche-Comté",
    "description": "Organisez votre mariage en Bourgogne avec les meilleurs prestataires. Châteaux viticoles, domaines prestigieux, caves historiques sélectionnés par Mariable.",
    "areaServed": { "@type": "AdministrativeArea", "name": "Bourgogne-Franche-Comté", "containedInPlace": { "@type": "Country", "name": "France" } },
    "serviceArea": [{ "@type": "City", "name": "Dijon" }, { "@type": "City", "name": "Beaune" }, { "@type": "City", "name": "Besançon" }]
  };

  return (
    <>
      <SEO title="Mariage Bourgogne | Lieux et Prestataires d'Exception" description="Organisez votre mariage en Bourgogne avec les meilleurs prestataires. Châteaux viticoles, domaines prestigieux sélectionnés par Mariable." keywords="mariage bourgogne, château mariage dijon, lieu mariage beaune, mariage vignoble bourgogne" canonical="/mariage-bourgogne">
        <meta name="geo.region" content="FR-BFC" />
        <meta name="geo.placename" content="Bourgogne-Franche-Comté, France" />
        <script type="application/ld+json">{JSON.stringify(bourgogneSchema)}</script>
      </SEO>
      <Header />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">Mariage en Bourgogne</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Au cœur des vignobles prestigieux, découvrez les lieux et prestataires pour votre mariage en Bourgogne</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90"><Link to="/selection?region=bourgogne-franche-comte"><MapPin className="mr-2 h-4 w-4" />Voir les prestataires</Link></Button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16"><div className="container mx-auto px-4"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-serif mb-8 text-center">Pourquoi se marier en Bourgogne ?</h2><div className="grid md:grid-cols-2 gap-8"><div><h3 className="text-xl font-serif mb-4">Vignobles UNESCO</h3><p className="text-muted-foreground">Les Climats de Bourgogne, inscrits au patrimoine mondial, offrent un cadre exceptionnel pour un mariage au cœur des grands crus.</p></div><div><h3 className="text-xl font-serif mb-4">Gastronomie d'excellence</h3><p className="text-muted-foreground">Escargots, bœuf bourguignon, fromages... la Bourgogne est un paradis pour les gourmets.</p></div></div></div></div></section>
        <section className="py-16 bg-wedding-olive/5"><div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-serif mb-6">Prêt à organiser votre mariage en Bourgogne ?</h2><Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90"><Link to="/selection?region=bourgogne-franche-comte">Commencer ma recherche<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div></div></section>
      </main>
      <Footer />
    </>
  );
};

export default MariageBourgogne;

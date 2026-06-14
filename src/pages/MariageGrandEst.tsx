import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Wine } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageGrandEst = () => {
  const grandEstSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Grand Est",
    "description": "Organisez votre mariage dans le Grand Est avec les meilleurs prestataires. Châteaux alsaciens, domaines champenois sélectionnés par Mariable.",
    "areaServed": { "@type": "AdministrativeArea", "name": "Grand Est", "containedInPlace": { "@type": "Country", "name": "France" } },
    "serviceArea": [{ "@type": "City", "name": "Strasbourg" }, { "@type": "City", "name": "Reims" }, { "@type": "City", "name": "Metz" }]
  };

  return (
    <>
      <SEO title="Mariage Grand Est | Lieux et Prestataires d'Exception" description="Organisez votre mariage dans le Grand Est avec les meilleurs prestataires. Châteaux alsaciens, domaines champenois sélectionnés par Mariable." keywords="mariage grand est, château mariage strasbourg, lieu mariage reims, mariage champagne, mariage alsace" canonical="/mariage-grand-est">
        <meta name="geo.region" content="FR-GES" />
        <meta name="geo.placename" content="Grand Est, France" />
        <script type="application/ld+json">{JSON.stringify(grandEstSchema)}</script>
      </SEO>
      <PremiumHeader />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">Mariage dans le Grand Est</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">De l'Alsace à la Champagne, découvrez les lieux et prestataires pour votre mariage dans le Grand Est</p>
              <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90"><Link to="/professionnelsmariable?region=grand-est"><MapPin className="mr-2 h-4 w-4" />Voir les prestataires</Link></Button>
            </div>
          </div>
        </section>
        <section className="py-16"><div className="container mx-auto px-4"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-serif mb-8 text-center">Pourquoi se marier dans le Grand Est ?</h2><div className="grid md:grid-cols-2 gap-8"><div><h3 className="text-xl font-serif mb-4">Route des Vins d'Alsace</h3><p className="text-muted-foreground">Villages pittoresques, caves à vin et châteaux médiévaux pour un mariage féerique.</p></div><div><h3 className="text-xl font-serif mb-4">Champagne</h3><p className="text-muted-foreground">Célébrez votre union dans les plus prestigieuses maisons de Champagne.</p></div></div></div></div></section>
        <section className="py-16 bg-wedding-olive/5"><div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-serif mb-6">Prêt à organiser votre mariage dans le Grand Est ?</h2><Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90"><Link to="/professionnelsmariable?region=grand-est">Commencer ma recherche<ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline" className="border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10 ml-3"><Link to="/register-gratuit">Créer mon compte gratuit</Link></Button></div></div></section>
      </main>
      <Footer />
    </>
  );
};

export default MariageGrandEst;
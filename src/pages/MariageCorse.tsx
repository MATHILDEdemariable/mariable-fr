import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Sun } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const MariageCorse = () => {
  const corseSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable - Mariage Corse",
    "description": "Organisez votre mariage en Corse avec les meilleurs prestataires. Domaines vue mer, bergeries, plages paradisiaques sélectionnés par Mariable.",
    "areaServed": { "@type": "AdministrativeArea", "name": "Corse", "containedInPlace": { "@type": "Country", "name": "France" } },
    "serviceArea": [{ "@type": "City", "name": "Ajaccio" }, { "@type": "City", "name": "Bastia" }, { "@type": "City", "name": "Porto-Vecchio" }, { "@type": "City", "name": "Bonifacio" }]
  };

  return (
    <>
      <SEO title="Mariage Corse | Lieux et Prestataires d'Exception" description="Organisez votre mariage en Corse avec les meilleurs prestataires. Domaines vue mer, bergeries, plages paradisiaques sélectionnés par Mariable." keywords="mariage corse, lieu mariage porto-vecchio, mariage bonifacio, photographe mariage corse, mariage ile de beauté" canonical="/mariage-corse">
        <meta name="geo.region" content="FR-COR" />
        <meta name="geo.placename" content="Corse, France" />
        <script type="application/ld+json">{JSON.stringify(corseSchema)}</script>
      </SEO>
      <PremiumHeader />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-wedding-cream/50 to-wedding-olive/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">Mariage en Corse</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Sur l'île de Beauté, découvrez les lieux et prestataires pour votre mariage de rêve en Corse</p>
              <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90"><Link to="/professionnelsmariable?region=corse"><MapPin className="mr-2 h-4 w-4" />Voir les prestataires</Link></Button>
            </div>
          </div>
        </section>
        <section className="py-16"><div className="container mx-auto px-4"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-serif mb-8 text-center">Pourquoi se marier en Corse ?</h2><div className="grid md:grid-cols-2 gap-8"><div><h3 className="text-xl font-serif mb-4">Paysages paradisiaques</h3><p className="text-muted-foreground">Plages de sable blanc, eaux turquoise et montagnes majestueuses pour un cadre de rêve.</p></div><div><h3 className="text-xl font-serif mb-4">Authenticité méditerranéenne</h3><p className="text-muted-foreground">Bergeries rénovées, domaines viticoles et traditions corses pour un mariage unique.</p></div></div></div></div></section>
        <section className="py-16 bg-wedding-olive/5"><div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-serif mb-6">Prêt à organiser votre mariage en Corse ?</h2><Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90"><Link to="/professionnelsmariable?region=corse">Commencer ma recherche<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div></div></section>
      </main>
      <Footer />
    </>
  );
};

export default MariageCorse;
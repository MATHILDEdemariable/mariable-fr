import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import SEO from '../components/SEO';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => (
  <section className="relative min-h-[80vh] flex items-center">
    <div className="absolute inset-0 bg-[url('/lovable-uploads/bea0740d-427b-4f1b-95e3-2468f199ec77.png')] bg-cover bg-center"></div>
    <div className="absolute inset-0 bg-black/40"></div>
    <div className="container relative z-10 max-w-6xl mx-auto px-4">
      <div className="max-w-2xl text-white">
        <h1 className="font-serif text-4xl md:text-5xl mb-6">Organisez le mariage de vos rêves</h1>
        <p className="text-lg mb-10 max-w-xl">
          Mariable accompagne les futurs mariés dans l'organisation de leur mariage, de la recherche de prestataires à la coordination le jour J.
        </p>
        <Link to="/register">
          <Button 
            size="lg" 
            className="mb-4 bg-wedding-olive hover:bg-wedding-olive/90"
            variant="wedding"
          >
            Oui je le veux <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const ServicesSection = () => (
  <section className="py-12 md:py-24 bg-wedding-cream/50">
    <div className="container max-w-6xl mx-auto px-4">
      <h2 className="font-serif text-3xl md:text-4xl text-center mb-8">Nos Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <Link to="/services/prestataires">
            <img src="/icons/prestataires.svg" alt="Recherche de prestataires" className="mx-auto h-20 mb-4" />
            <h3 className="text-xl font-medium mb-2">Recherche de prestataires</h3>
            <p className="text-muted-foreground">Trouvez les meilleurs prestataires pour votre mariage.</p>
          </Link>
        </div>
        <div className="text-center">
          <Link to="/services/planification">
            <img src="/icons/planification.svg" alt="Planification" className="mx-auto h-20 mb-4" />
            <h3 className="text-xl font-medium mb-2">Planification</h3>
            <p className="text-muted-foreground">Organisez chaque étape de votre mariage sans stress.</p>
          </Link>
        </div>
        <div className="text-center">
          <Link to="/services/budget">
            <img src="/icons/budget.svg" alt="Budgétisation" className="mx-auto h-20 mb-4" />
            <h3 className="text-xl font-medium mb-2">Budgétisation</h3>
            <p className="text-muted-foreground">Gérez votre budget et suivez vos dépenses facilement.</p>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const GuideSection = () => (
  <section className="py-12 md:py-24">
    <div className="container max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <img src="/lovable-uploads/0994942d-8859-4947-9e9d-198428945244.jpg" alt="Guide Mariable" className="rounded-lg shadow-md" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Le Guide Mariable</h2>
          <p className="text-lg mb-8">
            Découvrez notre guide complet pour organiser votre mariage de A à Z. Des conseils, desChecklists et des outils pour vous accompagner à chaque étape.
          </p>
          <Link to="/guide-mariable">
            <Button size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90" variant="wedding">
              Découvrir le guide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => (
  <div className="bg-white">
    <SEO
      title="Mariable - Organisez le mariage de vos rêves"
      description="Mariable vous accompagne dans l'organisation de votre mariage : recherche de prestataires, planification, budgétisation et conseils personnalisés."
    />
    <Header />
    <main>
      <HeroSection />
      <ServicesSection />
      <GuideSection />
    </main>
  </div>
);

export default Index;

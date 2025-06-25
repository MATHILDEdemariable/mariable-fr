
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ToolsSection from '@/components/home/ToolsSection';
import CallToAction from '@/components/home/CallToAction';
import WeddingToolsSection from '@/components/home/WeddingToolsSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, CheckSquare, Coins, Users, Heart, Calculator } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Mariable - Planifiez votre mariage moderne avec élégance</title>
        <meta name="description" content="Planifiez votre mariage avec Mariable, la plateforme moderne pour organiser votre jour J. Planning personnalisé, prestataires sélectionnés et coordination jour J." />
        <meta name="keywords" content="mariage, wedding planner, planning mariage, prestataires mariage, coordination jour J" />
        <meta property="og:title" content="Mariable - Planifiez votre mariage moderne avec élégance" />
        <meta property="og:description" content="La plateforme moderne pour organiser votre mariage de A à Z" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mariable.fr" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Section Outils Mariable */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
                Les outils Mariable pour votre mariage
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Découvrez nos outils gratuits pour planifier et organiser votre mariage sereinement
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <Calendar className="h-12 w-12 text-wedding-olive mb-4" />
                <h3 className="text-xl font-semibold mb-3">Planning personnalisé</h3>
                <p className="text-gray-600 mb-4">
                  Créez votre planning de mariage étape par étape avec nos conseils d'experts
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/planning-personnalise">Créer mon planning</Link>
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <CheckSquare className="h-12 w-12 text-wedding-olive mb-4" />
                <h3 className="text-xl font-semibold mb-3">Check-list interactive</h3>
                <p className="text-gray-600 mb-4">
                  Ne rien oublier avec notre check-list complète et personnalisable
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/tasks">Voir la check-list</Link>
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <Coins className="h-12 w-12 text-wedding-olive mb-4" />
                <h3 className="text-xl font-semibold mb-3">Gestion du budget</h3>
                <p className="text-gray-600 mb-4">
                  Suivez et optimisez votre budget mariage en temps réel
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/budget">Gérer mon budget</Link>
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <Users className="h-12 w-12 text-wedding-olive mb-4" />
                <h3 className="text-xl font-semibold mb-3">Sélection prestataires</h3>
                <p className="text-gray-600 mb-4">
                  Trouvez les meilleurs prestataires près de chez vous
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/prestataires">Voir les prestataires</Link>
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <Heart className="h-12 w-12 text-wedding-olive mb-4" />
                <h3 className="text-xl font-semibold mb-3">Wishlist mariage</h3>
                <p className="text-gray-600 mb-4">
                  Collectez vos inspirations et créez votre univers unique
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/wishlist">Ma wishlist</Link>
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <Calculator className="h-12 w-12 text-wedding-olive mb-4" />
                <h3 className="text-xl font-semibold mb-3">Calculateur de boissons</h3>
                <p className="text-gray-600 mb-4">
                  Calculez précisément les quantités de boissons nécessaires
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/drinks">Calculer les boissons</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <FeaturesSection />
        <ToolsSection />
        <WeddingToolsSection />
        
        {/* Section Coordination Jour J */}
        <section className="py-16 bg-gradient-to-br from-wedding-olive/5 to-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif text-black mb-6">
                Coordination Jour J - Vivez votre mariage sereinement
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Confiez-nous la coordination de votre jour J pour profiter pleinement de votre mariage. 
                Nos experts s'occupent de tout : planning détaillé, coordination des prestataires, 
                gestion des imprévus et assistance complète.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="bg-wedding-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-wedding-olive" />
                  </div>
                  <h3 className="font-semibold mb-2">Planning détaillé</h3>
                  <p className="text-gray-600 text-sm">Organisation minute par minute de votre journée</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-wedding-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-wedding-olive" />
                  </div>
                  <h3 className="font-semibold mb-2">Coordination prestataires</h3>
                  <p className="text-gray-600 text-sm">Liaison avec tous vos prestataires</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-wedding-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-wedding-olive" />
                  </div>
                  <h3 className="font-semibold mb-2">Sérénité totale</h3>
                  <p className="text-gray-600 text-sm">Profitez de votre mariage sans stress</p>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-8 py-3">
                <Link to="/reservation-jour-m">
                  Choisir ma formule Jour M
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

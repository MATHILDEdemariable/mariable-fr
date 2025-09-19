import React, { useEffect } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import ParcoursSection from '@/components/home/ParcoursSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with Video Background */}
        <HeroSection />

        {/* Parcours Section (3 étapes) */}
        <ParcoursSection />

        {/* Features Section (grille 2x4) */}
        <FeaturesSection />

        {/* Testimonials Section + CTA Final */}
        <TestimonialsSection />
      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default Index;
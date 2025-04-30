
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import ChatbotButton from '@/components/ChatbotButton';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import FooterSection from '@/components/home/FooterSection';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO />
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <CallToActionSection />
      </main>
      
      <FooterSection />
      
      <ChatbotButton />
    </div>
  );
};

export default Index;

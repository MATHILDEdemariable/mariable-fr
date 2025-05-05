
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';
import HeroSection from '@/components/home/HeroSection';
import WeddingToolsSection from '@/components/home/WeddingToolsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CallToAction from '@/components/home/CallToAction';
import Footer from '@/components/Footer';

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
        <WeddingToolsSection />
        <FeaturesSection />
        <CallToAction />
      </main>
      
      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default Index;

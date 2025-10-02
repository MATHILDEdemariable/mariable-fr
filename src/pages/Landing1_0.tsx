import React, { useEffect } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import ThreeStepsSection from '@/components/home/ThreeStepsSection';

const Landing1_0 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO />
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <ThreeStepsSection />
      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default Landing1_0;
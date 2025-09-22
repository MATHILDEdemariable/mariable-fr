import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import PremiumHeader from '@/components/home/PremiumHeader';
import VideoBackground from '@/components/VideoBackground';

const SimpleHomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-premium-base">
      <SEO 
        title="Mariable - Une expérience mariage exceptionnelle"
        description="La plateforme dédiée aux futurs mariés et professionnels du mariage. Organisez votre mariage parfait ou développez votre activité."
        keywords="mariage, futurs mariés, professionnels mariage, organisation mariage, prestataires mariage"
      />
      
      <PremiumHeader />
      
      <main className="flex-grow">
        {/* Hero Section Simple */}
        <VideoBackground 
          videoUrl="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos//freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4" 
          className="h-screen flex items-center justify-center"
        >
          <div className="relative z-20 text-center max-w-6xl mx-auto px-4">
            <h1 className="text-6xl font-extrabold text-white mb-12 leading-tight md:text-6xl">
              Une expérience mariage
              <br />
              <span className="bg-gradient-to-r from-white/90 to-white bg-clip-text text-transparent">
                exceptionnelle
              </span>
            </h1>
            
            {/* CTAs côte à côte */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/landingcouple">
                <Button size="lg" className="btn-primary text-white px-12 py-6 text-xl font-semibold ripple min-w-[200px]">
                  Futurs mariés
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              
              <Link to="/professionnels">
                <Button size="lg" className="bg-white text-premium-black hover:bg-white/90 px-12 py-6 text-xl font-semibold ripple min-w-[200px]">
                  Professionnels
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </VideoBackground>
      </main>

      <Footer />
    </div>
  );
};

export default SimpleHomePage;
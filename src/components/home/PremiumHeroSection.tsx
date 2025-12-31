import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VideoBackground from '@/components/VideoBackground';
import { motion } from 'framer-motion';

const PremiumHeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <VideoBackground 
      videoUrl="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4" 
      className="h-screen flex items-center justify-center"
    >
      <div className="relative z-20 text-center max-w-5xl mx-auto px-6">
        {/* Editorial badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-block px-5 py-2 text-xs tracking-[0.25em] uppercase text-white/90 border border-white/30 backdrop-blur-sm">
            L'art du mariage
          </span>
        </motion.div>

        {/* Main title - editorial serif */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-editorial text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6 leading-[1.1] drop-shadow-lg"
        >
          Créez le mariage
          <br />
          <span className="font-editorial-italic">qui vous ressemble</span>
        </motion.h1>
        
        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-16 h-px bg-white/50 mx-auto mb-8"
        />
        
        {/* Subtitle - refined */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-white/85 mb-10 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md"
        >
          Organisez vous-même un événement exceptionnel
          <br className="hidden md:block" />
          avec nos outils et notre sélection de professionnels
        </motion.p>
        
        {/* CTA Button - editorial style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Button 
            size="lg" 
            onClick={() => navigate('/register')} 
            className="bg-white text-foreground hover:bg-white/90 px-12 py-6 text-sm tracking-wide font-medium shadow-2xl hover:shadow-white/20 transform hover:scale-[1.02] transition-all duration-300 rounded-none border-0"
          >
            Découvrir 
            <ArrowRight className="ml-3 h-4 w-4" />
          </Button>
        </motion.div>
        
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-white/60 text-sm tracking-wide drop-shadow font-light"
        >
          La magie, c'est vous. La logistique, c'est nous.
        </motion.p>
      </div>
    </VideoBackground>
  );
};

export default PremiumHeroSection;

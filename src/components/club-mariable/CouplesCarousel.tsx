import React from 'react';
import { motion } from 'framer-motion';

const coupleAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
];

const CouplesCarousel = () => {
  const duplicatedAvatars = [...coupleAvatars, ...coupleAvatars];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="mt-12"
    >
      <p className="text-white/80 text-sm mb-4 text-center">
        Rejoignez plus de <span className="font-semibold text-premium-cream">1 500 couples</span> conquis
      </p>
      
      <div className="relative overflow-hidden max-w-md mx-auto">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/50 to-transparent z-10" />
        
        <div className="flex animate-marquee-slow">
          {duplicatedAvatars.map((avatar, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-1.5"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 hover:border-premium-cream hover:scale-110 transition-all duration-300">
                <img
                  src={avatar}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CouplesCarousel;

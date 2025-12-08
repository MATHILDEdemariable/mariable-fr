import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardLandaaProps {
  icon: React.ReactNode;
  emoji: string;
  badgeColor: string;
  title: string;
  description: string;
  tags: string[];
  index: number;
}

const FeatureCardLandaa = ({ 
  icon, 
  emoji, 
  badgeColor, 
  title, 
  description, 
  tags, 
  index 
}: FeatureCardLandaaProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Card className="h-full border-2 border-transparent hover:border-premium-sage/40 transition-all duration-500 hover:shadow-2xl overflow-hidden relative bg-gradient-to-b from-white to-premium-cream/10">
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
        
        <CardContent className="p-6 relative z-10">
          {/* Badge emoji */}
          <div 
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${badgeColor}`}
          >
            <span className="text-lg">{emoji}</span>
            <span>{title}</span>
          </div>
          
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-premium-sage/10 flex items-center justify-center mb-4 group-hover:bg-premium-sage group-hover:text-white transition-all duration-300 text-premium-sage">
            {icon}
          </div>
          
          {/* Description */}
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {description}
          </p>
          
          {/* Scrolling tags */}
          <div className="relative overflow-hidden h-7">
            <div className="flex gap-2 animate-marquee-tags whitespace-nowrap">
              {[...tags, ...tags].map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-full bg-premium-sage/10 text-premium-sage text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCardLandaa;

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PremiumTestimonialsSection = () => {
  const { t } = useTranslation('home');
  const images = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  ];
  const testimonials = [1, 2, 3].map((id, idx) => ({
    id,
    name: t(`testimonials.items.${id}.name`),
    location: t(`testimonials.items.${id}.location`),
    text: t(`testimonials.items.${id}.text`),
    image: images[idx],
  }));

  return (
    <section className="py-24 bg-editorial-beige">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-editorial-noir mb-4 font-normal">
            {t('testimonials.titleLine1')} <em>{t('testimonials.titleLine2')}</em>
          </h2>
          <p className="text-editorial-noir/70 text-lg max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-8 border border-gray-200 hover:border-editorial-olive/30 transition-colors"
            >
              <blockquote className="font-serif text-lg md:text-xl text-editorial-noir leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </blockquote>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-12 h-12 rounded-full object-cover grayscale"
                />
                <div>
                  <p className="font-medium text-editorial-noir text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-editorial-noir/60 text-xs uppercase tracking-wide">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-editorial-olive hover:bg-editorial-noir text-white px-12 py-6 text-base font-medium rounded-none"
            >
              {t('testimonials.cta')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-editorial-noir/60 mt-4">
            {t('testimonials.trust')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PremiumTestimonialsSection;

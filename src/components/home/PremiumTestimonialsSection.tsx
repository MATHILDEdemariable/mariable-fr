import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
const PremiumTestimonialsSection = () => {
  const testimonials = [{
    id: 1,
    name: "Sarah & Thomas",
    location: "Mariage à Provence",
    image: "/lovable-uploads/fake-testimonial-1.jpg",
    rating: 5,
    text: "Mariable a transformé notre organisation de mariage. La sélection de prestataires était exceptionnelle et les outils de planification nous ont fait gagner un temps précieux.",
    gradient: "from-premium-sage to-premium-sage-medium"
  }, {
    id: 2,
    name: "Julie & Marc",
    location: "Mariage à Paris",
    image: "/lovable-uploads/fake-testimonial-2.jpg",
    rating: 5,
    text: "La coordination le jour J était parfaite ! Grâce à l'application, toute notre équipe était synchronisée. Nous avons pu profiter pleinement de notre journée.",
    gradient: "from-premium-sage-medium to-premium-sage-light"
  }, {
    id: 3,
    name: "Emma & Pierre",
    location: "Mariage à Lyon",
    image: "/lovable-uploads/fake-testimonial-3.jpg",
    rating: 5,
    text: "Les prestataires recommandés par Mariable étaient tous formidables. La qualité de service était au rendez-vous, exactement ce que nous cherchions.",
    gradient: "from-premium-sage-light to-premium-sage"
  }];
  return <section className="py-24 bg-premium-base">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-premium-black mb-6 md:text-4xl">
            Ils ont vécu
            <br />
            <span className="bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light bg-clip-text text-transparent">
              l'expérience Mariable
            </span>
          </h2>
          <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">
            Découvrez les témoignages de couples qui ont fait confiance à notre plateforme
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <Card key={testimonial.id} className="group inspiration-card bg-white shadow-xl border-0 relative overflow-hidden section-reveal stagger-item">
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.gradient}`}></div>
              
              <CardContent className="p-8">
                {/* Quote icon */}
                <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${testimonial.gradient} mb-6`}>
                  <Quote className="h-6 w-6 text-white" />
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                
                {/* Testimonial text */}
                <p className="text-premium-charcoal leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-premium-black">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-premium-charcoal">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>

              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
            </Card>)}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 text-center">
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-premium-sage to-premium-sage-medium bg-clip-text text-transparent mb-2">
              500+
            </div>
            <p className="text-premium-charcoal">Mariages organisés</p>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-premium-sage-medium to-premium-sage-light bg-clip-text text-transparent mb-2">
              98%
            </div>
            <p className="text-premium-charcoal">Satisfaction client</p>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-premium-sage-light to-premium-sage bg-clip-text text-transparent mb-2">
              100+
            </div>
            <p className="text-premium-charcoal">Prestataires certifiés</p>
          </div>
        </div>
      </div>
    </section>;
};
export default PremiumTestimonialsSection;
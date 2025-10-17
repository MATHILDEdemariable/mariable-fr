import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const SocialProofSection = () => {
  return (
    <section className="max-w-4xl mx-auto mb-16">
      <Card className="p-8 bg-gradient-to-br from-wedding-cream to-white">
        <Quote className="h-8 w-8 text-wedding-olive mb-4" />
        
        <p className="text-lg italic mb-4">
          "Je gère 20 mariages/an. Depuis Mariable Paiements : zéro relance manuelle, tout part tout seul."
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Julie</p>
            <p className="text-sm text-muted-foreground">Photographe à Lyon</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-semibold">4.8/5</span>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default SocialProofSection;

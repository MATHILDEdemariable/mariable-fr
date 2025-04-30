
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const StartButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/test-formulaire')}
      className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-6 py-6 text-lg font-medium rounded-lg mt-8"
    >
      Commencer
    </Button>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-8 md:py-12 bg-wedding-cream/40">
      <div className="container px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-serif mb-2 md:mb-3">
            Mariable facilite l'organisation de votre mariage
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mx-auto">
            Transformez l'organisation du mariage en une expérience simple, rapide & agréable
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <li className="flex items-start gap-3 p-3 md:p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="text-wedding-olive shrink-0 mt-1" size={18} />
              <div>
                <h3 className="font-serif text-base md:text-lg text-wedding-black">Trouver les meilleurs prestataires</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Grâce à notre guide de référence soigneusement sélectionné</p>
              </div>
            </li>
            
            <li className="flex items-start gap-3 p-3 md:p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="text-wedding-olive shrink-0 mt-1" size={18} />
              <div>
                <h3 className="font-serif text-base md:text-lg text-wedding-black">Planifier chaque étape</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Organisez votre mariage avec clarté</p>
              </div>
            </li>
            
            <li className="flex items-start gap-3 p-3 md:p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="text-wedding-olive shrink-0 mt-1" size={18} />
              <div>
                <h3 className="font-serif text-base md:text-lg text-wedding-black">Gérer facilement votre budget</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Avec une transparence totale des prix et des prestations</p>
              </div>
            </li>
            
            <li className="flex items-start gap-3 p-3 md:p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="text-wedding-olive shrink-0 mt-1" size={18} />
              <div>
                <h3 className="font-serif text-base md:text-lg text-wedding-black">Réserver et gérer en ligne</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Directement en ligne - prochainement disponible</p>
              </div>
            </li>
          </ul>
          
          <div className="text-center mt-6">
            <StartButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

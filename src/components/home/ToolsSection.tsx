
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Camera, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StartButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/test-formulaire')}
      className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-6 py-6 text-lg font-medium rounded-lg mt-8 w-full sm:w-auto"
    >
      Découvrez votre style de mariage
    </Button>
  );
};

const ToolsSection = () => {
  return (
    <section className="py-8 md:py-12 bg-wedding-cream/40">
      <div className="container px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-2 md:mb-3">
            Comment Mariable facilite l'organisation de votre mariage ?
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mx-auto">
            En devenant votre wedding planner digital & intelligent
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Card 1: Conseils personnalisés */}
            <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <MessageCircle className="text-wedding-olive shrink-0 mt-1" size={22} />
                  <div>
                    <h3 className="font-serif text-base md:text-lg text-wedding-black mb-2">Conseils personnalisés</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      Écrivez nous sur WhatsApp, nous répondrons au mieux à vos questions & demandes
                    </p>
                    <a 
                      href="https://chat.whatsapp.com/In5xf3ZMJNvJkhy4F9g5C5" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-4 py-2 rounded-md inline-flex items-center text-sm"
                    >
                      Rejoindre la communauté
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Card 2: Des outils pour organiser */}
            <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-wedding-olive shrink-0 mt-1" size={22} />
                  <div>
                    <h3 className="font-serif text-base md:text-lg text-wedding-black mb-2">Des outils pour organiser votre mariage</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      Checklist, gestion budget, planning jour J
                    </p>
                    <Link 
                      to="/services/planification"
                      className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-4 py-2 rounded-md inline-flex items-center text-sm"
                    >
                      Accéder
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Card 3: Sélection de prestataires */}
            <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Camera className="text-wedding-olive shrink-0 mt-1" size={22} />
                  <div>
                    <h3 className="font-serif text-base md:text-lg text-wedding-black mb-2">Sélection de prestataires</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      Trouvez les meilleurs prestataires adaptés à votre style et budget
                    </p>
                    <Link 
                      to="/recherche"
                      className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-4 py-2 rounded-md inline-flex items-center text-sm"
                    >
                      Découvrir les prestataires
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-6">
            <StartButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;

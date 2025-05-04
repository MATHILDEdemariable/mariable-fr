
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Calendar, MapPin, Heart, Instagram, Mail, BookOpen, MessageCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from '@/components/search/SearchBar';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';

const StartButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/test-formulaire')}
      className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-6 py-6 text-lg font-medium rounded-lg mt-8 w-full sm:w-auto"
    >
      Commencer
    </Button>
  );
};

// Composant pour l'effet typing du titre principal avec une meilleure finition visuelle
const TypingEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 75); // Vitesse de l'animation ajustée pour une meilleure lecture
      
      return () => clearTimeout(timer);
    } else {
      // Animation terminée, on supprime le curseur après un délai
      const finishTimer = setTimeout(() => {
        setIsTypingComplete(true);
      }, 500);
      
      return () => clearTimeout(finishTimer);
    }
  }, [currentIndex, text]);

  return (
    <span className={`inline-block ${isTypingComplete ? 'typing-complete' : 'border-r-2 border-wedding-cream animate-pulse'}`}>
      {displayedText}
    </span>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleConnexionClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO />
      <Header />
      
      <main className="flex-grow">
        <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center">
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <img
              src="/lovable-uploads/977ff726-5f78-4cbc-bf10-dbf0bbd10ab7.png"
              alt="Couple de mariés célébrant leur union"
              className="absolute min-w-full min-h-full object-cover"
              style={{ objectPosition: "center center" }}
            />
            <div className="absolute inset-0 bg-wedding-black/40 backdrop-blur-[2px]"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4 py-6 md:py-16">
            <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-7 md:mb-8 font-serif pb-8">
                <TypingEffect text="Organisez le mariage parfait, simplement" />
              </h1>
              <p className="text-white/90 text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto">
                Trouvez les meilleurs prestataires
              </p>
              
              <div className="max-w-4xl mx-auto">
                <SearchBar />
                <div className="flex justify-center mt-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-wedding-cream/20 backdrop-blur-sm rounded-full">
                    <Sparkles size={16} className="text-wedding-cream" />
                    <span className="text-wedding-cream text-xs md:text-sm">
                      Nouveauté 2025 – MariableGPT, l'Intelligence amoureuse - <a 
                        href="https://chatgpt.com/g/g-67b5d482dd208191ae458763db0bb08c-mathilde-de-mariable" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="underline hover:text-white transition-colors"
                      >
                        voir une démo
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
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
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <li className="flex items-start gap-3 p-3 md:p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="text-wedding-olive shrink-0 mt-1" size={18} />
                  <div>
                    <h3 className="font-serif text-base md:text-lg text-wedding-black">Un guide de prestataires de confiance</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Grâce à notre sélection soigneusement établie</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3 p-3 md:p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="text-wedding-olive shrink-0 mt-1" size={18} />
                  <div>
                    <h3 className="font-serif text-base md:text-lg text-wedding-black">Des Outils de planification</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Check-list en 10 étapes, planning jour-j</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3 p-3 md:p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="text-wedding-olive shrink-0 mt-1" size={18} />
                  <div>
                    <h3 className="font-serif text-base md:text-lg text-wedding-black">Des Calculatrices magiques</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Budget, boissons et autres outils pratiques</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3 p-3 md:p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="text-wedding-olive shrink-0 mt-1" size={18} />
                  <div>
                    <h3 className="font-serif text-base md:text-lg text-wedding-black">De nouvelles fonctionnalités à venir</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Prochainement disponible</p>
                  </div>
                </li>
              </ul>
              
              <div className="text-center mt-6">
                <StartButton />
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-8 md:py-12 bg-white">
          <div className="container px-4">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-2 md:mb-3">
                Transformez l'organisation du mariage en une expérience simple, rapide & agréable
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mx-auto">
                Gardez la main sur votre grand jour
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              <div className="feature-card p-4">
                <div className="w-10 h-10 bg-wedding-black/10 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="text-wedding-black h-5 w-5" />
                </div>
                <h3 className="text-base md:text-lg font-serif mb-2">Gain de temps</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Une solution qui centralise les démarches pour trouver, comparer, réserver et coordonner les meilleurs prestataires.
                </p>
              </div>
              
              <div className="feature-card p-4">
                <div className="w-10 h-10 bg-wedding-black/10 rounded-full flex items-center justify-center mb-3">
                  <MapPin className="text-wedding-black h-5 w-5" />
                </div>
                <h3 className="text-base md:text-lg font-serif mb-2">Garantie des bons choix de prestataires</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Des experts triés sur le volet pour votre sérénité
                </p>
              </div>
              
              <div className="feature-card p-4">
                <div className="w-10 h-10 bg-wedding-black/10 rounded-full flex items-center justify-center mb-3">
                  <Heart className="text-wedding-black h-5 w-5" />
                </div>
                <h3 className="text-base md:text-lg font-serif mb-2">Réduction de la charge mentale</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Gérez tout au même endroit, sans stress ni oubli
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="contact" className="py-8 md:py-12 bg-white text-wedding-black">
          <div className="container text-center px-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-3 md:mb-4">
              Prêt à révolutionner l'organisation de votre mariage ?
            </h2>
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-6 py-6 text-lg font-medium w-full sm:w-auto"
              onClick={handleConnexionClick}
            >
              Oui je le veux
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="py-8 bg-white text-wedding-black">
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/c5ca128d-6c6f-4f09-a990-f6f16d47e231.png" alt="Mariable Logo" className="h-10 md:h-12 w-auto" />
              </div>
              <p className="mb-3 text-wedding-black/70 text-xs md:text-sm">
                Mariable est la référence des mariages modernes & élégants.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/mariable.fr/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-wedding-black hover:text-wedding-black/70 transition-colors">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <h3 className="font-serif text-base mb-2 md:mb-3">Liens Rapides</h3>
              <ul className="space-y-1 text-xs md:text-sm">
                <li><Link to="/" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Accueil</Link></li>
                <li><Link to="/services/prestataires" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Prestataires</Link></li>
                <li><Link to="/services/planification" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Planification</Link></li>
                <li><Link to="/services/budget" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Budget</Link></li>
                <li><Link to="/services/conseils" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Conseils</Link></li>
              </ul>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <h3 className="font-serif text-base mb-2 md:mb-3">À Propos</h3>
              <ul className="space-y-1 text-xs md:text-sm">
                <li><Link to="/about/histoire" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Histoire</Link></li>
                <li><Link to="/about/approche" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Approche</Link></li>
                <li><Link to="/about/temoignages" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Témoignages</Link></li>
                <li><Link to="/contact/nous-contacter" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Nous Contacter</Link></li>
              </ul>
            </div>
            
            <div className="mt-4 lg:mt-0">
              <h3 className="font-serif text-base mb-2 md:mb-3">Contact</h3>
              <ul className="space-y-2 text-xs md:text-sm">
                <li className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-wedding-black shrink-0" />
                  <a href="mailto:mathilde@mariable.fr" className="text-wedding-black/70 hover:text-wedding-black transition-colors">
                    mathilde@mariable.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 md:mt-8 pt-4 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-wedding-black/70 mb-3 md:mb-0 text-center md:text-left">
              © 2025 Mariable - Tous droits réservés
            </p>
            <div className="flex gap-4 text-xs">
              <Link to="/mentions-legales" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mentions Légales</Link>
              <Link to="/cgv" className="text-wedding-black/70 hover:text-wedding-black transition-colors">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
      
      <ChatbotButton />
    </div>
  );
};

export default Index;

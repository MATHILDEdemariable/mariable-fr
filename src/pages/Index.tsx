import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Calendar, MapPin, Heart, Instagram, Mail, BookOpen, MessageCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from '@/components/search/SearchBar';
import ChatbotButton from '@/components/ChatbotButton';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleConnexionClick = () => {
    navigate('/login-frame');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4">
                Organisez le mariage <span className="text-wedding-cream">dont vous rêvez</span>
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
                <Button 
                  size={isMobile ? "sm" : "default"} 
                  className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
                  asChild
                >
                  <Link to="/services/planification">
                    Commencer maintenant
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-8 md:py-12 bg-white">
          <div className="container px-4">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-base md:text-lg font-serif mb-2 md:mb-3">
                Le premier wedding planner digital qui centralise et simplifie les démarches
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mx-auto">
                Tout en vous laissant la liberté de garder la main sur votre grand jour
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
                <h3 className="text-base md:text-lg font-serif mb-2">Recommandations personnalisées</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Accédez à un référencement de professionnels adaptés et reconnus pour leur expertise.
                </p>
              </div>
              
              <div className="feature-card p-4">
                <div className="w-10 h-10 bg-wedding-black/10 rounded-full flex items-center justify-center mb-3">
                  <Heart className="text-wedding-black h-5 w-5" />
                </div>
                <h3 className="text-base md:text-lg font-serif mb-2">Sans stress</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Faites nous confiance et utilisez notre outil de planification pour ne rien oublier.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="contact" className="py-8 md:py-12 bg-white text-wedding-black">
          <div className="container text-center px-4">
            <h2 className="text-base md:text-lg font-serif mb-3 md:mb-4">
              Prêt à révolutionner l'organisation de votre mariage ?
            </h2>
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
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


import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import Header from '@/components/Header';
import { ArrowRight, Sparkles, Calendar, MapPin, Heart, Instagram, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();
  const [showFullChat, setShowFullChat] = useState(false);
  const [userInitialMessage, setUserInitialMessage] = useState('');
  const fullChatRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFirstMessage = (message: string) => {
    setUserInitialMessage(message);
    setShowFullChat(true);
    
    setTimeout(() => {
      if (fullChatRef.current) {
        fullChatRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        <section className="relative min-h-[80vh] flex items-center">
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <img
              src="/lovable-uploads/977ff726-5f78-4cbc-bf10-dbf0bbd10ab7.png"
              alt="Couple de mariés célébrant leur union"
              className="absolute min-w-full min-h-full object-cover"
              style={{ objectPosition: "center center" }}
            />
            <div className="absolute inset-0 bg-wedding-black/40 backdrop-blur-[2px]"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4 py-8 md:py-16">
            <div className="max-w-3xl mx-auto text-center mb-6 md:mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-wedding-light text-xs sm:text-sm text-wedding-black mb-3 md:mb-4">
                <Sparkles size={14} className="mr-2" />
                <span>Nouveau en 2025</span>
              </div>
              <h1 className="text-white mb-4 md:mb-6">
                Organisez le mariage <span className="text-wedding-cream">dont vous rêvez</span>
              </h1>
              <p className="text-white/90 text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
                Dites-nous ce dont vous avez besoin ou quel est le mariage parfait pour vous ! 💍
              </p>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-0">
              <ChatInterface 
                isSimpleInput={true} 
                onFirstMessage={() => {
                  const inputElement = document.querySelector('input') as HTMLInputElement;
                  if (inputElement) {
                    handleFirstMessage(inputElement.value);
                  }
                }}
              />
              
              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-center gap-2 items-center">
                <button 
                  onClick={() => navigate('/services/planification')}
                  className="text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors py-2"
                >
                  <span>Vous ne savez pas par où commencer ?</span>
                  <span className="underline font-medium">Voir une démo</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {showFullChat && (
          <section ref={fullChatRef} id="chat" className="py-8 md:py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-serif mb-3 md:mb-4">Poursuivez la conversation avec Mathilde</h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                  Obtenez des recommendations de prestataires adaptées à vos besoins
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <Card className="bg-white shadow-xl rounded-xl overflow-hidden border">
                  <ChatInterface initialMessage={userInitialMessage} />
                </Card>
              </div>
            </div>
          </section>
        )}
        
        <section id="features" className="py-8 md:py-16 bg-white">
          <div className="container px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-serif mb-3 md:mb-4">Comment Mariable transforme votre expérience</h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                Dites adieu au stress et aux heures interminables de recherche de prestataires
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              <div className="feature-card">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-wedding-black h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-lg md:text-xl font-serif mb-2">Gain de temps</h3>
                <p className="text-muted-foreground">
                  Une transparence totale sur les prix - Découvrez immédiatement les formules et tarifs personnalisés en fonction de vos besoins, pour comparer en toute simplicité.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-wedding-black h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-lg md:text-xl font-serif mb-2">Recommandations personnalisées</h3>
                <p className="text-muted-foreground">
                  Accédez à un référencement de prestataires parfaitement adapté et reconnus pour leur excellence.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-wedding-black h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-lg md:text-xl font-serif mb-2">Sans stress</h3>
                <p className="text-muted-foreground">
                  Une solution clé en main qui combine approche intuitive et simplifiée.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="contact" className="py-10 md:py-16 lg:py-24 bg-white text-wedding-black">
          <div className="container text-center px-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-4 md:mb-6">
              Prêt à révolutionner l'organisation de votre mariage ?
            </h2>
            <Button 
              size="lg" 
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base"
              asChild
            >
              <Link to="/services/planification">
                Essayer Mariable maintenant
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="py-8 md:py-12 bg-white text-wedding-black">
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-10 md:h-12 w-auto" />
              </div>
              <p className="mb-4 text-wedding-black/70 text-sm">
                Mariable est votre partenaire privilégié pour créer le mariage de vos rêves, en simplifiant chaque étape de l'organisation.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/mariable.fr/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-wedding-black hover:text-wedding-black/70 transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-0">
              <h3 className="font-serif text-base md:text-lg mb-3 md:mb-4">Liens Rapides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Accueil</Link></li>
                <li><Link to="/services/prestataires" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Prestataires</Link></li>
                <li><Link to="/services/planification" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Planification</Link></li>
                <li><Link to="/services/budget" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Budget</Link></li>
                <li><Link to="/services/conseils" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Conseils</Link></li>
              </ul>
            </div>
            
            <div className="mt-6 sm:mt-0">
              <h3 className="font-serif text-base md:text-lg mb-3 md:mb-4">À Propos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about/histoire" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Histoire</Link></li>
                <li><Link to="/about/approche" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Approche</Link></li>
                <li><Link to="/about/temoignages" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Témoignages</Link></li>
                <li><Link to="/contact/nous-contacter" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Nous Contacter</Link></li>
              </ul>
            </div>
            
            <div className="mt-6 lg:mt-0">
              <h3 className="font-serif text-base md:text-lg mb-3 md:mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5 text-wedding-black shrink-0" />
                  <a href="mailto:mathilde@mariable.fr" className="text-wedding-black/70 hover:text-wedding-black transition-colors">
                    mathilde@mariable.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 md:mt-12 pt-6 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs md:text-sm text-wedding-black/70 mb-4 md:mb-0 text-center md:text-left">
              © 2025 Mariable - Tous droits réservés
            </p>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
              <Link to="/mentions-legales" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mentions Légales</Link>
              <Link to="/cgv" className="text-wedding-black/70 hover:text-wedding-black transition-colors">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

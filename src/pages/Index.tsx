import React from 'react';
import { Link } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import Header from '@/components/Header';
import { ArrowRight, Sparkles, Calendar, MapPin, Heart, Instagram, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with Wedding Image Background */}
        <section className="relative py-24 md:py-32">
          {/* Image Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <img
              src="/lovable-uploads/e5ba755e-f57f-420f-8885-014226913bc8.png"
              alt="Couple de mariés marchant sous une pluie de pétales"
              className="absolute min-w-full min-h-full object-cover object-center"
              style={{ objectPosition: "center 40%" }}
            />
            <div className="absolute inset-0 bg-wedding-black/40"></div>
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-wedding-light text-sm text-wedding-black mb-4">
                <Sparkles size={14} className="mr-2" />
                <span>Nouveau en 2025</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-white mb-6">
                Organisez le mariage <span className="text-wedding-cream">dont vous rêvez</span>
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Avec Mariable, organiser un mariage devient simple, rapide & agréable. Nous vous connectons instantanément avec les meilleurs prestataires adaptés à vos envies et votre budget.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="gap-2 bg-wedding-olive hover:bg-wedding-olive/90 text-white"
                  asChild
                >
                  <Link to="/commencer">
                    Commencer <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-black hover:bg-white/10"
                  asChild
                >
                  <Link to="/about/histoire">
                    En savoir plus
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Chatbot Section - Deuxième partie de la landing page */}
        <section className="py-20 bg-wedding-cream/30">
          <div className="container mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Prêt à révolutionner l'organisation de votre mariage ?</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
              <ChatInterface />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif mb-4">Comment Mariable transforme votre expérience</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dites adieu au stress et aux heures interminables de recherche de prestataires
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-wedding-black" />
                </div>
                <h3 className="text-xl font-serif mb-2">Gain de temps</h3>
                <p className="text-muted-foreground">
                  Trouvez tous vos prestataires en quelques minutes au lieu de plusieurs semaines de recherche.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-wedding-black" />
                </div>
                <h3 className="text-xl font-serif mb-2">Recommandations personnalisées</h3>
                <p className="text-muted-foreground">
                  Des suggestions qui correspondent parfaitement à votre style, votre région et votre budget.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-wedding-black" />
                </div>
                <h3 className="text-xl font-serif mb-2">Sans stress</h3>
                <p className="text-muted-foreground">
                  Une approche intuitive et conversationnelle pour organiser chaque aspect de votre mariage.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action - Simplified */}
        <section id="contact" className="py-16 md:py-24 bg-white text-wedding-black">
          <div className="container text-center">
            <Button 
              size="lg" 
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
              asChild
            >
              <Link to="/commencer">
                Essayer Mariable maintenant
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="py-12 bg-white text-wedding-black">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-12 w-auto" />
              </div>
              <p className="mb-4 text-wedding-black/70">
                Mariable est votre partenaire privilégié pour créer le mariage de vos rêves, en simplifiant chaque étape de l'organisation.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/mariable.fr/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-wedding-black hover:text-wedding-black/70">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">Liens Rapides</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-wedding-black/70 hover:text-wedding-black">Accueil</Link></li>
                <li><Link to="/services/prestataires" className="text-wedding-black/70 hover:text-wedding-black">Prestataires</Link></li>
                <li><Link to="/services/planification" className="text-wedding-black/70 hover:text-wedding-black">Planification</Link></li>
                <li><Link to="/services/budget" className="text-wedding-black/70 hover:text-wedding-black">Budget</Link></li>
                <li><Link to="/services/conseils" className="text-wedding-black/70 hover:text-wedding-black">Conseils</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">À Propos</h3>
              <ul className="space-y-2">
                <li><Link to="/about/histoire" className="text-wedding-black/70 hover:text-wedding-black">Notre Histoire</Link></li>
                <li><Link to="/about/approche" className="text-wedding-black/70 hover:text-wedding-black">Notre Approche</Link></li>
                <li><Link to="/about/temoignages" className="text-wedding-black/70 hover:text-wedding-black">Témoignages</Link></li>
                <li><Link to="/contact/nous-contacter" className="text-wedding-black/70 hover:text-wedding-black">Nous Contacter</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="mr-2 h-5 w-5 text-wedding-black shrink-0 mt-0.5" />
                  <span className="text-wedding-black/70">123 Rue du Mariage, 75001 Paris, France</span>
                </li>
                <li className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-wedding-black shrink-0" />
                  <span className="text-wedding-black/70">+33 1 23 45 67 89</span>
                </li>
                <li className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-wedding-black shrink-0" />
                  <span className="text-wedding-black/70">contact@mariable.fr</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-wedding-black/70 mb-4 md:mb-0">
              © 2025 Mariable - Tous droits réservés
            </p>
            <div className="flex gap-6">
              <Link to="/mentions-legales" className="text-sm text-wedding-black/70 hover:text-wedding-black">Mentions Légales</Link>
              <Link to="/politique-confidentialite" className="text-sm text-wedding-black/70 hover:text-wedding-black">Politique de Confidentialité</Link>
              <Link to="/cgv" className="text-sm text-wedding-black/70 hover:text-wedding-black">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

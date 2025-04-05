
import React from 'react';
import { Link } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import Header from '@/components/Header';
import { ArrowRight, Sparkles, Calendar, MapPin, Heart, Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-wedding-cream">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-wedding-black/10 text-sm text-wedding-black mb-4">
                <Sparkles size={14} className="mr-2" />
                <span>Nouveau en 2025</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
                Organisez le mariage <span className="text-wedding-black">dont vous rêvez</span>
              </h2>
              <p className="text-muted-foreground text-lg md:pr-12">
                Mariable révolutionne l'organisation de votre mariage en vous connectant instantanément avec les meilleurs prestataires adaptés à vos envies et votre budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="gap-2 bg-wedding-black hover:bg-wedding-black/90 text-white"
                  asChild
                >
                  <Link to="/commencer">
                    Commencer <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-wedding-black text-wedding-black hover:bg-wedding-black/10"
                  asChild
                >
                  <Link to="/about/histoire">
                    En savoir plus
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-wedding-black/20">
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
              <div className="bg-wedding-cream p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-wedding-black" />
                </div>
                <h3 className="text-xl font-serif mb-2">Gain de temps</h3>
                <p className="text-muted-foreground">
                  Trouvez tous vos prestataires en quelques minutes au lieu de plusieurs semaines de recherche.
                </p>
              </div>
              
              <div className="bg-wedding-cream p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-wedding-black" />
                </div>
                <h3 className="text-xl font-serif mb-2">Recommandations personnalisées</h3>
                <p className="text-muted-foreground">
                  Des suggestions qui correspondent parfaitement à votre style, votre région et votre budget.
                </p>
              </div>
              
              <div className="bg-wedding-cream p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
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
        
        {/* Call to Action */}
        <section id="contact" className="py-16 md:py-24 bg-wedding-black text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Prêt à révolutionner l'organisation de votre mariage ?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Posez-nous vos questions sur les prestataires, lieux, et tout ce qui concerne votre grand jour. Mariable est là pour vous guider.
            </p>
            <Button 
              size="lg" 
              className="bg-white hover:bg-white/90 text-wedding-black"
              asChild
            >
              <Link to="/commencer">
                Essayer Mariable maintenant
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="py-12 bg-wedding-black text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-12 w-auto" />
              </div>
              <p className="mb-4 text-white/70">
                Mariable est votre partenaire privilégié pour créer le mariage de vos rêves, en simplifiant chaque étape de l'organisation.
              </p>
              <div className="flex gap-4">
                <a href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-wedding-cream">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-wedding-cream">
                  <Instagram size={20} />
                </a>
                <a href="https://twitter.com" aria-label="Twitter" className="text-white hover:text-wedding-cream">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">Liens Rapides</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-white/70 hover:text-white">Accueil</Link></li>
                <li><Link to="/services/prestataires" className="text-white/70 hover:text-white">Prestataires</Link></li>
                <li><Link to="/services/planification" className="text-white/70 hover:text-white">Planification</Link></li>
                <li><Link to="/services/budget" className="text-white/70 hover:text-white">Budget</Link></li>
                <li><Link to="/services/conseils" className="text-white/70 hover:text-white">Conseils</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">À Propos</h3>
              <ul className="space-y-2">
                <li><Link to="/about/histoire" className="text-white/70 hover:text-white">Notre Histoire</Link></li>
                <li><Link to="/about/approche" className="text-white/70 hover:text-white">Notre Approche</Link></li>
                <li><Link to="/about/temoignages" className="text-white/70 hover:text-white">Témoignages</Link></li>
                <li><Link to="/contact/nous-contacter" className="text-white/70 hover:text-white">Nous Contacter</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="mr-2 h-5 w-5 text-wedding-cream shrink-0 mt-0.5" />
                  <span className="text-white/70">123 Rue du Mariage, 75001 Paris, France</span>
                </li>
                <li className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-wedding-cream shrink-0" />
                  <span className="text-white/70">+33 1 23 45 67 89</span>
                </li>
                <li className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-wedding-cream shrink-0" />
                  <span className="text-white/70">contact@mariable.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/70 mb-4 md:mb-0">
              © 2025 Mariable - Tous droits réservés
            </p>
            <div className="flex gap-6">
              <Link to="/mentions-legales" className="text-sm text-white/70 hover:text-white">Mentions Légales</Link>
              <Link to="/politique-confidentialite" className="text-sm text-white/70 hover:text-white">Politique de Confidentialité</Link>
              <Link to="/cgv" className="text-sm text-white/70 hover:text-white">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

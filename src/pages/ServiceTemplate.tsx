import React from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Linkedin } from 'lucide-react';

interface ServiceTemplateProps {
  title: string;
  description: string;
  content: React.ReactNode;
  children?: React.ReactNode;
}

const ServiceTemplate: React.FC<ServiceTemplateProps> = ({ title, description, content, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {children}
      <Header />
      
      <main className="flex-grow py-16 container bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground mb-8">{description}</p>
          
          <div className="prose prose-lg">
            {content}
          </div>
        </div>
      </main>
      
      <footer className="py-8 md:py-12 bg-white text-wedding-black">
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-10 md:h-12 w-auto" />
              </div>
              <p className="mb-4 text-wedding-black/70 text-sm">
                Mariable est la référence des mariages modernes & élégants.
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
                <li className="flex items-center">
                  <Linkedin className="mr-2 h-4 w-4 md:h-5 md:w-5 text-wedding-black shrink-0" />
                  <a href="https://www.linkedin.com/in/lambertmathilde/" target="_blank" rel="noopener noreferrer" className="text-wedding-black/70 hover:text-wedding-black transition-colors">
                    LinkedIn Professionnel
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
              <Link to="/politique-confidentialite" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Politique de Confidentialité</Link>
              <Link to="/cgv" className="text-wedding-black/70 hover:text-wedding-black transition-colors">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceTemplate;

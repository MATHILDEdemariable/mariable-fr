
import React from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface ServiceTemplateProps {
  title: string;
  description: string;
  content: React.ReactNode;
}

const ServiceTemplate: React.FC<ServiceTemplateProps> = ({ title, description, content }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
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
                <a href="https://www.instagram.com/mariable.fr/" aria-label="Instagram" className="text-wedding-black hover:text-wedding-black/70">
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

export default ServiceTemplate;

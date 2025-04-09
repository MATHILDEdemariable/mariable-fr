
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import { ArrowLeft, Instagram, Mail, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuideMariable = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container py-8 md:py-12">
        <div className="mb-8">
          <Link 
            to="/services/prestataires" 
            className="inline-flex items-center text-wedding-black hover:text-wedding-olive transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux prestataires
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-serif mt-4 mb-2">Guide Mariable</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Notre sélection des meilleurs prestataires pour votre mariage, soigneusement choisis et validés par notre équipe.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <iframe 
            className="airtable-embed w-full" 
            src="https://airtable.com/embed/app6YR8d1UIVu4KQG/shrfJkl5B1GpVk53q?viewControls=on" 
            frameBorder="0" 
            width="100%" 
            height="700" 
            style={{ background: "transparent", border: "1px solid #ccc" }}
            title="Guide Mariable"
          ></iframe>
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

export default GuideMariable;

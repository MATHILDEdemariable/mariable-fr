
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import { Instagram, Mail, Linkedin } from 'lucide-react';

const MentionsLegales = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container py-16">
        <h1 className="text-4xl font-serif mb-8">Mentions Légales</h1>
        <Separator className="mb-8" />
        
        <div className="prose max-w-3xl">
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Éditeur du site</h2>
            <p>Mariable SAS</p>
            <p>123 Rue du Mariage, 75001 Paris, France</p>
            <p>SIREN : 123456789</p>
            <p>Capital social : 10 000 €</p>
            <p>TVA Intracommunautaire : FR 12 345678901</p>
            <p>Téléphone : +33 1 23 45 67 89</p>
            <p>Email : contact@mariable.fr</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Directeur de la publication</h2>
            <p>Marie Dupont, Présidente</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Hébergement</h2>
            <p>Le site mariable.fr est hébergé par :</p>
            <p>OVH SAS</p>
            <p>2 rue Kellermann</p>
            <p>59100 Roubaix - France</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Propriété intellectuelle</h2>
            <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
            <p>La reproduction de tout ou partie de ce site sur un support électronique ou autre est formellement interdite sauf autorisation expresse de Mariable SAS.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Données personnelles</h2>
            <p>Mariable SAS s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.</p>
            <p>Pour toute information ou exercice de vos droits sur les traitements de données personnelles, vous pouvez contacter notre délégué à la protection des données (DPO) à l'adresse suivante : dpo@mariable.fr</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Cookies</h2>
            <p>Le site mariable.fr utilise des cookies pour améliorer l'expérience utilisateur. Pour en savoir plus sur la gestion des cookies, veuillez consulter notre politique relative aux cookies.</p>
          </section>
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
                <li><Link to="/contact" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Nous Contacter</Link></li>
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

export default MentionsLegales;


import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Mariable</h3>
            <p className="text-gray-300">
              Votre plateforme de planification de mariage personnalisée.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services/budget" className="text-gray-300 hover:text-white transition-colors">
                  Calculateur de budget
                </Link>
              </li>
              <li>
                <Link to="/services/prestataires" className="text-gray-300 hover:text-white transition-colors">
                  Recherche prestataires
                </Link>
              </li>
              <li>
                <Link to="/planning-personnalise" className="text-gray-300 hover:text-white transition-colors">
                  Planning personnalisé
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">À propos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about/histoire" className="text-gray-300 hover:text-white transition-colors">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link to="/about/approche" className="text-gray-300 hover:text-white transition-colors">
                  Notre approche
                </Link>
              </li>
              <li>
                <Link to="/about/temoignages" className="text-gray-300 hover:text-white transition-colors">
                  Témoignages
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact/nous-contacter" className="text-gray-300 hover:text-white transition-colors">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link to="/contact/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/professionnels" className="text-gray-300 hover:text-white transition-colors">
                  Espace professionnel
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link to="/mentions-legales" className="text-gray-300 hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link to="/cgv" className="text-gray-300 hover:text-white transition-colors">
                CGV
              </Link>
            </div>
            
            <div className="flex space-x-4 text-sm">
              <p className="text-gray-300">
                © 2024 Mariable. Tous droits réservés.
              </p>
              <div className="hidden md:block text-gray-500">|</div>
              <div className="flex space-x-4">
                <Link to="/admin/access" className="text-gray-400 hover:text-gray-300 transition-colors text-xs">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

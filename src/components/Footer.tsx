import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const Footer = () => {
  return <footer className="py-8 bg-white text-wedding-black" role="contentinfo" aria-label="Pied de page">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo et description à gauche */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link to="/admin/dashboard" className="w-10 h-10 bg-wedding-black rounded-full flex items-center justify-center hover:bg-wedding-black/80 transition-colors" aria-label="Administration">
                <span className="text-white font-serif text-lg">M</span>
              </Link>
            </div>
            <p className="mb-4 text-wedding-black/70 text-sm">
              Mariable est la référence des mariages modernes & élégants.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/mariable.fr/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-wedding-black hover:text-wedding-black/70 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          {/* Planifier mon mariage */}
          <div>
            <h3 className="font-serif text-base mb-3">Planifier mon mariage</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/dashboard" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mon tableau de bord</Link></li>
              <li><Link to="/checklist-mariage" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Check-list</Link></li>
              <li><Link to="/selection" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Trouver un prestataire</Link></li>
              <li><Link to="/professionnelsmariable" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Sélection</Link></li>
              <li><Link to="/mon-jour-m" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Coordination du jour J</Link></li>
              <li><Link to="/guide-jour-j" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Guide Jour-J</Link></li>
              <li><Link to="/guide-debutant" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Guide Débutant</Link></li>
              <li><Link to="/services/budget" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Calculateur de budget</Link></li>
            </ul>
          </div>

          {/* Découvrir */}
          <div>
            <h3 className="font-serif text-base mb-3">Découvrir</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/jeunes-maries" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Club Mariable</Link></li>
              <li><Link to="/conseilsmariage" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Conseils mariage</Link></li>
              <li><Link to="/outils-planning-mariage" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Planification</Link></li>
              <li><Link to="/coordination-jour-j" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Jour J</Link></li>
              <li><Link to="/guidepersonnalise" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Newsletter</Link></li>
            </ul>
          </div>

          {/* Mariages par région */}
          <div>
            <h3 className="font-serif text-base mb-3">Mariages par région</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/mariage-provence" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mariage Provence</Link></li>
              <li><Link to="/mariage-paris" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mariage Paris & Île-de-France</Link></li>
              <li><Link to="/mariage-auvergne-rhone-alpes" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mariage Auvergne-Rhône-Alpes</Link></li>
              <li><Link to="/mariage-nouvelle-aquitaine" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mariage Nouvelle-Aquitaine</Link></li>
              <li><Link to="/professionnelsmariable" className="text-wedding-black/70 hover:text-wedding-black transition-colors font-medium">Voir toutes les régions →</Link></li>
            </ul>
          </div>
          
          {/* À Propos */}
          <div>
            <h3 className="font-serif text-base mb-3">À Propos</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/about/histoire" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre histoire</Link></li>
              <li><Link to="/about/charte" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre charte</Link></li>
              <li><Link to="/contact" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Nous contacter</Link></li>
              <li><Link to="/contact/faq" className="text-wedding-black/70 hover:text-wedding-black transition-colors">FAQ</Link></li>
              <li><Link to="/comparatif" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Comparatif</Link></li>
              <li><Link to="/professionnels" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Professionnels</Link></li>
              <li><Link to="/partenariat" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Partenariat</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-wedding-black/70 mb-3 md:mb-0 text-center md:text-left">
            © 2025 Mariable – Tous droits réservés. | Conçu avec joie pour les couples modernes 💍
          </p>
          <div className="flex gap-4 text-xs">
            <Link to="/contact" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Nous contacter</Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
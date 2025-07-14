import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const Footer = () => {
  return (
    <footer className="py-8 bg-white text-wedding-black" role="contentinfo" aria-label="Pied de page">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          
          {/* Planifier mon mariage au centre */}
          <div>
            <h3 className="font-serif text-base mb-3">Planifier mon mariage</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/dashboard" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mon tableau de bord</Link></li>
              <li><Link to="/checklist-mariage" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Check-list</Link></li>
              
              <li><Link to="/selection" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Trouver un prestataire</Link></li>
              <li><Link to="/mon-jour-m" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Coordination du jour J</Link></li>
              <li><Link to="/services/budget" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Calculateur de budget</Link></li>
            </ul>
          </div>
          
          {/* À Propos à droite */}
          <div>
            <h3 className="font-serif text-base mb-3">À Propos</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/livre-blanc" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Livre blanc</Link></li>
              <li><Link to="/about/histoire" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Histoire</Link></li>
              <li><Link to="/about/approche" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Approche</Link></li>
              <li><Link to="/about/charte" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Charte</Link></li>
              <li><Link to="/contact" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Nous Contacter</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-wedding-black/70 mb-3 md:mb-0 text-center md:text-left">
            © 2025 Mariable – Tous droits réservés. | Conçu avec joie pour les couples modernes 💍
          </p>
          <div className="flex gap-4 text-xs">
            <Link to="/mentions-legales" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mentions Légales</Link>
            <Link to="/cgv" className="text-wedding-black/70 hover:text-wedding-black transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        setIsAdmin(!error && !!data);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user?.id) {
          checkAdminStatus();
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <footer className="py-8 bg-white text-wedding-black" role="contentinfo" aria-label="Pied de page">
      <div className="container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/lovable-uploads/c5ca128d-6c6f-4f09-a990-f6f16d47e231.png" alt="Mariable Logo" className="h-10 md:h-12 w-auto" />
            </div>
            <p className="mb-3 text-wedding-black/70 text-xs md:text-sm">
              Mariable est la référence des mariages modernes & élégants.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/mariable.fr/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-wedding-black hover:text-wedding-black/70 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <h3 className="font-serif text-base mb-2 md:mb-3">Planifier mon mariage</h3>
            <ul className="space-y-1 text-xs md:text-sm">
              <li><Link to="/dashboard" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mon tableau de bord</Link></li>
              <li><Link to="/checklist-mariage" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Check-list</Link></li>
              <li><Link to="/planning-personnalise" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Planning personnalisé</Link></li>
              <li><Link to="/pricing" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Tarifs</Link></li>
              <li><Link to="/selection" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Trouver un prestataire</Link></li>
              <li><Link to="/register" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Coordination du jour J</Link></li>
              <li><Link to="/services/budget" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Calculateur de budget</Link></li>
            </ul>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <h3 className="font-serif text-base mb-2 md:mb-3">À Propos</h3>
            <ul className="space-y-1 text-xs md:text-sm">
              <li><Link to="/about/histoire" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Histoire</Link></li>
              <li><Link to="/about/approche" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Approche</Link></li>
              <li><Link to="/about/charte" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Charte</Link></li>
              <li><Link to="/contact/nous-contacter" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Nous Contacter</Link></li>
            </ul>
          </div>
          
          <div className="mt-4 lg:mt-0">
            <h3 className="font-serif text-base mb-2 md:mb-3">Contact</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-wedding-black shrink-0" />
                <a href="mailto:mathilde@mariable.fr" className="text-wedding-black/70 hover:text-wedding-black transition-colors">
                  mathilde@mariable.fr
                </a>
              </li>
              <li>
                <Link to="/professionnels" className="text-wedding-black/70 hover:text-wedding-black transition-colors">
                  Espace Pro (accès dédié aux prestataires)
                </Link>
              </li>
              {isAdmin && (
                <li className="pt-2 border-t border-wedding-black/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 text-wedding-olive" />
                    <span className="font-medium text-wedding-olive">Administration</span>
                  </div>
                  <ul className="space-y-1 ml-6">
                    <li><Link to="/admin/blog" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Gestion Blog</Link></li>
                    <li><Link to="/admin/prestataires" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Gestion Prestataires</Link></li>
                    <li><Link to="/admin/form" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Gestion Formulaires</Link></li>
                    <li><Link to="/admin/reservations-jour-m" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Réservations Jour-M</Link></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 md:mt-8 pt-4 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
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

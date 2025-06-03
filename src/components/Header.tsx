
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeaderDropdown,
  HeaderDropdownMenu,
  HeaderDropdownItem,
} from "./HeaderDropdown";
import { User2, Menu as MenuIcon, LogIn } from "lucide-react";
import { Drawer, DrawerContent } from "./ui/drawer";
import { useIsMobile } from "../hooks/use-mobile";
import { supabase } from '@/integrations/supabase/client';

// Nouveau logo joint
const LOGO_URL = "/lovable-uploads/a13321ac-adeb-489a-911e-3a88b1411ac2.png";

const HeaderLogo = () => (
  <Link to="/" className="flex items-center justify-center shrink-0 mr-2 md:mr-8">
    <img
      src={LOGO_URL}
      alt="Mariable Logo"
      className="h-14 w-14 md:h-24 md:w-24 object-contain"
      draggable={false}
      loading="eager"
      style={{ minWidth: '3.5rem', minHeight: '3.5rem' }}
    />
  </Link>
);

function Menus({ onClick, isLoggedIn }: { onClick?: () => void, isLoggedIn?: boolean }) {
  return (
    <>
      {/* Show this menu only when user is not logged in */}
      {!isLoggedIn && (
        <>
          {/* Futurs mariés - En premier */}
          <HeaderDropdown
            label="Futurs mariés"
            href="/dashboard"
            onClick={onClick}
          />
          
          {/* Professionnels - En second */}
          <HeaderDropdown 
            label="Professionnels"
            href="/professionnels"
            onClick={onClick}
          />
        </>
      )}

      {/* Show this menu when user is logged in */}
      {isLoggedIn && (
        <HeaderDropdown
          label="Mon compte"
          href="/dashboard"
          onClick={onClick}
        />
      )}
      
      {/* À propos Dropdown - Sans témoignages, en dernier */}
      <HeaderDropdown label="À propos">
        <HeaderDropdownMenu>
          <HeaderDropdownItem
            label="Notre histoire"
            description="Découvrez comment Mariable est né d'une passion"
            to="/about/histoire"
            onClick={onClick}
          />
          <HeaderDropdownItem
            label="Notre charte"
            description="Une méthode innovante et personnalisée pour organiser votre mariage"
            to="/about/charte"
            onClick={onClick}
          />
          <HeaderDropdownItem
            label="Nous contacter"
            description="Discutez avec notre équipe pour toutes vos questions"
            to="/contact/nous-contacter"
            onClick={onClick}
          />
          <HeaderDropdownItem
            label="FAQ"
            description="Réponses aux questions fréquemment posées"
            to="/contact/faq"
            onClick={onClick}
          />
        </HeaderDropdownMenu>
      </HeaderDropdown>
    </>
  );
}

export default function Header() {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    checkAuth();

    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="bg-white w-full border-b shadow-none z-30 sticky top-0">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-16 md:h-28">
        {/* Logo à gauche */}
        <HeaderLogo />

        {/* Desktop: Menus à droite, centrés */}
        <nav className="hidden md:flex flex-1 justify-end items-center gap-4 md:gap-6">
          <Menus isLoggedIn={isLoggedIn} />
          
          {/* Bouton de connexion explicite pour les utilisateurs non connectés */}
          {!isLoggedIn && (
            <Link 
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-wedding-olive hover:bg-wedding-olive/10 rounded-md transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Se connecter</span>
            </Link>
          )}
        </nav>

        {/* Mobile: Burger menu à droite */}
        <div className="md:hidden flex flex-1 justify-end items-center">
          <button
            aria-label="Menu"
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-md hover:bg-wedding-light transition"
          >
            <MenuIcon className="w-8 h-8" />
          </button>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            {/* Custom DrawerContent to appear from the top instead of bottom */}
            <DrawerContent
              className="!top-0 !bottom-auto max-h-[92vh] w-full left-0 right-0 rounded-t-none rounded-b-lg">
              <div className="flex items-center justify-between px-4 pt-4">
                {/* Logo again for mobile menu */}
                <HeaderLogo />
                <button
                  aria-label="Fermer le menu"
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-md hover:bg-wedding-light transition"
                >
                  <MenuIcon className="w-8 h-8 rotate-90" />
                </button>
              </div>
              <div className="py-3 grid gap-4">
                <nav className="flex flex-col gap-1">
                  <Menus onClick={() => setDrawerOpen(false)} isLoggedIn={isLoggedIn} />
                  
                  {/* Bouton de connexion dans le menu mobile */}
                  {!isLoggedIn && (
                    <Link 
                      to="/login"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-wedding-olive hover:bg-wedding-olive/10 rounded-md transition-colors mx-2"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Se connecter</span>
                    </Link>
                  )}
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

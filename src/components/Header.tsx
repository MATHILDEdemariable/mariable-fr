
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeaderDropdown,
  HeaderDropdownMenu,
  HeaderDropdownItem,
} from "./HeaderDropdown";
import { User2, Menu as MenuIcon } from "lucide-react";
import { Drawer, DrawerContent } from "./ui/drawer";
import { useIsMobile } from "../hooks/use-mobile";
import { supabase } from '@/integrations/supabase/client';

// Logo
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
      {/* Menu principal - Label conditionnel selon l'état de connexion */}
      <HeaderDropdown label={isLoggedIn ? "Mon compte" : "Futurs mariés"}>
        <HeaderDropdownMenu>
          {isLoggedIn ? (
            <>
              <HeaderDropdownItem
                label="Mon tableau de bord"
                description="Accéder à votre espace personnel"
                to="/dashboard"
                onClick={onClick}
              />
              <HeaderDropdownItem
                label="Mon Jour-J"
                description="Coordonnez tous les détails de votre mariage"
                to="/mon-jour-m"
                onClick={onClick}
              />
            </>
          ) : (
            <>
              <HeaderDropdownItem
                label="Créer un compte"
                description="Rejoindre Mariable et organiser votre mariage"
                to="/register"
                onClick={onClick}
              />
              <HeaderDropdownItem
                label="Se connecter"
                description="Accéder à votre compte existant"
                to="/login"
                onClick={onClick}
              />
            </>
          )}
        </HeaderDropdownMenu>
      </HeaderDropdown>
      
      {/* Jeunes Mariés - En second */}
      <HeaderDropdown 
        label="Jeunes Mariés"
        href="/jeunes-maries"
        onClick={onClick}
      />

      {/* Conseils mariage - Anciennement Blog */}
      <HeaderDropdown 
        label="Conseils mariage"
        href="/blog"
        onClick={onClick}
      />

      {/* Professionnels - En quatrième */}
      <HeaderDropdown 
        label="Professionnels"
        href="/professionnels"
        onClick={onClick}
      />
      
      {/* À propos Dropdown - En dernier */}
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
            to="/contact"
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
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

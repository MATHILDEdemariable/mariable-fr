
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderDropdown from "./HeaderDropdown";
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

function Menus({ onClick, isLoggedIn, userEmail }: { onClick?: () => void, isLoggedIn?: boolean, userEmail?: string }) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4 md:gap-6">
        {/* Navigation simple pour utilisateurs connectés */}
        <Link to="/dashboard" className="text-gray-700 hover:text-wedding-olive transition-colors">
          Dashboard
        </Link>
        <Link to="/blog" className="text-gray-700 hover:text-wedding-olive transition-colors">
          Blog
        </Link>
        <Link to="/professionnels" className="text-gray-700 hover:text-wedding-olive transition-colors">
          Professionnels
        </Link>
        <HeaderDropdown userEmail={userEmail} />
      </div>
    );
  }

  return (
    <>
      {/* Navigation pour utilisateurs non connectés */}
      <Link to="/register" className="text-gray-700 hover:text-wedding-olive transition-colors" onClick={onClick}>
        Futurs mariés
      </Link>
      <Link to="/professionnels" className="text-gray-700 hover:text-wedding-olive transition-colors" onClick={onClick}>
        Professionnels
      </Link>
      <Link to="/blog" className="text-gray-700 hover:text-wedding-olive transition-colors" onClick={onClick}>
        Blog
      </Link>
      <Link to="/contact/nous-contacter" className="text-gray-700 hover:text-wedding-olive transition-colors" onClick={onClick}>
        Contact
      </Link>
    </>
  );
}

export default function Header() {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      setUserEmail(data.session?.user?.email);
    };

    checkAuth();

    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
        setUserEmail(session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserEmail(undefined);
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
          <Menus isLoggedIn={isLoggedIn} userEmail={userEmail} />
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
                  <Menus onClick={() => setDrawerOpen(false)} isLoggedIn={isLoggedIn} userEmail={userEmail} />
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

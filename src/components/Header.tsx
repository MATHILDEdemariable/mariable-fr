
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeaderDropdown,
  HeaderDropdownMenu,
  HeaderDropdownItem,
} from "./HeaderDropdown";
import { User2, Menu as MenuIcon } from "lucide-react";
import { Drawer, DrawerContent } from "./ui/drawer";
import { useIsMobile } from "../hooks/use-mobile";

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

function Menus({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {/* Nos Services Dropdown - Updated order as requested */}
      <Link to="/recherche" className="pl-4 flex items-center gap-2">
        <span className="font-medium">Trouver vos prestataires</span>
      </Link>
      <HeaderDropdown label="Simplifier votre organisation" >
        <HeaderDropdownMenu>
          <HeaderDropdownItem
            label="Conseils personnalisés"
            description="Obtenez des recommandations adaptées à votre style et vos envies"
            to="/services/conseils"
            onClick={onClick}
          />
          <HeaderDropdownItem
            label="Planification"
            description="Organisez chaque étape de votre mariage sans stress"
            to="/services/planification"
            onClick={onClick}
          />
          <HeaderDropdownItem
            label="Budgétisation"
            description="Gérez votre budget et suivez vos dépenses facilement"
            to="/services/budget"
            onClick={onClick}
          />
        </HeaderDropdownMenu>
      </HeaderDropdown>

      {/* À propos Dropdown */}
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
            label="Témoignages"
            description="Ce que nos clients disent de nous"
            to="/about/temoignages"
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

      {/* User Menu */}
      <HeaderDropdown
        label={<User2 className="w-7 h-7" />}
        className="ml-2"
      >
        <HeaderDropdownMenu>
          <HeaderDropdownItem
            label="Professionnels"
            to="/professionnels"
            onClick={onClick}
          />
          <HeaderDropdownItem
            label="Futurs mariés"
            to="/register"
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

  return (
    <header className="bg-white w-full border-b shadow-none z-30 sticky top-0">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-16 md:h-28">
        {/* Logo à gauche */}
        <HeaderLogo />

        {/* Desktop: Menus à droite, centrés */}
        <nav className="hidden md:flex flex-1 justify-end items-center gap-4 md:gap-6">
          <Menus />
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
                  <MenuIcon className="w-8 h-8 rotate-90" /> {/* Optionally use an 'X' icon */}
                </button>
              </div>
              <div className="py-3 grid gap-4">
                <nav className="flex flex-col gap-1">
                  <Menus onClick={() => setDrawerOpen(false)} />
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeaderDropdown,
  HeaderDropdownMenu,
  HeaderDropdownItem,
} from "./HeaderDropdown";
import { User2 } from "lucide-react";

const HeaderLogo = () => (
  <Link to="/" className="flex items-center justify-center shrink-0 mr-2 md:mr-8">
    <img
      src="/lovable-uploads/08e3c50f-4f4b-49ad-8e52-3f1eeacb6bd0.png"
      alt="Mariable Logo"
      className="h-16 w-16 md:h-24 md:w-24 object-contain"
      draggable={false}
      loading="eager"
      style={{ minWidth: '4rem', minHeight: '4rem' }}
    />
  </Link>
);

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white w-full border-b shadow-none z-30 sticky top-0">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-20 md:h-28">
        {/* Logo à gauche */}
        <HeaderLogo />

        {/* Menu principal, à droite et centré verticalement */}
        <nav className="hidden md:flex flex-1 justify-end items-center gap-4 md:gap-6">
          {/* Nos Services Dropdown */}
          <HeaderDropdown label="Nos Services">
            <HeaderDropdownMenu>
              <HeaderDropdownItem
                label="Recherche de prestataires"
                description="Trouvez les meilleurs prestataires adaptés à vos besoins"
                to="/services/prestataires"
              />
              <HeaderDropdownItem
                label="Planification"
                description="Organisez chaque étape de votre mariage sans stress"
                to="/services/planification"
              />
              <HeaderDropdownItem
                label="Budgétisation"
                description="Gérez votre budget et suivez vos dépenses facilement"
                to="/services/budget"
              />
              <HeaderDropdownItem
                label="Conseils personnalisés"
                description="Obtenez des recommandations adaptées à votre style et vos envies"
                to="/services/conseils"
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
              />
              <HeaderDropdownItem
                label="Notre charte"
                description="Une méthode innovante et personnalisée pour organiser votre mariage"
                to="/about/charte"
              />
              <HeaderDropdownItem
                label="Témoignages"
                description="Ce que nos clients disent de nous"
                to="/about/temoignages"
              />
            </HeaderDropdownMenu>
          </HeaderDropdown>

          {/* Contact Dropdown */}
          <HeaderDropdown label="Contact">
            <HeaderDropdownMenu>
              <HeaderDropdownItem
                label="Nous contacter"
                description="Discutez avec notre équipe pour toutes vos questions"
                to="/contact/nous-contacter"
              />
              <HeaderDropdownItem
                label="FAQ"
                description="Réponses aux questions fréquemment posées"
                to="/contact/faq"
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
              />
              <HeaderDropdownItem
                label="Futurs mariés"
                to="/"
              />
            </HeaderDropdownMenu>
          </HeaderDropdown>
        </nav>

        {/* Hamburger menu pour mobile */}
        <div className="md:hidden flex-1 flex justify-end items-center">
          {/* Place a future mobile menu here if needed */}
        </div>
      </div>
    </header>
  );
}

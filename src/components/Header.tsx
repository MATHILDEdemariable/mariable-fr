
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeaderDropdown, HeaderDropdownMenu, HeaderDropdownItem } from "./HeaderDropdown";
import { User2 } from "lucide-react";

// New, bigger logo for header
const HeaderLogo = () => (
  <Link to="/" className="flex items-center justify-center">
    <img
      src="/lovable-uploads/cb5c64ba-4141-40cc-9954-ab1a0f30d7ef.png"
      alt="Mariable Logo"
      className="h-24 w-24 object-contain mx-8 my-3"
      draggable={false}
      loading="eager"
    />
  </Link>
);

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white w-full border-b shadow-none">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-8">
        {/* Logo à gauche */}
        <HeaderLogo />

        {/* Menu principal centré */}
        <nav className="flex-1 flex justify-center items-center gap-3">
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
        </nav>

        {/* User Menu à droite */}
        <div className="flex items-center">
          <HeaderDropdown
            label={
              <span>
                <User2 className="w-7 h-7" />
                <span className="sr-only">Compte utilisateur</span>
              </span>
            }
            className="ml-6"
          >
            <HeaderDropdownMenu>
              <Link
                to="/professionnels"
                className="block px-5 py-2 text-base hover:bg-wedding-cream rounded"
              >
                Professionnels
              </Link>
              <Link
                to="/"
                className="block px-5 py-2 text-base hover:bg-wedding-cream rounded"
              >
                Futurs mariés
              </Link>
            </HeaderDropdownMenu>
          </HeaderDropdown>
        </div>
      </div>
    </header>
  );
}

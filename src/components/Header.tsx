
import React from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-serif font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Header = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="py-4 bg-wedding-black border-b border-white/10 sticky top-0 z-10">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-24 w-auto" />
          </Link>
          
          {isMobile ? (
            <div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2"
              >
                <Menu size={24} />
              </button>
              
              {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-wedding-black p-4 border-b border-white/10">
                  <nav className="flex flex-col space-y-4">
                    <Link to="/services/prestataires" className="text-white hover:text-wedding-cream p-2" onClick={() => setMobileMenuOpen(false)}>
                      Nos Services
                    </Link>
                    <Link to="/about/histoire" className="text-white hover:text-wedding-cream p-2" onClick={() => setMobileMenuOpen(false)}>
                      À propos
                    </Link>
                    <Link to="/contact/nous-contacter" className="text-white hover:text-wedding-cream p-2" onClick={() => setMobileMenuOpen(false)}>
                      Contact
                    </Link>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-wedding-black/80 text-white">Nos Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem href="/services/prestataires" title="Recherche de prestataires">
                        Trouvez les meilleurs prestataires adaptés à vos besoins
                      </ListItem>
                      <ListItem href="/services/planification" title="Planification">
                        Organisez chaque étape de votre mariage sans stress
                      </ListItem>
                      <ListItem href="/services/budget" title="Budgétisation">
                        Gérez votre budget et suivez vos dépenses facilement
                      </ListItem>
                      <ListItem href="/services/conseils" title="Conseils personnalisés">
                        Obtenez des recommandations adaptées à votre style et vos envies
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-wedding-black/80 text-white">À propos</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <ListItem href="/about/histoire" title="Notre histoire">
                        Découvrez comment Mariable est né d'une passion
                      </ListItem>
                      <ListItem href="/about/approche" title="Notre approche">
                        Une méthode innovante et personnalisée pour organiser votre mariage
                      </ListItem>
                      <ListItem href="/about/temoignages" title="Témoignages">
                        Ce que nos clients disent de nous
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-wedding-black/80 text-white">Contact</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <ListItem href="/contact/nous-contacter" title="Nous contacter">
                        Discutez avec notre équipe pour toutes vos questions
                      </ListItem>
                      <ListItem href="/contact/rendez-vous" title="Prendre rendez-vous">
                        Réservez une consultation personnalisée
                      </ListItem>
                      <ListItem href="/contact/faq" title="FAQ">
                        Réponses aux questions fréquemment posées
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

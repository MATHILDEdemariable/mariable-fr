import React, { useState, useEffect } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Users, UserRound } from 'lucide-react';

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      "py-2 md:py-4 bg-white/95 backdrop-blur-sm border-b border-wedding-black/10 sticky top-0 z-20 transition-all duration-300",
      isScrolled ? "shadow-md" : ""
    )}>
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="px-2">
              <img 
                src="/lovable-uploads/c5ca128d-6c6f-4f09-a990-f6f16d47e231.png" 
                alt="Mariable Logo" 
                className="h-16 md:h-20 lg:h-24 w-auto object-contain" 
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://leguidemariable.softr.app/connexion" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-wedding-black/20 shadow-sm hover:shadow transition-all"
            >
              <UserRound size={20} className="text-wedding-black" />
              <span className="hidden md:inline text-sm font-medium">Connexion</span>
            </a>
            
            {isMobile ? (
              <div className="relative">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-wedding-black p-2 rounded-md hover:bg-wedding-cream/50 transition-colors"
                  aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                  {mobileMenuOpen ? (
                    <X size={24} />
                  ) : (
                    <Menu size={24} />
                  )}
                </button>
                
                {mobileMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-screen max-w-xs bg-white p-4 rounded-lg shadow-lg border border-wedding-black/10 animate-fade-in">
                    <nav className="flex flex-col space-y-3">
                      <div className="border-b pb-2 mb-2">
                        <h3 className="font-serif text-lg mb-2">Nos Services</h3>
                        <div className="pl-2 space-y-2">
                          <Link to="/services/prestataires" className="block text-wedding-black hover:text-wedding-olive transition-colors py-1" onClick={closeMobileMenu}>
                            Recherche de prestataires
                          </Link>
                          <Link to="/services/planification" className="block text-wedding-black hover:text-wedding-olive transition-colors py-1" onClick={closeMobileMenu}>
                            Planification
                          </Link>
                          <Link to="/services/budget" className="block text-wedding-black hover:text-wedding-olive transition-colors py-1" onClick={closeMobileMenu}>
                            Budgétisation
                          </Link>
                          <Link to="/services/conseils" className="block text-wedding-black hover:text-wedding-olive transition-colors py-1" onClick={closeMobileMenu}>
                            Conseils personnalisés
                          </Link>
                        </div>
                      </div>
                      
                      <div className="border-b pb-2 mb-2">
                        <h3 className="font-serif text-lg mb-2">À propos</h3>
                        <div className="pl-2 space-y-2">
                          <Link to="/about/histoire" className="block text-wedding-black hover:text-wedding-olive transition-colors py-1" onClick={closeMobileMenu}>
                            Notre histoire
                          </Link>
                          <Link to="/about/charte" className="block text-wedding-black hover:text-wedding-olive transition-colors py-1" onClick={closeMobileMenu}>
                            Notre charte
                          </Link>
                          <Link to="/about/temoignages" className="block text-wedding-black hover:text-wedding-olive transition-colors py-1" onClick={closeMobileMenu}>
                            Témoignages
                          </Link>
                        </div>
                      </div>
                      
                      <div className="border-b pb-2 mb-2">
                        <h3 className="font-serif text-lg mb-2">Contact</h3>
                        <div className="pl-2 space-y-2">
                          <Link to="/contact/nous-contacter" className="block text-wedding-black hover:text-wedding-olive transition-colors py-1" onClick={closeMobileMenu}>
                            Nous contacter
                          </Link>
                          <Link to="/contact/faq" className="block text-wedding-black hover:text-wedding-olive transition-colors py-1" onClick={closeMobileMenu}>
                            FAQ
                          </Link>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-serif text-lg mb-2">Professionnels</h3>
                        <div className="pl-2 space-y-2">
                          <Link to="/professionnels" className="block text-wedding-black hover:text-wedding-olive transition-colors py-1" onClick={closeMobileMenu}>
                            Devenir partenaire
                          </Link>
                        </div>
                      </div>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-wedding-cream text-wedding-black">Nos Services</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
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
                    <NavigationMenuTrigger className="bg-transparent hover:bg-wedding-cream text-wedding-black">À propos</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <ListItem href="/about/histoire" title="Notre histoire">
                          Découvrez comment Mariable est né d'une passion
                        </ListItem>
                        <ListItem href="/about/charte" title="Notre charte">
                          Une méthode innovante et personnalisée pour organiser votre mariage
                        </ListItem>
                        <ListItem href="/about/temoignages" title="Témoignages">
                          Ce que nos clients disent de nous
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-wedding-cream text-wedding-black">Contact</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <ListItem href="/contact/nous-contacter" title="Nous contacter">
                          Discutez avec notre équipe pour toutes vos questions
                        </ListItem>
                        <ListItem href="/contact/faq" title="FAQ">
                          Réponses aux questions fréquemment posées
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link to="/professionnels" className="inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-wedding-cream text-wedding-black">
                      <Users size={16} className="mr-1" />
                      Professionnels
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

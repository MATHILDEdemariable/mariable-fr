
import React, { useState, useEffect } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Users, UserRound, Home, Phone, Info } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

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
            {isMobile ? (
              <div className="relative flex items-center">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <button 
                      className="text-wedding-black p-2 rounded-md hover:bg-wedding-cream/50 transition-colors"
                      aria-label="Menu principal"
                    >
                      <Menu size={24} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="overflow-y-auto">
                    <div className="flex flex-col py-4 space-y-6">
                      <Link to="/" className="flex items-center gap-2 px-2 py-2 text-wedding-black hover:bg-wedding-cream/50 rounded-md" onClick={() => setSheetOpen(false)}>
                        <Home size={20} />
                        <span className="text-base font-medium">Accueil</span>
                      </Link>
                      
                      <div className="space-y-2 border-t pt-4">
                        <h3 className="px-2 font-serif text-base font-medium">Nos Services</h3>
                        <div className="pl-2 space-y-1">
                          <Link to="/services/prestataires" className="block w-full text-sm text-wedding-black hover:text-wedding-olive transition-colors py-2 px-4" onClick={() => setSheetOpen(false)}>
                            Recherche de prestataires
                          </Link>
                          <Link to="/services/planification" className="block w-full text-sm text-wedding-black hover:text-wedding-olive transition-colors py-2 px-4" onClick={() => setSheetOpen(false)}>
                            Planification
                          </Link>
                          <Link to="/services/budget" className="block w-full text-sm text-wedding-black hover:text-wedding-olive transition-colors py-2 px-4" onClick={() => setSheetOpen(false)}>
                            Budgétisation
                          </Link>
                          <Link to="/services/conseils" className="block w-full text-sm text-wedding-black hover:text-wedding-olive transition-colors py-2 px-4" onClick={() => setSheetOpen(false)}>
                            Conseils personnalisés
                          </Link>
                        </div>
                      </div>
                      
                      <div className="space-y-2 border-t pt-4">
                        <h3 className="px-2 font-serif text-base font-medium">À propos</h3>
                        <div className="pl-2 space-y-1">
                          <Link to="/about/histoire" className="block w-full text-sm text-wedding-black hover:text-wedding-olive transition-colors py-2 px-4" onClick={() => setSheetOpen(false)}>
                            Notre histoire
                          </Link>
                          <Link to="/about/charte" className="block w-full text-sm text-wedding-black hover:text-wedding-olive transition-colors py-2 px-4" onClick={() => setSheetOpen(false)}>
                            Notre charte
                          </Link>
                          <Link to="/about/temoignages" className="block w-full text-sm text-wedding-black hover:text-wedding-olive transition-colors py-2 px-4" onClick={() => setSheetOpen(false)}>
                            Témoignages
                          </Link>
                          <Link to="/about/approche" className="block w-full text-sm text-wedding-black hover:text-wedding-olive transition-colors py-2 px-4" onClick={() => setSheetOpen(false)}>
                            Notre approche
                          </Link>
                        </div>
                      </div>
                      
                      <div className="space-y-2 border-t pt-4">
                        <h3 className="px-2 font-serif text-base font-medium">Contact</h3>
                        <div className="pl-2 space-y-1">
                          <Link to="/contact/nous-contacter" className="block w-full text-sm text-wedding-black hover:text-wedding-olive transition-colors py-2 px-4" onClick={() => setSheetOpen(false)}>
                            Nous contacter
                          </Link>
                          <Link to="/contact/faq" className="block w-full text-sm text-wedding-black hover:text-wedding-olive transition-colors py-2 px-4" onClick={() => setSheetOpen(false)}>
                            FAQ
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-2 border-t pt-4">
                        <Link to="/professionnels" className="flex items-center gap-2 px-2 py-2 text-wedding-black hover:bg-wedding-cream/50 rounded-md" onClick={() => setSheetOpen(false)}>
                          <Users size={20} />
                          <span className="text-base font-medium">Professionnels</span>
                        </Link>
                        
                        <a 
                          href="https://leguidemariable.softr.app/connexion" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 m-2 px-4 py-2 bg-wedding-olive text-white rounded-md hover:bg-wedding-olive/90 transition-all"
                          onClick={() => setSheetOpen(false)}
                        >
                          <UserRound size={20} />
                          <span className="text-base font-medium">Connexion</span>
                        </a>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            ) : (
              <>
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
                
                <a 
                  href="https://leguidemariable.softr.app/connexion" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-wedding-black/20 shadow-sm hover:shadow transition-all"
                >
                  <UserRound size={20} className="text-wedding-black" />
                  <span className="text-sm font-medium">Connexion</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

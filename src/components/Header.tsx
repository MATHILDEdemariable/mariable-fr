
import React from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';

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
  return (
    <header className="py-4 bg-wedding-cream/95 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/lovable-uploads/d212cd91-6c48-4581-b66d-302d10e17ad9.png" alt="Mariable Logo" className="h-14 w-auto" />
            <div>
              <h1 className="text-2xl font-serif text-wedding-black">Mariable</h1>
              <p className="text-sm text-wedding-black/70 font-light">La révolution de l'organisation de mariage</p>
            </div>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-wedding-cream/80 text-wedding-black">Nos Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="#features" title="Recherche de prestataires">
                      Trouvez les meilleurs prestataires adaptés à vos besoins
                    </ListItem>
                    <ListItem href="#features" title="Planification">
                      Organisez chaque étape de votre mariage sans stress
                    </ListItem>
                    <ListItem href="#features" title="Budgétisation">
                      Gérez votre budget et suivez vos dépenses facilement
                    </ListItem>
                    <ListItem href="#features" title="Conseils personnalisés">
                      Obtenez des recommandations adaptées à votre style et vos envies
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-wedding-cream/80 text-wedding-black">À propos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <ListItem href="#about" title="Notre histoire">
                      Découvrez comment Mariable est né d'une passion
                    </ListItem>
                    <ListItem href="#about" title="Notre approche">
                      Une méthode innovante et personnalisée pour organiser votre mariage
                    </ListItem>
                    <ListItem href="#about" title="Témoignages">
                      Ce que nos clients disent de nous
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-wedding-cream/80 text-wedding-black">Contact</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <ListItem href="#contact" title="Nous contacter">
                      Discutez avec notre équipe pour toutes vos questions
                    </ListItem>
                    <ListItem href="#contact" title="Prendre rendez-vous">
                      Réservez une consultation personnalisée
                    </ListItem>
                    <ListItem href="#contact" title="FAQ">
                      Réponses aux questions fréquemment posées
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;

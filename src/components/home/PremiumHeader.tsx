import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HeaderDropdown, HeaderDropdownMenu, HeaderDropdownItem } from '@/components/HeaderDropdown';
import { supabase } from '@/integrations/supabase/client';

const PremiumHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'état de connexion au chargement
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleGetStarted = () => {
    navigate('/auth?mode=register');
  };

  // Navigation Links pour Desktop
  const NavLinks = () => (
    <nav className="hidden md:flex items-center space-x-2">
      <HeaderDropdown label="Inspiration">
        <HeaderDropdownMenu>
          <HeaderDropdownItem
            label="Inspirations de mariages"
            description="Découvrez des idées et tendances pour votre jour J"
            to="/inspirations"
          />
          <HeaderDropdownItem
            label="Témoignages"
            description="L'expérience de couples qui nous ont fait confiance"
            to="/temoignages"
          />
          <HeaderDropdownItem
            label="Blog"
            description="Conseils et actualités du mariage"
            to="/blog"
          />
        </HeaderDropdownMenu>
      </HeaderDropdown>

      <HeaderDropdown href="/selection" label="Prestataires" />
      <HeaderDropdown href="/planification" label="Planification" />
      <HeaderDropdown href="/jour-m" label="Jour M" />

      <HeaderDropdown label="À propos">
        <HeaderDropdownMenu>
          <HeaderDropdownItem
            label="Notre Histoire"
            description="Découvrez l'équipe et la mission de Mariable"
            to="/about"
          />
          <HeaderDropdownItem
            label="Notre Charte"
            description="Nos engagements et valeurs"
            to="/about/charte"
          />
          <HeaderDropdownItem
            label="Contact"
            description="Une question ? Contactez-nous"
            to="/contact"
          />
        </HeaderDropdownMenu>
      </HeaderDropdown>
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container px-4 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <NavLinks />

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoggedIn ? (
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-premium-sage hover:bg-premium-sage-dark text-white px-6"
            >
              Tableau de bord
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="text-premium-charcoal hover:text-premium-sage"
              >
                Se connecter
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-premium-sage hover:bg-premium-sage-dark text-white px-6"
              >
                Commencer
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/inspirations" className="text-lg font-medium">
                  Inspirations
                </Link>
                <Link to="/selection" className="text-lg font-medium">
                  Prestataires
                </Link>
                <Link to="/planification" className="text-lg font-medium">
                  Planification
                </Link>
                <Link to="/jour-m" className="text-lg font-medium">
                  Jour M
                </Link>
                <Link to="/about" className="text-lg font-medium">
                  À propos
                </Link>
                <Link to="/contact" className="text-lg font-medium">
                  Contact
                </Link>

                <div className="pt-4 border-t space-y-3">
                  {isLoggedIn ? (
                    <Button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-premium-sage hover:bg-premium-sage-dark text-white"
                    >
                      Tableau de bord
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleLogin}
                        className="w-full"
                      >
                        Se connecter
                      </Button>
                      <Button
                        onClick={handleGetStarted}
                        className="w-full bg-premium-sage hover:bg-premium-sage-dark text-white"
                      >
                        Commencer
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PremiumHeader;
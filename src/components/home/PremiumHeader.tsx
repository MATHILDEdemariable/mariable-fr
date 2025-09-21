import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HeaderDropdown, HeaderDropdownMenu, HeaderDropdownItem } from '@/components/HeaderDropdown';
import { supabase } from '@/integrations/supabase/client';

const PremiumHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  const NavLinks = () => (
    <>
      <HeaderDropdown label="Inspiration">
        <HeaderDropdownMenu>
          <HeaderDropdownItem 
            label="Club Mariable" 
            description="Communauté des jeunes mariés"
            to="/jeunes-maries" 
          />
          <HeaderDropdownItem 
            label="Conseils" 
            description="Inspiration et tendances mariage"
            to="/blog" 
          />
        </HeaderDropdownMenu>
      </HeaderDropdown>
      
      <Link to="/selection" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        Prestataires
      </Link>
      <Link to="/outils-planning-mariage" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        Planification
      </Link>
      <Link to="/coordination-jour-j" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        Jour J
      </Link>
      
      <HeaderDropdown label="À propos">
        <HeaderDropdownMenu>
          <HeaderDropdownItem 
            label="Notre histoire" 
            description="L'histoire de Mariable"
            to="/about/histoire" 
          />
          <HeaderDropdownItem 
            label="Notre charte" 
            description="Nos valeurs et engagements"
            to="/about/charte" 
          />
          <HeaderDropdownItem 
            label="Prix" 
            description="Tarifs et formules"
            to="/prix" 
          />
          <HeaderDropdownItem 
            label="Nous contacter" 
            description="Entrer en contact"
            to="/contact" 
          />
          <HeaderDropdownItem 
            label="FAQ" 
            description="Questions fréquentes"
            to="/contact/faq" 
          />
        </HeaderDropdownMenu>
      </HeaderDropdown>
    </>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-22">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <Button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-white ripple"
              >
                Tableau de bord
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleLogin}
                  className="btn-secondary border-premium-sage/30 text-premium-sage hover:bg-premium-sage/5 ripple"
                >
                  Se connecter
                </Button>
                <Button
                  onClick={handleGetStarted}
                  className="btn-primary text-white ripple"
                >
                  Commencer
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white">
              <div className="flex flex-col space-y-6 mt-8">
                <Link 
                  to="/" 
                  className="flex items-center mb-6"
                  onClick={() => setMobileOpen(false)}
                >
                  <Logo />
                </Link>
                
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/selection" 
                    className="text-premium-charcoal hover:text-premium-black transition-colors font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Prestataires
                  </Link>
                  <Link 
                    to="/outils-planning-mariage" 
                    className="text-premium-charcoal hover:text-premium-black transition-colors font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Planification
                  </Link>
                  <Link 
                    to="/coordination-jour-j" 
                    className="text-premium-charcoal hover:text-premium-black transition-colors font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Jour J
                  </Link>
                  
                  {/* Inspiration Submenu */}
                  <div className="py-2">
                    <p className="font-semibold text-premium-black mb-2">Inspiration</p>
                    <div className="ml-4 space-y-2">
                      <Link 
                        to="/jeunes-maries" 
                        className="block text-premium-charcoal hover:text-premium-black transition-colors py-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        Club Mariable
                      </Link>
                      <Link 
                        to="/blog" 
                        className="block text-premium-charcoal hover:text-premium-black transition-colors py-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        Conseils
                      </Link>
                    </div>
                  </div>
                  
                  {/* À propos Submenu */}
                  <div className="py-2">
                    <p className="font-semibold text-premium-black mb-2">À propos</p>
                    <div className="ml-4 space-y-2">
                      <Link 
                        to="/about/histoire" 
                        className="block text-premium-charcoal hover:text-premium-black transition-colors py-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        Notre histoire
                      </Link>
                      <Link 
                        to="/about/charte" 
                        className="block text-premium-charcoal hover:text-premium-black transition-colors py-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        Notre charte
                      </Link>
                      <Link 
                        to="/prix" 
                        className="block text-premium-charcoal hover:text-premium-black transition-colors py-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        Prix
                      </Link>
                      <Link 
                        to="/contact" 
                        className="block text-premium-charcoal hover:text-premium-black transition-colors py-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        Nous contacter
                      </Link>
                      <Link 
                        to="/contact/faq" 
                        className="block text-premium-charcoal hover:text-premium-black transition-colors py-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        FAQ
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 pt-6 border-t border-premium-light">
                  {isLoggedIn ? (
                    <Button
                      onClick={() => {
                        navigate('/dashboard');
                        setMobileOpen(false);
                      }}
                      className="btn-primary text-white ripple w-full"
                    >
                      Tableau de bord
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleLogin();
                          setMobileOpen(false);
                        }}
                        className="btn-secondary border-premium-sage/30 text-premium-sage hover:bg-premium-sage/5 w-full ripple"
                      >
                        Se connecter
                      </Button>
                      <Button
                        onClick={() => {
                          handleGetStarted();
                          setMobileOpen(false);
                        }}
                        className="btn-primary text-white w-full ripple"
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
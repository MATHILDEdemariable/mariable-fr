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
      <Link to="/fonctionnalites" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        Fonctionnalités
      </Link>
      <Link to="/selection" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        Prestataires
      </Link>
      <Link to="/prix" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        Tarifs
      </Link>
      <Link to="/conseilsmariage" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        Conseils
      </Link>
    </>
  );

  return (
    <header className="site-header w-full bg-white border-b border-gray-200 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
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
                  Futurs mariés
                </Button>
                <Button
                  onClick={() => navigate('/professionnels')}
                  className="btn-primary text-white ripple"
                >
                  Professionnel
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
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/fonctionnalites" 
                    className="text-premium-charcoal hover:text-premium-black transition-colors font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Fonctionnalités
                  </Link>
                  <Link 
                    to="/selection" 
                    className="text-premium-charcoal hover:text-premium-black transition-colors font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Prestataires
                  </Link>
                  <Link 
                    to="/prix" 
                    className="text-premium-charcoal hover:text-premium-black transition-colors font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Tarifs
                  </Link>
                  <Link 
                    to="/conseilsmariage" 
                    className="text-premium-charcoal hover:text-premium-black transition-colors font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Conseils
                  </Link>
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
                        Futurs mariés
                      </Button>
                      <Button
                        onClick={() => {
                          navigate('/professionnels');
                          setMobileOpen(false);
                        }}
                        className="btn-primary text-white w-full ripple"
                      >
                        Professionnel
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
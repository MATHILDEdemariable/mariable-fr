import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
      <Link to="/selection" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        Prestataires
      </Link>
      <Link to="/outils-planning-mariage" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        Planification
      </Link>
      <Link to="/coordination-jour-j" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        Jour J
      </Link>
      <Link to="/about/approche" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        À propos
      </Link>
    </>
  );

  return (
    <header className="navbar fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-premium-black">Mariable</span>
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
                  className="flex items-center space-x-2 mb-6"
                  onClick={() => setMobileOpen(false)}
                >
                  <Logo />
                  <span className="text-lg font-bold text-premium-black">Mariable</span>
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
                  <Link 
                    to="/about/approche" 
                    className="text-premium-charcoal hover:text-premium-black transition-colors font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    À propos
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
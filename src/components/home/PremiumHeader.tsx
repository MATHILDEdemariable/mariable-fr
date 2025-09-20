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
      <Link to="/about/approche" className="text-premium-charcoal hover:text-premium-black transition-colors font-medium">
        À propos
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-premium-light">
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
                className="bg-gradient-to-r from-premium-gradient-start via-premium-gradient-mid to-premium-gradient-end text-white hover:opacity-90 transition-opacity"
              >
                Tableau de bord
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleLogin}
                  className="border-premium-light text-premium-charcoal hover:bg-premium-warm"
                >
                  Se connecter
                </Button>
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-premium-gradient-start via-premium-gradient-mid to-premium-gradient-end text-white hover:opacity-90 transition-opacity"
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
                      className="bg-gradient-to-r from-premium-gradient-start via-premium-gradient-mid to-premium-gradient-end text-white hover:opacity-90 transition-opacity w-full"
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
                        className="border-premium-light text-premium-charcoal hover:bg-premium-warm w-full"
                      >
                        Se connecter
                      </Button>
                      <Button
                        onClick={() => {
                          handleGetStarted();
                          setMobileOpen(false);
                        }}
                        className="bg-gradient-to-r from-premium-gradient-start via-premium-gradient-mid to-premium-gradient-end text-white hover:opacity-90 transition-opacity w-full"
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
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

const PremiumHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isEmbedded = searchParams.get('embedded') === 'true';
  if (isEmbedded) {
    return null;
  }

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

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <header className="site-header w-full bg-white border-b border-editorial-noir/10 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Navigation Desktop - Style éditorial épuré */}
          <nav className="hidden md:flex items-center space-x-10">
            {/* Navigation centrale vide pour style éditorial épuré */}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/partenariat"
              className="text-xs tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir transition-colors font-sans"
            >
              Partenariat
            </Link>
            <Link 
              to="/contact"
              className="text-xs tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir transition-colors font-sans"
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-editorial-noir hover:bg-editorial-noir/80 text-white rounded-none px-6 text-xs tracking-widest uppercase font-sans">
                    Mon compte <ChevronDown className="ml-1 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-editorial-noir/10 shadow-lg z-[1000] rounded-none">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    Mes outils
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/professionnelsmariable')} className="cursor-pointer">
                    Les prestataires
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
            <>
                <Button 
                  variant="ghost"
                  onClick={() => navigate('/login')} 
                  className="text-xs tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir hover:bg-transparent font-sans"
                >
                  Futurs mariés
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-editorial-noir" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white pt-20">
              <div className="flex flex-col space-y-6">
                <Link 
                  to="/partenariat"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir"
                >
                  Partenariat
                </Link>
                <Link 
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir"
                >
                  Contact
                </Link>
                <hr className="border-editorial-noir/10" />
                {isLoggedIn ? (
                  <>
                    <Button 
                      onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} 
                      className="bg-editorial-noir text-white rounded-none w-full"
                    >
                      Mes outils
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => { navigate('/login'); setMobileOpen(false); }} 
                      className="border-editorial-noir/20 text-editorial-noir rounded-none w-full"
                    >
                      Futurs mariés
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PremiumHeader;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: "Prestataires", href: "/professionnelsmariable" },
  { label: "Outils", href: "/#outils-planification" },
  { label: "Prix", href: "/prix" },
];

const PremiumHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isHomepage = location.pathname === '/' || location.pathname === '/accueil';

  const isEmbedded = searchParams.get('embedded') === 'true';
  if (isEmbedded) {
    return null;
  }

  return (
    <header className="site-header w-full bg-white border-b border-editorial-noir/10 transition-all duration-300">
      <div className="container mx-auto px-4">
        {/* Niveau 1 : Logo + boutons */}
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
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
              <Button 
                variant="ghost"
                onClick={() => navigate('/login')} 
                className="text-xs tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir hover:bg-transparent font-sans"
              >
                Connexion / Créer un compte
              </Button>
            )}
            <Link 
              to="/partenariat"
              className="text-xs tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir transition-colors font-sans"
            >
              Je suis un professionnel
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-editorial-noir" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white pt-20">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-editorial-noir/10" />
                <Link 
                  to="/partenariat"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir"
                >
                  Je suis un professionnel
                </Link>
                <hr className="border-editorial-noir/10" />
                {isAuthenticated ? (
                  <Button 
                    onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} 
                    className="bg-editorial-noir text-white rounded-none w-full"
                  >
                    Mes outils
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => { navigate('/login'); setMobileOpen(false); }} 
                    className="border-editorial-noir/20 text-editorial-noir rounded-none w-full"
                  >
                    Connexion / Créer un compte
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>

      {/* Niveau 2 : Navigation sections (desktop only, homepage only) - full width */}
      {isHomepage && (
        <nav className="hidden md:flex items-center justify-center space-x-8 h-10 bg-editorial-beige border-t border-editorial-noir/5">
          {navLinks.map((link) => {
            if (link.href.startsWith('/#')) {
              return (
                <button
                  key={link.href}
                  onClick={() => {
                    const id = link.href.replace('/#', '');
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[11px] tracking-[0.15em] uppercase text-editorial-noir/70 hover:text-editorial-noir transition-colors font-sans bg-transparent border-none cursor-pointer"
                >
                  {link.label}
                </button>
              );
            }
            return (
              <Link
                key={link.href}
                to={link.href}
                className="text-[11px] tracking-[0.15em] uppercase text-editorial-noir/70 hover:text-editorial-noir transition-colors font-sans"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default PremiumHeader;

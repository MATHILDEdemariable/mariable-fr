import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '@/components/LanguageToggle';

const PremiumHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('common');
  const isHomepage = location.pathname === '/' || location.pathname === '/accueil';

  const isEmbedded = searchParams.get('embedded') === 'true';
  if (isEmbedded) {
    return null;
  }

  const navLinks = isHomepage ? [] : [
    { label: t('header.nav.vendors'), href: "/professionnelsmariable" },
    { label: t('header.nav.tools'), href: "/#outils-planification" },
    { label: t('header.nav.pricing'), href: "/prix" },
  ];

  return (
    <header className={`site-header w-full transition-all duration-300 ${isHomepage ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-editorial-noir/10'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {isHomepage && (
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                if (link.href.startsWith('/#')) {
                  return (
                    <button
                      key={link.href}
                      onClick={() => {
                        const id = link.href.replace('/#', '');
                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[11px] tracking-[0.15em] uppercase text-white/80 hover:text-white transition-colors font-sans bg-transparent border-none cursor-pointer"
                    >
                      {link.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-[11px] tracking-[0.15em] uppercase text-white/80 hover:text-white transition-colors font-sans"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/guides"
              className={`text-xs tracking-widest uppercase transition-colors font-sans ${isHomepage ? 'text-white/80 hover:text-white' : 'text-editorial-noir/80 hover:text-editorial-noir'}`}
            >
              {t('header.nav.ebooks')}
            </Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className={`rounded-none px-6 text-xs tracking-widest uppercase font-sans ${isHomepage ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30' : 'bg-editorial-noir hover:bg-editorial-noir/80 text-white'}`}>
                    {t('header.myAccount')} <ChevronDown className="ml-1 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-editorial-noir/10 shadow-lg z-[1000] rounded-none">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    {t('header.myTools')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/professionnelsmariable')} className="cursor-pointer">
                    {t('header.vendors')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost"
                onClick={() => navigate('/login')} 
                className={`text-xs tracking-widest uppercase font-sans ${isHomepage ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-editorial-noir/80 hover:text-editorial-noir hover:bg-transparent'}`}
              >
                {t('header.login')}
              </Button>
            )}
            <Link 
              to="/partenariat"
              className={`text-xs tracking-widest uppercase transition-colors font-sans ${isHomepage ? 'text-white/80 hover:text-white' : 'text-editorial-noir/80 hover:text-editorial-noir'}`}
            >
              {t('header.iAmPro')}
            </Link>
            <LanguageToggle variant={isHomepage ? 'light' : 'dark'} />
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className={`h-6 w-6 ${isHomepage ? 'text-white' : 'text-editorial-noir'}`} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white pt-20">
              <div className="flex flex-col space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir"
                    >
                      {t('header.nav.home', 'Accueil')}
                    </Link>
                    <hr className="border-editorial-noir/10" />
                    <Button
                      variant="outline"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setMobileOpen(false);
                        navigate('/');
                      }}
                      className="border-editorial-noir/20 text-editorial-noir rounded-none w-full"
                    >
                      {t('header.logout', 'Déconnexion')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/guides"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir"
                    >
                      {t('header.nav.ebooks')}
                    </Link>
                    <hr className="border-editorial-noir/10" />
                    <Link
                      to="/partenariat"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir"
                    >
                      {t('header.iAmPro')}
                    </Link>
                    <hr className="border-editorial-noir/10" />
                    <Button
                      variant="outline"
                      onClick={() => { navigate('/login'); setMobileOpen(false); }}
                      className="border-editorial-noir/20 text-editorial-noir rounded-none w-full"
                    >
                      {t('header.login')}
                    </Button>
                  </>
                )}
                <hr className="border-editorial-noir/10" />
                <div className="flex justify-center">
                  <LanguageToggle variant="dark" />
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

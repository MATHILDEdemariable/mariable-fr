import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
const PremiumHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Hide header when embedded in iframe
  const isEmbedded = searchParams.get('embedded') === 'true';
  if (isEmbedded) {
    return null;
  }
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkUser();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleGetStarted = () => {
    navigate('/register');
  };
  return <header className="site-header w-full bg-white border-b border-gray-200 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? <Button onClick={() => navigate('/professionnelsmariable')} className="btn-primary text-white ripple">
                Mon compte
              </Button> : <>
                <Button onClick={handleGetStarted} className="btn-primary text-white ripple">
                  Futurs mariés
                </Button>
                <Button variant="outline" onClick={() => navigate('/contact')} className="btn-secondary border-premium-sage/30 text-premium-sage hover:bg-premium-sage/5 ripple">
                  Contact
                </Button>
              </>}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white pt-32">
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-3">
                  {isLoggedIn ? <Button onClick={() => {
                  navigate('/professionnelsmariable');
                  setMobileOpen(false);
                }} className="btn-primary text-white ripple w-full">
                      Mon compte
                    </Button> : <>
                      <Button onClick={() => {
                    handleGetStarted();
                    setMobileOpen(false);
                  }} className="btn-primary text-white w-full ripple">
                        Club futurs mariés
                      </Button>
                      <Button variant="outline" onClick={() => {
                    navigate('/contact');
                    setMobileOpen(false);
                  }} className="btn-secondary border-premium-sage/30 text-premium-sage hover:bg-premium-sage/5 w-full ripple">
                        Contact
                      </Button>
                    </>}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>;
};
export default PremiumHeader;
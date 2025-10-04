import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';

const VibeWeddingHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/landing-generale" 
              className="text-sm font-medium text-foreground hover:text-premium-sage transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link 
              to="/prix" 
              className="text-sm font-medium text-foreground hover:text-premium-sage transition-colors"
            >
              Tarifs
            </Link>
            <Link 
              to="/conseilsmariage" 
              className="text-sm font-medium text-foreground hover:text-premium-sage transition-colors"
            >
              Conseils
            </Link>
            <Button 
              asChild 
              className="bg-premium-sage hover:bg-premium-sage-medium text-white"
            >
              <Link to="/auth">Créer un compte / Se connecter</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default VibeWeddingHeader;

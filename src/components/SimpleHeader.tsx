import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

const SimpleHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          <Link 
            to="/dashboard" 
            className="text-sm font-medium text-foreground hover:text-premium-sage transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
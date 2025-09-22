import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

const SimpleHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
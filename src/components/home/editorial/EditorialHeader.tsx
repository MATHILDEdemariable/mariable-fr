import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';

const OVERLAY_LINKS = [
  { label: 'NOS RECOMMANDATIONS', to: '/professionnelsmariable' },
  { label: "L'APPLI", to: '/register-gratuit' },
  { label: 'EBOOKS', to: '/guides' },
  { label: 'À PROPOS', to: '/about/approche' },
  { label: 'CONTACT', to: '/contact' },
];

const EditorialHeader: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-editorial-beige border-b border-editorial-noir/10">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <Link
            to="/refontejuillet"
            className="font-serif text-2xl lowercase text-editorial-noir tracking-tight"
            aria-label="mariable — accueil"
          >
            mariable
          </Link>

          <nav className="flex items-center gap-4 md:gap-6">
            <a
              href="https://www.instagram.com/mariable.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline text-xs tracking-[0.2em] uppercase text-editorial-noir hover:opacity-70 transition-opacity"
            >
              Instagram
            </a>
            <span className="hidden sm:inline text-editorial-noir/30" aria-hidden="true">|</span>
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="flex flex-col justify-center items-end gap-[5px] w-8 h-8 group"
              aria-label="Ouvrir le menu"
            >
              <span className="block h-px w-6 bg-editorial-noir transition-all group-hover:w-8" />
              <span className="block h-px w-8 bg-editorial-noir" />
              <span className="block h-px w-5 bg-editorial-noir transition-all group-hover:w-8" />
            </button>
          </nav>
        </div>
      </header>

      {/* Overlay menu */}
      <div
        className={`fixed inset-0 z-50 bg-editorial-beige transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
          <div className="flex items-center justify-between h-16 border-b border-editorial-noir/10">
            <span className="font-serif text-2xl lowercase text-editorial-noir">mariable</span>
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 flex items-center justify-center hover:opacity-70"
              aria-label="Fermer le menu"
            >
              <X className="w-6 h-6 text-editorial-noir" strokeWidth={1.25} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-end pr-2 md:pr-8 gap-6 md:gap-10">
            {OVERLAY_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-serif text-3xl md:text-5xl uppercase text-editorial-noir hover:italic transition-all tracking-tight"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-editorial-noir/10 py-6 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
            <div className="flex gap-6 text-xs tracking-[0.2em] uppercase text-editorial-noir/70">
              <Link to="/login" onClick={() => setOpen(false)} className="hover:text-editorial-noir">
                Se connecter
              </Link>
              <Link to="/partenariat" onClick={() => setOpen(false)} className="hover:text-editorial-noir">
                Espace professionnels
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/mariable.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-editorial-noir hover:opacity-70"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={1.25} />
              </a>
              <span className="text-editorial-noir/30">|</span>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorialHeader;

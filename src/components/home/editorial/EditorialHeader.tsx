import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';

interface Props {
  transparent?: boolean;
}

const EditorialHeader: React.FC<Props> = ({ transparent = false }) => {
  const { t } = useTranslation('refonteJuillet');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const OVERLAY_LINKS = [
    { label: t('header.menu.selection'), to: '/professionnelsmariable' },
    { label: t('header.menu.app'), to: '/register-gratuit' },
    { label: t('header.menu.ebooks'), to: '/guides' },
    { label: t('header.menu.pros'), to: '/partenariat' },
    { label: t('header.menu.contact'), to: '/contact' },
  ];

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

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

  const isOverlay = transparent && !scrolled;
  const headerBg = isOverlay
    ? 'bg-transparent border-transparent'
    : 'bg-white/95 backdrop-blur-sm border-editorial-noir/10';
  const textClr = isOverlay ? 'text-white' : 'text-editorial-noir';

  return (
    <>
      <header
        className={`${transparent ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-40 border-b transition-colors duration-300 ${headerBg}`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <Link
            to="/refontejuillet"
            className="flex items-center"
            aria-label="Mariable"
          >
            <Logo />
          </Link>

          <nav className={`flex items-center gap-4 md:gap-6 ${textClr}`}>
            <a
              href="https://www.instagram.com/mariable.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity"
            >
              {t('header.instagram')}
            </a>
            <span className="hidden sm:inline opacity-30" aria-hidden="true">|</span>
            <div className="hidden sm:block">
              <LanguageToggle variant={isOverlay ? 'light' : 'dark'} />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="flex flex-col justify-center items-end gap-[5px] w-8 h-8 group"
              aria-label={t('header.openMenu')}
            >
              <span className={`block h-px w-6 transition-all group-hover:w-8 ${isOverlay ? 'bg-white' : 'bg-editorial-noir'}`} />
              <span className={`block h-px w-8 ${isOverlay ? 'bg-white' : 'bg-editorial-noir'}`} />
              <span className={`block h-px w-5 transition-all group-hover:w-8 ${isOverlay ? 'bg-white' : 'bg-editorial-noir'}`} />
            </button>
          </nav>
        </div>
      </header>

      {/* Overlay menu */}
      <div
        className={`fixed inset-0 z-50 bg-[#F8F5EF] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
          <div className="flex items-center justify-between h-16 border-b border-editorial-noir/10">
            <Logo />
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 flex items-center justify-center hover:opacity-70"
              aria-label={t('header.closeMenu')}
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
                className="font-serif text-3xl md:text-5xl uppercase text-editorial-noir hover:italic hover:text-wedding-olive transition-all tracking-tight"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-editorial-noir/10 py-6 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
            <div className="flex gap-6 text-xs tracking-[0.2em] uppercase text-editorial-noir/70">
              <Link to="/login" onClick={() => setOpen(false)} className="hover:text-editorial-noir">
                {t('header.login')}
              </Link>
              <Link to="/partenariat" onClick={() => setOpen(false)} className="hover:text-editorial-noir">
                {t('header.prosFooter')}
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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SectionNavProps {
  sections: { id: string; label: string }[];
}

const SectionNav = ({ sections }: SectionNavProps) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero (90vh)
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.9;
      setIsVisible(scrollY > heroHeight);

      // Find active section
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-premium-sage/20 p-2">
        <div className="flex flex-col gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-left whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-premium-sage text-white shadow-md'
                  : 'text-muted-foreground hover:bg-premium-sage/10 hover:text-premium-sage'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default SectionNav;

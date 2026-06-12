import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Menu, X, MapPin, Clock, Calendar, Heart, Home, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import heroImage from '@/assets/severine-olivier-hero.jpeg';

const colors = {
  coral: '#E8736E',
  orange: '#E89557',
  pink: '#F5B5A8',
  green: '#6B8E4E',
  cream: '#FEFBF5',
  darkGreen: '#4A6741',
};

const weddingData = {
  couple: "Marie & Thomas",
  date: "21 juin 2026",
  rsvpDeadline: "1er mai 2026",
  schedule: [
    { time: "16h00", event: "Cérémonie laïque", location: "Domaine de l'Amour", icon: "💒" },
    { time: "17h30", event: "Vin d'honneur", location: "Jardins du Domaine", icon: "🥂" },
    { time: "20h00", event: "Dîner et festivités", location: "Domaine de l'Amour", icon: "🍽️" },
    { time: "11h00 (+1)", event: "Brunch du lendemain", location: "Terrasse du Domaine", icon: "☕" },
  ],
  accommodationLink: "https://www.google.com/maps/search/Hotels+Provence",
  contacts: [
    { name: "Marie", email: "marie@exemple.fr" },
    { name: "Thomas", email: "thomas@exemple.fr" },
    { name: "Mathilde", role: "Wedding Planner", email: "contact@mariable.fr" },
  ],
  venue: {
    name: "Domaine de l'Amour",
    address: "Provence, Sud de la France",
    mapLink: "https://maps.google.com/?q=Provence+France"
  }
};

const calculateCountdown = () => {
  const weddingDate = new Date('2026-06-21T16:00:00');
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
  };
};

const ExempleSite: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState(calculateCountdown());
  const [activeSection, setActiveSection] = useState('accueil');

  useEffect(() => {
    const timer = setInterval(() => setCountdown(calculateCountdown()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }),
      { threshold: 0.3 }
    );
    document.querySelectorAll('section[id]').forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'programme', label: 'Programme' },
    { id: 'logements', label: 'Logements' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <Helmet>
        <title>Exemple de site de mariage — Mariable.fr</title>
        <meta name="description" content="Découvrez un exemple de site de mariage personnalisé créé par Mariable.fr. Countdown, programme, hébergements et plus." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollToSection('accueil')} className="font-serif text-xl" style={{ color: colors.coral }}>
            M & T
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn("text-sm font-medium transition-colors", activeSection === item.id ? "" : "text-gray-600 hover:opacity-80")}
                style={activeSection === item.id ? { color: colors.coral } : {}}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
            <nav className="flex flex-col py-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn("px-6 py-3 text-left text-sm font-medium transition-colors", activeSection === item.id ? "bg-opacity-10" : "text-gray-600 hover:bg-gray-50")}
                  style={activeSection === item.id ? { color: colors.coral, backgroundColor: `${colors.coral}10` } : {}}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="pt-16" style={{ backgroundColor: colors.cream }}>
        {/* Hero */}
        <section id="accueil" className="min-h-[90vh] flex flex-col items-center justify-center relative px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
          <div className="absolute inset-0 bg-black/30" />
          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <p className="font-medium tracking-widest uppercase text-sm text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Nous nous marions</p>
            <h1 className="font-serif text-5xl md:text-7xl text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>{weddingData.couple}</h1>
            <div className="flex items-center justify-center gap-4 text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              <Calendar className="h-5 w-5" />
              <span className="text-xl">{weddingData.date}</span>
            </div>
            <p className="text-white/90" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>{weddingData.venue.name}</p>
            <div className="flex justify-center gap-6 md:gap-10 pt-8">
              {[{ value: countdown.days, label: 'jours' }, { value: countdown.hours, label: 'heures' }, { value: countdown.minutes, label: 'minutes' }].map((c) => (
                <div key={c.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-serif text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{c.value}</div>
                  <div className="text-sm text-white/80 mt-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programme */}
        <section id="programme" className="py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl text-center mb-4" style={{ color: colors.darkGreen }}>Programme</h2>
            <p className="text-center text-gray-500 mb-12">Le déroulé de notre journée — {weddingData.date}</p>
            <div className="space-y-0">
              {weddingData.schedule.map((item, index) => (
                <div key={index} className="flex gap-4 md:gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${colors.pink}40` }}>{item.icon}</div>
                    {index < weddingData.schedule.length - 1 && <div className="w-px h-full min-h-[60px]" style={{ backgroundColor: `${colors.coral}30` }} />}
                  </div>
                  <div className="pb-8 flex-1">
                    <span className="font-semibold" style={{ color: colors.coral }}>{item.time}</span>
                    <h3 className="font-serif text-xl" style={{ color: colors.darkGreen }}>{item.event}</h3>
                    <p className="text-gray-500 flex items-center gap-1 mt-1"><MapPin className="h-4 w-4" />{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 rounded-lg" style={{ backgroundColor: `${colors.pink}20` }}>
              <h3 className="font-serif text-xl mb-2" style={{ color: colors.darkGreen }}>{weddingData.venue.name}</h3>
              <p className="text-gray-600 flex items-center gap-2"><MapPin className="h-4 w-4" />{weddingData.venue.address}</p>
              <a href={weddingData.venue.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 hover:underline" style={{ color: colors.coral }}>
                Voir sur Google Maps <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Hébergements */}
        <section id="logements" className="py-20 px-4" style={{ backgroundColor: `${colors.pink}20` }}>
          <div className="max-w-4xl mx-auto text-center">
            <Home className="h-12 w-12 mx-auto mb-6" style={{ color: colors.coral }} />
            <h2 className="font-serif text-4xl mb-4" style={{ color: colors.darkGreen }}>Hébergements</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">Retrouvez notre sélection d'hébergements à proximité du lieu de réception.</p>
            <a href={weddingData.accommodationLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all" style={{ backgroundColor: colors.coral }}>
              <MapPin className="h-5 w-5" /> Sélection de logements à côté <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-4xl mb-4" style={{ color: colors.darkGreen }}>Contact</h2>
            <p className="text-gray-600 mb-8">Pour toute question, n'hésitez pas à nous contacter</p>
            <div className="space-y-4">
              {weddingData.contacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium" style={{ color: colors.darkGreen }}>{contact.name}</span>
                  {contact.role && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span style={{ color: colors.coral }}>{contact.role}</span>
                    </>
                  )}
                  {contact.email && (
                    <>
                      <span className="text-gray-400">•</span>
                      <Mail className="h-4 w-4" style={{ color: colors.coral }} />
                      <a href={`mailto:${contact.email}`} className="text-gray-800 hover:underline">{contact.email}</a>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 text-white text-center" style={{ backgroundColor: colors.darkGreen }}>
          <p className="font-serif text-2xl mb-2">{weddingData.couple}</p>
          <p className="text-white/70 mb-6">{weddingData.date} • {weddingData.venue.name}</p>
          <p className="text-white/50 text-sm">
            Réalisé avec <Heart className="h-3 w-3 inline" style={{ color: colors.coral }} /> via{' '}
            <a href="https://mariable.fr" className="hover:underline" style={{ color: colors.coral }}>Mariable.fr</a>
          </p>
        </footer>
      </main>
    </>
  );
};

export default ExempleSite;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Menu, X, MapPin, Clock, Calendar, Heart, Home, Mail, Phone, ExternalLink, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import RSVPInlineForm from '@/components/rsvp/RSVPInlineForm';
import heroImage from '@/assets/severine-olivier-hero.jpeg';

// Palette de couleurs corail/orange
const colors = {
  coral: '#E8736E',
  orange: '#E89557',
  pink: '#F5B5A8',
  green: '#6B8E4E',
  cream: '#FEFBF5',
  darkGreen: '#4A6741',
};

// Données du mariage - MISES À JOUR
const weddingData = {
  couple: "Séverine & Olivier",
  date: "5 septembre 2026",
  rsvpSlug: "mariageseverineolivier-2",
  rsvpDeadline: "15 juillet 2026",
  schedule: [
    { time: "16h30", event: "Cérémonie laïque", location: "Château de Saint Clair", icon: "💒" },
    { time: "18h00", event: "Vin d'honneur", location: "Jardins du Château", icon: "🥂" },
    { time: "20h00", event: "Cocktail dînatoire et festivités", location: "Château de Saint Clair", icon: "🍽️" },
    { time: "11h00 (+1)", event: "Brunch du lendemain", location: "Terrasse du Château", icon: "☕" },
  ],
  // Programme VIP (visible uniquement avec code)
  vipSchedule: [
    { time: "15h00", event: "Cérémonie civile", location: "Mairie", icon: "🏛️", date: "4 septembre" },
    { time: "20h00", event: "Dîner intime", location: "Restaurant Le Jardin", icon: "🌙", date: "4 septembre" },
  ],
  accommodationLink: "https://www.google.com/collections/s/list/ySkAOJFiqjsoFc5eqH9iQSWJnnDZOg/5wLW-FQvP8Y",
  contacts: [
    { name: "Olivier", phone: "06 07 98 00 56" },
    { name: "Séverine", phone: "06 15 46 28 41" },
    { name: "Mathilde", role: "Wedding Planner", email: "mathilde@mariable.fr" },
  ],
  venue: {
    name: "Château de Saint Clair",
    address: "Proche Etretat, Normandie",
    mapLink: "https://maps.app.goo.gl/SV5dPnt1X8mcu6SS6"
  }
};

// Calcul du compte à rebours - DATE MISE À JOUR
const calculateCountdown = () => {
  const weddingDate = new Date('2026-09-05T15:00:00');
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
};

const WeddingSeverineOlivier: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState(calculateCountdown());
  const [activeSection, setActiveSection] = useState('accueil');
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);

  // Vérifier l'accès VIP via le code URL
  const hasVipAccess = searchParams.get('code') === 'vip2026';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Observer pour section active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'programme', label: 'Programme' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'logements', label: 'Logements' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <Helmet>
        <title>Mariage de Séverine & Olivier - 5 septembre 2026</title>
        <meta name="description" content="Nous avons le plaisir de vous convier à notre mariage le 5 septembre 2026 au Château de Saint Clair. Retrouvez toutes les informations pratiques sur cette page." />
      </Helmet>

      {/* Header Sticky */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => scrollToSection('accueil')}
            className="font-serif text-xl"
            style={{ color: colors.coral }}
          >
            S & O
          </button>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeSection === item.id 
                    ? "" 
                    : "text-gray-600 hover:opacity-80"
                )}
                style={activeSection === item.id ? { color: colors.coral } : {}}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Menu Mobile */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu Mobile Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
            <nav className="flex flex-col py-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "px-6 py-3 text-left text-sm font-medium transition-colors",
                    activeSection === item.id 
                      ? "bg-opacity-10" 
                      : "text-gray-600 hover:bg-gray-50"
                  )}
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
        {/* Hero Section avec Image */}
        <section id="accueil" className="min-h-[90vh] flex flex-col items-center justify-center relative px-4 text-center overflow-hidden">
          {/* Background Image avec overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          {/* Dark overlay for text visibility */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <p 
              className="font-medium tracking-widest uppercase text-sm text-white"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              Nous nous marions
            </p>
            <h1 
              className="font-serif text-5xl md:text-7xl text-white"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
            >
              {weddingData.couple}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              <Calendar className="h-5 w-5" />
              <span className="text-xl">{weddingData.date}</span>
            </div>
            <p className="text-white/90" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
              {weddingData.venue.name}
            </p>
            
            {/* Countdown */}
            <div className="flex justify-center gap-6 md:gap-10 pt-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{countdown.days}</div>
                <div className="text-sm text-white/80 mt-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>jours</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{countdown.hours}</div>
                <div className="text-sm text-white/80 mt-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>heures</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{countdown.minutes}</div>
                <div className="text-sm text-white/80 mt-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>minutes</div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="mt-8 rounded-full px-10 py-6 text-white shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: colors.coral }}
              onClick={() => setIsRsvpModalOpen(true)}
            >
              Confirmer ma présence
            </Button>
          </div>
        </section>

        {/* Section VIP (visible uniquement avec code) */}
        {hasVipAccess && (
          <section className="py-12 px-4" style={{ backgroundColor: `${colors.pink}30` }}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Lock className="h-5 w-5" style={{ color: colors.coral }} />
                <h2 className="font-serif text-2xl text-center" style={{ color: colors.darkGreen }}>
                  Programme VIP - Veille du mariage
                </h2>
              </div>
              <p className="text-center text-gray-600 mb-8 text-sm">
                Ces informations sont réservées aux invités du 4 septembre
              </p>
              
              <div className="space-y-4">
                {weddingData.vipSchedule.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: colors.coral }}>{item.date}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{item.time}</span>
                      </div>
                      <h3 className="font-serif text-lg" style={{ color: colors.darkGreen }}>{item.event}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Programme Section */}
        <section id="programme" className="py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl text-center mb-4" style={{ color: colors.darkGreen }}>Programme</h2>
            <p className="text-center text-gray-500 mb-12">Le déroulé de notre journée - {weddingData.date}</p>
            
            <div className="space-y-0">
              {weddingData.schedule.map((item, index) => (
                <div key={index} className="flex gap-4 md:gap-8">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${colors.pink}40` }}
                    >
                      {item.icon}
                    </div>
                    {index < weddingData.schedule.length - 1 && (
                      <div 
                        className="w-px h-full min-h-[60px]"
                        style={{ backgroundColor: `${colors.coral}30` }}
                      />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="pb-8 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold" style={{ color: colors.coral }}>{item.time}</span>
                    </div>
                    <h3 className="font-serif text-xl" style={{ color: colors.darkGreen }}>{item.event}</h3>
                    {item.location && (
                      <p className="text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Lieu principal */}
            <div 
              className="mt-12 p-6 rounded-lg"
              style={{ backgroundColor: `${colors.pink}20` }}
            >
              <h3 className="font-serif text-xl mb-2" style={{ color: colors.darkGreen }}>{weddingData.venue.name}</h3>
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {weddingData.venue.address}
              </p>
              <a 
                href={weddingData.venue.mapLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 hover:underline"
                style={{ color: colors.coral }}
              >
                Voir sur Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="py-20 px-4" style={{ backgroundColor: `${colors.pink}20` }}>
          <div className="max-w-2xl mx-auto text-center">
            <Heart className="h-12 w-12 mx-auto mb-6" style={{ color: colors.coral }} />
            <h2 className="font-serif text-4xl mb-4" style={{ color: colors.darkGreen }}>Confirmez votre présence</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Nous serions ravis de vous compter parmi nous pour célébrer notre union. 
              Merci de nous confirmer votre présence avant le <strong>{weddingData.rsvpDeadline}</strong>.
            </p>
            
            <Button 
              size="lg" 
              className="rounded-full px-10 py-6 text-lg text-white shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: colors.coral }}
              onClick={() => setIsRsvpModalOpen(true)}
            >
              Répondre au formulaire RSVP
            </Button>

            <p className="text-sm text-gray-500 mt-6">
              Le formulaire vous permet d'indiquer le nombre d'adultes et d'enfants, 
              ainsi que vos éventuelles restrictions alimentaires.
            </p>
          </div>
        </section>

        {/* Logements Section - Simplifié */}
        <section id="logements" className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <Home className="h-12 w-12 mx-auto mb-6" style={{ color: colors.coral }} />
            <h2 className="font-serif text-4xl mb-4" style={{ color: colors.darkGreen }}>Hébergements</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Retrouvez notre sélection d'hébergements à proximité du lieu de réception.
            </p>
            <a 
              href={weddingData.accommodationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: colors.coral }}
            >
              <MapPin className="h-5 w-5" />
              Sélection de logements à côté
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4" style={{ backgroundColor: `${colors.pink}20` }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-4xl mb-4" style={{ color: colors.darkGreen }}>Contact</h2>
            <p className="text-gray-600 mb-8">
              Pour toute question, n'hésitez pas à nous contacter
            </p>

            <div className="space-y-4">
              {weddingData.contacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg">
                  <span className="font-medium" style={{ color: colors.darkGreen }}>
                    {contact.name}
                  </span>
                  {contact.role && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span style={{ color: colors.coral }}>{contact.role}</span>
                    </>
                  )}
                  {contact.phone && (
                    <>
                      <span className="text-gray-400">•</span>
                      <Phone className="h-4 w-4" style={{ color: colors.coral }} />
                      <span className="text-gray-800">{contact.phone}</span>
                    </>
                  )}
                  {contact.email && (
                    <>
                      <span className="text-gray-400">•</span>
                      <Mail className="h-4 w-4" style={{ color: colors.coral }} />
                      <a href={`mailto:${contact.email}`} className="text-gray-800 hover:underline">
                        {contact.email}
                      </a>
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
            <a href="https://mariable.fr" className="hover:underline" style={{ color: colors.coral }}>
              Mariable.fr
            </a>
          </p>
        </footer>
      </main>

      {/* Modal RSVP */}
      <Dialog open={isRsvpModalOpen} onOpenChange={setIsRsvpModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Formulaire RSVP</DialogTitle>
          </DialogHeader>
          <RSVPInlineForm 
            eventSlug={weddingData.rsvpSlug}
            onSuccess={() => {
              setTimeout(() => setIsRsvpModalOpen(false), 3000);
            }}
            primaryColor={colors.coral}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WeddingSeverineOlivier;

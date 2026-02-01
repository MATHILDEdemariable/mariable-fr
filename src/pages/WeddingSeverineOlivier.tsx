import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Menu, X, MapPin, Clock, Calendar, Heart, Home, Mail, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Données du mariage
const weddingData = {
  couple: "Séverine & Olivier",
  date: "30 juin 2026",
  rsvpSlug: "severine-olivier",
  rsvpDeadline: "15 mai 2026",
  schedule: [
    { time: "14h30", event: "Cérémonie civile", location: "Mairie de Libourne", icon: "🏛️" },
    { time: "16h00", event: "Cérémonie religieuse", location: "Église Saint-Jean-Baptiste", icon: "⛪" },
    { time: "17h30", event: "Vin d'honneur", location: "Domaine de Badine", icon: "🥂" },
    { time: "20h00", event: "Dîner", location: "Domaine de Badine", icon: "🍽️" },
    { time: "23h00", event: "Soirée dansante", location: "Domaine de Badine", icon: "💃" },
    { time: "11h00 (+1)", event: "Brunch du lendemain", location: "Domaine de Badine", icon: "☕" },
  ],
  accommodations: [
    { 
      name: "Hôtel & Spa de Pavie", 
      address: "Route de Bergerac, 33330 Saint-Émilion", 
      link: "https://hoteldesaintpavie.com", 
      distance: "8 km du domaine",
      note: "Vue sur les vignobles, spa"
    },
    { 
      name: "Hôtel Mercure Libourne", 
      address: "3 Quai Souchet, 33500 Libourne", 
      link: "https://all.accor.com/hotel/1162/index.fr.shtml", 
      distance: "12 km du domaine",
      note: "Centre-ville, parking gratuit"
    },
    { 
      name: "Chambres d'hôtes - Le Clos des Vignes", 
      address: "Lieu-dit Les Vignes, 33330 Saint-Émilion", 
      link: "#", 
      distance: "5 km du domaine",
      note: "Charme authentique, petit-déjeuner inclus"
    },
    { 
      name: "Airbnb recommandés", 
      link: "https://airbnb.fr", 
      note: "Sélection de gîtes et maisons d'hôtes dans la région",
      distance: "Variable"
    },
  ],
  contact: {
    email: "severineetolivier2026@gmail.com",
    phone: "06 XX XX XX XX",
    witness: "Mathilde (témoin de la mariée)",
  },
  venue: {
    name: "Domaine de Badine",
    address: "Lieu-dit Badine, 33330 Saint-Émilion",
    mapLink: "https://maps.google.com/?q=Domaine+de+Badine+Saint-Emilion"
  }
};

// Calcul du compte à rebours
const calculateCountdown = () => {
  const weddingDate = new Date('2026-06-30T14:30:00');
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
};

const WeddingSeverineOlivier: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState(calculateCountdown());
  const [activeSection, setActiveSection] = useState('accueil');

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
        <title>Mariage de Séverine & Olivier - 30 juin 2026</title>
        <meta name="description" content="Nous avons le plaisir de vous convier à notre mariage le 30 juin 2026. Retrouvez toutes les informations pratiques sur cette page." />
      </Helmet>

      {/* Header Sticky */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => scrollToSection('accueil')}
            className="font-serif text-xl text-gray-800"
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
                    ? "text-wedding-olive" 
                    : "text-gray-600 hover:text-wedding-olive"
                )}
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
                      ? "text-wedding-olive bg-wedding-olive/5" 
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section id="accueil" className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-wedding-olive/5 to-white px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <p className="text-wedding-olive font-medium tracking-widest uppercase text-sm">
              Nous nous marions
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-gray-800">
              {weddingData.couple}
            </h1>
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span className="text-xl">{weddingData.date}</span>
            </div>
            
            {/* Countdown */}
            <div className="flex justify-center gap-6 md:gap-10 pt-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-wedding-olive">{countdown.days}</div>
                <div className="text-sm text-gray-500 mt-1">jours</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-wedding-olive">{countdown.hours}</div>
                <div className="text-sm text-gray-500 mt-1">heures</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-wedding-olive">{countdown.minutes}</div>
                <div className="text-sm text-gray-500 mt-1">minutes</div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="mt-8 rounded-none px-8"
              onClick={() => scrollToSection('rsvp')}
            >
              Confirmer ma présence
            </Button>
          </div>
        </section>

        {/* Programme Section */}
        <section id="programme" className="py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl text-center text-gray-800 mb-4">Programme</h2>
            <p className="text-center text-gray-500 mb-12">Le déroulé de notre journée</p>
            
            <div className="space-y-0">
              {weddingData.schedule.map((item, index) => (
                <div key={index} className="flex gap-4 md:gap-8">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-wedding-olive/10 flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    {index < weddingData.schedule.length - 1 && (
                      <div className="w-px h-full min-h-[60px] bg-wedding-olive/20" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="pb-8 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-wedding-olive font-semibold">{item.time}</span>
                    </div>
                    <h3 className="font-serif text-xl text-gray-800">{item.event}</h3>
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
            <div className="mt-12 p-6 bg-wedding-olive/5 rounded-lg">
              <h3 className="font-serif text-xl text-gray-800 mb-2">{weddingData.venue.name}</h3>
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {weddingData.venue.address}
              </p>
              <a 
                href={weddingData.venue.mapLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-wedding-olive hover:underline"
              >
                Voir sur Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="py-20 px-4 bg-wedding-olive/5">
          <div className="max-w-2xl mx-auto text-center">
            <Heart className="h-12 w-12 text-wedding-olive mx-auto mb-6" />
            <h2 className="font-serif text-4xl text-gray-800 mb-4">Confirmez votre présence</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Nous serions ravis de vous compter parmi nous pour célébrer notre union. 
              Merci de nous confirmer votre présence avant le <strong>{weddingData.rsvpDeadline}</strong>.
            </p>
            
            <Link to={`/rsvp/${weddingData.rsvpSlug}`}>
              <Button size="lg" className="rounded-none px-10 py-6 text-lg">
                Répondre au formulaire RSVP
              </Button>
            </Link>

            <p className="text-sm text-gray-500 mt-6">
              Le formulaire vous permet d'indiquer le nombre d'adultes et d'enfants, 
              ainsi que vos éventuelles restrictions alimentaires.
            </p>
          </div>
        </section>

        {/* Logements Section */}
        <section id="logements" className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <Home className="h-12 w-12 text-wedding-olive mx-auto mb-6" />
            <h2 className="font-serif text-4xl text-center text-gray-800 mb-4">Hébergements</h2>
            <p className="text-center text-gray-600 mb-12 max-w-lg mx-auto">
              Voici une sélection d'hébergements à proximité du lieu de réception. 
              Nous vous conseillons de réserver rapidement.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {weddingData.accommodations.map((accommodation, index) => (
                <div 
                  key={index} 
                  className="p-6 border border-gray-200 rounded-lg hover:border-wedding-olive/50 hover:shadow-md transition-all"
                >
                  <h3 className="font-serif text-xl text-gray-800 mb-2">{accommodation.name}</h3>
                  {accommodation.address && (
                    <p className="text-gray-500 text-sm mb-2 flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      {accommodation.address}
                    </p>
                  )}
                  <p className="text-wedding-olive text-sm mb-3">{accommodation.distance}</p>
                  {accommodation.note && (
                    <p className="text-gray-600 text-sm mb-4">{accommodation.note}</p>
                  )}
                  {accommodation.link && accommodation.link !== '#' && (
                    <a 
                      href={accommodation.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-wedding-olive hover:underline"
                    >
                      Réserver
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-wedding-olive/5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-4xl text-gray-800 mb-4">Contact</h2>
            <p className="text-gray-600 mb-8">
              Pour toute question, n'hésitez pas à nous contacter
            </p>

            <div className="space-y-4">
              <a 
                href={`mailto:${weddingData.contact.email}`}
                className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <Mail className="h-5 w-5 text-wedding-olive" />
                <span className="text-gray-800">{weddingData.contact.email}</span>
              </a>

              <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg">
                <Phone className="h-5 w-5 text-wedding-olive" />
                <span className="text-gray-800">{weddingData.contact.witness} : {weddingData.contact.phone}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-gray-900 text-white text-center">
          <p className="font-serif text-2xl mb-2">{weddingData.couple}</p>
          <p className="text-gray-400 mb-6">{weddingData.date}</p>
          <p className="text-gray-500 text-sm">
            Réalisé avec <Heart className="h-3 w-3 inline text-red-400" /> via{' '}
            <a href="https://mariable.fr" className="text-wedding-olive hover:underline">
              Mariable.fr
            </a>
          </p>
        </footer>
      </main>
    </>
  );
};

export default WeddingSeverineOlivier;

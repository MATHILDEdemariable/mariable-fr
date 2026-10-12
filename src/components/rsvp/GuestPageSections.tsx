import React, { useEffect, useState } from 'react';
import type { GuestPageCustomization } from '@/data/guestPageThemes';

type GuestTheme = {
  palette: { background: string; surface: string; accent: string; text: string };
  font: { heading: string; body: string };
};

const computeTimeLeft = (targetDate: string) => {
  const diff = new Date(`${targetDate}T00:00:00`).getTime() - Date.now();
  if (Number.isNaN(diff) || diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
  };
};

/** Couverture plein écran du mini-site : photo, prénoms, date, décompte */
export const GuestPageHero: React.FC<{
  theme: GuestTheme;
  title: string;
  formattedDate?: string | null;
  eventDate?: string | null;
  location?: string | null;
  welcomeMessage?: string | null;
  customization?: GuestPageCustomization | null;
}> = ({ theme, title, formattedDate, eventDate, location, welcomeMessage, customization }) => {
  const photoUrl = customization?.heroPhotoUrl;
  const showCountdown = customization?.showCountdown !== false && !!eventDate;
  const [timeLeft, setTimeLeft] = useState(() => (eventDate ? computeTimeLeft(eventDate) : null));

  useEffect(() => {
    if (!showCountdown || !eventDate) return;
    const timer = window.setInterval(() => setTimeLeft(computeTimeLeft(eventDate)), 60000);
    return () => window.clearInterval(timer);
  }, [showCountdown, eventDate]);

  const lightText = !!photoUrl;
  const textColor = lightText ? '#FFFFFF' : theme.palette.text;

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center text-center px-6 py-20 overflow-hidden"
      style={{ backgroundColor: theme.palette.background }}
    >
      {photoUrl && (
        <>
          <img src={photoUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)' }} />
        </>
      )}
      <div className="relative max-w-2xl space-y-5" style={{ color: textColor }}>
        <p className="uppercase tracking-[0.35em] text-xs sm:text-sm opacity-90">Nous nous marions</p>
        <h1 className="text-5xl sm:text-7xl leading-tight" style={{ fontFamily: theme.font.heading, color: lightText ? '#FFFFFF' : theme.palette.accent }}>
          {title}
        </h1>
        {(formattedDate || location) && (
          <p className="text-lg sm:text-xl">
            {formattedDate}
            {formattedDate && location ? ' · ' : ''}
            {location}
          </p>
        )}
        {welcomeMessage && <p className="italic text-base sm:text-lg opacity-90 max-w-xl mx-auto whitespace-pre-line">{welcomeMessage}</p>}

        {showCountdown && timeLeft && (
          <div className="flex justify-center gap-6 sm:gap-10 pt-4" aria-label="Décompte avant le mariage">
            {[
              { value: timeLeft.days, label: 'jours' },
              { value: timeLeft.hours, label: 'heures' },
              { value: timeLeft.minutes, label: 'minutes' },
            ].map((unit) => (
              <div key={unit.label} className="text-center">
                <p className="text-4xl sm:text-5xl" style={{ fontFamily: theme.font.heading }}>{unit.value}</p>
                <p className="uppercase tracking-widest text-[11px] opacity-80">{unit.label}</p>
              </div>
            ))}
          </div>
        )}

        <a
          href="#rsvp-form"
          className="inline-block mt-4 px-8 py-3 text-sm uppercase tracking-widest border"
          style={lightText ? { borderColor: '#FFFFFF', color: '#FFFFFF' } : { backgroundColor: theme.palette.accent, color: theme.palette.surface, borderColor: theme.palette.accent }}
        >
          Confirmer ma présence
        </a>
      </div>
    </section>
  );
};

/** Programme de la journée en timeline verticale */
export const GuestPageProgram: React.FC<{ theme: GuestTheme; customization?: GuestPageCustomization | null }> = ({ theme, customization }) => {
  const items = (customization?.program ?? []).filter((item) => item.title?.trim());
  if (items.length === 0) return null;
  return (
    <section className="py-8 text-center">
      <h2 className="text-3xl sm:text-4xl mb-8" style={{ fontFamily: theme.font.heading, color: theme.palette.accent }}>Programme</h2>
      <ol className="relative max-w-md mx-auto text-left border-l pl-8 space-y-8" style={{ borderColor: `${theme.palette.accent}55` }}>
        {items.map((item, index) => (
          <li key={index} className="relative">
            <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full" style={{ backgroundColor: theme.palette.accent }} />
            {item.time && <p className="text-sm tracking-widest" style={{ color: theme.palette.accent }}>{item.time.slice(0, 5)}</p>}
            <p className="text-xl" style={{ fontFamily: theme.font.heading }}>{item.title}</p>
            {item.place && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.place)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline opacity-80"
              >
                {item.place}
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};

/** Coordonnées des mariés, façon signature */
export const GuestPageContactCard: React.FC<{ theme: GuestTheme; customization?: GuestPageCustomization | null }> = ({ theme, customization }) => {
  const contact = customization?.contact;
  const showAddress = !!contact?.showPostalAddress && !!contact?.postalAddress?.trim();
  if (!contact || contact.visible === false || !(contact.names || contact.email || contact.phone || showAddress)) return null;
  return (
    <section className="max-w-2xl mx-auto mt-10 p-8 text-center border" style={{ backgroundColor: theme.palette.surface, borderColor: `${theme.palette.accent}33` }}>
      <p className="uppercase tracking-[0.3em] text-xs opacity-70 mb-3">Une question ? Écrivez-nous</p>
      {contact.names && <p className="text-3xl mb-4" style={{ fontFamily: theme.font.heading, color: theme.palette.accent }}>{contact.names}</p>}
      <div className="space-y-1">
        {contact.email && <a href={`mailto:${contact.email}`} className="block underline">{contact.email}</a>}
        {contact.phone && <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="block underline">{contact.phone}</a>}
        {showAddress && <p className="whitespace-pre-line opacity-80 pt-2">{contact.postalAddress}</p>}
      </div>
    </section>
  );
};

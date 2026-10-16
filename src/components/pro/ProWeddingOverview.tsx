import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar, Users, Heart, Table, Wine, FileText, Home, CalendarRange, Calculator,
  UserCheck, Store, ListChecks, ArrowRight,
} from 'lucide-react';
import type { Wedding } from '@/contexts/WeddingContext';
import InviteCoupleDialog from './InviteCoupleDialog';
import weddingHeroPhoto from '@/assets/editorial/baiser-arche-oliviers.png.asset.json';

type OverviewModule = { labelFr: string; labelEn: string; hintFr: string; hintEn: string; icon: typeof Calendar; path: string };

// Outils Jour J : Planning et Équipe sont deux onglets du module « Mon Jour M ».
const JOUR_J_MODULES: OverviewModule[] = [
  { labelFr: 'Planning Jour J', labelEn: 'Day-of schedule', hintFr: 'Conducteur minute par minute', hintEn: 'Minute-by-minute run sheet', icon: Calendar, path: '/mon-jour-m/planning' },
  { labelFr: 'Équipe & contacts', labelEn: 'Team & contacts', hintFr: 'Témoins, prestataires', hintEn: 'Witnesses, vendors', icon: Users, path: '/mon-jour-m/equipe' },
  { labelFr: 'Cérémonie', labelEn: 'Ceremony', hintFr: 'Cortège, textes, musiques', hintEn: 'Procession, readings, music', icon: Heart, path: '/dashboard/ceremonie' },
  { labelFr: 'Plan de table & menus', labelEn: 'Seating & menus', hintFr: 'Placement, régimes', hintEn: 'Seating, diets', icon: Table, path: '/dashboard/seating-plan' },
  { labelFr: 'Boissons', labelEn: 'Drinks', hintFr: 'Quantités selon invités', hintEn: 'Quantities per guest', icon: Wine, path: '/dashboard/drinks' },
  { labelFr: 'Documents', labelEn: 'Documents', hintFr: 'Contrats, plans techniques', hintEn: 'Contracts, plans', icon: FileText, path: '/mon-jour-m/documents' },
  { labelFr: 'Hébergements', labelEn: 'Accommodation', hintFr: 'Sur place et alentours', hintEn: 'On site and nearby', icon: Home, path: '/dashboard/accommodations' },
];

const ORGANISATION_MODULES: OverviewModule[] = [
  { labelFr: 'Rétroplanning', labelEn: 'Timeline', hintFr: 'De M-12 à J-1', hintEn: 'From M-12 to D-1', icon: CalendarRange, path: '/dashboard/mon-mariage/retroplanning' },
  { labelFr: 'Checklist', labelEn: 'Checklist', hintFr: 'Tâches et échéances', hintEn: 'Tasks and deadlines', icon: ListChecks, path: '/dashboard/checklist-mariage?tab=manuelle' },
  { labelFr: 'Budget & acomptes', labelEn: 'Budget & deposits', hintFr: 'Suivi détaillé', hintEn: 'Detailed tracking', icon: Calculator, path: '/dashboard/budget?tab=detailed' },
  { labelFr: 'Invités & RSVP', labelEn: 'Guests & RSVP', hintFr: 'Liste, réponses, mini-site', hintEn: 'List, replies, mini-site', icon: UserCheck, path: '/dashboard/rsvp' },
  { labelFr: 'Prestataires', labelEn: 'Vendors', hintFr: 'Suivi des devis', hintEn: 'Quote tracking', icon: Store, path: '/dashboard/suivi' },
];

/** Vue d'ensemble d'un mariage ouvert par un professionnel (remplace la vue couple). */
const ProWeddingOverview: React.FC<{ wedding: Wedding }> = ({ wedding }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const isJourJ = wedding.prestation_type === 'jourJ';
  const modules = isJourJ ? JOUR_J_MODULES : [...ORGANISATION_MODULES, ...JOUR_J_MODULES];

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const daysUntil = wedding.wedding_date
    ? Math.ceil((new Date(wedding.wedding_date).getTime() - todayDate.getTime()) / 86400000)
    : null;
  const formattedDate = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : (isEnglish ? 'Date to be set' : 'Date à définir');

  return (
    <div className="max-w-5xl space-y-6 pb-8">
      <section className="relative overflow-hidden min-h-[280px] flex items-end">
        <img src={weddingHeroPhoto.url} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-[center_35%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-editorial-noir/85 via-editorial-noir/55 to-editorial-noir/10" aria-hidden="true" />
        <div className="relative w-full p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-6 items-end text-editorial-beige">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">
              {isJourJ ? (isEnglish ? 'Wedding day coordination' : 'Coordination Jour J') : (isEnglish ? 'Full planning' : 'Organisation complète')}
              {' · '}{formattedDate}{wedding.wedding_location ? ` · ${wedding.wedding_location}` : ''}
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl mt-2">{wedding.title}</h1>
            <p className="text-sm opacity-90 mt-2 max-w-lg">
              {isJourJ
                ? (isEnglish ? 'The day, minute by minute, shared with the whole team.' : 'Le Jour J, minute par minute, partagé avec toute l’équipe.')
                : (isEnglish ? 'All the planning, from first quotes to the big day.' : 'Toute l’organisation, des premiers devis au Jour J.')}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 [&_button]:rounded-none [&_button]:min-h-[44px]">
              <InviteCoupleDialog weddingId={wedding.id} />
              <Link to="/mon-jour-m/planning" className="inline-flex items-center gap-2 border border-editorial-beige/60 px-4 min-h-[44px] text-sm hover:bg-editorial-beige/10">
                <Calendar className="h-4 w-4" /> {isEnglish ? 'Open the day-of schedule' : 'Ouvrir le planning Jour J'}
              </Link>
            </div>
          </div>
          {daysUntil !== null && daysUntil >= 0 && (
            <div className="text-center sm:border-l sm:border-editorial-beige/30 sm:pl-8">
              <p className="font-serif text-5xl">{daysUntil === 0 ? (isEnglish ? 'Today' : 'Jour J') : daysUntil}</p>
              {daysUntil > 0 && <p className="text-xs uppercase tracking-widest opacity-80">{isEnglish ? 'days to go' : 'jours restants'}</p>}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="pro-wedding-tools">
        <h2 id="pro-wedding-tools" className="font-serif text-2xl text-foreground mb-3">
          {isJourJ
            ? (isEnglish ? `Your ${modules.length} wedding-day tools` : `Vos ${modules.length} outils Jour J`)
            : (isEnglish ? 'All your tools' : 'Tous vos outils')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((module) => (
            <Link key={module.path} to={module.path} className="group bg-background border border-border p-4 min-h-[120px] transition-all hover:border-wedding-olive hover:shadow-md">
              <module.icon className="h-6 w-6 text-wedding-olive" aria-hidden="true" />
              <h3 className="font-semibold text-sm mt-3 text-foreground">{isEnglish ? module.labelEn : module.labelFr}</h3>
              <p className="text-xs text-muted-foreground mt-1">{isEnglish ? module.hintEn : module.hintFr}</p>
              <ArrowRight className="h-4 w-4 mt-2 text-wedding-olive opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProWeddingOverview;

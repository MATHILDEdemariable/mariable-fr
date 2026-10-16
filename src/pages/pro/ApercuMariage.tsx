import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronDown, Calendar, Users, Table, Wine, FileText, Home, CalendarRange, Calculator, UserCheck, Store, Globe, Heart, Images, Lock, Share2, CheckCircle2 } from 'lucide-react';
import { ModeBadge, MockupBanner } from './ApercuEspacePro';

/**
 * Maquette autonome du dashboard d'un mariage (commun pro et couple).
 * Commutateur Coordination Jour J / Organisation complète. Données fictives.
 */

type WeddingMode = 'jourj' | 'complet';

type MockModule = { label: string; icon: typeof Calendar; stat: string; hint: string; parent?: string };

// Planning et Équipe sont deux onglets du module existant « Mon Jour M » (/mon-jour-m).
const JOURJ_MODULES: MockModule[] = [
  { label: 'Planning Jour J', icon: Calendar, stat: '11 étapes', hint: 'Conducteur minute par minute', parent: 'Mon Jour M' },
  { label: 'Équipe & contacts', icon: Users, stat: '7 personnes', hint: 'Témoins, prestataires', parent: 'Mon Jour M' },
  { label: 'Cérémonie', icon: Heart, stat: '2 / 4', hint: 'Cortège, textes, musiques' },
  { label: 'Plan de table & menus', icon: Table, stat: '48 / 50 placés', hint: '3 régimes à signaler' },
  { label: 'Boissons', icon: Wine, stat: '120 bouteilles', hint: 'Calcul selon invités' },
  { label: 'Documents', icon: FileText, stat: '5 fichiers', hint: 'Contrats, plans techniques' },
  { label: 'Hébergements', icon: Home, stat: '18 couchages', hint: 'Sur place et alentours' },
];

const COMPLET_EXTRA: MockModule[] = [
  { label: 'Rétroplanning', icon: CalendarRange, stat: '12 / 18 tâches', hint: 'Kanban de M-12 à J-1' },
  { label: 'Budget', icon: Calculator, stat: '34 500 €', hint: '8 200 € restant à payer' },
  { label: 'Invités & RSVP', icon: UserCheck, stat: '42 oui · 6 en attente', hint: 'Liste, formulaire, mini-site' },
  { label: 'Prestataires', icon: Store, stat: '9 réservés', hint: 'Suivi des devis' },
  { label: 'Mini-site', icon: Globe, stat: 'En ligne', hint: 'Page des invités' },
  { label: 'Album & après Jour J', icon: Images, stat: 'QR code prêt', hint: 'Photos des invités' },
];

const TODAY_ITEMS: Record<WeddingMode, string[]> = {
  jourj: ['Partager la feuille de route aux prestataires', 'Signaler les 3 régimes au traiteur', 'Confirmer l\'heure d\'arrivée du DJ'],
  complet: ['Valider le devis traiteur', 'Relancer 6 invités sans réponse', 'Payer l\'acompte photographe (900 €)'],
};

const ApercuMariage: React.FC = () => {
  const [mode, setMode] = useState<WeddingMode>('complet');
  const modules = mode === 'jourj' ? JOURJ_MODULES : [...COMPLET_EXTRA.slice(0, 3), ...JOURJ_MODULES.slice(0, 4), ...COMPLET_EXTRA.slice(3), ...JOURJ_MODULES.slice(4)];

  const menu = mode === 'jourj'
    ? [{ section: 'Jour J', items: JOURJ_MODULES }]
    : [
        { section: 'Préparatifs', items: COMPLET_EXTRA.slice(0, 4) },
        { section: 'Jour J', items: JOURJ_MODULES.slice(0, 5) },
        { section: 'Invités & extras', items: [...COMPLET_EXTRA.slice(4), ...JOURJ_MODULES.slice(5)] },
      ];

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#2B2A26]">
      <Helmet>
        <title>Aperçu dashboard mariage | Mariable</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <MockupBanner other={{ to: '/pro/apercu-espace-pro', label: 'Voir la maquette de l\'espace pro' }} />

      {/* Fil d'Ariane + sélecteur */}
      <div className="bg-white border-b border-[#E8DFD0] px-4 sm:px-8 py-3 flex flex-wrap items-center gap-3 text-sm">
        <Link to="/pro/apercu-espace-pro" className="inline-flex items-center gap-1 text-gray-600 hover:text-wedding-olive"><ChevronLeft className="h-4 w-4" /> Mon espace pro</Link>
        <span className="text-gray-300">/</span>
        <span className="inline-flex items-center gap-1 font-semibold">Camille & Thomas <ChevronDown className="h-4 w-4 text-gray-400" /></span>
        <ModeBadge mode={mode} />
      </div>

      {/* Commutateur maquette */}
      <div className="px-4 sm:px-8 pt-6">
        <p className="text-xs text-gray-500 mb-2">Comparer les deux formules :</p>
        <div className="inline-flex border border-[#2B2A26]" role="tablist">
          {(['jourj', 'complet'] as WeddingMode[]).map((option) => (
            <button key={option} role="tab" aria-selected={mode === option} onClick={() => setMode(option)}
              className={`px-4 py-2.5 text-sm font-medium min-h-[44px] ${mode === option ? 'bg-[#2B2A26] text-[#F8F5EF]' : 'bg-white'}`}>
              {option === 'jourj' ? 'Coordination Jour J' : 'Organisation complète'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        <aside className="hidden md:block w-60 shrink-0 p-4 pt-6">
          <div className="bg-white border border-[#E8DFD0] p-3 space-y-1">
            <span className="block px-3 py-2 text-sm font-medium bg-wedding-olive text-white">Vue d'ensemble</span>
            {menu.map((group) => (
              <div key={group.section}>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 pt-3 pb-1">{group.section}</p>
                {group.items.map((item) => (
                  <span key={item.label} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}{item.parent && <span className="block text-[10px] text-gray-400">dans {item.parent}</span>}</span>
                  </span>
                ))}
              </div>
            ))}
            {mode === 'jourj' && (
              <div className="mt-3 p-3 bg-[#F8F5EF] text-xs text-gray-600 flex gap-2">
                <Lock className="h-4 w-4 shrink-0" /> Budget, rétroplanning, RSVP : inclus dans l'organisation complète.
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-8 pt-6 space-y-6 max-w-5xl">
          {/* Hero mariage */}
          <section className="bg-[#2B2A26] text-[#F8F5EF] p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-70">10 juillet 2027 · Château de la Tour, Chantilly</p>
              <h1 className="font-serif text-3xl sm:text-4xl mt-2">Camille & Thomas</h1>
              <p className="text-sm opacity-80 mt-2">{mode === 'jourj' ? 'Votre Jour J, minute par minute, partagé avec toute l\'équipe.' : 'Toute l\'organisation, des premiers devis au Jour J.'}</p>
              {mode === 'jourj' && (
                <button className="mt-4 inline-flex items-center gap-2 bg-[#F8F5EF] text-[#2B2A26] px-4 py-2.5 text-sm font-medium min-h-[44px]"><Share2 className="h-4 w-4" /> Partager le planning</button>
              )}
            </div>
            <div className="text-center sm:border-l sm:border-white/20 sm:pl-8">
              <p className="font-serif text-5xl">267</p>
              <p className="text-xs uppercase tracking-widest opacity-70">jours restants</p>
            </div>
          </section>

          {/* À faire */}
          <section aria-labelledby="a-faire" className="bg-white border border-[#E8DFD0] p-5">
            <h2 id="a-faire" className="font-serif text-xl mb-3">À faire pour ce mariage</h2>
            <ul className="space-y-2">
              {TODAY_ITEMS[mode].map((task) => (
                <li key={task} className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-wedding-olive" /> {task}</li>
              ))}
            </ul>
          </section>

          {/* Modules */}
          <section aria-labelledby="modules">
            <h2 id="modules" className="font-serif text-xl mb-3">{mode === 'jourj' ? `Vos ${JOURJ_MODULES.length} outils Jour J` : 'Tous vos outils'}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {modules.map((module) => (
                <div key={module.label} className="bg-white border border-[#E8DFD0] p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <module.icon className="h-6 w-6 text-wedding-olive" />
                  <h3 className="font-semibold text-sm mt-3">{module.label}</h3>
                  <p className="text-lg font-serif mt-1">{module.stat}</p>
                  <p className="text-xs text-gray-500">{module.hint}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ApercuMariage;

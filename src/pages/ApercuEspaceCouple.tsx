import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Users, Heart, Table, Wine, Home, Share2, CalendarRange, Calculator, UserCheck, Store, Building2, FileText, Globe, Images, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { ModeBadge, MockupBanner } from './pro/ApercuEspacePro';

/**
 * Maquette autonome du nouvel espace couple. Données fictives, aucune écriture.
 * Le couple choisit à l'arrivée Coordination Jour J ou Organisation complète, et peut basculer à tout moment.
 */

type WeddingMode = 'jourj' | 'complet';
type MockModule = { label: string; icon: typeof Calendar; stat: string; hint: string; parent?: string };

const JOURJ_MODULES: MockModule[] = [
  { label: 'Planning Jour J', icon: Calendar, stat: '11 étapes', hint: 'Minute par minute', parent: 'Mon Jour M' },
  { label: 'Équipe & rôles', icon: Users, stat: '7 personnes', hint: 'Témoins, contacts d\'urgence', parent: 'Mon Jour M' },
  { label: 'Cérémonie & cortège', icon: Heart, stat: '2 / 4', hint: 'Entrées, textes, musiques' },
  { label: 'Plan de table & menus', icon: Table, stat: '48 / 50 placés', hint: '3 régimes à signaler' },
  { label: 'Boissons', icon: Wine, stat: '120 bouteilles', hint: 'Vin d\'honneur et soirée' },
  { label: 'Hébergements', icon: Home, stat: '18 couchages', hint: 'Attribution des chambres' },
  { label: 'Partages Jour J', icon: Share2, stat: '4 liens', hint: 'Proches et prestataires' },
];

const PREPARATION_MODULES: MockModule[] = [
  { label: 'Rétroplanning & checklist', icon: CalendarRange, stat: '12 / 18 tâches', hint: 'De M-12 à J-1' },
  { label: 'Budget & acomptes', icon: Calculator, stat: '34 500 €', hint: '8 200 € restant à payer' },
  { label: 'Prestataires & devis', icon: Store, stat: '9 réservés', hint: 'Suivi, contrats, panier' },
  { label: 'Invités & RSVP', icon: UserCheck, stat: '42 oui · 6 en attente', hint: 'Liste et invitations' },
  { label: 'Site des invités', icon: Globe, stat: 'En ligne', hint: 'Infos pratiques' },
  { label: 'Mairie & documents', icon: Building2, stat: '3 / 5 pièces', hint: 'Dossier civil' },
];

const AFTER_MODULES: MockModule[] = [
  { label: 'Album invités', icon: Images, stat: 'QR code prêt', hint: 'Photos partagées' },
  { label: 'Après Jour J', icon: FileText, stat: '0 / 6', hint: 'Remerciements, avis' },
];

const NEXT_STEPS: Record<WeddingMode, string[]> = {
  jourj: ['Compléter le planning de 14h à 18h', 'Indiquer les régimes de 3 invités', 'Partager le planning à vos témoins'],
  complet: ['Valider le devis traiteur', 'Relancer 6 invités sans réponse', 'Verser l\'acompte photographe (900 €)'],
};

const ModuleCard: React.FC<{ module: MockModule }> = ({ module }) => (
  <div className="bg-white border border-[#E8DFD0] p-4 hover:shadow-md transition-shadow cursor-pointer">
    <module.icon className="h-6 w-6 text-wedding-olive" aria-hidden="true" />
    <h3 className="font-semibold text-sm mt-3">{module.label}</h3>
    <p className="text-lg font-serif mt-1">{module.stat}</p>
    <p className="text-xs text-gray-500">{module.hint}</p>
  </div>
);

const ApercuEspaceCouple: React.FC = () => {
  const [mode, setMode] = useState<WeddingMode | null>(null);

  const menu = mode === 'jourj'
    ? [{ section: 'Jour J', items: JOURJ_MODULES }, { section: 'Après', items: AFTER_MODULES }]
    : [{ section: 'Préparatifs', items: PREPARATION_MODULES }, { section: 'Jour J', items: JOURJ_MODULES }, { section: 'Après', items: AFTER_MODULES }];

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#2B2A26]">
      <Helmet>
        <title>Aperçu espace couple | Mariable</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <MockupBanner other={{ to: '/pro/apercu-mariage', label: 'Voir la maquette côté pro' }} />

      {/* Écran d'accueil : choix du parcours */}
      {mode === null ? (
        <main className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
          <section aria-labelledby="choix-parcours">
            <p className="text-xs uppercase tracking-widest text-gray-500">Bienvenue Camille & Thomas</p>
            <h1 id="choix-parcours" className="font-serif text-3xl sm:text-4xl mt-2">Où en êtes-vous de vos préparatifs ?</h1>
            <p className="text-sm text-gray-600 mt-3">Choisissez votre point de départ. Vous pourrez changer à tout moment, sans rien perdre.</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <button onClick={() => setMode('complet')} className="text-left bg-white border border-[#E8DFD0] p-6 hover:border-wedding-olive min-h-[44px]">
                <CalendarRange className="h-7 w-7 text-wedding-olive" aria-hidden="true" />
                <h2 className="font-serif text-xl mt-4">Je commence l'organisation</h2>
                <p className="text-sm text-gray-600 mt-2">Budget, prestataires, invités, rétroplanning… tout, des premiers devis au Jour J.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-wedding-olive mt-4">Organisation complète <ArrowRight className="h-4 w-4" /></span>
              </button>
              <button onClick={() => setMode('jourj')} className="text-left bg-[#2B2A26] text-[#F8F5EF] p-6 min-h-[44px]">
                <Sparkles className="h-7 w-7" aria-hidden="true" />
                <h2 className="font-serif text-xl mt-4">Tout est réservé, je prépare le Jour J</h2>
                <p className="text-sm opacity-80 mt-2">Planning minute par minute, cérémonie, plan de table et partage avec vos proches.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium mt-4">Coordination Jour J <ArrowRight className="h-4 w-4" /></span>
              </button>
            </div>
          </section>
        </main>
      ) : (
        <>
          <div className="bg-white border-b border-[#E8DFD0] px-4 sm:px-8 py-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold">Mon espace mariage</span>
            <ModeBadge mode={mode} />
            <div className="ml-auto inline-flex border border-[#2B2A26]" role="tablist" aria-label="Parcours">
              {(['jourj', 'complet'] as WeddingMode[]).map((option) => (
                <button key={option} role="tab" aria-selected={mode === option} onClick={() => setMode(option)}
                  className={`px-3 py-2 text-xs sm:text-sm font-medium min-h-[44px] ${mode === option ? 'bg-[#2B2A26] text-[#F8F5EF]' : 'bg-white'}`}>
                  {option === 'jourj' ? 'Jour J' : 'Organisation complète'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex">
            <aside className="hidden md:block w-60 shrink-0 p-4 pt-6">
              <nav className="bg-white border border-[#E8DFD0] p-3 space-y-1" aria-label="Modules">
                <span className="block px-3 py-2 text-sm font-medium bg-wedding-olive text-white">Vue d'ensemble</span>
                {menu.map((group) => (
                  <div key={group.section}>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 pt-3 pb-1">{group.section}</p>
                    {group.items.map((item) => (
                      <span key={item.label} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600">
                        <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{item.label}{item.parent && <span className="block text-[10px] text-gray-400">dans {item.parent}</span>}</span>
                      </span>
                    ))}
                  </div>
                ))}
                {mode === 'jourj' && (
                  <button onClick={() => setMode('complet')} className="mt-3 w-full text-left p-3 bg-[#F8F5EF] text-xs text-gray-600">
                    Besoin du budget ou des prestataires ? <span className="underline">Passer en organisation complète</span>
                  </button>
                )}
              </nav>
            </aside>

            <main className="flex-1 p-4 sm:p-8 pt-6 space-y-6 max-w-5xl">
              <section className="bg-[#2B2A26] text-[#F8F5EF] p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-70">10 juillet 2027 · Château de la Tour, Chantilly</p>
                  <h1 className="font-serif text-3xl sm:text-4xl mt-2">Camille & Thomas</h1>
                  <p className="text-sm opacity-80 mt-2">{mode === 'jourj' ? 'Votre Jour J, serein et partagé avec vos proches.' : 'Toute votre organisation, pas à pas.'}</p>
                  <p className="text-xs opacity-70 mt-3">Wedding planner : Atelier Lumière · accès partagé</p>
                </div>
                <div className="text-center sm:border-l sm:border-white/20 sm:pl-8">
                  <p className="font-serif text-5xl">267</p>
                  <p className="text-xs uppercase tracking-widest opacity-70">jours restants</p>
                </div>
              </section>

              <section aria-labelledby="prochaines-etapes" className="bg-white border border-[#E8DFD0] p-5">
                <h2 id="prochaines-etapes" className="font-serif text-xl mb-3">Vos 3 prochaines étapes</h2>
                <ul className="space-y-2">
                  {NEXT_STEPS[mode].map((step) => (
                    <li key={step} className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-wedding-olive" aria-hidden="true" /> {step}</li>
                  ))}
                </ul>
              </section>

              {menu.map((group) => (
                <section key={group.section} aria-label={group.section}>
                  <h2 className="font-serif text-xl mb-3">{group.section}</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.items.map((module) => <ModuleCard key={module.label} module={module} />)}
                  </div>
                </section>
              ))}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default ApercuEspaceCouple;

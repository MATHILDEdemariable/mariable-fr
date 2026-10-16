import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CalendarHeart, BookUser, LayoutTemplate, Plus, Settings, GraduationCap, ArrowRight, Flame, Target, Bell, Archive, Eye, Clock } from 'lucide-react';

/**
 * Maquette autonome (aperçu) de l'accueil Espace Pro.
 * Données fictives — ne remplace pas /pro tant que non validée.
 */

type WeddingMode = 'jourj' | 'complet';

const DEMO_WEDDINGS: { title: string; date: string; daysLeft: number; mode: WeddingMode; progress: number; next: string }[] = [
  { title: 'Jeanne & Jean', date: '17 oct. 2026', daysLeft: 1, mode: 'jourj', progress: 92, next: 'Envoyer la feuille de route aux prestataires' },
  { title: 'Séverine & Olivier', date: '12 juin 2027', daysLeft: 239, mode: 'complet', progress: 41, next: 'Valider le devis traiteur' },
  { title: 'Camille & Thomas', date: '10 juil. 2027', daysLeft: 267, mode: 'complet', progress: 28, next: 'Lancer le mini-site RSVP' },
];

const MATRIX = [
  {
    key: 'urgent', title: 'Urgent & important', subtitle: 'Cette semaine', icon: Flame, tone: 'bg-[#2B2A26] text-[#F8F5EF]',
    items: [
      { task: 'Feuille de route Jour J à partager', wedding: 'Jeanne & Jean', source: 'Planning Jour J', when: 'Demain' },
      { task: 'Solde fleuriste — 1 200 €', wedding: 'Jeanne & Jean', source: 'Budget', when: 'J-1' },
      { task: '3 tâches en retard', wedding: 'Séverine & Olivier', source: 'Rétroplanning', when: 'En retard' },
    ],
  },
  {
    key: 'important', title: 'Important, pas urgent', subtitle: 'À planifier', icon: Target, tone: 'bg-wedding-olive text-white',
    items: [
      { task: 'Acompte photographe — 900 €', wedding: 'Camille & Thomas', source: 'Budget', when: 'Dans 3 sem.' },
      { task: 'Ébauche du plan de table', wedding: 'Séverine & Olivier', source: 'Plan de table', when: 'Novembre' },
    ],
  },
  {
    key: 'relance', title: 'À relancer', subtitle: 'Délégable', icon: Bell, tone: 'bg-[#E8DFD0] text-[#2B2A26]',
    items: [
      { task: '6 invités sans réponse RSVP', wedding: 'Camille & Thomas', source: 'Invités', when: '—' },
      { task: '2 prestataires sans téléphone', wedding: 'Jeanne & Jean', source: 'Équipe Jour J', when: '—' },
    ],
  },
  {
    key: 'fond', title: 'Plus tard', subtitle: 'Peut attendre', icon: Archive, tone: 'bg-white text-[#2B2A26] border border-[#E8DFD0]',
    items: [
      { task: 'Remerciements prestataires', wedding: 'Mathilde & Lambert', source: 'Après Jour J', when: '—' },
    ],
  },
];

const COMMON_TOOLS = [
  { label: 'Carnet d\'adresses', desc: '48 prestataires de confiance', icon: BookUser },
  { label: 'Mes modèles', desc: 'Rétroplanning type, planning Jour J type — à injecter en 1 clic', icon: LayoutTemplate, badge: 'Nouveau' },
  { label: 'Tuto & guide', desc: 'Prise en main en 5 min', icon: GraduationCap },
  { label: 'Paramètres du compte', desc: 'Coordonnées, offre', icon: Settings },
];

export const ModeBadge: React.FC<{ mode: WeddingMode }> = ({ mode }) => (
  <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${mode === 'jourj' ? 'bg-[#2B2A26] text-[#F8F5EF]' : 'bg-wedding-olive text-white'}`}>
    {mode === 'jourj' ? 'Coordination Jour J' : 'Organisation complète'}
  </span>
);

export const MockupBanner: React.FC<{ other: { to: string; label: string } }> = ({ other }) => (
  <div className="bg-[#2B2A26] text-[#F8F5EF] text-xs sm:text-sm px-4 py-2 flex flex-wrap items-center justify-between gap-2">
    <span className="flex items-center gap-2"><Eye className="h-4 w-4" /> Maquette — données fictives, rien n'est modifié</span>
    <Link to={other.to} className="underline underline-offset-2">{other.label} →</Link>
  </div>
);

const ApercuEspacePro: React.FC = () => (
  <div className="min-h-screen bg-[#F8F5EF] text-[#2B2A26]">
    <Helmet>
      <title>Aperçu Espace Pro | Mariable</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <MockupBanner other={{ to: '/pro/apercu-mariage', label: 'Voir la maquette d\'un mariage' }} />

    <div className="flex">
      {/* Menu gauche simple */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[#E8DFD0] bg-white min-h-screen p-4 gap-1">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 pt-2">Mon espace pro</p>
        <span className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium bg-wedding-olive text-white"><Clock className="h-4 w-4" /> Aujourd'hui</span>
        <span className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600"><CalendarHeart className="h-4 w-4" /> Mes mariages</span>
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 pt-4">Tronc commun</p>
        {COMMON_TOOLS.map((tool) => (
          <span key={tool.label} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600"><tool.icon className="h-4 w-4" /> {tool.label}</span>
        ))}
        <span className="mt-auto text-xs text-gray-400 px-3">mariable.fr ↗</span>
      </aside>

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-wedding-olive font-semibold">Vendredi 16 octobre</p>
            <h1 className="font-serif text-3xl sm:text-4xl mt-1">Bonjour Mathilde</h1>
            <p className="text-sm text-gray-600 mt-1">7 actions cette semaine sur 3 mariages en cours.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-[#2B2A26] text-[#F8F5EF] px-4 py-3 text-sm font-medium min-h-[44px]">
            <Plus className="h-4 w-4" /> Nouveau mariage
          </button>
        </header>

        {/* Matrice */}
        <section aria-labelledby="matrice">
          <div className="flex items-baseline justify-between mb-3">
            <h2 id="matrice" className="font-serif text-2xl">Ma feuille de route</h2>
            <span className="text-xs text-gray-500">Remplie automatiquement depuis vos mariages</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {MATRIX.map((quadrant) => (
              <div key={quadrant.key} className="bg-white border border-[#E8DFD0]">
                <div className={`flex items-center gap-2 px-4 py-3 ${quadrant.tone}`}>
                  <quadrant.icon className="h-4 w-4" />
                  <h3 className="font-semibold text-sm">{quadrant.title}</h3>
                  <span className="ml-auto text-xs opacity-80">{quadrant.subtitle} · {quadrant.items.length}</span>
                </div>
                <ul className="divide-y divide-[#F0EADF]">
                  {quadrant.items.map((item) => (
                    <li key={item.task} className="px-4 py-3 flex items-start gap-3 hover:bg-[#FBF9F5] cursor-pointer">
                      <span className="mt-1 h-4 w-4 border border-gray-300 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.task}</p>
                        <p className="text-xs text-gray-500">{item.wedding} · {item.source}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{item.when}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Mariages */}
        <section aria-labelledby="mariages">
          <h2 id="mariages" className="font-serif text-2xl mb-3">Mes mariages en cours</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEMO_WEDDINGS.map((wedding) => (
              <Link key={wedding.title} to="/pro/apercu-mariage" className="group bg-white border border-[#E8DFD0] p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <ModeBadge mode={wedding.mode} />
                  <span className="text-xs font-semibold text-wedding-olive">J-{wedding.daysLeft}</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl">{wedding.title}</h3>
                  <p className="text-xs text-gray-500">{wedding.date}</p>
                </div>
                <div className="h-1.5 bg-[#F0EADF]"><div className="h-full bg-wedding-olive" style={{ width: `${wedding.progress}%` }} /></div>
                <p className="text-xs text-gray-600"><span className="font-semibold">Prochaine étape :</span> {wedding.next}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium group-hover:text-wedding-olive">Ouvrir le mariage <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </section>

        {/* Tronc commun */}
        <section aria-labelledby="tronc">
          <h2 id="tronc" className="font-serif text-2xl mb-1">Tronc commun</h2>
          <p className="text-sm text-gray-600 mb-3">Vos outils partagés entre tous vos mariages.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {COMMON_TOOLS.map((tool) => (
              <div key={tool.label} className="bg-white border border-[#E8DFD0] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <tool.icon className="h-6 w-6 text-wedding-olive" />
                  {tool.badge && <span className="text-[10px] font-semibold uppercase bg-wedding-olive text-white px-1.5 py-0.5">{tool.badge}</span>}
                </div>
                <h3 className="font-semibold text-sm">{tool.label}</h3>
                <p className="text-xs text-gray-500">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  </div>
);

export default ApercuEspacePro;

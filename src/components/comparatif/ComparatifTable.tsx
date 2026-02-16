import { Check, X, Crown, Users, Clock, Heart, Shield, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ComparisonOption {
  value: string;
  description: string;
  status: 'best' | 'ok' | 'warning' | 'bad';
}

interface Comparison {
  category: string;
  icon: JSX.Element;
  seul: ComparisonOption;
  weddingPlanner: ComparisonOption;
  mariable: ComparisonOption;
}

const comparisons: Comparison[] = [
  {
    category: "Prix total",
    icon: <Crown className="w-5 h-5" />,
    seul: { value: "0€", description: "Gratuit mais chronophage", status: "ok" },
    weddingPlanner: { value: "2000-10000€", description: "Coût élevé selon prestataire", status: "warning" },
    mariable: { value: "Gratuit + Premium 29€", description: "Outils gratuits, fonctionnalités avancées à 29€ (accès à vie)", status: "best" }
  },
  {
    category: "Autonomie",
    icon: <Users className="w-5 h-5" />,
    seul: { value: "Totale", description: "Vous gérez tout seul", status: "warning" },
    weddingPlanner: { value: "Déléguée", description: "Perte de contrôle", status: "ok" },
    mariable: { value: "Guidée", description: "Accompagnement sans dépendance", status: "best" }
  },
  {
    category: "Simplicité",
    icon: <Sparkles className="w-5 h-5" />,
    seul: { value: "Complexe", description: "Multiples outils non connectés", status: "warning" },
    weddingPlanner: { value: "Déléguée", description: "Dépendance au prestataire", status: "ok" },
    mariable: { value: "Intuitive", description: "Interface unifiée et simple", status: "best" }
  },
  {
    category: "Transparence",
    icon: <Shield className="w-5 h-5" />,
    seul: { value: "Variable", description: "Dépend de vos recherches", status: "warning" },
    weddingPlanner: { value: "Limitée", description: "Accès restreint aux informations", status: "warning" },
    mariable: { value: "100%", description: "Accès complet aux données", status: "best" }
  },
  {
    category: "Gestion du temps",
    icon: <Clock className="w-5 h-5" />,
    seul: { value: "À vous", description: "Des centaines d'heures", status: "bad" },
    weddingPlanner: { value: "Entièrement gérée", description: "Mais à prix élevé", status: "ok" },
    mariable: { value: "Optimisée", description: "Outils pour gagner du temps", status: "best" }
  },
  {
    category: "Support disponible",
    icon: <Heart className="w-5 h-5" />,
    seul: { value: "Aucun", description: "Vous êtes seul(e)", status: "bad" },
    weddingPlanner: { value: "Personnalisé", description: "Mais coûteux", status: "ok" },
    mariable: { value: "Outils + conseils", description: "Support optimal", status: "best" }
  },
  {
    category: "Accès prestataires",
    icon: <Sparkles className="w-5 h-5" />,
    seul: { value: "Recherche manuelle", description: "Chronophage et incertain", status: "warning" },
    weddingPlanner: { value: "Réseau fermé", description: "Limité aux partenaires", status: "ok" },
    mariable: { value: "Base complète", description: "Tous les prestataires référencés", status: "best" }
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "best":
      return <Check className="w-5 h-5 text-editorial-noir" />;
    case "ok":
      return <Check className="w-5 h-5 text-editorial-noir/50" />;
    case "warning":
      return <X className="w-5 h-5 text-editorial-noir/40" />;
    case "bad":
      return <X className="w-5 h-5 text-editorial-noir/60" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "best":
      return "border-editorial-noir/20 bg-editorial-beige";
    case "ok":
      return "border-editorial-noir/10 bg-gray-50";
    case "warning":
      return "border-editorial-noir/10 bg-gray-50";
    case "bad":
      return "border-editorial-noir/10 bg-gray-100";
    default:
      return "border-editorial-noir/10 bg-gray-50";
  }
};

const MobileComparatifView = () => (
  <div className="space-y-6">
    {/* Card Organiser seul */}
    <div className="border border-editorial-noir/10">
      <div className="bg-gray-50 p-4">
        <h3 className="text-center text-lg font-serif text-editorial-noir">Organiser seul</h3>
        <p className="text-sm text-editorial-noir/60 text-center">Autonomie totale</p>
      </div>
      <div className="p-4 space-y-3">
        {comparisons.map((comp) => (
          <div key={comp.category} className={`p-3 border ${getStatusColor(comp.seul.status)}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {comp.icon}
                <span className="font-medium text-sm text-editorial-noir">{comp.category}</span>
              </div>
              {getStatusIcon(comp.seul.status)}
            </div>
            <p className="font-semibold text-sm text-editorial-noir">{comp.seul.value}</p>
            <p className="text-xs text-editorial-noir/60">{comp.seul.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Card Wedding Planner */}
    <div className="border border-editorial-noir/10">
      <div className="bg-gray-50 p-4">
        <h3 className="text-center text-lg font-serif text-editorial-noir">Wedding Planner</h3>
        <p className="text-sm text-editorial-noir/60 text-center">Service traditionnel</p>
      </div>
      <div className="p-4 space-y-3">
        {comparisons.map((comp) => (
          <div key={comp.category} className={`p-3 border ${getStatusColor(comp.weddingPlanner.status)}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {comp.icon}
                <span className="font-medium text-sm text-editorial-noir">{comp.category}</span>
              </div>
              {getStatusIcon(comp.weddingPlanner.status)}
            </div>
            <p className="font-semibold text-sm text-editorial-noir">{comp.weddingPlanner.value}</p>
            <p className="text-xs text-editorial-noir/60">{comp.weddingPlanner.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Card Mariable - Recommandée */}
    <div className="border-2 border-editorial-noir shadow-lg relative">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <span className="bg-editorial-noir text-white px-4 py-1 text-sm font-medium">
          Recommandé
        </span>
      </div>
      <div className="bg-editorial-beige p-4">
        <h3 className="text-center text-lg font-serif text-editorial-noir">Mariable</h3>
        <p className="text-sm text-editorial-noir/60 text-center">Solution moderne</p>
      </div>
      <div className="p-4 space-y-3">
        {comparisons.map((comp) => (
          <div key={comp.category} className={`p-3 border ${getStatusColor(comp.mariable.status)}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {comp.icon}
                <span className="font-medium text-sm text-editorial-noir">{comp.category}</span>
              </div>
              {getStatusIcon(comp.mariable.status)}
            </div>
            <p className="font-semibold text-sm text-editorial-noir">{comp.mariable.value}</p>
            <p className="text-xs text-editorial-noir/60">{comp.mariable.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DesktopComparatifView = () => (
  <>
    {/* Headers */}
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div></div>
      <div className="text-center p-6 bg-white border border-editorial-noir/10">
        <h3 className="text-lg font-serif text-editorial-noir mb-2">Organiser seul</h3>
        <p className="text-sm text-editorial-noir/60">Autonomie totale</p>
      </div>
      <div className="text-center p-6 bg-white border border-editorial-noir/10">
        <h3 className="text-lg font-serif text-editorial-noir mb-2">Wedding Planner</h3>
        <p className="text-sm text-editorial-noir/60">Service traditionnel</p>
      </div>
      <div className="text-center p-6 bg-editorial-noir border border-editorial-noir relative">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-editorial-noir text-white px-4 py-1 text-sm font-medium">
            Recommandé
          </span>
        </div>
        <h3 className="text-lg font-serif text-white mb-2">Mariable</h3>
        <p className="text-sm text-white/80">Solution moderne</p>
      </div>
    </div>

    {/* Comparison Rows */}
    <div className="space-y-4">
      {comparisons.map((comparison, index) => (
        <div key={index} className="grid grid-cols-4 gap-4">
          {/* Category */}
          <div className="flex items-center p-4 bg-white border border-editorial-noir/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-editorial-beige text-editorial-noir">
                {comparison.icon}
              </div>
              <span className="font-medium text-editorial-noir">{comparison.category}</span>
            </div>
          </div>

          {/* Seul */}
          <div className={`p-4 border ${getStatusColor(comparison.seul.status)}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="font-semibold text-editorial-noir">{comparison.seul.value}</span>
              {getStatusIcon(comparison.seul.status)}
            </div>
            <p className="text-sm text-editorial-noir/60">{comparison.seul.description}</p>
          </div>

          {/* Wedding Planner */}
          <div className={`p-4 border ${getStatusColor(comparison.weddingPlanner.status)}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="font-semibold text-editorial-noir">{comparison.weddingPlanner.value}</span>
              {getStatusIcon(comparison.weddingPlanner.status)}
            </div>
            <p className="text-sm text-editorial-noir/60">{comparison.weddingPlanner.description}</p>
          </div>

          {/* Mariable */}
          <div className={`p-4 shadow-sm border ${getStatusColor(comparison.mariable.status)}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="font-semibold text-editorial-noir">{comparison.mariable.value}</span>
              {getStatusIcon(comparison.mariable.status)}
            </div>
            <p className="text-sm text-editorial-noir/60">{comparison.mariable.description}</p>
          </div>
        </div>
      ))}
    </div>
  </>
);

export const ComparatifTable = () => {
  const isMobile = useIsMobile();

  return (
    <div className="max-w-6xl mx-auto">
      {isMobile ? <MobileComparatifView /> : <DesktopComparatifView />}
    </div>
  );
};

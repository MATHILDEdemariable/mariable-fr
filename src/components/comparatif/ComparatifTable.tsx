import { Check, X, Crown, Users, Clock, Heart, Shield, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    mariable: { value: "0-900€", description: "Accessible à tous les budgets", status: "best" }
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
      return <Check className="w-5 h-5 text-wedding-olive" />;
    case "ok":
      return <Check className="w-5 h-5 text-gray-500" />;
    case "warning":
      return <X className="w-5 h-5 text-amber-600" />;
    case "bad":
      return <X className="w-5 h-5 text-gray-600" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "best":
      return "border-wedding-olive/30 bg-wedding-olive/5";
    case "ok":
      return "border-gray-300 bg-gray-50";
    case "warning":
      return "border-amber-300 bg-amber-50";
    case "bad":
      return "border-gray-400 bg-gray-100";
    default:
      return "border-gray-200 bg-gray-50";
  }
};

const MobileComparatifView = () => (
  <div className="space-y-6">
    {/* Card Organiser seul */}
    <Card className="border-2 border-gray-300">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-center text-lg">Organiser seul</CardTitle>
        <p className="text-sm text-muted-foreground text-center">Autonomie totale</p>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {comparisons.map((comp) => (
          <div key={comp.category} className={`p-3 rounded-lg border-2 ${getStatusColor(comp.seul.status)}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {comp.icon}
                <span className="font-medium text-sm">{comp.category}</span>
              </div>
              {getStatusIcon(comp.seul.status)}
            </div>
            <p className="font-semibold text-sm">{comp.seul.value}</p>
            <p className="text-xs text-muted-foreground">{comp.seul.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Card Wedding Planner */}
    <Card className="border-2 border-gray-300">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-center text-lg">Wedding Planner</CardTitle>
        <p className="text-sm text-muted-foreground text-center">Service traditionnel</p>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {comparisons.map((comp) => (
          <div key={comp.category} className={`p-3 rounded-lg border-2 ${getStatusColor(comp.weddingPlanner.status)}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {comp.icon}
                <span className="font-medium text-sm">{comp.category}</span>
              </div>
              {getStatusIcon(comp.weddingPlanner.status)}
            </div>
            <p className="font-semibold text-sm">{comp.weddingPlanner.value}</p>
            <p className="text-xs text-muted-foreground">{comp.weddingPlanner.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Card Mariable - Recommandée */}
    <Card className="border-2 border-wedding-olive shadow-lg relative">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <span className="bg-wedding-olive text-white px-4 py-1 rounded-full text-sm font-medium">
          Recommandé
        </span>
      </div>
      <CardHeader className="bg-gradient-to-br from-wedding-olive/10 to-wedding-olive/5">
        <CardTitle className="text-center text-lg text-wedding-olive">Mariable</CardTitle>
        <p className="text-sm text-muted-foreground text-center">Solution moderne</p>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {comparisons.map((comp) => (
          <div key={comp.category} className={`p-3 rounded-lg border-2 ${getStatusColor(comp.mariable.status)}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {comp.icon}
                <span className="font-medium text-sm">{comp.category}</span>
              </div>
              {getStatusIcon(comp.mariable.status)}
            </div>
            <p className="font-semibold text-sm">{comp.mariable.value}</p>
            <p className="text-xs text-muted-foreground">{comp.mariable.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

const DesktopComparatifView = () => (
  <>
    {/* Headers */}
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div></div>
      <div className="text-center p-6 bg-card rounded-2xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Organiser seul</h3>
        <p className="text-sm text-muted-foreground">Autonomie totale</p>
      </div>
      <div className="text-center p-6 bg-card rounded-2xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Wedding Planner</h3>
        <p className="text-sm text-muted-foreground">Service traditionnel</p>
      </div>
      <div className="text-center p-6 bg-gradient-to-br from-wedding-olive to-wedding-olive/80 rounded-2xl shadow-lg border border-wedding-olive/20 relative">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-wedding-olive text-white px-4 py-1 rounded-full text-sm font-medium">
            Recommandé
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Mariable</h3>
        <p className="text-sm text-white/90">Solution moderne</p>
      </div>
    </div>

    {/* Comparison Rows */}
    <div className="space-y-4">
      {comparisons.map((comparison, index) => (
        <div key={index} className="grid grid-cols-4 gap-4">
          {/* Category */}
          <div className="flex items-center p-4 bg-card rounded-2xl shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-wedding-olive/10 rounded-lg text-wedding-olive">
                {comparison.icon}
              </div>
              <span className="font-medium">{comparison.category}</span>
            </div>
          </div>

          {/* Seul */}
          <div className={`p-4 rounded-2xl shadow-sm border-2 ${getStatusColor(comparison.seul.status)}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="font-semibold">{comparison.seul.value}</span>
              {getStatusIcon(comparison.seul.status)}
            </div>
            <p className="text-sm text-muted-foreground">{comparison.seul.description}</p>
          </div>

          {/* Wedding Planner */}
          <div className={`p-4 rounded-2xl shadow-sm border-2 ${getStatusColor(comparison.weddingPlanner.status)}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="font-semibold">{comparison.weddingPlanner.value}</span>
              {getStatusIcon(comparison.weddingPlanner.status)}
            </div>
            <p className="text-sm text-muted-foreground">{comparison.weddingPlanner.description}</p>
          </div>

          {/* Mariable */}
          <div className={`p-4 rounded-2xl shadow-lg border-2 ${getStatusColor(comparison.mariable.status)}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="font-semibold">{comparison.mariable.value}</span>
              {getStatusIcon(comparison.mariable.status)}
            </div>
            <p className="text-sm text-muted-foreground">{comparison.mariable.description}</p>
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

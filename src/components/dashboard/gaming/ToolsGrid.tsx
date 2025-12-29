import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface Tool {
  title: string;
  description: string;
  icon: string;
  path: string;
  gradient: string;
}

const tools: Tool[] = [
  {
    title: 'Quiz Mariage',
    description: 'Testez votre niveau',
    icon: '❓',
    path: '/dashboard/planning',
    gradient: 'from-purple-500/10 to-pink-500/10'
  },
  {
    title: 'Budget',
    description: 'Gérez vos dépenses',
    icon: '💰',
    path: '/dashboard/budget',
    gradient: 'from-emerald-500/10 to-green-500/10'
  },
  {
    title: 'Prestataires',
    description: 'Trouvez vos pros',
    icon: '🏪',
    path: '/dashboard/professionnelsmariable',
    gradient: 'from-blue-500/10 to-cyan-500/10'
  },
  {
    title: 'RSVP Invités',
    description: 'Confirmations',
    icon: '✉️',
    path: '/dashboard/rsvp',
    gradient: 'from-rose-500/10 to-orange-500/10'
  },
  {
    title: 'Check-list',
    description: 'Vos préparatifs',
    icon: '✅',
    path: '/dashboard/checklist-mariage',
    gradient: 'from-amber-500/10 to-yellow-500/10'
  },
  {
    title: 'Boissons',
    description: 'Calculatrice',
    icon: '🥂',
    path: '/dashboard/drinks',
    gradient: 'from-violet-500/10 to-purple-500/10'
  }
];

const advancedTools: Tool[] = [
  {
    title: 'Coordination Jour J',
    description: 'Planning détaillé',
    icon: '📅',
    path: '/mon-jour-m',
    gradient: 'from-rose-500/10 to-pink-500/10'
  },
  {
    title: 'Après le mariage',
    description: 'Conseils post jour J',
    icon: '💕',
    path: '/dashboard/apres-jour-j',
    gradient: 'from-amber-500/10 to-orange-500/10'
  }
];

const ToolsGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Main Tools */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-serif text-foreground">Votre arsenal</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 cascade-children">
          {tools.map((tool, index) => (
            <div
              key={index}
              onClick={() => navigate(tool.path)}
              className={`tool-card text-center bg-gradient-to-br ${tool.gradient} hover:shadow-lg`}
            >
              <div className="text-3xl mb-2 tool-icon">{tool.icon}</div>
              <h3 className="font-medium text-sm text-foreground mb-1">{tool.title}</h3>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Tools */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h2 className="text-xl font-serif text-foreground">Dernière ligne droite</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advancedTools.map((tool, index) => (
            <div
              key={index}
              onClick={() => navigate(tool.path)}
              className={`tool-card flex items-center gap-4 bg-gradient-to-br ${tool.gradient}`}
            >
              <div className="text-4xl tool-icon">{tool.icon}</div>
              <div>
                <h3 className="font-semibold text-foreground">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsGrid;

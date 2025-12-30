import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface Tool {
  title: string;
  description: string;
  icon: string;
  path: string;
}

const tools: Tool[] = [
  {
    title: 'Quiz Mariage',
    description: 'Testez votre niveau',
    icon: '❓',
    path: '/dashboard/planning'
  },
  {
    title: 'Budget',
    description: 'Gérez vos dépenses',
    icon: '💰',
    path: '/dashboard/budget'
  },
  {
    title: 'RSVP Invités',
    description: 'Confirmations',
    icon: '✉️',
    path: '/dashboard/rsvp'
  },
  {
    title: 'Check-list',
    description: 'Vos préparatifs',
    icon: '✅',
    path: '/dashboard/checklist-mariage'
  },
  {
    title: 'Boissons',
    description: 'Calculatrice',
    icon: '🥂',
    path: '/dashboard/drinks'
  },
  {
    title: 'Plan de table',
    description: 'Placez vos invités',
    icon: '🪑',
    path: '/dashboard/seating'
  }
];

const advancedTools: Tool[] = [
  {
    title: 'Coordination Jour J',
    description: 'Planning détaillé',
    icon: '📅',
    path: '/mon-jour-m'
  },
  {
    title: 'Après le mariage',
    description: 'Conseils post jour J',
    icon: '💕',
    path: '/dashboard/apres-jour-j'
  }
];

const ToolsGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Wedding Selection CTA */}
      <div 
        onClick={() => navigate('/professionnelsmariable')}
        className="glass-card rounded-2xl p-5 cursor-pointer hover:border-[#7F9474] transition-all hover:shadow-lg group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#7F9474]/10 flex items-center justify-center group-hover:bg-[#7F9474]/20 transition-colors">
            <ShoppingBag className="w-7 h-7 text-[#7F9474]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
              🛒 Votre sélection mariage
            </h3>
            <p className="text-sm text-muted-foreground">
              Découvrez nos prestataires certifiés et composez votre équipe de rêve
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[#7F9474] font-medium">
            <span>Explorer</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* Main Tools */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7F9474]" />
          <h2 className="text-xl font-serif text-foreground">Votre arsenal</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tools.map((tool, index) => (
            <div
              key={index}
              onClick={() => navigate(tool.path)}
              className="tool-card text-center hover:border-[#7F9474]"
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
              className="tool-card flex items-center gap-4 hover:border-[#7F9474]"
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

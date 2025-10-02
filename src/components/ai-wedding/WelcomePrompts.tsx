import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, MapPin, Euro, Calendar } from 'lucide-react';

interface Props {
  onPromptClick: (prompt: string) => void;
}

const welcomePrompts = [
  {
    icon: Calendar,
    label: "Par où commencer ?",
    prompt: "Je veux me marier mais je ne sais pas par où commencer. Pouvez-vous m'aider ?"
  },
  {
    icon: MapPin,
    label: "Mariage en Provence",
    prompt: "Je me marie en juin 2026 en Provence avec environ 80 invités. Budget 20 000€. Quelles sont les premières étapes ?"
  },
  {
    icon: Euro,
    label: "Budget serré",
    prompt: "Je voudrais organiser un beau mariage avec un budget limité d'environ 8000€. C'est possible ?"
  },
  {
    icon: Sparkles,
    label: "Planning personnalisé",
    prompt: "J'ai déjà la date et le lieu. Peux-tu me créer un rétroplanning pour les 12 prochains mois ?"
  }
];

const WelcomePrompts: React.FC<Props> = ({ onPromptClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 max-w-2xl mx-auto">
      {welcomePrompts.map((prompt, index) => {
        const Icon = prompt.icon;
        return (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-4 text-left justify-start hover:bg-wedding-olive/5 hover:border-wedding-olive"
            onClick={() => onPromptClick(prompt.prompt)}
          >
            <Icon className="w-5 h-5 mr-3 text-wedding-olive flex-shrink-0" />
            <span className="text-sm">{prompt.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default WelcomePrompts;
import React from 'react';
import { Trophy, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface AchievementBadgesProps {
  completedTasks: number;
  totalTasks: number;
  hasSetBudget?: boolean;
  hasSetDate?: boolean;
  guestCount?: number;
}

const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  completedTasks,
  totalTasks,
  hasSetBudget = false,
  hasSetDate = false,
  guestCount = 0
}) => {
  const badges: Badge[] = [
    {
      id: 'first-steps',
      name: 'Premiers pas',
      description: 'Date de mariage définie',
      icon: '📅',
      unlocked: hasSetDate
    },
    {
      id: 'budget-master',
      name: 'Maître du budget',
      description: 'Budget initial configuré',
      icon: '💰',
      unlocked: hasSetBudget
    },
    {
      id: 'guest-list',
      name: 'Liste d\'or',
      description: 'Plus de 50 invités',
      icon: '👥',
      unlocked: guestCount >= 50,
      progress: guestCount,
      target: 50
    },
    {
      id: 'task-starter',
      name: '5 tâches',
      description: 'Complétez 5 tâches',
      icon: '✅',
      unlocked: completedTasks >= 5,
      progress: completedTasks,
      target: 5
    },
    {
      id: 'task-champion',
      name: 'Champion',
      description: 'Complétez 20 tâches',
      icon: '🏆',
      unlocked: completedTasks >= 20,
      progress: completedTasks,
      target: 20
    },
    {
      id: 'perfectionist',
      name: 'Perfectionniste',
      description: 'Complétez 50 tâches',
      icon: '⭐',
      unlocked: completedTasks >= 50,
      progress: completedTasks,
      target: 50
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const nextBadge = badges.find(b => !b.unlocked && b.progress !== undefined);

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#d4af37]" />
          <h2 className="text-xl font-serif text-foreground">Vos accomplissements</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {unlockedCount}/{badges.length} débloqués
        </span>
      </div>

      {/* Badge Grid */}
      <div className="flex flex-wrap gap-3">
        <TooltipProvider>
          {badges.map((badge) => (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <div
                  className={`achievement-badge relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all
                    ${badge.unlocked 
                      ? 'unlocked bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 border-2 border-[#d4af37]/40 shadow-sm' 
                      : 'locked bg-muted border-2 border-muted'
                    }`}
                >
                  {badge.unlocked ? (
                    badge.icon
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-semibold">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  {!badge.unlocked && badge.progress !== undefined && badge.target && (
                    <p className="text-xs text-[#d4af37] mt-1">
                      {badge.progress}/{badge.target}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Next Badge Progress */}
      {nextBadge && nextBadge.progress !== undefined && nextBadge.target && (
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Prochain badge : <span className="font-medium text-foreground">{nextBadge.name}</span>
            </span>
            <span className="text-muted-foreground">
              {nextBadge.progress}/{nextBadge.target}
            </span>
          </div>
          <div className="progress-gaming">
            <div
              className="progress-gaming-fill"
              style={{ width: `${(nextBadge.progress / nextBadge.target) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;

import React from 'react';
import { Trophy, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('dashboard');

  const badges: Badge[] = [
    { id: 'first-steps', name: t('achievements.badges.firstSteps.name'), description: t('achievements.badges.firstSteps.description'), icon: '📅', unlocked: hasSetDate },
    { id: 'budget-master', name: t('achievements.badges.budgetMaster.name'), description: t('achievements.badges.budgetMaster.description'), icon: '💰', unlocked: hasSetBudget },
    { id: 'guest-list', name: t('achievements.badges.guestList.name'), description: t('achievements.badges.guestList.description'), icon: '👥', unlocked: guestCount >= 50, progress: guestCount, target: 50 },
    { id: 'task-starter', name: t('achievements.badges.taskStarter.name'), description: t('achievements.badges.taskStarter.description'), icon: '✅', unlocked: completedTasks >= 5, progress: completedTasks, target: 5 },
    { id: 'task-champion', name: t('achievements.badges.taskChampion.name'), description: t('achievements.badges.taskChampion.description'), icon: '🏆', unlocked: completedTasks >= 20, progress: completedTasks, target: 20 },
    { id: 'perfectionist', name: t('achievements.badges.perfectionist.name'), description: t('achievements.badges.perfectionist.description'), icon: '⭐', unlocked: completedTasks >= 50, progress: completedTasks, target: 50 }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const nextBadge = badges.find(b => !b.unlocked && b.progress !== undefined);

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#d4af37]" />
          <h2 className="text-xl font-serif text-foreground">{t('achievements.heading')}</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {t('achievements.unlocked', { count: unlockedCount, total: badges.length })}
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
              {t('achievements.next')} : <span className="font-medium text-foreground">{nextBadge.name}</span>
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

import React from 'react';
import { ArrowRight, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  priority: 'urgent' | 'normal';
  path: string;
  icon: string;
  completed?: boolean;
}

interface QuestCardsProps {
  tasks?: Array<{
    id: string;
    label: string;
    completed: boolean;
    priority?: string;
    category: string;
  }>;
}

const QuestCards: React.FC<QuestCardsProps> = ({ tasks = [] }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');

  const defaultQuests: Quest[] = [
    { id: '1', title: t('quests.defaults.budget.title'), description: t('quests.defaults.budget.description'), xp: 50, priority: 'urgent', path: '/dashboard/budget', icon: '💰' },
    { id: '2', title: t('quests.defaults.rsvp.title'), description: t('quests.defaults.rsvp.description'), xp: 40, priority: 'normal', path: '/dashboard/rsvp', icon: '✉️' },
    { id: '3', title: t('quests.defaults.venue.title'), description: t('quests.defaults.venue.description'), xp: 60, priority: 'urgent', path: '/professionnelsmariable', icon: '🏰' },
    { id: '4', title: t('quests.defaults.checklist.title'), description: t('quests.defaults.checklist.description'), xp: 30, priority: 'normal', path: '/dashboard/checklist-mariage', icon: '✅' }
  ];

  // Use real tasks if available, otherwise use default quests
  const quests = tasks.length > 0 
    ? tasks.slice(0, 4).map((task, index) => ({
        id: task.id,
        title: task.label,
        description: task.category,
        xp: task.priority === 'high' ? 50 : task.priority === 'medium' ? 35 : 20,
        priority: (task.priority === 'high' ? 'urgent' : 'normal') as 'urgent' | 'normal',
        path: '/dashboard/checklist-mariage',
        icon: task.completed ? '✅' : ['🎯', '📋', '💡', '🔔'][index % 4],
        completed: task.completed
      }))
    : defaultQuests;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#d4af37]" />
          <h2 className="text-xl font-serif text-foreground">{t('quests.heading')}</h2>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {t('quests.pending', { count: quests.filter(q => !q.completed).length })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quests.map((quest) => (
          <div
            key={quest.id}
            onClick={() => navigate(quest.path)}
            className={`quest-card ${quest.priority} ${quest.completed ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">{quest.icon}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {quest.priority === 'urgent' && !quest.completed && (
                    <span className="text-xs font-medium text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t('quests.priority')}
                    </span>
                  )}
                  {quest.completed && (
                    <span className="text-xs font-medium text-[#7F9474] bg-[#7F9474]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t('quests.done')}
                    </span>
                  )}
                </div>
                
                <h3 className={`font-medium text-foreground ${quest.completed ? 'line-through' : ''}`}>
                  {quest.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{quest.description}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="xp-badge">+{quest.xp} XP</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestCards;

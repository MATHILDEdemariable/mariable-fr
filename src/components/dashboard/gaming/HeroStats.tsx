import React, { useState } from 'react';
import { Calendar, Users, CheckCircle2, Trophy, Crown } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';

interface HeroStatsProps {
  firstName?: string | null;
  weddingDate?: Date;
  guestCount: string;
  completionPercentage: number;
  onWeddingDateChange: (date: Date | undefined) => void;
  onGuestCountChange: (value: string) => void;
}

const HeroStats: React.FC<HeroStatsProps> = ({
  firstName,
  weddingDate,
  guestCount,
  completionPercentage,
  onWeddingDateChange,
  onGuestCountChange
}) => {
  const { t, i18n } = useTranslation('dashboard');
  const today = new Date();
  const daysUntilWedding = weddingDate ? differenceInDays(weddingDate, today) : null;
  const { isPremium } = useUserProfile();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const dateLocale = i18n.language?.startsWith('en') ? enUS : fr;

  const handlePremiumClick = () => {
    navigate('/paiement');
  };

  const greeting = firstName ? t('hero.welcomeWithName', { name: firstName }) : t('hero.welcomeGeneric');

  return (
    <div className="glass-card-dark rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header with greeting and level */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-serif text-foreground">{greeting}</h1>
          <p className="text-muted-foreground">
            {format(today, "EEEE d MMMM yyyy", { locale: dateLocale })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Countdown Card */}
        <div className="stat-card group">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-[#7F9474]/10">
              <Calendar className="w-5 h-5 text-[#7F9474]" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs opacity-70 hover:opacity-100">
                  {t('hero.edit')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={weddingDate}
                  onSelect={onWeddingDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-1">
            {daysUntilWedding !== null && daysUntilWedding > 0 ? (
              <>
                <p className="text-4xl font-bold text-foreground">
                  J-{daysUntilWedding}
                </p>
                <p className="text-sm text-muted-foreground">{t('hero.daysRemaining')}</p>
              </>
            ) : daysUntilWedding === 0 ? (
              <>
                <p className="text-2xl font-bold text-[#7F9474]">{t('hero.weddingDay')}</p>
                <p className="text-sm text-muted-foreground">{t('hero.congrats')}</p>
              </>
            ) : weddingDate ? (
              <>
                <p className="text-2xl font-bold text-foreground">{t('hero.congrats')}</p>
                <p className="text-sm text-muted-foreground">{t('hero.weddingPast')}</p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-muted-foreground">--</p>
                <p className="text-sm text-muted-foreground">{t('hero.setDate')}</p>
              </>
            )}
          </div>
          
          {weddingDate && daysUntilWedding !== null && daysUntilWedding > 0 && (
            <div className="mt-3 progress-gaming">
              <div 
                className="progress-gaming-fill" 
                style={{ width: `${Math.max(5, 100 - (daysUntilWedding / 365 * 100))}%` }}
              />
            </div>
          )}
        </div>

        {/* Guests Card */}
        <div className="stat-card group">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-[#7F9474]/10">
              <Users className="w-5 h-5 text-[#7F9474]" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <Input
                type="number"
                value={guestCount}
                onChange={(e) => onGuestCountChange(e.target.value)}
                className="text-4xl font-bold w-24 border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                placeholder="--"
                min="1"
              />
            </div>
            <p className="text-sm text-muted-foreground">{t('hero.guestsPlanned')}</p>
          </div>
          
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-[#7F9474]"></span>
            {t('hero.editCountAbove')}
          </div>
        </div>

        {/* Progress Card */}
        <div className="stat-card group">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-[#7F9474]/10">
              <CheckCircle2 className="w-5 h-5 text-[#7F9474]" />
            </div>
            <div className="flex items-center gap-2">
              {isPremium ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold rounded">
                  <Crown className="w-3 h-3" /> {t('hero.premium')}
                </span>
              ) : (
                <Button
                  onClick={handlePremiumClick}
                  disabled={checkoutLoading}
                  size="sm"
                  className="bg-editorial-noir hover:bg-editorial-noir/80 text-white rounded-none text-xs px-3 py-1 h-auto"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  {checkoutLoading ? "..." : t('hero.premium')}
                </Button>
              )}
              <Trophy className="w-4 h-4 text-[#d4af37]" />
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-4xl font-bold text-foreground">
              {completionPercentage}%
            </p>
            <p className="text-sm text-muted-foreground">{t('hero.organizationComplete')}</p>
          </div>
          
          <div className="mt-3 progress-gaming">
            <div 
              className="progress-gaming-fill" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroStats;

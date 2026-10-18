import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, ChevronDown, Plus } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';
import InviteCoupleDialog from './InviteCoupleDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

const formatWeddingDate = (date: string | null | undefined, locale: string) => {
  if (!date) return null;
  try {
    return new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return null;
  }
};

const daysUntil = (date: string | null | undefined) => {
  if (!date) return null;
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  return diff >= 0 ? diff : null;
};

/**
 * Bandeau de contexte affiché uniquement pour les comptes professionnels :
 * rappelle le mariage ouvert, permet d'en changer et de revenir à la liste.
 * Sur mobile : encadré lisible + tiroir de bascule entre mariages.
 */
const WeddingContextBar: React.FC = () => {
  const { accountType, currentWedding, currentWeddingId, weddings, selectWedding } = useWedding();
  const { t, i18n } = useTranslation('pro');
  const location = useLocation();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const isProHome = location.pathname === '/pro';

  if (accountType !== 'b2b' || !currentWedding || isProHome) return null;

  const isEnglish = i18n.language?.startsWith('en');
  const locale = isEnglish ? 'en-GB' : 'fr-FR';
  const formulaLabel = (type?: string) =>
    type === 'jourJ'
      ? isEnglish ? 'Wedding day coordination' : 'Coordination Jour J'
      : isEnglish ? 'Full planning' : 'Organisation complète';

  const handleSelectWedding = (weddingId: string) => {
    selectWedding(weddingId);
    setSwitcherOpen(false);
  };

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden sticky top-0 z-30 border-b border-border bg-editorial-beige mb-4 px-4 py-3">
        <Link to="/pro#mes-mariages" className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-2 min-h-[32px]">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEnglish ? 'All my weddings' : 'Tous mes mariages'}
        </Link>
        <button
          type="button"
          onClick={() => setSwitcherOpen(true)}
          aria-label={isEnglish ? 'Change wedding' : 'Changer de mariage'}
          className="w-full flex items-center justify-between gap-3 border border-wedding-olive/30 bg-background px-3 py-2.5 text-left min-h-[56px]"
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {isEnglish ? 'You are on' : 'Vous êtes sur'}
            </p>
            <p className="font-serif text-base truncate">{currentWedding.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {[formatWeddingDate(currentWedding.wedding_date, locale), formulaLabel(currentWedding.prestation_type)]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-wedding-olive shrink-0">
            {isEnglish ? 'Change' : 'Changer'}
            <ChevronDown className="h-4 w-4" />
          </span>
        </button>
        {currentWeddingId && (
          <div className="mt-2">
            <InviteCoupleDialog weddingId={currentWeddingId} />
          </div>
        )}
      </div>

      <Drawer open={switcherOpen} onOpenChange={setSwitcherOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="font-serif">{isEnglish ? 'My weddings' : 'Mes mariages'}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-8 space-y-2">
            {weddings.map((wedding) => {
              const isCurrent = wedding.id === currentWeddingId;
              const remainingDays = daysUntil(wedding.wedding_date);
              return (
                <button
                  key={wedding.id}
                  type="button"
                  onClick={() => handleSelectWedding(wedding.id)}
                  className={`w-full flex items-center justify-between gap-3 border px-3 py-3 text-left min-h-[56px] ${
                    isCurrent ? 'border-wedding-olive bg-wedding-olive/10' : 'border-border bg-background'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-serif truncate">{wedding.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[
                        formatWeddingDate(wedding.wedding_date, locale),
                        remainingDays !== null ? `J-${remainingDays}` : null,
                        formulaLabel(wedding.prestation_type),
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                  {isCurrent && <Check className="h-5 w-5 text-wedding-olive shrink-0" />}
                </button>
              );
            })}
            <Link
              to="/pro#mes-mariages"
              onClick={() => setSwitcherOpen(false)}
              className="flex items-center justify-center gap-2 border border-dashed border-wedding-olive/40 px-3 py-3 text-sm text-wedding-olive min-h-[48px]"
            >
              <Plus className="h-4 w-4" />
              {isEnglish ? 'Create a new wedding' : 'Créer un nouveau mariage'}
            </Link>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Desktop */}
      <div className="hidden md:block border-b border-border bg-editorial-beige mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center gap-3 justify-between">
          <Link
            to="/pro"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('bar.myProSpace', { defaultValue: 'Mon espace pro' })}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {currentWeddingId && <InviteCoupleDialog weddingId={currentWeddingId} />}
            <span className="text-sm text-muted-foreground">{t('bar.currentWedding')}</span>
            <Select value={currentWeddingId ?? undefined} onValueChange={selectWedding}>
              <SelectTrigger className="h-8 w-[220px] rounded-none bg-background text-sm">
                <SelectValue placeholder={t('bar.chooseWedding')} />
              </SelectTrigger>
              <SelectContent>
                {weddings.map((wedding) => (
                  <SelectItem key={wedding.id} value={wedding.id}>
                    {wedding.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeddingContextBar;

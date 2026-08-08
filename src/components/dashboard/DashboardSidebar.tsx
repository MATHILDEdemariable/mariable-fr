import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Calendar, CheckSquare, Calculator, Store, Heart, Settings, LogOut,
  Wine, MessageCircleQuestion, MessageSquare, Users, Lightbulb, ChevronDown, Coins,
  ListChecks, UserCheck, Home, QrCode, FileText, Table, AlertCircle, Gift,
  ShoppingCart, Building2, Smartphone, Palette, Globe, BarChart3
} from 'lucide-react';
import { CallScheduleModal } from './CallScheduleModal';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProblemModal } from '@/components/support/ProblemModal';
import SiteInternetModal from './SiteInternetModal';

interface DashboardSidebarProps {
  isReaderMode?: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isReaderMode = false }) => {
  const location = useLocation();
  const search = location.search;
  const { t } = useTranslation('dashboard');
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showSiteInternetModal, setShowSiteInternetModal] = useState(false);

  const checklistItems = [
    { label: t('sidebar.checklistSteps'), icon: <CheckSquare className="h-4 w-4" />, path: '/dashboard/checklist-mariage?tab=etapes' },
    { label: t('sidebar.checklistManual'), icon: <ListChecks className="h-4 w-4" />, path: '/dashboard/checklist-mariage?tab=manuelle' },
    { label: t('sidebar.checklistSmart'), icon: <Lightbulb className="h-4 w-4" />, path: '/dashboard/checklist-mariage?tab=intelligente' },
  ];

  const prestatairesItems = [
    { label: t('sidebar.vendorsAll'), icon: <Store className="h-4 w-4" />, path: '/professionnelsmariable' },
    { label: t('sidebar.vendorsCart'), icon: <ShoppingCart className="h-4 w-4" />, path: '/dashboard/panier' },
    { label: t('sidebar.vendorsTracking'), icon: <Settings className="h-4 w-4" />, path: '/dashboard/suivi' },
    { label: t('sidebar.vendorsMessages'), icon: <MessageSquare className="h-4 w-4" />, path: '/dashboard/messages' },
  ];

  const jourMItems = [
    { label: t('sidebar.weddingDayPlanning'), icon: <Calendar className="h-4 w-4" />, path: '/mon-jour-m' },
  ];

  const bonusItems = [
    { label: t('sidebar.bonusChatGPT'), icon: <MessageSquare className="h-4 w-4" />, path: 'https://chatgpt.com/g/g-684071f00100819199b7b11839db48d4-assistant-mariage-by-mariable', external: true },
    { label: t('sidebar.bonusAssistant'), icon: <MessageCircleQuestion className="h-4 w-4" />, path: '/dashboard/assistant', external: false },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      window.location.href = '/';
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === path;
    if (path === '/mon-jour-m') return location.pathname.startsWith('/mon-jour-m');
    return location.pathname.startsWith(path);
  };
  const isChecklistActive = () => location.pathname.startsWith('/dashboard/checklist-mariage');
  const isPrestatairesActive = () => prestatairesItems.some(item => isActive(item.path));
  const isJourMActive = () => jourMItems.some(item => isActive(item.path));
  const isBonusActive = () => bonusItems.some(item => !item.external && isActive(item.path));
  const isBudgetCalcActive = () =>
    location.pathname.startsWith('/dashboard/budget') && (search.includes('tab=calculator') || !search.includes('tab='));
  const isBudgetMgmtActive = () =>
    location.pathname.startsWith('/dashboard/budget') && search.includes('tab=detailed');

  const linkClass = (active: boolean) => cn(
    "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors",
    active ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
    isReaderMode ? 'pointer-events-none opacity-70' : ''
  );

  const preventReader = (e: React.MouseEvent) => { if (isReaderMode) e.preventDefault(); };

  const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
    <div className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
      {label}
    </div>
  );

  return (
    <div className="h-full min-h-screen bg-white border-r border-gray-200" style={{ paddingTop: 'var(--header-h)' }}>
      <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4">
        <span className="font-bold text-lg sm:text-xl">{t('header.myWorkspace')}</span>
      </div>

      <nav className="py-2 sm:py-3 px-2 sm:px-3 space-y-0.5">
        {/* ORGANISATION */}
        <SectionLabel label={t('sidebar.sections.organisation')} />

        <Link to={isReaderMode ? '#' : '/dashboard'} onClick={preventReader} className={linkClass(isActive('/dashboard'))}>
          <LayoutDashboard className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.dashboardHome')}</span>
        </Link>

        <Link to={isReaderMode ? '#' : '/dashboard/mon-mariage/retroplanning'} onClick={preventReader} className={linkClass(isActive('/dashboard/mon-mariage/retroplanning'))}>
          <Calendar className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.retroplanning')}</span>
        </Link>

        <Link to={isReaderMode ? '#' : '/dashboard/budget?tab=calculator'} onClick={preventReader} className={linkClass(isBudgetCalcActive())}>
          <Calculator className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.budgetCalculator')}</span>
        </Link>

        <Link to={isReaderMode ? '#' : '/dashboard/budget?tab=detailed'} onClick={preventReader} className={linkClass(isBudgetMgmtActive())}>
          <BarChart3 className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.budgetManagement')}</span>
        </Link>

        <Link to={isReaderMode ? '#' : '/dashboard/rsvp'} onClick={preventReader} className={linkClass(isActive('/dashboard/rsvp'))}>
          <UserCheck className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.rsvp')}</span>
        </Link>

        {/* Prestataires (dropdown) */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(linkClass(isPrestatairesActive()), 'w-full justify-start')} disabled={isReaderMode}>
            <Store className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.vendors')}</span>
            <ChevronDown className="ml-auto h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {prestatairesItems.map(subItem => (
              <DropdownMenuItem key={subItem.path} asChild>
                <Link to={isReaderMode ? '#' : subItem.path} onClick={preventReader} className={cn("flex items-center px-2 py-2 text-sm w-full", isActive(subItem.path) ? 'bg-wedding-olive/10 text-wedding-olive font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                  {subItem.icon}<span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Checklist (dropdown) */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(linkClass(isChecklistActive()), 'w-full justify-start')} disabled={isReaderMode}>
            <CheckSquare className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.checklist')}</span>
            <ChevronDown className="ml-auto h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {checklistItems.map(subItem => (
              <DropdownMenuItem key={subItem.path} asChild>
                <Link to={isReaderMode ? '#' : subItem.path} onClick={preventReader} className="flex items-center px-2 py-2 text-sm w-full text-gray-600 hover:bg-gray-50">
                  {subItem.icon}<span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* JOUR-J */}
        <SectionLabel label={t('sidebar.sections.jourJ')} />

        <DropdownMenu>
          <DropdownMenuTrigger className={cn(linkClass(isJourMActive()), 'w-full justify-start')} disabled={isReaderMode}>
            <Calendar className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.weddingDay')}</span>
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-wedding-olive text-white rounded-full font-semibold">{t('header.exclusive')}</span>
            <ChevronDown className="ml-auto h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {jourMItems.map(subItem => (
              <DropdownMenuItem key={subItem.path} asChild>
                <Link to={isReaderMode ? '#' : subItem.path} onClick={preventReader} className={cn("flex items-center px-2 py-2 text-sm w-full", isActive(subItem.path) ? 'bg-wedding-olive/10 text-wedding-olive font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                  {subItem.icon}<span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to={isReaderMode ? '#' : '/dashboard/seating-plan'} onClick={preventReader} className={linkClass(isActive('/dashboard/seating-plan'))}>
          <Table className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.seatingPlan')}</span>
        </Link>

        <Link to={isReaderMode ? '#' : '/dashboard/drinks'} onClick={preventReader} className={linkClass(isActive('/dashboard/drinks'))}>
          <Wine className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.drinksCalculator')}</span>
        </Link>

        <Link to={isReaderMode ? '#' : '/dashboard/ceremonie'} onClick={preventReader} className={linkClass(isActive('/dashboard/ceremonie'))}>
          <Heart className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.ceremony')}</span>
        </Link>

        <Link to={isReaderMode ? '#' : '/dashboard/accommodations'} onClick={preventReader} className={linkClass(isActive('/dashboard/accommodations'))}>
          <Home className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.accommodations')}</span>
        </Link>

        {/* APRÈS JOUR-J */}
        <SectionLabel label={t('sidebar.sections.apres')} />

        <Link to={isReaderMode ? '#' : '/dashboard/apres-jour-j'} onClick={preventReader} className={linkClass(isActive('/dashboard/apres-jour-j'))}>
          <CheckSquare className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.afterDay')}</span>
        </Link>

        <Link to={isReaderMode ? '#' : '/dashboard/album'} onClick={preventReader} className={linkClass(isActive('/dashboard/album'))}>
          <Images className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Album invités</span>
        </Link>


        {/* ADMIN */}
        <SectionLabel label={t('sidebar.sections.admin')} />

        <Link to={isReaderMode ? '#' : '/dashboard/mairie-civil'} onClick={preventReader} className={linkClass(isActive('/dashboard/mairie-civil'))}>
          <Building2 className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.civil')}</span>
        </Link>

        <Link to={isReaderMode ? '#' : '/dashboard/documents'} onClick={preventReader} className={linkClass(isActive('/dashboard/documents'))}>
          <FileText className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.documents')}</span>
        </Link>

        <button
          onClick={() => !isReaderMode && setShowSiteInternetModal(true)}
          className={cn(linkClass(false), 'w-full text-left')}
        >
          <Globe className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.website')}</span>
        </button>

        <Link to={isReaderMode ? '#' : '/dashboard/moodboard'} onClick={preventReader} className={linkClass(isActive('/dashboard/moodboard'))}>
          <Palette className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.moodboard')}</span>
        </Link>

        {/* BONUS */}
        <SectionLabel label={t('sidebar.sections.bonus')} />

        <Link to={isReaderMode ? '#' : '/dashboard/guides'} onClick={preventReader} className={linkClass(isActive('/dashboard/guides'))}>
          <FileText className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.guidesPdf')}</span>
        </Link>

        <Link to={isReaderMode ? '#' : '/dashboard/qr-code'} onClick={preventReader} className={linkClass(isActive('/dashboard/qr-code'))}>
          <QrCode className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.qrCode')}</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className={cn(linkClass(isBonusActive()), 'w-full justify-start')} disabled={isReaderMode}>
            <Gift className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">{t('sidebar.bonus')}</span>
            <ChevronDown className="ml-auto h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {bonusItems.map(subItem => (
              <DropdownMenuItem key={subItem.path} asChild>
                {subItem.external ? (
                  <a href={isReaderMode ? '#' : subItem.path} target="_blank" rel="noopener noreferrer" onClick={preventReader} className="flex items-center px-2 py-2 text-sm w-full text-gray-600 hover:bg-gray-50">
                    {subItem.icon}<span className="ml-2">{subItem.label}</span>
                  </a>
                ) : (
                  <Link to={isReaderMode ? '#' : subItem.path} onClick={preventReader} className={cn("flex items-center px-2 py-2 text-sm w-full", isActive(subItem.path) ? 'bg-wedding-olive/10 text-wedding-olive font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                    {subItem.icon}<span className="ml-2">{subItem.label}</span>
                  </Link>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="pt-4" />

        <Link to={isReaderMode ? '#' : '/dashboard/settings'} onClick={preventReader} className={linkClass(isActive('/dashboard/settings'))}>
          <Settings className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('header.settings')}</span>
        </Link>

        <Link to="/dashboard/installer-app" className={linkClass(isActive('/dashboard/installer-app'))}>
          <Smartphone className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('header.installApp')}</span>
        </Link>
      </nav>

      <div className="mt-auto px-2 sm:px-3 py-2">
        <button onClick={() => setShowProblemModal(true)} className="flex items-center w-full px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 mt-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="ml-2 sm:ml-3 leading-tight">{t('header.reportIssue')}</span>
        </button>
      </div>

      <div className="px-2 sm:px-3 py-2">
        <button onClick={handleLogout} className="flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 w-full justify-start" disabled={isReaderMode}>
          <LogOut className="h-4 w-4" />
          <span className="ml-2 sm:ml-3">{t('header.logout')}</span>
        </button>
      </div>

      {isReaderMode && (
        <div className="px-2 sm:px-3 py-4 mt-auto border-t border-gray-200">
          <div className="bg-wedding-olive/10 p-3 rounded-md text-xs text-gray-700">
            {t('header.readOnlyBanner')}
          </div>
        </div>
      )}

      <ProblemModal isOpen={showProblemModal} onClose={() => setShowProblemModal(false)} />
      <CallScheduleModal isOpen={showCallModal} onClose={() => setShowCallModal(false)} />
      <SiteInternetModal open={showSiteInternetModal} onOpenChange={setShowSiteInternetModal} />
    </div>
  );
};

export default DashboardSidebar;

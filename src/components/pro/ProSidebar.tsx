import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, CalendarHeart, IdCard, Crown, Settings, LogOut, BookUser, GraduationCap, LifeBuoy } from 'lucide-react';
import { openProTutorial, openProHelp } from './ProSupportHost';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

/**
 * Navigation de l'espace professionnel (pré-dashboard).
 * Volontairement courte : le pro choisit d'abord un mariage,
 * les modules restent dans l'espace mariage.
 */
const ProSidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation('pro');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('❌ ProSidebar: déconnexion impossible', error);
    } finally {
      window.location.href = '/';
    }
  };

  const items = [
    { label: t('nav.weddings'), icon: <CalendarHeart className="h-4 w-4" />, hash: '#mes-mariages' },
    { label: t('nav.info'), icon: <IdCard className="h-4 w-4" />, hash: '#mes-informations' },
    { label: t('nav.offer'), icon: <Crown className="h-4 w-4" />, hash: '#mon-offre' },
  ];

  const linkClass = (active: boolean) =>
    cn(
      'flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
      active ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive'
    );

  return (
    <div className="h-full min-h-screen flex flex-col bg-white border-r border-gray-200" style={{ paddingTop: 'var(--header-h)' }}>
      <div className="flex items-center gap-2 px-6 py-4">
        <Building2 className="h-5 w-5 text-wedding-olive" />
        <span className="font-bold text-lg">{t('nav.space')}</span>
      </div>

      <nav className="py-3 px-3 space-y-0.5 flex-1">
        {items.map((item) => (
          <a key={item.hash} href={`/pro${item.hash}`} className={linkClass(false)}>
            {item.icon}
            <span className="ml-3 leading-tight">{item.label}</span>
          </a>
        ))}

        <Link to="/pro/carnet-adresses" className={linkClass(location.pathname.startsWith('/pro/carnet-adresses'))}>
          <BookUser className="h-4 w-4" />
          <span className="ml-3 leading-tight">{t('nav.addressBook')}</span>
        </Link>

        <Link to="/dashboard/settings" className={linkClass(location.pathname.startsWith('/dashboard/settings'))}>
          <Settings className="h-4 w-4" />
          <span className="ml-3 leading-tight">{t('nav.settings')}</span>
        </Link>

        <button onClick={handleLogout} className={cn(linkClass(false), 'w-full text-left')}>
          <LogOut className="h-4 w-4" />
          <span className="ml-3 leading-tight">{t('nav.logout')}</span>
        </button>
      </nav>

      <div className="sticky bottom-0 px-3 py-3 space-y-2 border-t border-gray-200 bg-white">
        <button onClick={openProTutorial} className={cn(linkClass(false), 'w-full text-left border border-wedding-olive/30')}>
          <GraduationCap className="h-4 w-4" />
          <span className="ml-3 leading-tight">{t('nav.tutorial')}</span>
        </button>
        <button onClick={openProHelp} className={cn(linkClass(false), 'w-full text-left border border-wedding-olive/30')}>
          <LifeBuoy className="h-4 w-4" />
          <span className="ml-3 leading-tight">{t('nav.help')}</span>
        </button>
      </div>
    </div>
  );
};

export default ProSidebar;

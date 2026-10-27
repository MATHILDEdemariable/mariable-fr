import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, CalendarHeart, Sun, BarChart3, Settings, LogOut, BookUser, GraduationCap, LifeBuoy, Smartphone, ExternalLink, Library } from 'lucide-react';
import { openProTutorial, openProHelp } from './ProSupportHost';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

/**
 * Navigation de l'espace professionnel : « Mon espace pro » puis le tronc commun.
 * Les modules d'un mariage restent dans l'espace mariage.
 */
const ProSidebar: React.FC = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation('pro');
  const isEnglish = i18n.language?.startsWith('en');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('❌ ProSidebar: déconnexion impossible', error);
    } finally {
      window.location.href = '/';
    }
  };

  const linkClass = (active: boolean) =>
    cn(
      'flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
      active ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive'
    );

  const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
    <div className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{label}</div>
  );

  const isProHome = location.pathname === '/pro';
  const spaceItems = [
    { label: isEnglish ? 'Today' : 'Aujourd’hui', icon: <Sun className="h-4 w-4" />, hash: '#aujourdhui' },
    { label: t('nav.weddings'), icon: <CalendarHeart className="h-4 w-4" />, hash: '#mes-mariages' },
    { label: isEnglish ? 'My season' : 'Ma saison', icon: <BarChart3 className="h-4 w-4" />, hash: '#ma-saison' },
  ];

  return (
    <div className="h-full min-h-screen flex flex-col bg-white border-r border-gray-200" style={{ paddingTop: 'var(--header-h)' }}>
      <div className="flex items-center gap-2 px-6 py-4">
        <Building2 className="h-5 w-5 text-wedding-olive" />
        <span className="font-bold text-lg">{t('nav.space')}</span>
      </div>

      <nav className="py-1 px-3 space-y-0.5 flex-1">
        <SectionLabel label={isEnglish ? 'My pro space' : 'Mon espace pro'} />
        {spaceItems.map((item, index) => (
          <a key={item.hash} href={`/pro${item.hash}`} className={linkClass(isProHome && index === 0 && !location.hash)}>
            {item.icon}
            <span className="ml-3 leading-tight">{item.label}</span>
          </a>
        ))}

        <SectionLabel label={isEnglish ? 'Shared tools' : 'Tronc commun'} />
        <Link to="/pro/carnet-adresses" className={linkClass(location.pathname.startsWith('/pro/carnet-adresses'))}>
          <BookUser className="h-4 w-4" />
          <span className="ml-3 leading-tight">{t('nav.addressBook')}</span>
        </Link>
        <Link to="/pro/referentiels" className={linkClass(location.pathname.startsWith('/pro/referentiels'))}>
          <Library className="h-4 w-4" />
          <span className="ml-3 leading-tight">{isEnglish ? 'Templates & catalogues' : 'Modèles & catalogues'}</span>
        </Link>
        <button onClick={openProTutorial} className={cn(linkClass(false), 'w-full text-left')}>
          <GraduationCap className="h-4 w-4" />
          <span className="ml-3 leading-tight">{t('nav.tutorial')}</span>
        </button>
        <a href="/pro#parametres" className={linkClass(false)}>
          <Settings className="h-4 w-4" />
          <span className="ml-3 leading-tight">{isEnglish ? 'Account settings' : 'Paramètres du compte'}</span>
        </a>
        <a href="/pro#installer-app" className={linkClass(false)}>
          <Smartphone className="h-4 w-4" />
          <span className="ml-3 leading-tight">{t('nav.installApp')}</span>
        </a>
        <button onClick={openProHelp} className={cn(linkClass(false), 'w-full text-left')}>
          <LifeBuoy className="h-4 w-4" />
          <span className="ml-3 leading-tight">{t('nav.help')}</span>
        </button>
        <button onClick={handleLogout} className={cn(linkClass(false), 'w-full text-left')}>
          <LogOut className="h-4 w-4" />
          <span className="ml-3 leading-tight">{t('nav.logout')}</span>
        </button>
      </nav>

      <div className="sticky bottom-0 px-6 py-3 border-t border-gray-200 bg-white">
        <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-wedding-olive">
          mariable.fr <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

export default ProSidebar;

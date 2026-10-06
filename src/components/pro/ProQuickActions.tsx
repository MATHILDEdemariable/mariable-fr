import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookUser, GraduationCap, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openProTutorial, openProHelp } from './ProSupportHost';

/** Raccourcis visibles en haut des pages pro (utiles surtout sur mobile, sans barre latérale). */
const ProQuickActions: React.FC<{ showAddressBook?: boolean }> = ({ showAddressBook = true }) => {
  const { t } = useTranslation('pro');
  return (
    <div className="flex flex-wrap gap-2">
      {showAddressBook && (
        <Button asChild variant="outline" size="sm" className="rounded-none min-h-[40px]">
          <Link to="/pro/carnet-adresses"><BookUser className="h-4 w-4 mr-1.5" />{t('nav.addressBook')}</Link>
        </Button>
      )}
      <Button variant="outline" size="sm" className="rounded-none min-h-[40px]" onClick={openProTutorial}>
        <GraduationCap className="h-4 w-4 mr-1.5" />{t('nav.tutorial')}
      </Button>
      <Button variant="outline" size="sm" className="rounded-none min-h-[40px]" onClick={openProHelp}>
        <LifeBuoy className="h-4 w-4 mr-1.5" />{t('nav.help')}
      </Button>
    </div>
  );
};

export default ProQuickActions;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Users, FileText, Lightbulb, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SharePublicButton from './SharePublicButton';

interface MonJourMLayoutProps {
  children?: React.ReactNode;
  coordinationId?: string;
}

const MonJourMLayout: React.FC<MonJourMLayoutProps> = ({ children, coordinationId }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation('monJourM');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" asChild className="shrink-0">
                <Link to="/dashboard" className="flex items-center gap-1 sm:gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('layout.backToDashboard')}</span>
                  <span className="sm:hidden">{t('layout.back')}</span>
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">{t('layout.title')}</h1>
            </div>

            {coordinationId && (
              <div className="shrink-0">
                <SharePublicButton coordinationId={coordinationId} />
              </div>
            )}
          </div>

          <div className="mt-2 sm:mt-4 pb-3 sm:pb-4">
            <div className="bg-gray-100 rounded-lg p-1">
              <div className="grid grid-cols-5 gap-1 max-w-4xl">
                <Link 
                  to="/mon-jour-m/equipe" 
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 rounded-md py-2 sm:py-2.5 px-1 sm:px-3 text-xs sm:text-sm min-h-[50px] sm:min-h-[44px] touch-manipulation transition-all duration-200 ${
                    currentPath.includes('/equipe') 
                      ? 'bg-wedding-olive text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-white hover:text-wedding-olive'
                  }`}
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="text-center leading-tight font-medium">{t('layout.tabs.team')}</span>
                </Link>
                <Link 
                  to="/mon-jour-m/planning" 
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 rounded-md py-2 sm:py-2.5 px-1 sm:px-3 text-xs sm:text-sm min-h-[50px] sm:min-h-[44px] touch-manipulation transition-all duration-200 ${
                    currentPath.includes('/planning') 
                      ? 'bg-wedding-olive text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-white hover:text-wedding-olive'
                  }`}
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="text-center leading-tight font-medium">{t('layout.tabs.planning')}</span>
                </Link>
                <Link 
                  to="/mon-jour-m/documents" 
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 rounded-md py-2 sm:py-2.5 px-1 sm:px-3 text-xs sm:text-sm min-h-[50px] sm:min-h-[44px] touch-manipulation transition-all duration-200 ${
                    currentPath.includes('/documents') 
                      ? 'bg-wedding-olive text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-white hover:text-wedding-olive'
                  }`}
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="text-center leading-tight font-medium">{t('layout.tabs.documents')}</span>
                </Link>
                <Link 
                  to="/mon-jour-m/conseils" 
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 rounded-md py-2 sm:py-2.5 px-1 sm:px-3 text-xs sm:text-sm min-h-[50px] sm:min-h-[44px] touch-manipulation transition-all duration-200 ${
                    currentPath.includes('/conseils') 
                      ? 'bg-wedding-olive text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-white hover:text-wedding-olive'
                  }`}
                >
                  <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="text-center leading-tight font-medium">{t('layout.tabs.advice')}</span>
                </Link>
                <Link 
                  to="/mon-jour-m/pense-bete" 
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 rounded-md py-2 sm:py-2.5 px-1 sm:px-3 text-xs sm:text-sm min-h-[50px] sm:min-h-[44px] touch-manipulation transition-all duration-200 ${
                    currentPath.includes('/pense-bete') 
                      ? 'bg-wedding-olive text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-white hover:text-wedding-olive'
                  }`}
                >
                  <PenTool className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="text-center leading-tight font-medium">{t('layout.tabs.notes')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </div>
    </div>
  );
};

export default MonJourMLayout;

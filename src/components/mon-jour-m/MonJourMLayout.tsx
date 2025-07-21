
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SharePublicButton from './SharePublicButton';

interface MonJourMLayoutProps {
  children?: React.ReactNode;
  coordinationId?: string;
}

const MonJourMLayout: React.FC<MonJourMLayoutProps> = ({ children, coordinationId }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveTab = () => {
    if (currentPath.includes('/planning')) return 'planning';
    if (currentPath.includes('/equipe')) return 'equipe';
    if (currentPath.includes('/documents')) return 'documents';
    return 'planning'; // default
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" asChild className="shrink-0">
                <Link to="/dashboard" className="flex items-center gap-1 sm:gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Retour au Dashboard</span>
                  <span className="sm:hidden">Retour</span>
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">Mon Jour-J</h1>
            </div>

            {/* Bouton de partage - conditionnel - optimisé pour mobile */}
            {coordinationId && (
              <div className="shrink-0">
                <SharePublicButton coordinationId={coordinationId} />
              </div>
            )}
          </div>

          {/* Navigation par onglets - optimisée pour mobile */}
          <div className="mt-2 sm:mt-4 pb-3 sm:pb-4">
            <Tabs value={getActiveTab()} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-lg h-auto p-1">
                <TabsTrigger value="equipe" asChild>
                  <Link 
                    to="/mon-jour-m/equipe" 
                    className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-wedding-olive data-[state=active]:text-white data-[state=active]:border-wedding-olive border-2 border-transparent rounded-md py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm min-h-[44px] touch-manipulation transition-all duration-200 hover:bg-wedding-olive/10"
                  >
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                    <span className="truncate">Équipe</span>
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="planning" asChild>
                  <Link 
                    to="/mon-jour-m/planning" 
                    className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-wedding-olive data-[state=active]:text-white data-[state=active]:border-wedding-olive border-2 border-transparent rounded-md py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm min-h-[44px] touch-manipulation transition-all duration-200 hover:bg-wedding-olive/10"
                  >
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                    <span className="truncate">Planning</span>
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="documents" asChild>
                  <Link 
                    to="/mon-jour-m/documents" 
                    className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-wedding-olive data-[state=active]:text-white data-[state=active]:border-wedding-olive border-2 border-transparent rounded-md py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm min-h-[44px] touch-manipulation transition-all duration-200 hover:bg-wedding-olive/10"
                  >
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                    <span className="truncate">Documents</span>
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
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

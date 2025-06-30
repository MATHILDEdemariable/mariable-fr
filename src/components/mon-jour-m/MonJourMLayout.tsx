
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SharePublicButton from './SharePublicButton';
import { useWeddingCoordination } from '@/hooks/useWeddingCoordination';

interface MonJourMLayoutProps {
  children?: React.ReactNode;
}

const MonJourMLayout: React.FC<MonJourMLayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { coordination } = useWeddingCoordination();

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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour au Dashboard
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-semibold text-gray-900">Mon Jour-M</h1>
            </div>

            {/* Bouton de partage */}
            <SharePublicButton coordinationId={coordination?.id} />
          </div>

          {/* Navigation par onglets */}
          <div className="mt-4 pb-4">
            <Tabs value={getActiveTab()} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-lg">
                <TabsTrigger value="planning" asChild>
                  <Link 
                    to="/mon-jour-m/planning" 
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <Calendar className="h-4 w-4" />
                    Planning
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="equipe" asChild>
                  <Link 
                    to="/mon-jour-m/equipe" 
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <Users className="h-4 w-4" />
                    Équipe
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="documents" asChild>
                  <Link 
                    to="/mon-jour-m/documents" 
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <FileText className="h-4 w-4" />
                    Documents
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
};

export default MonJourMLayout;

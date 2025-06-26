
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonJourMProvider } from '@/contexts/MonJourMContext';

interface MonJourMLayoutProps {
  children?: React.ReactNode;
}

const MonJourMLayout: React.FC<MonJourMLayoutProps> = ({ children }) => {
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.includes('/equipe')) return 'equipe';
    if (location.pathname.includes('/documents')) return 'documents';
    return 'planning';
  };

  return (
    <MonJourMProvider>
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
            </div>

            <Tabs value={getActiveTab()} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="planning" asChild>
                  <Link to="/mon-jour-m/planning" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Planning
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="equipe" asChild>
                  <Link to="/mon-jour-m/equipe" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Équipe
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="documents" asChild>
                  <Link to="/mon-jour-m/documents" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </Link>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {children}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </MonJourMProvider>
  );
};

export default MonJourMLayout;

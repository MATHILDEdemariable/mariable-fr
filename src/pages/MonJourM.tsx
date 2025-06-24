
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, FileText, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCoordination } from '@/hooks/useCoordination';

const MonJourM = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { coordination, loading } = useCoordination();

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/equipe')) return 'equipe';
    if (path.includes('/documents')) return 'documents';
    return 'planning';
  };

  const handleTabChange = (value: string) => {
    navigate(`/mon-jour-m/${value === 'planning' ? '' : value}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive mx-auto mb-4"></div>
          <p>Chargement de votre coordination...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {coordination?.title || 'Mon Jour-M'}
              </h1>
              <p className="text-lg text-gray-600">
                Coordonnez votre jour de mariage en temps réel
              </p>
              {coordination?.wedding_date && (
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(coordination.wedding_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
          </div>

          {/* Navigation par onglets */}
          <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Planning
              </TabsTrigger>
              <TabsTrigger value="equipe" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Équipe
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            {/* Contenu des onglets */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <Outlet />
            </div>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MonJourM;

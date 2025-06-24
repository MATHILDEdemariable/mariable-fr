
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, FileText, Share2, Copy, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCoordination } from '@/hooks/useCoordination';
import { useToast } from '@/hooks/use-toast';
import { generateShareToken } from '@/utils/tokenUtils';
import { supabase } from '@/integrations/supabase/client';

const MonJourM = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { coordination, loading } = useCoordination();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/equipe')) return 'equipe';
    if (path.includes('/documents')) return 'documents';
    return 'planning';
  };

  const handleTabChange = (value: string) => {
    navigate(`/mon-jour-m/${value === 'planning' ? '' : value}`);
  };

  const handleShare = async () => {
    try {
      setGeneratingLink(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour générer un lien de partage",
          variant: "destructive"
        });
        return;
      }

      const token = await generateShareToken(user.id);
      if (!token) {
        throw new Error('Impossible de générer le token');
      }

      const shareUrl = `${window.location.origin}/dashboard?token=${token}`;
      await navigator.clipboard.writeText(shareUrl);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Lien copié!",
        description: "Le lien de partage a été copié dans le presse-papiers"
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le lien de partage",
        variant: "destructive"
      });
    } finally {
      setGeneratingLink(false);
    }
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
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
          {/* En-tête responsive */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {coordination?.title || 'Mon Jour-M'}
              </h1>
              <p className="text-base md:text-lg text-gray-600">
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
            <Button 
              variant="outline" 
              className="flex items-center gap-2 w-full md:w-auto"
              onClick={handleShare}
              disabled={generatingLink}
            >
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {generatingLink ? 'Génération...' : copied ? 'Copié!' : 'Partager'}
            </Button>
          </div>

          {/* Navigation par onglets responsive */}
          <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-8 h-auto">
              <TabsTrigger value="planning" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 md:py-2 text-xs md:text-sm">
                <Calendar className="h-4 w-4" />
                <span>Planning</span>
              </TabsTrigger>
              <TabsTrigger value="equipe" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 md:py-2 text-xs md:text-sm">
                <Users className="h-4 w-4" />
                <span>Équipe</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 md:py-2 text-xs md:text-sm">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </TabsTrigger>
            </TabsList>

            {/* Contenu des onglets */}
            <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
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

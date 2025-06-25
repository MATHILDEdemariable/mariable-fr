
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Share2, Calendar, Users, FileText, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import MonJourMPlanningContent from './MonJourMPlanning';
import MonJourMEquipeContent from './MonJourMEquipe';
import MonJourMDocumentsContent from './MonJourMDocuments';

interface MonJourMLayoutProps {
  children?: React.ReactNode;
}

const MonJourMLayout: React.FC<MonJourMLayoutProps> = ({ children }) => {
  const { toast } = useToast();
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [coordination, setCoordination] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('planning');

  useEffect(() => {
    initializeCoordination();
  }, []);

  const initializeCoordination = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer ou créer la coordination
      let { data: existingCoordination } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!existingCoordination) {
        const { data: newCoordination, error } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage'
          })
          .select()
          .single();

        if (error) throw error;
        existingCoordination = newCoordination;
      }

      setCoordination(existingCoordination);

      // Récupérer le token de partage existant
      const { data: shareTokenData } = await supabase
        .from('dashboard_share_tokens')
        .select('token')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (shareTokenData) {
        setShareToken(shareTokenData.token);
      }
    } catch (error) {
      console.error('Error initializing coordination:', error);
    }
  };

  const generateShareLink = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const { error } = await supabase
        .from('dashboard_share_tokens')
        .upsert({
          user_id: user.id,
          token,
          active: true,
          description: 'Mon Jour-M Share'
        });

      if (error) throw error;

      setShareToken(token);
      const shareUrl = `${window.location.origin}/jour-m-vue/${token}`;
      
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien de partage a été copié dans votre presse-papiers"
      });
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le lien de partage",
        variant: "destructive"
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'equipe':
        return <MonJourMEquipeContent />;
      case 'documents':
        return <MonJourMDocumentsContent />;
      default:
        return <MonJourMPlanningContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* En-tête avec titre et actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-wedding-black mb-2">
              Mon Jour-M
            </h1>
            <p className="text-gray-600">
              Organisez et coordonnez tous les détails de votre mariage
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={generateShareLink}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
            <Button className="flex items-center gap-2 bg-wedding-olive hover:bg-wedding-olive/90">
              <Sparkles className="h-4 w-4" />
              Assistant IA
            </Button>
          </div>
        </div>

        {/* Navigation par onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
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

          <TabsContent value={activeTab} className="min-h-[600px]">
            {renderTabContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MonJourMLayout;

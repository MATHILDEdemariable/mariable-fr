import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Palette, Download, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMoodboard } from '@/hooks/useMoodboard';
import MoodboardUploader from '@/components/moodboard/MoodboardUploader';
import MoodboardCanvas from '@/components/moodboard/MoodboardCanvas';
import { generateMoodboardPdf } from '@/services/moodboardPdfService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const MoodboardPage: React.FC = () => {
  const { toast } = useToast();
  const [coupleName, setCoupleName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const {
    images,
    colors,
    ambiance,
    isAnalyzing,
    isGenerated,
    addImages,
    removeImage,
    analyzeColors,
    reset,
  } = useMoodboard();

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, wedding_date')
          .eq('id', user.id)
          .single();

        if (profile) {
          if (profile.first_name || profile.last_name) {
            const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
            if (!coupleName) setCoupleName(name);
          }
          if (profile.wedding_date && !weddingDate) {
            setWeddingDate(profile.wedding_date);
          }
        }
      }
    };

    loadProfile();
  }, []);

  const handleGenerate = async () => {
    const success = await analyzeColors();
    if (success) {
      // Scroll to canvas
      setTimeout(() => {
        document.getElementById('moodboard-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await generateMoodboardPdf({
        coupleName,
        weddingDate,
        images,
        colors,
        ambiance,
      });
      toast({
        title: "PDF téléchargé !",
        description: "Votre moodboard a été exporté avec succès.",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    reset();
    setCoupleName('');
    setWeddingDate('');
  };

  return (
    <>
      <Helmet>
        <title>Moodboard | Mariable</title>
        <meta name="description" content="Créez votre moodboard de mariage avec extraction automatique de palette de couleurs" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-wedding-olive/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-wedding-olive" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl">Moodboard</h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Créez votre planche d'inspiration avec extraction automatique de palette de couleurs par IA
          </p>
        </div>

        {/* Step 1: Couple info */}
        <div className="bg-white border border-gray-200 rounded-none p-6 mb-6">
          <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-wedding-olive text-white text-sm flex items-center justify-center">1</span>
            Informations du mariage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="couple-name">Nom des mariés</Label>
              <Input
                id="couple-name"
                placeholder="Ex: Marie & Pierre"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                className="rounded-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wedding-date">Date du mariage</Label>
              <Input
                id="wedding-date"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Upload photos */}
        <div className="bg-white border border-gray-200 rounded-none p-6 mb-6">
          <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-wedding-olive text-white text-sm flex items-center justify-center">2</span>
            Photos d'inspiration
          </h2>
          <MoodboardUploader
            images={images}
            onAddImages={addImages}
            onRemoveImage={removeImage}
            disabled={isAnalyzing}
          />
        </div>

        {/* Step 3: Generate */}
        <div className="bg-white border border-gray-200 rounded-none p-6 mb-6">
          <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-wedding-olive text-white text-sm flex items-center justify-center">3</span>
            Générer le moodboard
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGenerate}
              disabled={images.length < 5 || isAnalyzing}
              className="flex-1 rounded-none bg-wedding-olive hover:bg-wedding-olive/90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer mon moodboard
                </>
              )}
            </Button>

            {(images.length > 0 || isGenerated) && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="rounded-none"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Recommencer
              </Button>
            )}
          </div>

          {images.length < 5 && images.length > 0 && (
            <p className="text-sm text-amber-600 mt-3">
              Ajoutez encore {5 - images.length} photo{5 - images.length > 1 ? 's' : ''} pour pouvoir générer le moodboard.
            </p>
          )}
        </div>

        {/* Result */}
        {isGenerated && (
          <div id="moodboard-result" className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-none p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-medium text-lg">Votre Moodboard</h2>
                <Button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="rounded-none bg-wedding-olive hover:bg-wedding-olive/90"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Export...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </>
                  )}
                </Button>
              </div>

              <MoodboardCanvas
                coupleName={coupleName}
                weddingDate={weddingDate}
                images={images}
                colors={colors}
                ambiance={ambiance}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MoodboardPage;

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface MoodboardColor {
  hex: string;
  name: string;
}

export interface MoodboardImage {
  id: string;
  file: File;
  preview: string;
  base64?: string;
}

export interface MoodboardData {
  coupleName: string;
  weddingDate: string;
  images: MoodboardImage[];
  colors: MoodboardColor[];
  ambiance: string;
}

export const useMoodboard = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<MoodboardImage[]>([]);
  const [colors, setColors] = useState<MoodboardColor[]>([]);
  const [ambiance, setAmbiance] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const addImages = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = 10 - images.length;
    
    if (fileArray.length > remainingSlots) {
      toast({
        title: "Limite atteinte",
        description: `Vous pouvez ajouter maximum ${remainingSlots} photo(s) supplémentaire(s).`,
        variant: "destructive",
      });
    }

    const filesToAdd = fileArray.slice(0, remainingSlots);
    
    const newImages: MoodboardImage[] = await Promise.all(
      filesToAdd.map(async (file) => {
        const preview = URL.createObjectURL(file);
        const base64 = await fileToBase64(file);
        return {
          id: crypto.randomUUID(),
          file,
          preview,
          base64,
        };
      })
    );

    setImages((prev) => [...prev, ...newImages]);
  }, [images.length, toast]);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
    setIsGenerated(false);
    setColors([]);
    setAmbiance('');
  }, []);

  const analyzeColors = useCallback(async () => {
    if (images.length < 5) {
      toast({
        title: "Photos insuffisantes",
        description: "Veuillez ajouter au moins 5 photos pour générer le moodboard.",
        variant: "destructive",
      });
      return false;
    }

    setIsAnalyzing(true);

    try {
      const base64Images = images.map((img) => img.base64).filter(Boolean);

      const { data, error } = await supabase.functions.invoke('analyze-moodboard-colors', {
        body: { images: base64Images },
      });

      if (error) {
        console.error('❌ analyzeColors edge function error:', error);
        const errorMessage = error.message || "Erreur lors de l'analyse des couleurs";
        throw new Error(errorMessage);
      }

      if (data.colors && Array.isArray(data.colors)) {
        setColors(data.colors);
        setAmbiance(data.ambiance || '');
        setIsGenerated(true);
        toast({
          title: "Moodboard généré !",
          description: "Votre palette de couleurs a été extraite avec succès.",
        });
        return true;
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (error) {
      console.error('Error analyzing colors:', error);
      toast({
        title: "Erreur d'analyse",
        description: error instanceof Error ? error.message : "Impossible d'analyser les couleurs.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  }, [images, toast]);

  const reset = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setColors([]);
    setAmbiance('');
    setIsGenerated(false);
  }, [images]);

  return {
    images,
    colors,
    ambiance,
    isAnalyzing,
    isGenerated,
    addImages,
    removeImage,
    analyzeColors,
    reset,
  };
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

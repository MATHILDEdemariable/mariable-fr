
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, Loader2, Trash2, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface SavedParametersManagerProps {
  currentParameters: any;
  onLoadParameters: (parameters: any) => void;
}

interface SavedParameter {
  id: string;
  name: string;
  created_at: string;
  parameters: any;
}

const SavedParametersManager: React.FC<SavedParametersManagerProps> = ({ 
  currentParameters,
  onLoadParameters
}) => {
  const [savedParameters, setSavedParameters] = useState<SavedParameter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newSaveName, setNewSaveName] = useState<string>("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch saved parameters on component mount
  useEffect(() => {
    fetchSavedParameters();
  }, []);

  const fetchSavedParameters = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('coordination_parameters')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setSavedParameters(data || []);
      }
    } catch (error) {
      console.error('Error fetching saved parameters:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer vos paramètres sauvegardés"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveParameters = async () => {
    if (!newSaveName.trim()) {
      toast({
        variant: "destructive",
        title: "Nom requis",
        description: "Veuillez entrer un nom pour cette sauvegarde"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('coordination_parameters')
          .insert({
            user_id: user.id,
            name: newSaveName.trim(),
            parameters: currentParameters
          });
        
        if (error) throw error;
        
        toast({
          title: "Sauvegarde réussie",
          description: `Les paramètres ont été sauvegardés sous "${newSaveName}"`
        });

        // Refresh the saved parameters list
        await fetchSavedParameters();
        
        // Reset the input field and close dialog
        setNewSaveName("");
        setIsSaveDialogOpen(false);
      }
    } catch (error) {
      console.error('Error saving parameters:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadParameters = (parameters: any) => {
    onLoadParameters(parameters);
    setIsLoadDialogOpen(false);
    toast({
      title: "Paramètres chargés",
      description: "Les paramètres ont été appliqués avec succès"
    });
  };

  const handleDeleteSavedParameters = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('coordination_parameters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Suppression réussie",
        description: `"${name}" a été supprimé`
      });

      // Refresh the saved parameters list
      await fetchSavedParameters();
    } catch (error) {
      console.error('Error deleting parameters:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer les paramètres"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 bg-wedding-olive text-white hover:bg-wedding-olive/80"
            >
              <Save className="h-4 w-4" />
              <span>Sauvegarder</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sauvegarder les paramètres</DialogTitle>
              <DialogDescription>
                Donnez un nom à cette configuration pour la retrouver facilement.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Nom de la sauvegarde (ex: Mariage d'été)"
                value={newSaveName}
                onChange={(e) => setNewSaveName(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsSaveDialogOpen(false)} 
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveParameters} 
                disabled={isLoading || !newSaveName.trim()} 
                className="bg-wedding-olive hover:bg-wedding-olive/80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Sauvegarde...</span>
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <span>Sauvegarder</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Charger</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Charger des paramètres sauvegardés</DialogTitle>
              <DialogDescription>
                Sélectionnez une configuration pour l'appliquer à votre planning.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
                </div>
              ) : savedParameters.length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {savedParameters.map((param) => (
                    <div key={param.id} className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <p className="font-medium">{param.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(param.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleLoadParameters(param.parameters)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="ml-1">Charger</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteSavedParameters(param.id, param.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Aucune configuration sauvegardée.</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsLoadDialogOpen(false)} 
                disabled={isLoading}
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SavedParametersManager;

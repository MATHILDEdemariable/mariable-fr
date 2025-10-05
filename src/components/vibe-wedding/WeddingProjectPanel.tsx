import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, Euro, Palette, Save } from 'lucide-react';
import { useWeddingProject } from '@/contexts/WeddingProjectContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type WeddingProjectPanelProps = {
  onSave?: () => void;
};

const WeddingProjectPanel: React.FC<WeddingProjectPanelProps> = ({ onSave }) => {
  const { project } = useWeddingProject();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    if (!project) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentification requise",
          description: "Veuillez vous connecter pour sauvegarder votre projet",
          variant: "destructive",
        });
        return;
      }

      // Save to generated_planning table
      const { error } = await supabase.from('generated_planning').insert({
        user_id: user.id,
        budget: project.weddingData?.budget || 0,
        nombre_invites: project.weddingData?.guests || 0,
        date_mariage: project.weddingData?.date || null,
        lieu_mariage: project.weddingData?.location || null,
        style: project.weddingData?.style || null,
        retroplanning: project.timeline || [],
        budget_breakdown: project.budgetBreakdown || [],
        prestataires_suggeres: project.vendors || [],
      });

      if (error) throw error;

      toast({
        title: "✅ Projet sauvegardé",
        description: "Votre projet de mariage a été ajouté à votre dashboard",
      });

      if (onSave) onSave();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le projet",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-muted-foreground text-center">
          Commencez une conversation pour créer votre projet de mariage
        </p>
      </div>
    );
  }

  const { weddingData, timeline, budgetBreakdown, vendors } = project;
  const isComplete = weddingData?.budget && weddingData?.date && weddingData?.location;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header with save button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif">Votre Projet de Mariage</h2>
          {!isComplete && (
            <Badge variant="outline" className="mt-2">
              Projet en cours
            </Badge>
          )}
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      {/* Wedding Data */}
      {weddingData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weddingData.budget && (
              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{weddingData.budget.toLocaleString('fr-FR')} €</span>
              </div>
            )}
            {weddingData.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(weddingData.date).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {weddingData.guests && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{weddingData.guests} invités</span>
              </div>
            )}
            {weddingData.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{weddingData.location}</span>
              </div>
            )}
            {weddingData.style && (
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <span>{weddingData.style}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Budget Breakdown */}
      {budgetBreakdown && budgetBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition du budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {budgetBreakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.category}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                  <span className="font-semibold">{item.estimatedCost.toLocaleString('fr-FR')} €</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {timeline && timeline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rétroplanning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timeline.map((task, idx) => (
                <div key={idx} className="flex justify-between items-start py-2 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-muted-foreground">{task.category}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendors */}
      {vendors && vendors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prestataires trouvés ({vendors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vendors.map((vendor, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{vendor.nom}</h4>
                    <Badge variant="outline">{vendor.categorie}</Badge>
                  </div>
                  {vendor.description && (
                    <p className="text-sm text-muted-foreground mb-2">{vendor.description}</p>
                  )}
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {vendor.ville && <span>📍 {vendor.ville}</span>}
                    {vendor.fourchette_prix && <span>💰 {vendor.fourchette_prix}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeddingProjectPanel;

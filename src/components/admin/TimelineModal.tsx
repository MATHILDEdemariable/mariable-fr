
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Phone, Mail, FileText, RefreshCw, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type FormulaireProfessionnel = Database['public']['Tables']['prestataires']['Row'];
type TimelineAction = Database['public']['Tables']['prestataires_timeline']['Row'];

interface TimelineModalProps {
  formulaire: FormulaireProfessionnel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const actionTypes = [
  { value: 'appel', label: 'Appel téléphonique', icon: Phone, color: 'bg-blue-100 text-blue-800' },
  { value: 'email', label: 'Email envoyé', icon: Mail, color: 'bg-green-100 text-green-800' },
  { value: 'mission', label: 'Mission assignée', icon: FileText, color: 'bg-purple-100 text-purple-800' },
  { value: 'relance', label: 'Relance', icon: RefreshCw, color: 'bg-orange-100 text-orange-800' },
  { value: 'note', label: 'Note interne', icon: User, color: 'bg-gray-100 text-gray-800' },
];

const TimelineModal: React.FC<TimelineModalProps> = ({
  formulaire,
  open,
  onOpenChange,
  onUpdate,
}) => {
  const [timeline, setTimeline] = useState<TimelineAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newAction, setNewAction] = useState({
    type_action: '',
    description: '',
    utilisateur: '',
  });

  useEffect(() => {
    if (formulaire && open) {
      fetchTimeline();
    }
  }, [formulaire, open]);

  const fetchTimeline = async () => {
    if (!formulaire) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prestataires_timeline')
        .select('*')
        .eq('prestataire_id', formulaire.id)
        .order('date_action', { ascending: false });

      if (error) throw error;
      setTimeline(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement de la timeline:', error);
      toast.error('Erreur lors du chargement de la timeline');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAction = async () => {
    if (!formulaire || !newAction.type_action || !newAction.description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setAdding(true);
    try {
      const { error } = await supabase
        .from('prestataires_timeline')
        .insert({
          prestataire_id: formulaire.id,
          type_action: newAction.type_action,
          description: newAction.description,
          utilisateur: newAction.utilisateur || 'Admin',
        });

      if (error) throw error;

      toast.success('Action ajoutée avec succès');
      setNewAction({ type_action: '', description: '', utilisateur: '' });
      fetchTimeline();
      onUpdate();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'action:', error);
      toast.error('Erreur lors de l\'ajout de l\'action');
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (type: string) => {
    const actionType = actionTypes.find(at => at.value === type);
    if (!actionType) return User;
    return actionType.icon;
  };

  const getActionBadge = (type: string) => {
    const actionType = actionTypes.find(at => at.value === type);
    if (!actionType) return <Badge variant="secondary">Non défini</Badge>;
    
    return (
      <Badge className={actionType.color}>
        {actionType.label}
      </Badge>
    );
  };

  if (!formulaire) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Timeline - {formulaire.nom}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulaire d'ajout d'action */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Ajouter une action</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={newAction.type_action} onValueChange={(value) => setNewAction({...newAction, type_action: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'action" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Utilisateur (optionnel)"
                value={newAction.utilisateur}
                onChange={(e) => setNewAction({...newAction, utilisateur: e.target.value})}
              />

              <Button onClick={handleAddAction} disabled={adding}>
                <Plus className="h-4 w-4 mr-1" />
                {adding ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
            
            <Textarea
              placeholder="Description de l'action..."
              value={newAction.description}
              onChange={(e) => setNewAction({...newAction, description: e.target.value})}
              className="mt-3"
              rows={2}
            />
          </div>

          {/* Timeline des actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Historique des actions</h3>
            {loading ? (
              <p>Chargement de la timeline...</p>
            ) : timeline.length === 0 ? (
              <p className="text-gray-500">Aucune action enregistrée</p>
            ) : (
              <div className="space-y-4">
                {timeline.map((action) => {
                  const Icon = getActionIcon(action.type_action);
                  return (
                    <div key={action.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getActionBadge(action.type_action)}
                            <span className="text-sm text-gray-500">
                              par {action.utilisateur || 'Utilisateur inconnu'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(action.date_action)}
                          </span>
                        </div>
                        <p className="text-gray-900">{action.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineModal;

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, User, CheckCircle2 } from 'lucide-react';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import ProjectTaskEditModal from './ProjectTaskEditModal';
import { useProjectCoordination } from '@/hooks/useProjectCoordination';
import { supabase } from '@/integrations/supabase/client';

interface ProjectTaskListProps {
  events: PlanningEvent[];
  onEdit: (event: PlanningEvent) => void;
  onDelete: (eventId: string) => void;
  selectionMode: boolean;
  selectedEvents: string[];
  onSelectionChange: (eventId: string, selected: boolean) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'Élevée';
    case 'medium':
      return 'Moyenne';
    case 'low':
      return 'Faible';
    default:
      return 'Normale';
  }
};

const ProjectTaskList: React.FC<ProjectTaskListProps> = ({
  events,
  onEdit,
  onDelete,
  selectionMode,
  selectedEvents,
  onSelectionChange
}) => {
  const [editingEvent, setEditingEvent] = useState<PlanningEvent | null>(null);
  const [teamMembers, setTeamMembers] = useState<Array<{id: string, name: string, role: string}>>([]);
  const { coordination } = useProjectCoordination();

  // Charger les membres de l'équipe
  React.useEffect(() => {
    if (coordination?.id) {
      loadTeamMembers();
    }
  }, [coordination?.id]);

  const loadTeamMembers = async () => {
    if (!coordination?.id) return;

    try {
      const { data, error } = await supabase
        .from('coordination_team')
        .select('id, name, role')
        .eq('coordination_id', coordination.id);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
    }
  };

  const handleEdit = (event: PlanningEvent) => {
    setEditingEvent(event);
  };

  const handleEditSave = (updatedEvent: PlanningEvent) => {
    onEdit(updatedEvent);
    setEditingEvent(null);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      onDelete(eventId);
    }
  };

  return (
    <>
      <div className="space-y-3">
        {events.map((event) => (
          <Card 
            key={event.id} 
            className={`transition-all duration-200 hover:shadow-md ${
              selectedEvents.includes(event.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-grow">
                  {selectionMode && (
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.id)}
                      onChange={(e) => onSelectionChange(event.id, e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  )}
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 ml-4">
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Moyenne
        </Badge>
                      </div>
                    </div>

                    {event.notes && (
                      <p className="text-sm text-gray-600 mb-3">
                        {event.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Catégorie:</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {event.category}
                        </Badge>
                      </div>

                      {event.assignedTo && event.assignedTo.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <User className="h-3 w-3" />
                          {event.assignedTo.map((memberId: string) => {
                            const member = teamMembers.find(m => m.id === memberId);
                            return member ? (
                              <Badge key={memberId} variant="outline" className="text-xs">
                                {member.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!selectionMode && (
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(event)}
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(event.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal d'édition */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <ProjectTaskEditModal
              event={editingEvent}
              onSave={handleEditSave}
              onClose={() => setEditingEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectTaskList;
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical, Edit2, Trash2, Clock, Target } from 'lucide-react';
import { PlanningEvent } from '../wedding-day/types/planningTypes';

interface ProjectTimelineProps {
  events: PlanningEvent[];
  onEventsChange: (events: PlanningEvent[]) => void;
  selectionMode: boolean;
  selectedEvents: string[];
  onSelectionChange: (eventId: string, selected: boolean) => void;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  events,
  onEventsChange,
  selectionMode,
  selectedEvents,
  onSelectionChange
}) => {

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex === endIndex) return;

    const reorderedEvents = Array.from(events);
    const [removed] = reorderedEvents.splice(startIndex, 1);
    reorderedEvents.splice(endIndex, 0, removed);

    onEventsChange(reorderedEvents);
  };

  const getPriorityColor = (isHighlight: boolean) => {
    return isHighlight ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Budget et finances': 'bg-green-100 text-green-800',
      'Recherche prestataires': 'bg-blue-100 text-blue-800',
      'Administratif': 'bg-purple-100 text-purple-800',
      'Shopping et achats': 'bg-pink-100 text-pink-800',
      'Communication': 'bg-orange-100 text-orange-800',
      'Planification': 'bg-indigo-100 text-indigo-800',
      'Tests et essayages': 'bg-yellow-100 text-yellow-800',
      'Confirmations': 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="project-timeline">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-4 ${
              snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-2' : ''
            }`}
          >
            {events.map((event, index) => (
              <Draggable key={event.id} draggableId={event.id} index={index}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-all ${
                      snapshot.isDragging 
                        ? 'shadow-lg scale-105 rotate-1 bg-white border-blue-500' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Drag handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="flex items-center pt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>

                        {/* Checkbox pour sélection multiple */}
                        {selectionMode && (
                          <div className="flex items-center pt-1">
                            <Checkbox
                              checked={selectedEvents.includes(event.id)}
                              onCheckedChange={(checked) => 
                                onSelectionChange(event.id, checked as boolean)
                              }
                            />
                          </div>
                        )}

                        {/* Contenu principal */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-grow">
                              <h4 className="font-medium text-gray-900 mb-2">
                                {event.title}
                              </h4>
                              
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge 
                                  variant="secondary" 
                                  className={getCategoryColor(event.category)}
                                >
                                  {event.category}
                                </Badge>
                                
                                {event.isHighlight && (
                                  <Badge variant="secondary" className={getPriorityColor(event.isHighlight)}>
                                    Priorité élevée
                                  </Badge>
                                )}
                                
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{event.duration} min</span>
                                </div>
                              </div>
                              
                              {event.notes && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {event.notes}
                                </p>
                              )}
                              
                              {event.assignedTo && event.assignedTo.length > 0 && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Target className="h-3 w-3" />
                                  <span>Assignée à: {event.assignedTo.join(', ')}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Actions */}
                            {!selectionMode && (
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ProjectTimeline;
import React from 'react';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import MonJourMEventCard from './MonJourMEventCard';
import { Button } from '@/components/ui/button';
import { Plus, Link2 } from 'lucide-react';
import { generateParallelGroupId } from '@/types/monjourm-mvp';

interface MonJourMParallelTasksProps {
  parallelTasks: PlanningEvent[];
  teamMembers: any[];
  onUpdate: (updatedEvent: PlanningEvent) => void;
  onDelete?: (eventId: string) => void;
  onAddParallelTask?: (baseEvent: PlanningEvent) => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (eventId: string, selected: boolean) => void;
  selectionMode?: boolean;
  selectedEvents?: string[];
}

const MonJourMParallelTasks: React.FC<MonJourMParallelTasksProps> = ({
  parallelTasks,
  teamMembers,
  onUpdate,
  onDelete,
  onAddParallelTask,
  dragHandleProps,
  isDragging,
  isSelected = false,
  onSelectionChange,
  selectionMode = false,
  selectedEvents = []
}) => {
  const handleAddParallelTask = () => {
    if (onAddParallelTask && parallelTasks.length > 0) {
      onAddParallelTask(parallelTasks[0]);
    }
  };

  const formatTime = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return '--:--';
    }
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeRange = () => {
    if (parallelTasks.length === 0) return '';
    const firstTask = parallelTasks[0];
    const maxDuration = Math.max(...parallelTasks.map(task => task.duration));
    const startTime = firstTask.startTime;
    const endTime = new Date(startTime.getTime() + maxDuration * 60000);
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  if (parallelTasks.length === 1) {
    // Tâche unique - affichage normal
    return (
      <div className="relative group">
        <MonJourMEventCard
          event={parallelTasks[0]}
          teamMembers={teamMembers}
          onUpdate={onUpdate}
          onDelete={onDelete}
          dragHandleProps={dragHandleProps}
          isDragging={isDragging}
          isSelected={selectedEvents.includes(parallelTasks[0].id)}
          onSelectionChange={onSelectionChange}
          selectionMode={selectionMode}
        />
        {!selectionMode && (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddParallelTask}
              className="h-8 w-8 p-0 bg-white shadow-md hover:shadow-lg border-2 border-blue-200 hover:border-blue-400"
              title="Ajouter une tâche parallèle"
            >
              <Link2 className="h-4 w-4 text-blue-600" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Tâches parallèles - affichage en grille
  return (
    <div className="relative group">
      {/* En-tête du groupe parallèle */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Tâches parallèles - {getTimeRange()}
          </span>
          <span className="text-xs text-gray-500">
            ({parallelTasks.length} tâches)
          </span>
        </div>
        {!selectionMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddParallelTask}
            className="h-6 px-2 text-xs"
            title="Ajouter une tâche parallèle"
          >
            <Plus className="h-3 w-3 mr-1" />
            Ajouter
          </Button>
        )}
      </div>

      {/* Grille des tâches parallèles */}
      <div 
        className={`grid gap-3 ${
          parallelTasks.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
          parallelTasks.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {parallelTasks.map((task, index) => (
          <div 
            key={task.id} 
            className={`${
              index === 0 ? 'border-l-4 border-blue-400' : 
              index === 1 ? 'border-l-4 border-green-400' : 
              'border-l-4 border-orange-400'
            } pl-2`}
          >
            <MonJourMEventCard
              event={task}
              teamMembers={teamMembers}
              onUpdate={onUpdate}
              onDelete={onDelete}
              dragHandleProps={index === 0 ? dragHandleProps : undefined}
              isDragging={isDragging}
              isSelected={selectedEvents.includes(task.id)}
              onSelectionChange={onSelectionChange}
              selectionMode={selectionMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonJourMParallelTasks;
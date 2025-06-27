
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { PlanningTask, addMinutesToTime } from '@/types/monjourm-mvp';

interface MonJourMSharedTimelineProps {
  tasks: PlanningTask[];
}

const MonJourMSharedTimeline: React.FC<MonJourMSharedTimelineProps> = ({ tasks }) => {
  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 print:bg-red-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 print:bg-yellow-100';
      case 'low': return 'bg-green-100 text-green-800 print:bg-green-100';
      default: return 'bg-gray-100 text-gray-800 print:bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Moyenne';
    }
  };

  // Calculer la durée totale
  const totalDuration = tasks.reduce((acc, task) => acc + task.duration, 0);
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <Card className="bg-wedding-cream/20 print:bg-white print:border">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-wedding-olive">{tasks.length}</div>
              <div className="text-sm text-muted-foreground">Tâches planifiées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-wedding-olive">
                {totalHours}h{totalMinutes > 0 && `${totalMinutes}min`}
              </div>
              <div className="text-sm text-muted-foreground">Durée totale</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-wedding-olive">
                {tasks[0]?.start_time || '09:00'} - {addMinutesToTime(tasks[tasks.length - 1]?.start_time || '09:00', tasks[tasks.length - 1]?.duration || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Plage horaire</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline des tâches */}
      <div className="space-y-4">
        {tasks.map((task, index) => {
          const endTime = addMinutesToTime(task.start_time, task.duration);
          const isLastTask = index === tasks.length - 1;
          
          return (
            <div key={task.id} className="relative">
              {/* Ligne de connexion */}
              {!isLastTask && (
                <div className="absolute left-6 top-20 w-0.5 h-8 bg-wedding-olive/30 print:bg-gray-300" />
              )}
              
              <Card className="relative bg-white/90 backdrop-blur-sm print:bg-white print:shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-wedding-olive mt-2 print:bg-gray-600" />
                    
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                          {task.description && (
                            <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                          )}
                        </div>
                        
                        {/* Heure */}
                        <div className="flex items-center gap-2 text-wedding-olive font-medium ml-4 print:text-gray-700">
                          <Clock className="h-4 w-4" />
                          <div className="text-right">
                            <div className="text-lg">{task.start_time} - {endTime}</div>
                            <div className="text-xs text-muted-foreground">
                              {task.duration} min
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="print:border-gray-400">
                          {task.category}
                        </Badge>
                        
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        
                        {task.assigned_role && (
                          <Badge variant="secondary" className="print:bg-gray-200">
                            {task.assigned_role}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Barre de progression visuelle */}
                      <div className="mt-4 print:hidden">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-wedding-olive to-wedding-olive/70"
                            style={{ 
                              width: `${Math.min((task.duration / 120) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonJourMSharedTimeline;

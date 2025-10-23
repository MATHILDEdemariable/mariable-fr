import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle2, Table, TrendingUp } from 'lucide-react';
import { SeatingTable, SeatingAssignment } from '@/types/seating';

interface SeatingPlanStatsProps {
  totalGuests: number;
  assignedGuests: number;
  tablesCount: number;
  tables: SeatingTable[];
  guests: SeatingAssignment[];
}

const SeatingPlanStats = ({ 
  totalGuests, 
  assignedGuests, 
  tablesCount,
  tables,
  guests 
}: SeatingPlanStatsProps) => {
  const unassignedGuests = totalGuests - assignedGuests;
  const assignmentRate = totalGuests > 0 ? Math.round((assignedGuests / totalGuests) * 100) : 0;
  
  const totalCapacity = tables.reduce((sum, table) => sum + table.capacity, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((assignedGuests / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Total invités</span>
              <span className="font-semibold">{totalGuests}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                Placés
              </span>
              <span className="font-semibold text-green-600">{assignedGuests}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Non placés</span>
              <span className="font-semibold text-orange-600">{unassignedGuests}</span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Taux d'assignation</span>
              <span className="font-semibold">{assignmentRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-green-600"
                style={{ width: `${assignmentRate}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Table className="h-3 w-3" />
                Tables
              </span>
              <span className="font-semibold">{tablesCount}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Capacité totale</span>
              <span>{totalCapacity} places</span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Taux de remplissage
              </span>
              <span className="font-semibold">{occupancyRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatingPlanStats;

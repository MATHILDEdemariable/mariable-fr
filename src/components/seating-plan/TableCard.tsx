import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users, AlertCircle } from 'lucide-react';
import { SeatingTable, SeatingAssignment } from '@/types/seating';
import GuestCard from './GuestCard';

interface TableCardProps {
  table: SeatingTable;
  guests: SeatingAssignment[];
  onEdit: () => void;
  onDelete: () => void;
  isDragOver: boolean;
}

const TableCard = ({ table, guests, onEdit, onDelete, isDragOver }: TableCardProps) => {
  const occupancy = guests.length;
  const capacity = table.capacity;
  const isFull = occupancy >= capacity;
  const occupancyPercent = (occupancy / capacity) * 100;

  return (
    <Card className={`transition-all ${isDragOver ? 'ring-2 ring-primary shadow-lg' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{table.table_name}</h3>
            <p className="text-sm text-muted-foreground">Table {table.table_number}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {occupancy}/{capacity}
            </span>
            {isFull && (
              <Badge variant="destructive" className="text-xs">Pleine</Badge>
            )}
          </div>
          <Badge variant="outline" className="text-xs capitalize">
            {table.shape === 'round' && 'Ronde'}
            {table.shape === 'rectangle' && 'Rectangle'}
            {table.shape === 'oval' && 'Ovale'}
          </Badge>
        </div>

        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-primary'}`}
              style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {guests.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Aucun invité assigné
          </div>
        ) : (
          guests.map((guest, index) => (
            <GuestCard key={guest.id} guest={guest} index={index} />
          ))
        )}

        {guests.some(g => g.dietary_restrictions) && (
          <div className="flex items-center gap-1 text-xs text-orange-600 mt-2 pt-2 border-t">
            <AlertCircle className="h-3 w-3" />
            <span>Restrictions alimentaires présentes</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TableCard;

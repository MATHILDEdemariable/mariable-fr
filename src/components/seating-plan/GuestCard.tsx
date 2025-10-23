import { Draggable } from 'react-beautiful-dnd';
import { Badge } from '@/components/ui/badge';
import { User, Baby, Star, Utensils } from 'lucide-react';
import { SeatingAssignment } from '@/types/seating';

interface GuestCardProps {
  guest: SeatingAssignment;
  index: number;
}

const GuestCard = ({ guest, index }: GuestCardProps) => {
  const getGuestIcon = () => {
    if (guest.guest_type === 'child') return <Baby className="h-3 w-3" />;
    if (guest.guest_type === 'vip') return <Star className="h-3 w-3 text-yellow-500" />;
    return <User className="h-3 w-3" />;
  };

  return (
    <Draggable draggableId={`guest-${guest.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-2 bg-muted rounded-lg border flex items-center justify-between transition-shadow ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-primary' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            {getGuestIcon()}
            <span className="text-sm font-medium">{guest.guest_name}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {guest.dietary_restrictions && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Utensils className="h-3 w-3" />
              </Badge>
            )}
            {guest.guest_type === 'vip' && (
              <Badge variant="secondary" className="text-xs">VIP</Badge>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default GuestCard;

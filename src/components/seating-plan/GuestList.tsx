import { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, Trash2, X } from 'lucide-react';
import { SeatingAssignment } from '@/types/seating';
import GuestCard from './GuestCard';

interface GuestListProps {
  guests: SeatingAssignment[];
  onDeleteGuest?: (guestId: string) => void;
  onDeleteAllGuests?: () => void;
}

const GuestList = ({ guests, onDeleteGuest, onDeleteAllGuests }: GuestListProps) => {
  const [search, setSearch] = useState('');

  const filteredGuests = guests.filter(g => 
    g.guest_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteAll = () => {
    if (guests.length === 0) return;
    if (confirm(`Supprimer ${guests.length} invité(s) non placé(s) ?`)) {
      onDeleteAllGuests?.();
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Invités Non Placés ({guests.length})
          </CardTitle>
          {onDeleteAllGuests && guests.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteAll}
              className="h-7 px-2 text-muted-foreground hover:text-destructive"
              title="Supprimer tous les invités non placés"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Droppable droppableId="unassigned">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-2 min-h-[200px] p-2 rounded-lg transition-colors ${
                snapshot.isDraggingOver ? 'bg-muted' : ''
              }`}
            >
              {filteredGuests.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {search ? 'Aucun invité trouvé' : 'Tous les invités sont placés'}
                </div>
              ) : (
                filteredGuests.map((guest, index) => (
                  <GuestCard 
                    key={guest.id} 
                    guest={guest} 
                    index={index} 
                    onDelete={onDeleteGuest}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
};

export default GuestList;

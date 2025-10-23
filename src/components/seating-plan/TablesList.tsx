import { Droppable } from 'react-beautiful-dnd';
import TableCard from './TableCard';
import { SeatingTable, SeatingAssignment } from '@/types/seating';
import { Card } from '@/components/ui/card';

interface TablesListProps {
  tables: SeatingTable[];
  guests: SeatingAssignment[];
  onEditTable: (table: SeatingTable) => void;
  onDeleteTable: (tableId: string) => void;
}

const TablesList = ({ tables, guests, onEditTable, onDeleteTable }: TablesListProps) => {
  if (tables.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-2">Aucune table créée</p>
        <p className="text-sm text-muted-foreground">
          Cliquez sur "Nouvelle Table" pour commencer
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Tables ({tables.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tables.map(table => {
          const tableGuests = guests.filter(g => g.table_id === table.id);
          return (
            <Droppable key={table.id} droppableId={`table-${table.id}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <TableCard
                    table={table}
                    guests={tableGuests}
                    onEdit={() => onEditTable(table)}
                    onDelete={() => onDeleteTable(table.id)}
                    isDragOver={snapshot.isDraggingOver}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </div>
  );
};

export default TablesList;

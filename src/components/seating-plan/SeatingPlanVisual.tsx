import React, { useState, useRef, useEffect } from 'react';
import { SeatingTable, SeatingAssignment } from '@/types/seating';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SeatingPlanVisualProps {
  tables: SeatingTable[];
  guests: SeatingAssignment[];
  onTablePositionUpdate: () => void;
}

const SeatingPlanVisual: React.FC<SeatingPlanVisualProps> = ({
  tables,
  guests,
  onTablePositionUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tablePositions, setTablePositions] = useState<Record<string, { x: number; y: number }>>({});

  // Initialize positions from database or default grid
  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    tables.forEach((table, index) => {
      positions[table.id] = {
        x: table.position_x ?? (100 + (index % 4) * 180),
        y: table.position_y ?? (100 + Math.floor(index / 4) * 180)
      };
    });
    setTablePositions(positions);
  }, [tables]);

  const getTableGuests = (tableId: string) => {
    return guests.filter(g => g.table_id === tableId);
  };

  const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).closest('.table-shape')?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2
      });
    }
    setDraggingTable(tableId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingTable || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    // Keep within bounds
    const boundedX = Math.max(50, Math.min(containerRect.width - 100, newX));
    const boundedY = Math.max(50, Math.min(containerRect.height - 100, newY));

    setTablePositions(prev => ({
      ...prev,
      [draggingTable]: { x: boundedX, y: boundedY }
    }));
  };

  const handleMouseUp = async () => {
    if (!draggingTable) return;

    const position = tablePositions[draggingTable];
    if (position) {
      // Save position to database
      const { error } = await supabase
        .from('seating_tables')
        .update({ 
          position_x: Math.round(position.x), 
          position_y: Math.round(position.y) 
        })
        .eq('id', draggingTable);

      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de sauvegarder la position',
          variant: 'destructive'
        });
      }
    }

    setDraggingTable(null);
    onTablePositionUpdate();
  };

  const getTableShape = (shape: string) => {
    switch (shape) {
      case 'rectangle':
        return 'rounded-lg';
      case 'oval':
        return 'rounded-[50%]';
      case 'round':
      default:
        return 'rounded-full';
    }
  };

  const getTableSize = (shape: string, capacity: number) => {
    const baseSize = Math.max(80, Math.min(140, 60 + capacity * 8));
    if (shape === 'rectangle') {
      return { width: baseSize * 1.5, height: baseSize };
    }
    if (shape === 'oval') {
      return { width: baseSize * 1.3, height: baseSize };
    }
    return { width: baseSize, height: baseSize };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] bg-gradient-to-br from-premium-cream to-white rounded-xl border-2 border-dashed border-premium-sage/30 overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #4a5568 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-premium-sage" />
          <span>Table ronde</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 rounded-lg bg-premium-sage" />
          <span>Table rectangle</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 rounded-[50%] bg-premium-sage" />
          <span>Table ovale</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm text-xs text-muted-foreground">
        Glissez les tables pour les positionner
      </div>

      {/* Tables */}
      {tables.map(table => {
        const position = tablePositions[table.id] || { x: 100, y: 100 };
        const tableGuests = getTableGuests(table.id);
        const size = getTableSize(table.shape, table.capacity);
        const isFull = tableGuests.length >= table.capacity;
        const isDragging = draggingTable === table.id;

        return (
          <div
            key={table.id}
            className={cn(
              "absolute transition-shadow duration-200",
              isDragging && "z-50"
            )}
            style={{
              left: position.x - size.width / 2,
              top: position.y - size.height / 2,
              transform: isDragging ? 'scale(1.05)' : 'scale(1)',
              transition: isDragging ? 'none' : 'transform 0.2s'
            }}
          >
            {/* Table shape */}
            <div
              className={cn(
                "table-shape flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-2",
                getTableShape(table.shape),
                isFull 
                  ? "bg-premium-sage text-white border-premium-sage-dark" 
                  : "bg-white text-foreground border-premium-sage/50 hover:border-premium-sage",
                isDragging && "shadow-2xl ring-2 ring-premium-sage ring-offset-2"
              )}
              style={{
                width: size.width,
                height: size.height,
                backgroundColor: table.color || (isFull ? undefined : '#fff')
              }}
              onMouseDown={(e) => handleMouseDown(e, table.id)}
            >
              <span className="font-semibold text-sm truncate max-w-[90%]">
                {table.table_name}
              </span>
              <span className="text-xs opacity-80">
                {tableGuests.length}/{table.capacity}
              </span>
            </div>

            {/* Guest indicators around the table */}
            {tableGuests.slice(0, 8).map((guest, index) => {
              const angle = (index / Math.min(tableGuests.length, 8)) * 2 * Math.PI - Math.PI / 2;
              const radius = Math.max(size.width, size.height) / 2 + 20;
              const guestX = Math.cos(angle) * radius;
              const guestY = Math.sin(angle) * radius;

              return (
                <div
                  key={guest.id}
                  className="absolute w-6 h-6 bg-premium-sage-light rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[8px] text-premium-sage-dark font-medium"
                  style={{
                    left: size.width / 2 + guestX - 12,
                    top: size.height / 2 + guestY - 12
                  }}
                  title={guest.guest_name}
                >
                  {guest.guest_name.charAt(0).toUpperCase()}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Empty state */}
      {tables.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">Aucune table créée</p>
            <p className="text-sm">Créez des tables pour les voir ici</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatingPlanVisual;

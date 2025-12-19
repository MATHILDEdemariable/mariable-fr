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
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);

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
    return guests.filter(g => g.table_id === tableId).sort((a, b) => (a.seat_number ?? 0) - (b.seat_number ?? 0));
  };

  // Handle guest click for seat swapping
  const handleGuestClick = async (guestId: string, tableId: string) => {
    if (selectedGuest === null) {
      // First click: select this guest
      setSelectedGuest(guestId);
    } else if (selectedGuest === guestId) {
      // Same guest clicked: deselect
      setSelectedGuest(null);
    } else {
      // Different guest clicked: swap seats if same table
      const guest1 = guests.find(g => g.id === selectedGuest);
      const guest2 = guests.find(g => g.id === guestId);

      if (guest1 && guest2 && guest1.table_id === guest2.table_id) {
        // Swap seat numbers
        const seat1 = guest1.seat_number ?? 0;
        const seat2 = guest2.seat_number ?? 0;

        try {
          // Update both guests
          await Promise.all([
            supabase.from('seating_assignments').update({ seat_number: seat2 }).eq('id', guest1.id),
            supabase.from('seating_assignments').update({ seat_number: seat1 }).eq('id', guest2.id)
          ]);

          toast({
            title: 'Places échangées',
            description: `${guest1.guest_name} et ${guest2.guest_name} ont échangé leurs places`
          });

          onTablePositionUpdate();
        } catch (error) {
          toast({
            title: 'Erreur',
            description: 'Impossible d\'échanger les places',
            variant: 'destructive'
          });
        }
      } else {
        toast({
          title: 'Action impossible',
          description: 'Vous ne pouvez échanger que des invités sur la même table',
          variant: 'destructive'
        });
      }
      setSelectedGuest(null);
    }
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
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm text-xs text-muted-foreground max-w-[200px]">
        <p className="mb-1">• Glissez les tables pour les positionner</p>
        <p>• Cliquez sur 2 invités d'une même table pour échanger leurs places</p>
      </div>

      {/* Selected guest indicator */}
      {selectedGuest && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-premium-sage text-white px-4 py-2 rounded-full text-sm shadow-lg z-50">
          Cliquez sur un autre invité de la même table pour échanger
        </div>
      )}

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
            {tableGuests.slice(0, 12).map((guest, index) => {
              const totalGuests = Math.min(tableGuests.length, 12);
              const angle = (index / totalGuests) * 2 * Math.PI - Math.PI / 2;
              const radius = Math.max(size.width, size.height) / 2 + 20;
              const guestX = Math.cos(angle) * radius;
              const guestY = Math.sin(angle) * radius;
              const isSelected = selectedGuest === guest.id;

              return (
                <div
                  key={guest.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGuestClick(guest.id, table.id);
                  }}
                  className={cn(
                    "absolute w-7 h-7 rounded-full border-2 shadow-sm flex items-center justify-center text-[9px] font-medium cursor-pointer transition-all duration-200 hover:scale-110",
                    isSelected 
                      ? "bg-premium-sage text-white border-white ring-2 ring-premium-sage ring-offset-1 scale-110" 
                      : "bg-premium-sage-light text-premium-sage-dark border-white hover:bg-premium-sage hover:text-white"
                  )}
                  style={{
                    left: size.width / 2 + guestX - 14,
                    top: size.height / 2 + guestY - 14
                  }}
                  title={`${guest.guest_name}${guest.seat_number ? ` (Place ${guest.seat_number})` : ''} - Cliquez pour échanger`}
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

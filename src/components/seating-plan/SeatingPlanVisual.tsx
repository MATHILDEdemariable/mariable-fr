import { useTranslation } from 'react-i18next';
import React, { useState, useRef, useEffect } from 'react';
import { SeatingTable, SeatingAssignment } from '@/types/seating';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type RoomShape = 'rectangle' | 'square' | 'L' | 'U';
type FixedElementKind = 'dancefloor' | 'stage' | 'buffet' | 'door';
interface RoomConfig {
  enabled: boolean;
  shape: RoomShape;
  widthM: number;
  lengthM: number;
  pxPerMeter: number;
  showComfort: boolean;
  fixedElements: Array<{ id: string; kind: FixedElementKind; x: number; y: number }>;
}
const ROOM_MARGIN = 50;
const DEFAULT_ROOM: RoomConfig = { enabled: false, shape: 'rectangle', widthM: 16, lengthM: 10, pxPerMeter: 35, showComfort: true, fixedElements: [] };
// Dimensions indicatives en mètres
const FIXED_ELEMENTS: Record<FixedElementKind, { fr: string; en: string; w: number; h: number }> = {
  dancefloor: { fr: 'Piste de danse', en: 'Dance floor', w: 5, h: 5 },
  stage: { fr: 'Scène / DJ', en: 'Stage / DJ', w: 3, h: 2 },
  buffet: { fr: 'Buffet / Bar', en: 'Buffet / Bar', w: 4, h: 1 },
  door: { fr: 'Accès traiteur', en: 'Catering door', w: 1.5, h: 0.6 },
};

interface SeatingPlanVisualProps {
  tables: SeatingTable[];
  guests: SeatingAssignment[];
  onTablePositionUpdate: () => void;
  onEditTable?: (table: SeatingTable) => void;
}

const SeatingPlanVisual: React.FC<SeatingPlanVisualProps> = ({
  tables,
  guests,
  onTablePositionUpdate,
  onEditTable
}) => {
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.language?.startsWith('en') ? en : fr);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tablePositions, setTablePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);

  // Configuration de salle partagée en ligne (wedding_tool_states, accès par mariage : pro + couple)
  const seatingPlanId = tables[0]?.seating_plan_id;
  const roomToolKey = `seating-room-${seatingPlanId ?? 'default'}`;
  const [showGuestNames, setShowGuestNames] = useState(true);
  const [roomConfig, setRoomConfig] = useState<RoomConfig>(DEFAULT_ROOM);
  const [areaInput, setAreaInput] = useState('');
  const roomStateRef = useRef<{ id: string | null; weddingId: string | null }>({ id: null, weddingId: null });
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!seatingPlanId) return;
    const loadRoomConfig = async () => {
      try {
        const { data: plan } = await supabase.from('seating_plans').select('wedding_id').eq('id', seatingPlanId).maybeSingle();
        const weddingId = plan?.wedding_id ?? null;
        let query = supabase.from('wedding_tool_states').select('id, state').eq('tool_key', roomToolKey);
        query = weddingId ? query.eq('wedding_id', weddingId) : query.is('wedding_id', null);
        const { data, error } = await query.order('updated_at', { ascending: false }).limit(1);
        if (error) throw error;
        roomStateRef.current = { id: data?.[0]?.id ?? null, weddingId };
        if (data?.[0]) {
          setRoomConfig({ ...DEFAULT_ROOM, ...(data[0].state as Partial<RoomConfig>) });
        } else {
          // Reprise d'une ancienne configuration enregistrée sur cet appareil
          const legacy = localStorage.getItem(`seating-room-${seatingPlanId}`);
          if (legacy) setRoomConfig({ ...DEFAULT_ROOM, ...JSON.parse(legacy) });
        }
      } catch (error) { console.error('Erreur lecture configuration salle:', error); }
    };
    loadRoomConfig();
  }, [seatingPlanId, roomToolKey]);
  const saveRoomConfig = (config: RoomConfig) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        const { id, weddingId } = roomStateRef.current;
        if (id) {
          const { error } = await supabase.from('wedding_tool_states').update({ state: config as any }).eq('id', id);
          if (error) throw error;
        } else {
          const { data: auth } = await supabase.auth.getUser();
          if (!auth.user) return;
          const { data, error } = await supabase.from('wedding_tool_states')
            .insert({ user_id: auth.user.id, wedding_id: weddingId, tool_key: roomToolKey, state: config as any })
            .select('id').single();
          if (error) throw error;
          roomStateRef.current.id = data.id;
        }
      } catch (error) {
        console.error('Erreur sauvegarde salle:', error);
        toast({ title: tr('Configuration de salle non enregistrée', 'Room setup not saved'), variant: 'destructive' });
      }
    }, 600);
  };
  const updateRoom = (patch: Partial<RoomConfig>) => {
    setRoomConfig((prev) => {
      const next = { ...prev, ...patch };
      saveRoomConfig(next);
      return next;
    });
  };
  const applyArea = (value: string) => {
    setAreaInput(value);
    const area = parseFloat(value.replace(',', '.'));
    if (!area || area <= 0) return;
    const width = roomConfig.shape === 'square' ? Math.sqrt(area) : Math.sqrt(area * 1.6);
    updateRoom({ widthM: Math.round(width * 10) / 10, lengthM: Math.round((area / width) * 10) / 10 });
  };
  const ppm = roomConfig.pxPerMeter;
  const roomW = roomConfig.widthM * ppm;
  const roomL = (roomConfig.shape === 'square' ? roomConfig.widthM : roomConfig.lengthM) * ppm;

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

  // Extract first name from full name

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
            title: tr('Places échangées','Seats swapped'),
            description: `${guest1.guest_name} et ${guest2.guest_name} ont échangé leurs places`
          });

          onTablePositionUpdate();
        } catch (error) {
          toast({
            title: tr('Erreur','Error'),
            description: tr("Impossible d'échanger les places",'Unable to swap seats'),
            variant: 'destructive'
          });
        }
      } else {
        toast({
          title: tr('Action impossible','Action not allowed'),
          description: tr('Vous ne pouvez échanger que des invités sur la même table','You can only swap guests at the same table'),
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
    const boundedX = Math.max(20, Math.min(containerRect.width - 20, newX));
    const boundedY = Math.max(20, Math.min(containerRect.height - 20, newY));

    setTablePositions(prev => ({
      ...prev,
      [draggingTable]: { x: boundedX, y: boundedY }
    }));
  };

  const handleMouseUp = async () => {
    if (!draggingTable) return;
    if (draggingTable.startsWith('fixed:')) {
      const elementId = draggingTable.slice(6);
      const position = tablePositions[draggingTable];
      if (position) updateRoom({ fixedElements: roomConfig.fixedElements.map((el) => el.id === elementId ? { ...el, x: Math.round(position.x), y: Math.round(position.y) } : el) });
      setDraggingTable(null);
      return;
    }

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
          title: tr('Erreur','Error'),
          description: tr('Impossible de sauvegarder la position','Unable to save position'),
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
    if (roomConfig.enabled) {
      if (shape === 'rectangle') return { width: 2 * ppm, height: 0.9 * ppm };
      if (shape === 'oval') return { width: 2 * ppm, height: 1.1 * ppm };
      const diameter = (capacity <= 8 ? 1.5 : 1.8) * ppm;
      return { width: diameter, height: diameter };
    }
    const baseSize = Math.max(80, Math.min(140, 60 + capacity * 8));
    if (shape === 'rectangle') {
      return { width: baseSize * 1.5, height: baseSize };
    }
    if (shape === 'oval') {
      return { width: baseSize * 1.3, height: baseSize };
    }
    return { width: baseSize, height: baseSize };
  };

  const roomPolygon = () => {
    const x0 = ROOM_MARGIN, y0 = ROOM_MARGIN, w = roomW, l = roomL;
    if (roomConfig.shape === 'L') return [[0,0],[w,0],[w,l*0.5],[w*0.5,l*0.5],[w*0.5,l],[0,l]].map(([x,y]) => `${x0+x},${y0+y}`).join(' ');
    if (roomConfig.shape === 'U') return [[0,0],[w*0.33,0],[w*0.33,l*0.5],[w*0.67,l*0.5],[w*0.67,0],[w,0],[w,l],[0,l]].map(([x,y]) => `${x0+x},${y0+y}`).join(' ');
    return [[0,0],[w,0],[w,l],[0,l]].map(([x,y]) => `${x0+x},${y0+y}`).join(' ');
  };
  const surfaceM2 = Math.round(roomConfig.widthM * (roomConfig.shape === 'square' ? roomConfig.widthM : roomConfig.lengthM) * (roomConfig.shape === 'L' ? 0.75 : roomConfig.shape === 'U' ? 0.83 : 1));
  const addFixedElement = (kind: FixedElementKind) => {
    const id = `${kind}-${Date.now()}`;
    updateRoom({ fixedElements: [...roomConfig.fixedElements, { id, kind, x: ROOM_MARGIN + roomW / 2, y: ROOM_MARGIN + roomL / 2 }] });
  };

  return (
    <div className="space-y-3">
      {/* Barre d'outils : lisibilité & salle à l'échelle */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button type="button" onClick={() => setShowGuestNames((v) => !v)} className="min-h-[44px] px-3 border border-wedding-olive/40 bg-white hover:bg-editorial-cream" aria-pressed={!showGuestNames}>
          {showGuestNames ? tr('Vue épurée (tables et compteurs)', 'Clean view (tables & counts)') : tr('Afficher les noms des invités', 'Show guest names')}
        </button>
        <button type="button" onClick={() => updateRoom({ enabled: !roomConfig.enabled })} className={cn('min-h-[44px] px-3 border border-wedding-olive/40', roomConfig.enabled ? 'bg-wedding-olive text-white' : 'bg-white hover:bg-editorial-cream')} aria-pressed={roomConfig.enabled}>
          📐 {tr('Configuration de la salle à l’échelle', 'Room setup to scale')}
        </button>
      </div>

      {roomConfig.enabled && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 p-3 bg-white border border-wedding-olive/30 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Forme', 'Shape')}</span>
            <select className="min-h-[44px] border px-2 bg-white" value={roomConfig.shape} onChange={(e) => updateRoom({ shape: e.target.value as RoomShape })}>
              <option value="rectangle">{tr('Rectangulaire', 'Rectangular')}</option>
              <option value="square">{tr('Carrée', 'Square')}</option>
              <option value="L">{tr('En L', 'L-shaped')}</option>
              <option value="U">{tr('En U', 'U-shaped')}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Surface (m²)', 'Area (m²)')}</span>
            <input type="number" min={10} inputMode="decimal" className="min-h-[44px] border px-2" placeholder="160" value={areaInput} onChange={(e) => applyArea(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Largeur (m)', 'Width (m)')}</span>
            <input type="number" min={3} step={0.5} className="min-h-[44px] border px-2" value={roomConfig.widthM} onChange={(e) => updateRoom({ widthM: Math.max(3, Number(e.target.value) || 3) })} />
          </label>
          {roomConfig.shape !== 'square' && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{tr('Longueur (m)', 'Length (m)')}</span>
              <input type="number" min={3} step={0.5} className="min-h-[44px] border px-2" value={roomConfig.lengthM} onChange={(e) => updateRoom({ lengthM: Math.max(3, Number(e.target.value) || 3) })} />
            </label>
          )}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Échelle : 1 m =', 'Scale: 1 m =')} {ppm} px</span>
            <input type="range" min={15} max={60} value={ppm} onChange={(e) => updateRoom({ pxPerMeter: Number(e.target.value) })} className="min-h-[44px]" aria-label={tr('Pixels par mètre', 'Pixels per metre')} />
          </label>
          <label className="flex items-center gap-2 min-h-[44px]">
            <input type="checkbox" checked={roomConfig.showComfort} onChange={(e) => updateRoom({ showComfort: e.target.checked })} />
            <span>{tr('Distance de confort 1,50 m', '1.50 m clearance')}</span>
          </label>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Ajouter un élément', 'Add an element')}</span>
            <select className="min-h-[44px] border px-2 bg-white" value="" onChange={(e) => { if (e.target.value) addFixedElement(e.target.value as FixedElementKind); }}>
              <option value="">+</option>
              {(Object.keys(FIXED_ELEMENTS) as FixedElementKind[]).map((kind) => (
                <option key={kind} value={kind}>{tr(FIXED_ELEMENTS[kind].fr, FIXED_ELEMENTS[kind].en)}</option>
              ))}
            </select>
          </div>
          <p className="col-span-full text-xs text-muted-foreground">
            {tr('Surface', 'Area')} ≈ {surfaceM2} m² · {tr('Tables rondes 150 cm (8 pers.) / 180 cm (10 pers.), rectangles 200 × 90 cm. Glissez tables et éléments ; double-cliquez sur un élément pour le retirer.', 'Round tables 150 cm (8 seats) / 180 cm (10 seats), rectangles 200 × 90 cm. Drag tables and elements; double-click an element to remove it.')}
          </p>
        </div>
      )}

    <div className="w-full overflow-auto rounded-xl border-2 border-dashed border-wedding-olive/30">
    <div
      ref={containerRef}
      className="relative bg-gradient-to-br from-editorial-cream to-white cursor-crosshair"
      style={{ width: roomConfig.enabled ? Math.max(roomW + ROOM_MARGIN * 2, 600) : '100%', height: roomConfig.enabled ? Math.max(roomL + ROOM_MARGIN * 2, 600) : 600 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {roomConfig.enabled && (
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" aria-hidden="true">
          <polygon points={roomPolygon()} fill="hsl(var(--background))" stroke="#63745A" strokeWidth={3} />
          <text x={ROOM_MARGIN} y={ROOM_MARGIN - 10} fontSize={12} fill="#63745A">{roomConfig.widthM} m</text>
          <text x={ROOM_MARGIN - 34} y={ROOM_MARGIN + roomL / 2} fontSize={12} fill="#63745A">{roomConfig.shape === 'square' ? roomConfig.widthM : roomConfig.lengthM} m</text>
          <line x1={ROOM_MARGIN} y1={ROOM_MARGIN + roomL + 20} x2={ROOM_MARGIN + ppm} y2={ROOM_MARGIN + roomL + 20} stroke="#333" strokeWidth={2} />
          <text x={ROOM_MARGIN + ppm + 6} y={ROOM_MARGIN + roomL + 24} fontSize={11} fill="#333">1 m</text>
        </svg>
      )}

      {roomConfig.enabled && roomConfig.fixedElements.map((element) => {
        const config = FIXED_ELEMENTS[element.kind];
        const key = `fixed:${element.id}`;
        const position = tablePositions[key] || { x: element.x, y: element.y };
        return (
          <div
            key={element.id}
            className="table-shape absolute flex items-center justify-center text-[11px] font-medium text-center border-2 border-dashed border-wedding-olive bg-editorial-olive-light/70 cursor-grab z-0"
            style={{ left: position.x - (config.w * ppm) / 2, top: position.y - (config.h * ppm) / 2, width: config.w * ppm, height: config.h * ppm }}
            onMouseDown={(e) => handleMouseDown(e, key)}
            onDoubleClick={() => updateRoom({ fixedElements: roomConfig.fixedElements.filter((el) => el.id !== element.id) })}
            title={tr('Double-cliquez pour retirer', 'Double-click to remove')}
          >
            {tr(config.fr, config.en)}
          </div>
        );
      })}
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #4a5568 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      {/* Legend */}
      {!roomConfig.enabled && <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-wedding-olive" />
          <span>{tr('Table ronde','Round table')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 rounded-lg bg-wedding-olive" />
          <span>{tr('Table rectangle','Rectangular table')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 rounded-[50%] bg-wedding-olive" />
          <span>{tr('Table ovale','Oval table')}</span>
        </div>
      </div>}

      {/* Instructions */}
      {!roomConfig.enabled && <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm text-xs text-muted-foreground max-w-[220px]">
        <p className="font-medium text-foreground mb-2">{tr('Mode Vue Visuelle','Visual view mode')}</p>
        <p className="mb-1">• {tr('Glissez les tables pour les repositionner','Drag tables to reposition them')}</p>
        <p className="mb-1">• {tr('Cliquez sur ✎ pour modifier une table','Click ✎ to edit a table')}</p>
        <p className="mb-1">• {tr("Cliquez sur 2 invités d'une même table pour échanger leurs places",'Click 2 guests at the same table to swap seats')}</p>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-[#7F9474] font-medium">
            💡 {tr('Pour déplacer un invité vers une autre table, utilisez l\'onglet « Liste »','To move a guest to another table, use the "List" tab')}
          </p>
        </div>
      </div>}

      {/* Selected guest indicator */}
      {selectedGuest && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-wedding-olive text-white px-4 py-2 rounded-full text-sm shadow-lg z-50">
          {tr('Cliquez sur un autre invité de la même table pour échanger','Click another guest at the same table to swap')}
        </div>
      )}

      {/* Tables */}
      {tables.map(table => {
        const position = tablePositions[table.id] || { x: 100, y: 100 };
        const tableGuests = getTableGuests(table.id);
        const size = getTableSize(table.shape, table.capacity);
        const comfortDiameter = Math.max(size.width, size.height) + 3 * ppm;
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
            {roomConfig.enabled && roomConfig.showComfort && (
              <div className="absolute rounded-full border border-dashed border-wedding-olive/60 bg-wedding-olive/5 pointer-events-none" style={{ width: comfortDiameter, height: comfortDiameter, left: size.width / 2 - comfortDiameter / 2, top: size.height / 2 - comfortDiameter / 2 }} aria-hidden="true" />
            )}
            {/* Table shape */}
            <div
              className={cn(
                "table-shape relative flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-2",
                getTableShape(table.shape),
                isFull 
                  ? "bg-wedding-olive text-white border-premium-olive-dark" 
                  : "bg-white text-foreground border-wedding-olive/50 hover:border-wedding-olive",
                isDragging && "shadow-2xl ring-2 ring-wedding-olive ring-offset-2"
              )}
              style={{
                width: size.width,
                height: size.height,
                backgroundColor: table.color || (isFull ? undefined : '#fff')
              }}
              onMouseDown={(e) => handleMouseDown(e, table.id)}
              onDoubleClick={() => onEditTable?.(table)}
              title={tr('Double-cliquez pour modifier la table', 'Double-click to edit the table')}
            >
              {onEditTable && (
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); onEditTable(table); }}
                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-wedding-olive text-white text-xs shadow flex items-center justify-center z-30"
                  aria-label={tr('Modifier la table', 'Edit table')}
                >✎</button>
              )}
              <span className="font-semibold text-sm truncate max-w-[90%]">
                {table.table_name}
              </span>
              <span className="text-xs opacity-80">
                {tableGuests.length}/{table.capacity}
              </span>
            </div>

            {/* Guest indicators around the table */}
            {showGuestNames && tableGuests.slice(0, 12).map((guest, index) => {
              const totalGuests = Math.min(tableGuests.length, 12);
              const angle = (index / totalGuests) * 2 * Math.PI - Math.PI / 2;
              const radius = Math.max(size.width, size.height) / 2 + 22 + Math.max(0, totalGuests - 6) * 4;
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
                    "absolute rounded-full border-2 shadow-sm flex items-center justify-center font-medium cursor-pointer transition-all duration-200 hover:scale-110",
                    isSelected 
                      ? "bg-wedding-olive text-white border-white ring-2 ring-wedding-olive ring-offset-1 scale-110 z-20 px-2 py-1 min-w-max text-[10px]" 
                      : "bg-white text-premium-olive-dark border-wedding-olive/40 hover:bg-wedding-olive hover:text-white px-2 py-0.5 max-w-[110px] truncate text-[10px] z-10"
                  )}
                  style={{
                    left: size.width / 2 + guestX,
                    top: size.height / 2 + guestY - 10,
                    transform: 'translateX(-50%)'
                  }}
                  title={`${guest.guest_name}${guest.seat_number ? ` (${tr('Place','Seat')} ${guest.seat_number})` : ''} - ${tr('Cliquez pour échanger','Click to swap')}`}
                >
                  {guest.guest_name}
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
            <p className="text-lg font-medium mb-2">{tr('Aucune table créée','No tables yet')}</p>
            <p className="text-sm">{tr('Créez des tables pour les voir ici','Create tables to see them here')}</p>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default SeatingPlanVisual;
